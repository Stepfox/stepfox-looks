<?php
/**
 * Responsive DOM adjustments (ID injection, classes mirroring)
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

function stepfox_wrap_group_and_columns($block_content = '', $block = [])
{
    if (empty($block_content) && empty($block)) {
        return '';
    }

    $hasResponsiveAttrs = false;
    if (isset($block['attrs']['responsiveStyles'])) {
        $responsiveStyles = $block['attrs']['responsiveStyles'];
        foreach ($responsiveStyles as $property => $devices) {
            if (is_array($devices)) {
                foreach ($devices as $device => $value) {
                    if (is_array($value)) {
                        if (!empty(array_filter($value))) {
                            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    } else {
                        if (!empty($value)) {
                            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    }
                }
            }
        }
    }

    $needsCustomId = false;
    if ($hasResponsiveAttrs && isset($block['attrs'])) {
        if (!empty($block['attrs']['responsiveStyles'])) {
            foreach ($block['attrs']['responsiveStyles'] as $property => $values) {
                if (is_array($values) && array_filter($values)) {
                    $needsCustomId = true;
                    break;
                }
            }
        }
        if (!empty($block['attrs']['custom_css']) || !empty($block['attrs']['animation'])) {
            $needsCustomId = true;
        }
    }

    if ($needsCustomId && isset($block['attrs']) && empty($block['attrs']['customId']) && $block['blockName'] != 'core/spacer') {
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }

    if (isset($block['blockName']) && $block['blockName'] === 'core/post-template') {
        $customId = $block['attrs']['customId'] ?? '';
        if (!empty($customId)) {
            $cleanCustomId = str_replace('anchor_', '', $customId);
            $finalId = !empty($block['attrs']['anchor']) ? $block['attrs']['anchor'] : $cleanCustomId;
            if (!preg_match('/<ul[^>]*\sid="/i', $block_content)) {
                $block_content = preg_replace('/<ul([^>]*)>/i', '<ul$1 id="block_' . esc_attr($finalId) . '">', $block_content, 1);
            }
        }
        return $block_content;
    }

    $skipIdBlocks = ['stepfox/navigation-mega'];
    if (isset($block['blockName']) && in_array($block['blockName'], $skipIdBlocks, true)) {
        return $block_content;
    }

    if (isset($block['context']) && (isset($block['context']['queryId']) || isset($block['context']['postId']))) {
        if (empty($block['attrs']['customId'])) {
            return $block_content;
        }
    }

    if ( isset($block['attrs']) && ! empty( $block['attrs']['customId'] ) && $block['blockName'] != 'core/spacer' ) {
        $cleanCustomId = str_replace( 'anchor_', '', $block['attrs']['customId'] );
        $finalId = ! empty( $block['attrs']['anchor'] ) ? $block['attrs']['anchor'] : $cleanCustomId;

        $first_tag_match = [];
        if ( ! empty( $block_content ) ) {
            preg_match( '/<[^>]+>/', $block_content, $first_tag_match );
        }

        if ( ! empty( $first_tag_match[0] ) && strpos( $first_tag_match[0], 'id="' ) !== false ) {
            if (preg_match('/\sid="block_[^"]*"/i', $first_tag_match[0])) {
                return $block_content;
            }
            $content = preg_replace( '/\sid="[^"]*"/i', ' id="block_' . $finalId . '"', $block_content, 1 );
        } else {
            $content = preg_replace( '(>+)', ' id="block_' . $finalId . '" > ', $block_content, 1 );
        }

        if ( !empty($content) ) {
            preg_match( '/(<[^>]*>)/i', $content, $first_line );
        } else {
            $first_line = [];
        }

        $final_output = $content;
        if (isset($block['blockName']) && in_array($block['blockName'], array('core/group','core/cover','core/separator'), true)) {
            if (!empty($final_output)) {
                $first_tag_match_aug = array();
                preg_match('/<[^>]+>/', $final_output, $first_tag_match_aug);
                if (!empty($first_tag_match_aug[0])) {
                    $opening = $first_tag_match_aug[0];
                    $classes = '';
                    if (preg_match('/class="([^"]*)"/i', $opening, $cm)) {
                        $classes = $cm[1];
                    }
                    $styleAttr = '';
                    if (preg_match('/style="([^"]*)"/i', $opening, $sm)) {
                        $styleAttr = strtolower($sm[1]);
                    }
                    $newClasses = $classes;
                    if ($styleAttr !== '') {
                        if ((strpos($styleAttr, 'background:') !== false || strpos($styleAttr, 'background-color:') !== false) && stripos($newClasses, 'has-background') === false) {
                            $newClasses .= ' has-background';
                        }
                        if (strpos($styleAttr, 'color:') !== false && stripos($newClasses, 'has-text-color') === false) {
                            $newClasses .= ' has-text-color';
                        }
                        if ((strpos($styleAttr, 'border-color:') !== false || strpos($styleAttr, 'border:') !== false) && stripos($newClasses, 'has-border-color') === false) {
                            $newClasses .= ' has-border-color';
                        }
                        if ($block['blockName'] === 'core/separator' && strpos($styleAttr, 'rgba(') !== false && stripos($newClasses, 'has-alpha-channel-opacity') === false) {
                            $newClasses .= ' has-alpha-channel-opacity';
                        }
                    }
                    if ($block['blockName'] === 'core/cover' && stripos($newClasses, 'wp-block-cover') === false) {
                        $newClasses = trim('wp-block-cover ' . $newClasses);
                    }
                    if ($newClasses !== $classes && $classes !== '') {
                        $new_opening = preg_replace('/class="[^"]*"/i', 'class="' . trim($newClasses) . '"', $opening, 1);
                        $pos = strpos($final_output, $opening);
                        if ($pos !== false) {
                            $final_output = substr_replace($final_output, $new_opening, $pos, strlen($opening));
                        }
                    }
                }
            }
        }

        return $final_output;
    }

    if ( isset($block['attrs']) && ! empty( $block['attrs']['image_block_id'] ) ) {
        // Reserved for future enhancements
    }

    if (isset($block['blockName']) && in_array($block['blockName'], array('core/group','core/cover'), true)) {
        $final_output = $block_content;
        if (!empty($final_output)) {
            $first_tag_match_aug = array();
            preg_match('/<[^>]+>/', $final_output, $first_tag_match_aug);
            if (!empty($first_tag_match_aug[0])) {
                $opening = $first_tag_match_aug[0];
                $classes = '';
                if (preg_match('/class="([^"]*)"/i', $opening, $cm)) {
                    $classes = $cm[1];
                }
                $styleAttr = '';
                if (preg_match('/style="([^"]*)"/i', $opening, $sm)) {
                    $styleAttr = strtolower($sm[1]);
                }
                $newClasses = $classes;
                if ($styleAttr !== '') {
                    if ((strpos($styleAttr, 'background:') !== false || strpos($styleAttr, 'background-color:') !== false) && stripos($newClasses, 'has-background') === false) {
                        $newClasses .= ' has-background';
                    }
                    if (strpos($styleAttr, 'color:') !== false && stripos($newClasses, 'has-text-color') === false) {
                        $newClasses .= ' has-text-color';
                    }
                    if ((strpos($styleAttr, 'border-color:') !== false || strpos($styleAttr, 'border:') !== false) && stripos($newClasses, 'has-border-color') === false) {
                        $newClasses .= ' has-border-color';
                    }
                }
                if ($newClasses !== $classes && $classes !== '') {
                    $new_opening = preg_replace('/class="[^"]*"/i', 'class="' . trim($newClasses) . '"', $opening, 1);
                    $pos = strpos($final_output, $opening);
                    if ($pos !== false) {
                        $final_output = substr_replace($final_output, $new_opening, $pos, strlen($opening));
                    }
                }
            }
        }
        return $final_output;
    }

    return $block_content;
}
add_filter( 'render_block', 'stepfox_wrap_group_and_columns', 10, 2 );


