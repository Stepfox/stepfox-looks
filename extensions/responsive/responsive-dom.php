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

    // Check if any stepfox looks plugin attributes have actual values
    $hasStepfoxAttributes = false;
    
    // Check responsiveStyles
    if (isset($block['attrs']['responsiveStyles']) && is_array($block['attrs']['responsiveStyles'])) {
        foreach ($block['attrs']['responsiveStyles'] as $property => $devices) {
            if (is_array($devices)) {
                foreach ($devices as $device => $value) {
                    if (is_array($value)) {
                        if (!empty(array_filter($value))) {
                            $hasStepfoxAttributes = true;
                            break 2;
                        }
                    } else {
                        if (!empty($value)) {
                            $hasStepfoxAttributes = true;
                            break 2;
                        }
                    }
                }
            }
        }
    }
    
    // Check custom_css and animation attributes
    if (!$hasStepfoxAttributes && isset($block['attrs'])) {
        if (!empty($block['attrs']['custom_css']) || !empty($block['attrs']['animation'])) {
            $hasStepfoxAttributes = true;
        }
    }

    // Detect: Query blocks that contain a Load More child anywhere inside
    $hasLoadMoreChild = false;
    if (isset($block['blockName']) && $block['blockName'] === 'core/query') {
        if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $containsLoadMore = function ($b) use (&$containsLoadMore) {
                if (!isset($b['innerBlocks']) || !is_array($b['innerBlocks'])) {
                    return false;
                }
                foreach ($b['innerBlocks'] as $child) {
                    if (isset($child['blockName']) && $child['blockName'] === 'stepfox/query-loop-load-more') {
                        return true;
                    }
                    if (!empty($child['innerBlocks']) && $containsLoadMore($child)) {
                        return true;
                    }
                }
                return false;
            };
            $hasLoadMoreChild = $containsLoadMore($block);
        }
    }
    
    // Only set needsCustomId if stepfox attributes have actual values, or Query has Load More
    $needsCustomId = ($hasStepfoxAttributes || $hasLoadMoreChild);

    // Generate customId only if stepfox attributes exist and no customId is set
    if ($needsCustomId && isset($block['attrs']) && empty($block['attrs']['customId']) && $block['blockName'] != 'core/spacer') {
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }
    
    // If block has a customId but no stepfox attributes, we should not add the ID to the DOM
    // EXCEPT for Query blocks that have a Load More child
    $shouldAddIdToDom = (($hasStepfoxAttributes || $hasLoadMoreChild) && !empty($block['attrs']['customId']));

    if (isset($block['blockName']) && $block['blockName'] === 'core/post-template') {
        // Only add ID if block should have ID in DOM
        if ($shouldAddIdToDom) {
            $customId = $block['attrs']['customId'] ?? '';
            if (!empty($customId)) {
                $cleanCustomId = str_replace('anchor_', '', $customId);
                $finalId = !empty($block['attrs']['anchor']) ? $block['attrs']['anchor'] : $cleanCustomId;
                if (!preg_match('/<ul[^>]*\sid="/i', $block_content)) {
                    $block_content = preg_replace('/<ul([^>]*)>/i', '<ul$1 id="block_' . esc_attr($finalId) . '">', $block_content, 1);
                }
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

    // Guard: Do not inject IDs into empty core/template-part wrappers (to avoid inheriting parent IDs)
    if (isset($block['blockName']) && $block['blockName'] === 'core/template-part' && !$hasStepfoxAttributes) {
        return $block_content;
    }

    if ( $shouldAddIdToDom && $block['blockName'] != 'core/spacer' && isset($block['attrs']['customId']) ) {
        $cleanCustomId = str_replace( 'anchor_', '', $block['attrs']['customId'] );
        $finalId = ! empty( $block['attrs']['anchor'] ) ? $block['attrs']['anchor'] : $cleanCustomId;

        // Find the opening tag of THIS block's wrapper using its class
        $wrapperClass = '';
        if (isset($block['blockName']) && is_string($block['blockName'])) {
            $parts = explode('/', $block['blockName']);
            if (count($parts) === 2) {
                $ns = $parts[0];
                $nm = $parts[1];
                $wrapperClass = 'wp-block-' . ($ns === 'core' ? $nm : $ns . '-' . $nm);
            } else {
                $wrapperClass = 'wp-block-' . str_replace('/', '-', $block['blockName']);
            }
        }

        $opening_match = [];
        if ($wrapperClass !== '') {
            preg_match('/<[^>]*class="[^"]*\\b' . preg_quote($wrapperClass, '/') . '\\b[^"]*"[^>]*>/', $block_content, $opening_match);
        }

        // If not found, do not inject to avoid touching child blocks
        if (empty($opening_match)) {
            return $block_content;
        }

        $opening = $opening_match[0];
        // If an id is already present with block_ prefix, leave as-is
        if (strpos($opening, 'id="') !== false) {
            if (preg_match('/\sid="block_' . preg_quote($finalId, '/') . '"/i', $opening)) {
                return $block_content;
            }
            if (preg_match('/\sid="block_[^"]*"/i', $opening)) {
                return $block_content;
            }
            $new_opening = preg_replace('/\sid="[^"]*"/i', ' id="block_' . esc_attr($finalId) . '"', $opening, 1);
        } else {
            $new_opening = preg_replace('/>/', ' id="block_' . esc_attr($finalId) . '">', $opening, 1);
        }

        // Replace only that opening tag occurrence
        $final_output = $block_content;
        $pos = strpos($final_output, $opening);
        if ($pos !== false) {
            $final_output = substr_replace($final_output, $new_opening, $pos, strlen($opening));
        }
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



