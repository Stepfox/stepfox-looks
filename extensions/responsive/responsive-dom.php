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

    // Check if block has any Stepfox Looks attributes (presence alone is enough)
    $hasStepfoxAttributes = false;
    if (isset($block['attrs'])) {
        if (array_key_exists('responsiveStyles', $block['attrs'])) {
            $hasStepfoxAttributes = true;
        } elseif (array_key_exists('custom_css', $block['attrs']) || array_key_exists('animation', $block['attrs'])) {
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
    
    // Treat Load More button as needing an ID as well
    if (isset($block['blockName']) && $block['blockName'] === 'stepfox/query-loop-load-more') {
        $hasStepfoxAttributes = true;
    }

    // Only set needsCustomId if stepfox attributes have actual values, or Query has Load More, or this is the Load More button
    $needsCustomId = ($hasStepfoxAttributes || $hasLoadMoreChild);

    // Generate customId only if stepfox attributes exist and no customId is set
    if ($needsCustomId && isset($block['attrs']) && empty($block['attrs']['customId']) && $block['blockName'] != 'core/spacer') {
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }
    
    // If block has a customId but no stepfox attributes, we should not add the ID to the DOM
    // EXCEPT for Query blocks that have a Load More child, or the Load More button itself
    $shouldAddIdToDom = (($hasStepfoxAttributes || $hasLoadMoreChild) && !empty($block['attrs']['customId']));

    // Special handling: Load More button renders as a plain <button> without the wp-block class
    if ($shouldAddIdToDom && isset($block['blockName']) && $block['blockName'] === 'stepfox/query-loop-load-more') {
        $customId = $block['attrs']['customId'] ?? '';
        if (!empty($customId)) {
            $cleanCustomId = str_replace('anchor_', '', $customId);
            $finalId = !empty($block['attrs']['anchor']) ? $block['attrs']['anchor'] : $cleanCustomId;
            // Inject id on the first <button> if it doesn't already have one
            if (!preg_match('/<button[^>]*\sid="/i', $block_content)) {
                $block_content = preg_replace('/<button([^>]*)>/', '<button$1 id="block_' . esc_attr($finalId) . '">', $block_content, 1);
            }
        }
        return $block_content;
    }

    // Special handling: Paragraphs render as <p> without a predictable wp-block wrapper in some cases
    if ($shouldAddIdToDom && isset($block['blockName']) && $block['blockName'] === 'core/paragraph') {
        $customId = $block['attrs']['customId'] ?? '';
        if (!empty($customId)) {
            $cleanCustomId = str_replace('anchor_', '', $customId);
            $finalId = !empty($block['attrs']['anchor']) ? $block['attrs']['anchor'] : $cleanCustomId;
            // Inject id on the first <p> if it doesn't already have one
            if (!preg_match('/<p[^>]*\sid="/i', $block_content)) {
                $block_content = preg_replace('/<p([^>]*)>/', '<p$1 id="block_' . esc_attr($finalId) . '">', $block_content, 1);
            }
        }
        return $block_content;
    }

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



