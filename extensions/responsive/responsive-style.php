<?php
/**
 * Responsive Style Manager
 * Handles dynamic CSS generation and responsive block attributes.
 * Provides caching and optimization for better performance.
 * @package stepfox-looks
 * @since 1.0.0
 * @author Stepfox
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

add_filter( 'register_block_type_args', 'modify_core_group_block_args', 20, 2 );
function modify_core_group_block_args( $args, $name ) {
    
    // Helper function to safely add attributes
    $safe_add_attr = function($attr_name, $definition) use (&$args) {
        if (!isset($args['attributes'][$attr_name])) {
            $args['attributes'][$attr_name] = $definition;
        }
    };

    // System attributes - core responsive functionality
    $safe_add_attr('customId', [ "type" => "string", "default" => "stepfox-not-set-id" ]);
    $safe_add_attr('device', [ "type" => "string", "default" => "desktop" ]);
    
    // System state attributes
    $safe_add_attr('element_state', [ "type" => "string", "default" => "normal" ]);
    
    // Only add custom styling and animation to blocks that support them
    if ($name !== 'core/spacer' && $name !== 'core/separator') {
        $safe_add_attr('custom_css', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('custom_js', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('animation', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('animation_delay', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('animation_duration', [ "type" => "string", "default" => "" ]);
    }
    
    // Extension-specific attributes (preserve if extensions are loaded)
    if ($name === 'core/cover') {
        $safe_add_attr('linkToPost', [ "type" => "boolean", "default" => false ]);
    }
    if ($name === 'core/social-link') {
        $safe_add_attr('shareThisPost', [ "type" => "boolean", "default" => false ]);
    }
    if ($name === 'core/query') {
        $safe_add_attr('customPostsPerPage', [ "type" => "string", "default" => "" ]);
    }

    // Modern responsive styles object - MINIMAL default to prevent URL overflow in block renderer
    $safe_add_attr('responsiveStyles', [
        "type" => "object", 
        "default" => []
    ]);

    return $args;
}

// Old individual attribute definitions have been cleaned up and replaced by responsiveStyles object





// Using responsiveStyles object for attribute definitions





function wrap_group_and_columns($block_content = '', $block = [])
{
    // Safety check for parameters
    if (empty($block_content) && empty($block)) {
        return '';
    }
    // Check if block has any responsive attributes that would need an ID
    $hasResponsiveAttrs = false;
    
    // Check for the new responsiveStyles object structure
    if (isset($block['attrs']['responsiveStyles'])) {
        $responsiveStyles = $block['attrs']['responsiveStyles'];
        
        // Check if any property has any device-specific values
        foreach ($responsiveStyles as $property => $devices) {
            if (is_array($devices)) {
                foreach ($devices as $device => $value) {
                    if (is_array($value)) {
                        // Complex properties like padding, margin, borderRadius
                        if (!empty(array_filter($value))) {
                            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    } else {
                        // Simple properties
                        if (!empty($value)) {
                            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    }
                }
            }
        }
    }
    
    // Only generate customId if block actually has responsive styles or custom CSS that need it
    $needsCustomId = false;
    if ($hasResponsiveAttrs && isset($block['attrs'])) {
        // Check if block has actual responsive values (not just empty objects)
        if (!empty($block['attrs']['responsiveStyles'])) {
            foreach ($block['attrs']['responsiveStyles'] as $property => $values) {
                if (is_array($values) && array_filter($values)) {
                    $needsCustomId = true;
                    break;
                }
            }
        }
        // Also check for custom CSS or animation that need ID
        if (!empty($block['attrs']['custom_css']) || 
            !empty($block['attrs']['animation'])) {
            $needsCustomId = true;
        }
    }
    
    // Only generate customId if block actually needs it and doesn't have one
    if ($needsCustomId && isset($block['attrs']) && empty($block['attrs']['customId']) && $block['blockName'] != 'core/spacer') {
        // Create a consistent ID based on block content and attributes
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }

    // If the block has a customId (and is not a spacer) add the custom id to the outer tag.
    if ( isset($block['attrs']) && ! empty( $block['attrs']['customId'] ) && $block['blockName'] != 'core/spacer' ) {
$block['attrs']['customId'] = str_replace( 'anchor_', '', $block['attrs']['customId'] );
        $content = preg_replace( '(>+)', ' id="block_' . $block['attrs']['customId'] . '" > ', $block_content, 1 );

        if ( !empty($content) ) {
            preg_match( '/(<[^>]*>)/i', $content, $first_line );
        } else {
            $first_line = [];
        }
        if(!empty($first_line[0])) {
            if (strpos($first_line[0], 'style="') !== false &&
                strpos($first_line[0], 'id="block_' . $block['attrs']['customId'] . '"') !== false) {
                $content = preg_replace('/(<[^>]+) style=".*?"/i', '$1', $content, 1);
            }
        }

        return $content;
    }

    if ( isset($block['attrs']) && ! empty( $block['attrs']['image_block_id'] ) ) {
        // Additional image_block_id processing if needed.
    }

    return $block_content;
}
add_filter( 'render_block', 'wrap_group_and_columns', 10, 2 );


function search($array, $key)
{
    $results = array();

    if ( is_array( $array ) ) {
        if ( isset( $array[$key] ) ) {
            $results[] = $array;
        }
        foreach ( $array as $subarray ) {
            $results = array_merge( $results, search( $subarray, $key ) );
        }
    }

    return $results;
}

/**
 * Process custom CSS with smart this_block replacement
 * Handles complex selectors like ".fixed-menu this_block" properly
 *
 * @param string $custom_css The custom CSS containing this_block
 * @param string $block_selector The block selector to replace this_block with
 * @return string Processed CSS with proper selectors
 */
function stepfox_process_custom_css($custom_css, $block_selector) {
    if (empty($custom_css) || !is_string($custom_css)) {
        return '';
    }
    
    // If no this_block found, return as-is
    if (strpos($custom_css, 'this_block') === false) {
        return $custom_css;
    }
    
    // Split CSS into rules (by commas) and process each
    $rules = array_map('trim', explode(',', $custom_css));
    $processed_rules = array();
    
    foreach ($rules as $rule) {
        if (strpos($rule, 'this_block') !== false) {
            // Replace this_block with the actual block selector
            $processed_rule = str_replace('this_block', $block_selector, $rule);
            $processed_rules[] = $processed_rule;
        } else {
            $processed_rules[] = $rule;
        }
    }
    
    return implode(', ', $processed_rules);
}


function stepfox_styling() {
    wp_reset_postdata();
    global $_wp_current_template_content;
    $page_content = get_the_content();
    $full_content = $_wp_current_template_content . $page_content;

    if ( has_blocks( $full_content ) ) {
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        // Get template parts content.
        foreach ( $all_blocks as $block ) {
            $full_content .= get_template_parts_as_content( $block );
        }
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        $inline_style = '';
        wp_register_style( 'stepfox-responsive-style', false );
        wp_enqueue_style( 'stepfox-responsive-style' );

        foreach ( $all_blocks as $block ) {
            if ( ( $block['blockName'] === 'core/block' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ||
                ( $block['blockName'] === 'core/navigation' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ) {
                $content = get_post_field( 'post_content', $block['attrs']['ref'] );
                $reusable_blocks = parse_blocks( $content );
                $all_reusable_blocks = search( $reusable_blocks, 'blockName' );
                foreach ( $all_reusable_blocks as $reusable_block ) {
                    $inline_style .= inline_styles_for_blocks( $reusable_block );
                }
            }

            // Process all blocks with inline styles
            $inline_style .= inline_styles_for_blocks( $block );
        }

        wp_add_inline_style( 'stepfox-responsive-style', $inline_style );
    }
}
add_action( 'wp_head', 'stepfox_styling' );


function get_template_parts_as_content($block) {
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['blockName'])) {
        return '';
    }
    
    $template_parts_content = '';
    if ( $block['blockName'] == 'core/template-part' && isset($block['attrs']) ) {
        $theme = isset($block['attrs']['theme']) ? $block['attrs']['theme'] : '';
        $slug = isset($block['attrs']['slug']) ? $block['attrs']['slug'] : '';
        $template_part = get_block_template( $theme . '//' . $slug, 'wp_template_part' );
        if ( $template_part && isset($template_part->content) ) {
            $template_part_content = $template_part->content;
            $template_blocks = parse_blocks( $template_part_content );
            $all_template_blocks = search( $template_blocks, 'blockName' );
            $template_parts_content .= $template_part_content;
            
            foreach ( $all_template_blocks as $template_block ) {
            if ( $template_block['blockName'] == 'core/template-part' && isset($template_block['attrs']) ) {
                $theme = isset($template_block['attrs']['theme']) ? $template_block['attrs']['theme'] : '';
                $slug = isset($template_block['attrs']['slug']) ? $template_block['attrs']['slug'] : '';
                $template_part_1 = get_block_template( $theme . '//' . $slug, 'wp_template_part' );
                if ( $template_part_1 && isset($template_part_1->content) ) {
                    $template_part_content_1 = $template_part_1->content;
                    $template_parts_content .= $template_part_content_1;
                }
            }
            }
        }
    }
    return $template_parts_content;
}

function decode_css_var( $input ) {
    // Safety check for null or non-string input
    if ( empty($input) || !is_string($input) ) {
        return $input;
    }
    
    // Check if the string starts with "var:"
    if ( strpos( $input, 'var:' ) === 0 ) {
        // Remove the "var:" prefix.
        $trimmed = substr( $input, 4 );
        // Replace '|' with '--'
        $variable_part = str_replace( '|', '--', $trimmed );
        // Return the final CSS variable format.
        return 'var(--wp--' . $variable_part . ')';
    }

    // If the string doesn't start with "var:", return it unchanged.
    return $input;
}

function inline_styles_for_blocks($block) {
    
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['blockName'])) {
        return '';
    }
    

    
    // Ensure attrs exists and is an array, initialize as empty array if not
    if (!isset($block['attrs']) || !is_array($block['attrs'])) {
        $block['attrs'] = [];
    }

    // Check if block has any responsive attributes that would need an ID
    $hasResponsiveAttrs = false;
    
    // Check for the new responsiveStyles object structure
    if (isset($block['attrs']['responsiveStyles'])) {
        $responsiveStyles = $block['attrs']['responsiveStyles'];
        
        // Check if any property has any device-specific values
        foreach ($responsiveStyles as $property => $devices) {
            if (is_array($devices)) {
                foreach ($devices as $device => $value) {
                    if (is_array($value)) {
                        // Complex properties like padding, margin, borderRadius
                        if (!empty(array_filter($value))) {
            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    } else {
                        // Simple properties
                        if (!empty($value)) {
                            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    }
                }
            }
        }
    }
    
    // If block has responsive attributes but no customId, generate one based on block content hash
    if ($hasResponsiveAttrs && isset($block['attrs']) && empty($block['attrs']['customId'])) {
        // Create a consistent ID based on block content and attributes
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }

    if ( isset($block['attrs']) && ( ! empty( $block['attrs']['customId'] ) || ! empty( $block['attrs']['image_block_id'] ) ) ) {

        // Set width if desktop width is provided from new responsiveStyles structure.
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['desktop'] ) ) {
            $block['attrs']['width'] = $block['attrs']['responsiveStyles']['width']['desktop'];
        }
        // Modern responsive system handles all styling through responsiveStyles object

        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['right'] ) ) {
            $block['attrs']['style']['spacing']['border']['right'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['right'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['left'] ) ) {
            $block['attrs']['style']['spacing']['border']['left'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['left'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom'] ) ) {
            $block['attrs']['style']['spacing']['border']['bottom'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['top'] ) ) {
            $block['attrs']['style']['spacing']['border']['top'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['top'];
        }

        // REMOVED: desktop_margin WordPress style assignments to prevent duplicates

        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['tablet'] ) ) {
            $block['attrs']['padding_tablet'] = $block['attrs']['responsiveStyles']['padding']['tablet'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['tablet'] ) ) {
            $block['attrs']['margin_tablet'] = $block['attrs']['responsiveStyles']['margin']['tablet'];
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile'] ) ) {
            $block['attrs']['padding_mobile'] = $block['attrs']['responsiveStyles']['padding']['mobile'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile'] ) ) {
            $block['attrs']['margin_mobile'] = $block['attrs']['responsiveStyles']['margin']['mobile'];
        }

        if ( strpos( $block['blockName'], 'acf/' ) !== false ) {
            $block['attrs']['customId'] = str_replace( 'block_', '', $block['attrs']['customId'] );
        }
        if ( ! empty( $block['attrs']['image_block_id'] ) ) {
            $block['attrs']['customId'] = $block['attrs']['image_block_id'];
        }

        $inlineStyles = '#block_' . $block['attrs']['customId'] . '{';
        $inlineStyles = str_replace( 'block_anchor_', '', $inlineStyles );
        if ( ! empty( $block['attrs']['style']['color']['background'] ) ) {
            $inlineStyles .= 'background-color:' . $block['attrs']['style']['color']['background'] . ';';
        }

        if ( ! empty( $block['attrs']['style']['background']['backgroundImage'] ) ) {
            $inlineStyles .= 'background:url(' . $block['attrs']['style']['background']['backgroundImage']['url'] . ');background-size: 100%;';
        }
        if ( ! empty( $block['attrs']['theme_colors'] ) ) {
            foreach ( $block['attrs']['theme_colors'] as $theme_color => $value ) {
                if ( $theme_color == 'gradient_override' ) {
                    $inlineStyles .= '--wp--preset--gradient--flag: ' . $value . ';';
                } else {
                    $inlineStyles .= '--wp--preset--color--' . $theme_color . ':' . $value . ';';
                }
            }
        }

        if ( ! empty( $block['attrs']['start_from'] ) ) {
            $inlineStyles .= '--start-from:' . $block['attrs']['start_from'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['color']['gradient'] ) ) {
            $inlineStyles .= 'background:' . $block['attrs']['style']['color']['gradient'] . ';';
        }
        if ( ! empty( $block['attrs']['backgroundColor'] ) ) {
            $inlineStyles .= 'background-color:var(--wp--preset--color--' . $block['attrs']['backgroundColor'] . ');';
        }
        if ( ! empty( $block['attrs']['style']['color']['text'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['style']['color']['text'] . ';';
        }
        if ( ! empty( $block['attrs']['textColor'] ) ) {
            $inlineStyles .= 'color:var(--wp--preset--color--' . $block['attrs']['textColor'] . ');';
        }
        // shadow
        if ( ! empty( $block['attrs']['style']['shadow'] ) ) {
            $inlineStyles .= 'box-shadow:' . $block['attrs']['style']['shadow'] . ';';
        }
        if ( ! empty( $block['attrs']['animation'] ) ) {
            $inlineStyles .= 'animation:' . $block['attrs']['animation'] . ';';
        }
        if ( ! empty( $block['attrs']['animation_delay'] ) ) {
            $inlineStyles .= 'animation-delay:' . $block['attrs']['animation_delay'] . 's;';
        }
        if ( ! empty( $block['attrs']['animation_duration'] ) ) {
            $inlineStyles .= 'animation-duration:' . $block['attrs']['animation_duration'] . 's;';
        }

        // Typography
        if ( ! empty( $block['attrs']['style']['typography']['fontSize'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['style']['typography']['fontSize'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['textDecoration'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['style']['typography']['textDecoration'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['letterSpacing'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['style']['typography']['letterSpacing'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['lineHeight'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['style']['typography']['lineHeight'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['fontWeight'] ) ) {
            $inlineStyles .= 'font-weight:' . $block['attrs']['style']['typography']['fontWeight'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['fontStyle'] ) ) {
            $inlineStyles .= 'font-style:' . $block['attrs']['style']['typography']['fontStyle'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['textTransform'] ) ) {
            $inlineStyles .= 'text-transform:' . $block['attrs']['style']['typography']['textTransform'] . ';';
        }

        if ( ! empty( $block['attrs']['style']['border']['width'] ) ) {
            $inlineStyles .= 'border-width:' . $block['attrs']['style']['border']['width'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['border']['style'] ) ) {
            $inlineStyles .= 'border-style:' . $block['attrs']['style']['border']['style'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['border']['radius'] ) ) {
            $inlineStyles .= 'border-radius:' . $block['attrs']['style']['border']['radius'] . ';';
            $inlineStyles .= 'overflow:hidden;';
        }
        if ( ! empty( $block['attrs']['style']['border']['color'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['style']['border']['color'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['borderColor'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['style']['borderColor'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['border'] ) ) {
            foreach ( $block['attrs']['style']['border'] as $border_side_key => $border_side_value ) {
                if ( ! empty( $border_side_value["width"] ) ) {
                    $inlineStyles .= 'border-' . $border_side_key . '-width:' . decode_css_var($border_side_value['width']) . ';';
                    if(!empty($border_side_value['color'])) {
                        $inlineStyles .= 'border-' . $border_side_key . '-color:' . decode_css_var($border_side_value['color']) . ';';
                    }
                    $inlineStyles .= 'border-' . $border_side_key . '-style:solid;';
                    if(!empty($border_side_value['radius'])) {
                        $inlineStyles .= 'border-' . $border_side_key . '-radius:' . decode_css_var($border_side_value['radius']) . ';';
                    }
                }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['top'] ) ) {
            $inlineStyles .= 'border-top-width:' . $block['attrs']['responsiveStyles']['borderWidth']['desktop']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom'] ) ) {
            $inlineStyles .= 'border-bottom-width:' . $block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['left'] ) ) {
            $inlineStyles .= 'border-left-width:' . $block['attrs']['responsiveStyles']['borderWidth']['desktop']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['right'] ) ) {
            $inlineStyles .= 'border-right-width:' . $block['attrs']['responsiveStyles']['borderWidth']['desktop']['right'] . ';';
        }

        if ( ! empty( $block['attrs']['image_block_id'] ) ) {
            if ( ! empty( $block['attrs']['width'] ) ) {
                $inlineStyles .= 'width:' . $block['attrs']['width'] . 'px;';
                $block['attrs']['width'] = '';
            }
            if ( ! empty( $block['attrs']['height'] ) ) {
                $inlineStyles .= 'height:' . $block['attrs']['height'] . 'px;';
                $block['attrs']['height'] = '';
            }
        }
        // Block width
        if ( ! empty( $block['attrs']['layout']['contentSize'] ) && $block['blockName'] != 'core/group' ) {
            $inlineStyles .= 'max-width:' . $block['attrs']['layout']['contentSize'] . ';';
        }
        if ( ! empty( $block['attrs']['layout']['contentSize'] ) && $block['blockName'] == 'core/group' ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['layout']['contentSize'] . '; max-width:100%;';
        }
        if ( ! empty( $block['attrs']['width'] ) && $block['blockName'] != 'core/column' ) {
            $inlineStyles .= 'width:' . $block['attrs']['width'] . ';';
        }
        if ( ! empty( $block['attrs']['width'] ) && $block['blockName'] === 'core/column' ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['width'] . ';';
        }

        if ( ! empty( $block['attrs']['layout']['type'] ) && $block['attrs']['layout']['type'] == 'flex' ) {
            $inlineStyles .= 'display:' . $block['attrs']['layout']['type'] . ';';
            if ( ! empty( $block['attrs']['layout']['flexWrap'] ) ) {
                $inlineStyles .= 'flex-wrap:' . $block['attrs']['layout']['flexWrap'] . ';';
            } else {
                $inlineStyles .= 'flex-wrap:wrap;';
            }
            if ( ! empty( $block['attrs']['layout']['verticalAlignment'] ) ) {
                $verticalAlignment = 'center';
                if ( $block['attrs']['layout']['verticalAlignment'] == 'bottom' ) {
                    $verticalAlignment = 'flex-end';
                } elseif ( $block['attrs']['layout']['verticalAlignment'] == 'top' ) {
                    $verticalAlignment = 'flex-start';
                }
                $inlineStyles .= 'align-items:' . $verticalAlignment . ';';
            } else {
                $inlineStyles .= 'align-items:center;';
            }
            if ( ! empty( $block['attrs']['layout']['justifyContent'] ) ) {
                if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                    $inlineStyles .= 'justify-content:flex-start;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                    $inlineStyles .= 'justify-content:center;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                    $inlineStyles .= 'justify-content:flex-end;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'space-between' ) {
                    $inlineStyles .= 'justify-content:space-between;';
                }
            }
            if ( ! empty( $block['attrs']['layout']['orientation'] ) ) {
                if ( $block['attrs']['layout']['orientation'] == 'vertical' ) {
                    $inlineStyles .= 'flex-direction:column;';
                    if ( ! empty( $block['attrs']['layout']['justifyContent'] ) ) {
                        if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                            $inlineStyles .= 'align-items:flex-start;';
                        }
                        if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                            $inlineStyles .= 'align-items:center;';
                        }
                        if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                            $inlineStyles .= 'align-items:flex-end;';
                        }
                    }
                } else {
                    $inlineStyles .= 'flex-direction:row;';
                    if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                        $inlineStyles .= 'justify-content:flex-start;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                        $inlineStyles .= 'justify-content:center;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                        $inlineStyles .= 'justify-content:flex-end;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'space-between' ) {
                        $inlineStyles .= 'justify-content:space-between;';
                    }
                }
            }
        }
        if ( strpos( $block['blockName'], 'core/column' ) !== false ) {
            if ( ! empty( $block['attrs']['align'] ) ) {
                $inlineStyles .= 'align-self:' . $block['attrs']['align'] . ';';
            }
        }

        if ( ! empty( $block['attrs']['minHeight'] ) ) {
            if ( empty( $block['attrs']['minHeightUnit'] ) ) {
                $block['attrs']['minHeightUnit'] = 'px';
            }
            $inlineStyles .= 'min-height:' . $block['attrs']['minHeight'] . $block['attrs']['minHeightUnit'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['dimensions']['minHeight'] ) ) {
            $inlineStyles .= 'min-height:' . $block['attrs']['style']['dimensions']['minHeight']. ';';
        }
        // Spacing (gap, padding, margin)
        if ( ! empty( $block['attrs']['style']['spacing']['blockGap'] ) ) {
    $blockGap = $block['attrs']['style']['spacing']['blockGap'];
    if ( is_array( $blockGap ) ) {
        // Convert array to string, e.g., join with a space or comma.
        $blockGap = implode(' ', $blockGap);
    }
    $inlineStyles .= 'gap:' . $blockGap . ';';
}
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['style']['spacing']['padding']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['style']['spacing']['padding']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['style']['spacing']['padding']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['style']['spacing']['padding']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['style']['spacing']['margin']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['style']['spacing']['margin']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['style']['spacing']['margin']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['style']['spacing']['margin']['left'] . ';';
        }
        // ================================
        // RESPONSIVE CSS GENERATION - DESKTOP STYLES
        // ================================
        
        // Typography - Desktop
        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['desktop'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['desktop'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['desktop'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['desktop'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['desktop'] ) ) {
            $inlineStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['desktop'] ) ) {
            $inlineStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['desktop'] ) ) {
            $inlineStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['desktop'] ) ) {
            $inlineStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['desktop'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['desktop'] ) ) {
            $inlineStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['desktop'] . ';';
}

        // Text and Background colors - Desktop (High Priority)
        if ( ! empty( $block['attrs']['responsiveStyles']['color']['desktop'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['desktop'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['desktop'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['desktop'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['desktop'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['desktop'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['desktop'] ) ) {
            $bg_image = $block['attrs']['responsiveStyles']['background_image']['desktop'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['desktop'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['desktop'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['desktop'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['desktop'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['desktop'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['desktop'] . ' !important;';
        }

        // Layout & Positioning - Desktop
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['desktop'] ) ) {
            $width_value = $block['attrs']['responsiveStyles']['width']['desktop'];
            $inlineStyles .= 'width:' . $width_value . ';';
            $inlineStyles .= 'flex-basis:' . $width_value . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['desktop'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['desktop'] ) ) {
            $inlineStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['desktop'] ) ) {
            $inlineStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['desktop'] ) ) {
            $inlineStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['desktop'] ) ) {
            $inlineStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['desktop'] ) ) {
            $inlineStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['desktop'] ) ) {
            $inlineStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['float']['desktop'] ) ) {
            $inlineStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['clear']['desktop'] ) ) {
            $inlineStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['desktop'] ) ) {
            $inlineStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['desktop'] ) ) {
            $inlineStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['desktop'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) || ! empty( $block['attrs']['animation'] ) ) {
            $animation = ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) ? $block['attrs']['responsiveStyles']['animation']['desktop'] : $block['attrs']['animation'];
    $inlineStyles .= 'animation-name:' . $animation . ';';
    $inlineStyles .= 'animation-fill-mode:both;';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['desktop'] ) || ! empty( $block['attrs']['animation_duration'] ) ) {
            $duration = ! empty( $block['attrs']['responsiveStyles']['animation_duration']['desktop'] ) ? $block['attrs']['responsiveStyles']['animation_duration']['desktop'] : $block['attrs']['animation_duration'];
    $inlineStyles .= 'animation-duration:' . $duration . 's;';
        } elseif ( ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) || ! empty( $block['attrs']['animation'] ) ) {
    $inlineStyles .= 'animation-duration:1s;';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['desktop'] ) || ! empty( $block['attrs']['animation_delay'] ) ) {
            $delay = ! empty( $block['attrs']['responsiveStyles']['animation_delay']['desktop'] ) ? $block['attrs']['responsiveStyles']['animation_delay']['desktop'] : $block['attrs']['animation_delay'];
    $inlineStyles .= 'animation-delay:' . $delay . 's;';
        } elseif ( ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) || ! empty( $block['attrs']['animation'] ) ) {
    $inlineStyles .= 'animation-delay:0s;';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['desktop'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['desktop'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['desktop'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['desktop'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['desktop'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['desktop'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['desktop'] ) ) {
            $position = $block['attrs']['responsiveStyles']['position']['desktop'];
            if ( is_string( $position ) ) {
                $inlineStyles .= 'position:' . $position . ';';
            } elseif ( is_array( $position ) ) {
                // Handle position object with top, left, right, bottom
                if ( ! empty( $position['top'] ) ) {
                    $inlineStyles .= 'top:' . $position['top'] . ';';
                }
                if ( ! empty( $position['left'] ) ) {
                    $inlineStyles .= 'left:' . $position['left'] . ';';
                }
                if ( ! empty( $position['right'] ) ) {
                    $inlineStyles .= 'right:' . $position['right'] . ';';
                }
                if ( ! empty( $position['bottom'] ) ) {
                    $inlineStyles .= 'bottom:' . $position['bottom'] . ';';
                }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['desktop'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['desktop'] . ';';
        }
        // Flexbox - Desktop
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['desktop'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['desktop'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['desktop'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['responsiveStyles']['flexWrap']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['desktop'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['desktop'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['desktop'] . ';';
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['desktop'] ) ) {
            $inlineStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['desktop'] ) ) {
            $inlineStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['desktop'] ) ) {
            $inlineStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['desktop'] ) ) {
            $inlineStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['desktop'] ) ) {
            $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['responsiveStyles']['grid_template_columns']['desktop'] . ', 1fr);';
        }

        // Border - Desktop
        // Border properties - Desktop (handle both string and array formats)
        if ( ! empty( $block['attrs']['responsiveStyles']['borderStyle']['desktop'] ) ) {
            $borderStyle = $block['attrs']['responsiveStyles']['borderStyle']['desktop'];
            if (is_array($borderStyle)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderStyle['top'])) $inlineStyles .= 'border-top-style:' . $borderStyle['top'] . ';';
                if (!empty($borderStyle['right'])) $inlineStyles .= 'border-right-style:' . $borderStyle['right'] . ';';
                if (!empty($borderStyle['bottom'])) $inlineStyles .= 'border-bottom-style:' . $borderStyle['bottom'] . ';';
                if (!empty($borderStyle['left'])) $inlineStyles .= 'border-left-style:' . $borderStyle['left'] . ';';
            } else {
                $inlineStyles .= 'border-style:' . $borderStyle . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderColor']['desktop'] ) ) {
            $borderColor = $block['attrs']['responsiveStyles']['borderColor']['desktop'];
            if (is_array($borderColor)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderColor['top'])) $inlineStyles .= 'border-top-color:' . $borderColor['top'] . ';';
                if (!empty($borderColor['right'])) $inlineStyles .= 'border-right-color:' . $borderColor['right'] . ';';
                if (!empty($borderColor['bottom'])) $inlineStyles .= 'border-bottom-color:' . $borderColor['bottom'] . ';';
                if (!empty($borderColor['left'])) $inlineStyles .= 'border-left-color:' . $borderColor['left'] . ';';
            } else {
                $inlineStyles .= 'border-color:' . $borderColor . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop'] ) ) {
            $borderWidth = $block['attrs']['responsiveStyles']['borderWidth']['desktop'];
            if (is_array($borderWidth)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderWidth['top'])) $inlineStyles .= 'border-top-width:' . $borderWidth['top'] . ';';
                if (!empty($borderWidth['right'])) $inlineStyles .= 'border-right-width:' . $borderWidth['right'] . ';';
                if (!empty($borderWidth['bottom'])) $inlineStyles .= 'border-bottom-width:' . $borderWidth['bottom'] . ';';
                if (!empty($borderWidth['left'])) $inlineStyles .= 'border-left-width:' . $borderWidth['left'] . ';';
            } else {
                $inlineStyles .= 'border-width:' . $borderWidth . ';';
            }
        }

        // Visual Effects - Desktop
        if ( ! empty( $block['attrs']['responsiveStyles']['opacity']['desktop'] ) ) {
            $inlineStyles .= 'opacity:' . $block['attrs']['responsiveStyles']['opacity']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['transform']['desktop'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['responsiveStyles']['transform']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['transition']['desktop'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['responsiveStyles']['transition']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['desktop'] ) ) {
            $inlineStyles .= 'box-shadow:' . $block['attrs']['responsiveStyles']['box_shadow']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['filter']['desktop'] ) ) {
            $inlineStyles .= 'filter:' . $block['attrs']['responsiveStyles']['filter']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['backdrop_filter']['desktop'] ) ) {
            $inlineStyles .= 'backdrop-filter:' . $block['attrs']['responsiveStyles']['backdrop_filter']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['cursor']['desktop'] ) ) {
            $inlineStyles .= 'cursor:' . $block['attrs']['responsiveStyles']['cursor']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['pointer_events']['desktop'] ) ) {
            $inlineStyles .= 'pointer-events:' . $block['attrs']['responsiveStyles']['pointer_events']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['user_select']['desktop'] ) ) {
            $inlineStyles .= 'user-select:' . $block['attrs']['responsiveStyles']['user_select']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['gap']['desktop'] ) ) {
            $inlineStyles .= 'gap:' . $block['attrs']['responsiveStyles']['gap']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_fit']['desktop'] ) ) {
            $inlineStyles .= 'object-fit:' . $block['attrs']['responsiveStyles']['object_fit']['desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_position']['desktop'] ) ) {
            $inlineStyles .= 'object-position:' . $block['attrs']['responsiveStyles']['object_position']['desktop'] . ';';
        }

        // Object-based attributes - Desktop
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['responsiveStyles']['padding']['desktop']['top'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['responsiveStyles']['padding']['desktop']['right'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['responsiveStyles']['padding']['desktop']['bottom'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['responsiveStyles']['padding']['desktop']['left'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['responsiveStyles']['margin']['desktop']['top'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['responsiveStyles']['margin']['desktop']['right'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['responsiveStyles']['margin']['desktop']['bottom'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['responsiveStyles']['margin']['desktop']['left'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomRight'] . ';';
        }
        $inlineStyles .= '}';

        // ================================
        // RESPONSIVE CSS GENERATION - TABLET STYLES
        // ================================
        $inlineStyles .= '@media screen and (max-width: 1024px){ #block_' . $block['attrs']['customId'] . '{';
        
        // Typography - Tablet (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['tablet'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['tablet'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['tablet'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['tablet'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['tablet'] ) ) {
            $inlineStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['tablet'] ) ) {
            $inlineStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['tablet'] ) ) {
            $inlineStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['tablet'] ) ) {
            $inlineStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['tablet'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['tablet'] ) ) {
            $inlineStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['tablet'] . ';';
        }

        // Text and Background colors - Tablet (High Priority - using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['color']['tablet'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['tablet'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['tablet'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['tablet'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['tablet'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['tablet'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['tablet'] ) ) {
            $bg_image = $block['attrs']['responsiveStyles']['background_image']['tablet'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['tablet'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['tablet'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['tablet'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['tablet'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['tablet'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['tablet'] . ' !important;';
        }

        // Layout & Positioning - Tablet (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['tablet'] ) ) {
            $width_value = $block['attrs']['responsiveStyles']['width']['tablet'];
            $inlineStyles .= 'width:' . $width_value . ';';
            $inlineStyles .= 'flex-basis:' . $width_value . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['tablet'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['tablet'] ) ) {
            $inlineStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['tablet'] ) ) {
            $inlineStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['tablet'] ) ) {
            $inlineStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['tablet'] ) ) {
            $inlineStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['tablet'] ) ) {
            $inlineStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['tablet'] ) ) {
            $inlineStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['float']['tablet'] ) ) {
            $inlineStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['clear']['tablet'] ) ) {
            $inlineStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['tablet'] ) ) {
            $inlineStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['tablet'] ) ) {
            $inlineStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation']['tablet'] ) ) {
            $inlineStyles .= 'animation-name:' . $block['attrs']['responsiveStyles']['animation']['tablet'] . ';';
            $inlineStyles .= 'animation-fill-mode:both;';
            $inlineStyles .= 'animation-duration:1s;';
            $inlineStyles .= 'animation-delay:0s;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['tablet'] ) ) {
            $inlineStyles .= 'animation-duration:' . $block['attrs']['responsiveStyles']['animation_duration']['tablet'] . 's;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['tablet'] ) ) {
            $inlineStyles .= 'animation-delay:' . $block['attrs']['responsiveStyles']['animation_delay']['tablet'] . 's;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['tablet'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['tablet'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['tablet'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['tablet'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['tablet'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['tablet'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['tablet'] ) ) {
            $position = $block['attrs']['responsiveStyles']['position']['tablet'];
            if ( is_string( $position ) ) {
                $inlineStyles .= 'position:' . $position . ';';
            } elseif ( is_array( $position ) ) {
                // Handle position object with top, left, right, bottom
                if ( ! empty( $position['top'] ) ) {
                    $inlineStyles .= 'top:' . $position['top'] . ';';
                }
                if ( ! empty( $position['left'] ) ) {
                    $inlineStyles .= 'left:' . $position['left'] . ';';
                }
                if ( ! empty( $position['right'] ) ) {
                    $inlineStyles .= 'right:' . $position['right'] . ';';
                }
                if ( ! empty( $position['bottom'] ) ) {
                    $inlineStyles .= 'bottom:' . $position['bottom'] . ';';
                }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['tablet'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['tablet'] . ';';
        }

        // Flexbox - Tablet (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['tablet'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['tablet'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['tablet'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['responsiveStyles']['flexWrap']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['tablet'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['tablet'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['tablet'] . ';';
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['tablet'] ) ) {
            $inlineStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['tablet'] ) ) {
            $inlineStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['tablet'] ) ) {
            $inlineStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['tablet'] ) ) {
            $inlineStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['tablet'] ) ) {
            $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['responsiveStyles']['grid_template_columns']['tablet'] . ', 1fr);';
        }

        // Border - Tablet (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['borderStyle']['tablet'] ) ) {
            $borderStyle = $block['attrs']['responsiveStyles']['borderStyle']['tablet'];
            if (is_array($borderStyle)) {
                // Handle array format with top, right, bottom, left
                $inlineStyles .= 'border-top-style:' . ($borderStyle['top'] ?? '') . ';';
                $inlineStyles .= 'border-right-style:' . ($borderStyle['right'] ?? '') . ';';
                $inlineStyles .= 'border-bottom-style:' . ($borderStyle['bottom'] ?? '') . ';';
                $inlineStyles .= 'border-left-style:' . ($borderStyle['left'] ?? '') . ';';
            } else {
                $inlineStyles .= 'border-style:' . $borderStyle . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderColor']['tablet'] ) ) {
            $borderColor = $block['attrs']['responsiveStyles']['borderColor']['tablet'];
            if (is_array($borderColor)) {
                // Handle array format with top, right, bottom, left
                $inlineStyles .= 'border-top-color:' . ($borderColor['top'] ?? '') . ';';
                $inlineStyles .= 'border-right-color:' . ($borderColor['right'] ?? '') . ';';
                $inlineStyles .= 'border-bottom-color:' . ($borderColor['bottom'] ?? '') . ';';
                $inlineStyles .= 'border-left-color:' . ($borderColor['left'] ?? '') . ';';
            } else {
                $inlineStyles .= 'border-color:' . $borderColor . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['tablet'] ) ) {
            $borderWidth = $block['attrs']['responsiveStyles']['borderWidth']['tablet'];
            if (is_array($borderWidth)) {
                // Handle array format with top, right, bottom, left
                $inlineStyles .= 'border-top-width:' . ($borderWidth['top'] ?? '') . ';';
                $inlineStyles .= 'border-right-width:' . ($borderWidth['right'] ?? '') . ';';
                $inlineStyles .= 'border-bottom-width:' . ($borderWidth['bottom'] ?? '') . ';';
                $inlineStyles .= 'border-left-width:' . ($borderWidth['left'] ?? '') . ';';
            } else {
                $inlineStyles .= 'border-width:' . $borderWidth . ';';
            }
        }

        // Visual Effects - Tablet (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['opacity']['tablet'] ) ) {
            $inlineStyles .= 'opacity:' . $block['attrs']['responsiveStyles']['opacity']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['transform']['tablet'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['responsiveStyles']['transform']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['transition']['tablet'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['responsiveStyles']['transition']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['tablet'] ) ) {
            $inlineStyles .= 'box-shadow:' . $block['attrs']['responsiveStyles']['box_shadow']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['filter']['tablet'] ) ) {
            $inlineStyles .= 'filter:' . $block['attrs']['responsiveStyles']['filter']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['backdrop_filter']['tablet'] ) ) {
            $inlineStyles .= 'backdrop-filter:' . $block['attrs']['responsiveStyles']['backdrop_filter']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['cursor']['tablet'] ) ) {
            $inlineStyles .= 'cursor:' . $block['attrs']['responsiveStyles']['cursor']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['user_select']['tablet'] ) ) {
            $inlineStyles .= 'user-select:' . $block['attrs']['responsiveStyles']['user_select']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['gap']['tablet'] ) ) {
            $inlineStyles .= 'gap:' . $block['attrs']['responsiveStyles']['gap']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_fit']['tablet'] ) ) {
            $inlineStyles .= 'object-fit:' . $block['attrs']['responsiveStyles']['object_fit']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_position']['tablet'] ) ) {
            $inlineStyles .= 'object-position:' . $block['attrs']['responsiveStyles']['object_position']['tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['pointer_events']['tablet'] ) ) {
            $inlineStyles .= 'pointer-events:' . $block['attrs']['responsiveStyles']['pointer_events']['tablet'] . ';';
        }

        // Object-based attributes - Tablet
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['tablet']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['responsiveStyles']['padding']['tablet']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['tablet']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['responsiveStyles']['padding']['tablet']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['tablet']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['responsiveStyles']['padding']['tablet']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['tablet']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['responsiveStyles']['padding']['tablet']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['tablet']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['responsiveStyles']['margin']['tablet']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['tablet']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['responsiveStyles']['margin']['tablet']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['tablet']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['responsiveStyles']['margin']['tablet']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['tablet']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['responsiveStyles']['margin']['tablet']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['tablet']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['tablet']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['tablet']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['tablet']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['tablet']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['tablet']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['tablet']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['tablet']['bottomRight'] . ';';
}

        $inlineStyles .= '} }';
        // ================================
        // RESPONSIVE CSS GENERATION - MOBILE STYLES
        // ================================
        $inlineStyles .= '@media screen and (max-width: 768px){ #block_' . $block['attrs']['customId'] . '{';
        // Typography - Mobile (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['mobile'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['mobile'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['mobile'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['mobile'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['mobile'] ) ) {
            $inlineStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['mobile'] ) ) {
            $inlineStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['mobile'] ) ) {
            $inlineStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['mobile'] ) ) {
            $inlineStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['mobile'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['mobile'] ) ) {
            $inlineStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['mobile'] . ';';
        }

        // Text and Background colors - Mobile (High Priority - using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['color']['mobile'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['mobile'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['mobile'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['mobile'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['mobile'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['mobile'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['mobile'] ) ) {
            $bg_image = $block['attrs']['responsiveStyles']['background_image']['mobile'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['mobile'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['mobile'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['mobile'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['mobile'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['mobile'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['mobile'] . ' !important;';
        }

        // Layout & Positioning - Mobile
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['mobile'] ) ) {
            $width_value = $block['attrs']['responsiveStyles']['width']['mobile'];
            $inlineStyles .= 'width:' . $width_value . ';';
            $inlineStyles .= 'flex-basis:' . $width_value . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['mobile'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['mobile'] . ';';
        }
if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['mobile'] ) ) {
    $inlineStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['mobile'] ) ) {
    $inlineStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['mobile'] ) ) {
    $inlineStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['mobile'] ) ) {
    $inlineStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['mobile'] ) ) {
    $inlineStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['mobile'] ) ) {
    $inlineStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['float']['mobile'] ) ) {
    $inlineStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['clear']['mobile'] ) ) {
    $inlineStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['mobile'] ) ) {
    $inlineStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['mobile'] ) ) {
    $inlineStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['animation']['mobile'] ) ) {
    $inlineStyles .= 'animation-name:' . $block['attrs']['responsiveStyles']['animation']['mobile'] . ';';
    $inlineStyles .= 'animation-fill-mode:both;';
    $inlineStyles .= 'animation-duration:1s;';
    $inlineStyles .= 'animation-delay:0s;';
}
if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['mobile'] ) ) {
    $inlineStyles .= 'animation-duration:' . $block['attrs']['responsiveStyles']['animation_duration']['mobile'] . 's;';
}
if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['mobile'] ) ) {
    $inlineStyles .= 'animation-delay:' . $block['attrs']['responsiveStyles']['animation_delay']['mobile'] . 's;';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['mobile'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['mobile'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['mobile'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['mobile'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['mobile'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['mobile'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['mobile'] ) ) {
            $position = $block['attrs']['responsiveStyles']['position']['mobile'];
            if ( is_string( $position ) ) {
                $inlineStyles .= 'position:' . $position . ';';
            } elseif ( is_array( $position ) ) {
                // Handle position object with top, left, right, bottom
                if ( ! empty( $position['top'] ) ) {
                    $inlineStyles .= 'top:' . $position['top'] . ';';
                }
                if ( ! empty( $position['left'] ) ) {
                    $inlineStyles .= 'left:' . $position['left'] . ';';
                }
                if ( ! empty( $position['right'] ) ) {
                    $inlineStyles .= 'right:' . $position['right'] . ';';
                }
                if ( ! empty( $position['bottom'] ) ) {
                    $inlineStyles .= 'bottom:' . $position['bottom'] . ';';
                }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['mobile'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['mobile'] . ';';
        }

        // Flexbox - Mobile
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['mobile'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['mobile'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['mobile'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['responsiveStyles']['flexWrap']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['mobile'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['mobile'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['mobile'] . ';';
        }

if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['mobile'] ) ) {
    $inlineStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['mobile'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['mobile'] ) ) {
            $inlineStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['mobile'] ) ) {
            $inlineStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['mobile'] . ';';
        }
if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['mobile'] ) ) {
    $inlineStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['mobile'] ) ) {
    $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['responsiveStyles']['grid_template_columns']['mobile'] . ', 1fr);';
}

        // Border - Mobile (handle both string and array formats)
        if ( ! empty( $block['attrs']['responsiveStyles']['borderStyle']['mobile'] ) ) {
            $borderStyle = $block['attrs']['responsiveStyles']['borderStyle']['mobile'];
            if (is_array($borderStyle)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderStyle['top'])) $inlineStyles .= 'border-top-style:' . $borderStyle['top'] . ';';
                if (!empty($borderStyle['right'])) $inlineStyles .= 'border-right-style:' . $borderStyle['right'] . ';';
                if (!empty($borderStyle['bottom'])) $inlineStyles .= 'border-bottom-style:' . $borderStyle['bottom'] . ';';
                if (!empty($borderStyle['left'])) $inlineStyles .= 'border-left-style:' . $borderStyle['left'] . ';';
            } else {
                $inlineStyles .= 'border-style:' . $borderStyle . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderColor']['mobile'] ) ) {
            $borderColor = $block['attrs']['responsiveStyles']['borderColor']['mobile'];
            if (is_array($borderColor)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderColor['top'])) $inlineStyles .= 'border-top-color:' . $borderColor['top'] . ';';
                if (!empty($borderColor['right'])) $inlineStyles .= 'border-right-color:' . $borderColor['right'] . ';';
                if (!empty($borderColor['bottom'])) $inlineStyles .= 'border-bottom-color:' . $borderColor['bottom'] . ';';
                if (!empty($borderColor['left'])) $inlineStyles .= 'border-left-color:' . $borderColor['left'] . ';';
            } else {
                $inlineStyles .= 'border-color:' . $borderColor . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['mobile'] ) ) {
            $borderWidth = $block['attrs']['responsiveStyles']['borderWidth']['mobile'];
            if (is_array($borderWidth)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderWidth['top'])) $inlineStyles .= 'border-top-width:' . $borderWidth['top'] . ';';
                if (!empty($borderWidth['right'])) $inlineStyles .= 'border-right-width:' . $borderWidth['right'] . ';';
                if (!empty($borderWidth['bottom'])) $inlineStyles .= 'border-bottom-width:' . $borderWidth['bottom'] . ';';
                if (!empty($borderWidth['left'])) $inlineStyles .= 'border-left-width:' . $borderWidth['left'] . ';';
            } else {
                $inlineStyles .= 'border-width:' . $borderWidth . ';';
            }
        }

        // Visual Effects - Mobile
if ( ! empty( $block['attrs']['responsiveStyles']['opacity']['mobile'] ) ) {
    $inlineStyles .= 'opacity:' . $block['attrs']['responsiveStyles']['opacity']['mobile'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['transform']['mobile'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['responsiveStyles']['transform']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['transition']['mobile'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['responsiveStyles']['transition']['mobile'] . ';';
}
if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['mobile'] ) ) {
    $inlineStyles .= 'box-shadow:' . $block['attrs']['responsiveStyles']['box_shadow']['mobile'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['filter']['mobile'] ) ) {
            $inlineStyles .= 'filter:' . $block['attrs']['responsiveStyles']['filter']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['backdrop_filter']['mobile'] ) ) {
            $inlineStyles .= 'backdrop-filter:' . $block['attrs']['responsiveStyles']['backdrop_filter']['mobile'] . ';';
        }
if ( ! empty( $block['attrs']['responsiveStyles']['cursor']['mobile'] ) ) {
    $inlineStyles .= 'cursor:' . $block['attrs']['responsiveStyles']['cursor']['mobile'] . ';';
}
        if ( ! empty( $block['attrs']['responsiveStyles']['user_select']['mobile'] ) ) {
            $inlineStyles .= 'user-select:' . $block['attrs']['responsiveStyles']['user_select']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['gap']['mobile'] ) ) {
            $inlineStyles .= 'gap:' . $block['attrs']['responsiveStyles']['gap']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_fit']['mobile'] ) ) {
            $inlineStyles .= 'object-fit:' . $block['attrs']['responsiveStyles']['object_fit']['mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_position']['mobile'] ) ) {
            $inlineStyles .= 'object-position:' . $block['attrs']['responsiveStyles']['object_position']['mobile'] . ';';
        }
if ( ! empty( $block['attrs']['responsiveStyles']['pointer_events']['mobile'] ) ) {
    $inlineStyles .= 'pointer-events:' . $block['attrs']['responsiveStyles']['pointer_events']['mobile'] . ';';
}

        // Object-based attributes - Mobile
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['responsiveStyles']['padding']['mobile']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['responsiveStyles']['padding']['mobile']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['responsiveStyles']['padding']['mobile']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['responsiveStyles']['padding']['mobile']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['responsiveStyles']['margin']['mobile']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['responsiveStyles']['margin']['mobile']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['responsiveStyles']['margin']['mobile']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['responsiveStyles']['margin']['mobile']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomRight'] . ';';
}

        $inlineStyles .= '} }';
        // ================================
        // RESPONSIVE CSS GENERATION - HOVER STYLES
        // ================================
        $inlineStyles .= '#block_' . $block['attrs']['customId'] . ':hover{';
        
        // Typography - Hover (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['hover'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['hover'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['hover'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['hover'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['hover'] ) ) {
            $inlineStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['hover'] ) ) {
            $inlineStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['hover'] ) ) {
            $inlineStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['hover'] ) ) {
            $inlineStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['hover'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['hover'] ) ) {
            $inlineStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['hover'] . ';';
        }

        // Text and Background colors - Hover (High Priority - using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['color']['hover'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['hover'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['hover'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['hover'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['hover'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['hover'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['hover'] ) ) {
            $bg_image = $block['attrs']['responsiveStyles']['background_image']['hover'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['hover'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['hover'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['hover'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['hover'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['hover'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['hover'] . ' !important;';
        }

        // Layout & Positioning - Hover (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['hover'] ) ) {
            $width_value = $block['attrs']['responsiveStyles']['width']['hover'];
            $inlineStyles .= 'width:' . $width_value . ';';
            $inlineStyles .= 'flex-basis:' . $width_value . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['hover'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['hover'] ) ) {
            $inlineStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['hover'] ) ) {
            $inlineStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['hover'] ) ) {
            $inlineStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['hover'] ) ) {
            $inlineStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['hover'] ) ) {
            $inlineStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['hover'] ) ) {
            $inlineStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['float']['hover'] ) ) {
            $inlineStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['clear']['hover'] ) ) {
            $inlineStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['hover'] ) ) {
            $inlineStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['hover'] ) ) {
            $inlineStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation']['hover'] ) ) {
            $inlineStyles .= 'animation-name:' . $block['attrs']['responsiveStyles']['animation']['hover'] . ';';
            $inlineStyles .= 'animation-fill-mode:both;';
            $inlineStyles .= 'animation-duration:1s;';
            $inlineStyles .= 'animation-delay:0s;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['hover'] ) ) {
            $inlineStyles .= 'animation-duration:' . $block['attrs']['responsiveStyles']['animation_duration']['hover'] . 's;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['hover'] ) ) {
            $inlineStyles .= 'animation-delay:' . $block['attrs']['responsiveStyles']['animation_delay']['hover'] . 's;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['hover'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['hover'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['hover'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['hover'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['hover'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['hover'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['hover'] ) ) {
            $inlineStyles .= 'position:' . $block['attrs']['responsiveStyles']['position']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['hover'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['hover'] . ';';
        }

        // Flexbox - Hover (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['hover'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['hover'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['hover'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['responsiveStyles']['flexWrap']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['hover'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['hover'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['hover'] . ';';
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['hover'] ) ) {
            $inlineStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['hover'] ) ) {
            $inlineStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['hover'] ) ) {
            $inlineStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['hover'] ) ) {
            $inlineStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['hover'] ) ) {
            $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['responsiveStyles']['grid_template_columns']['hover'] . ', 1fr);';
        }

        // Border - Hover (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['borderStyle']['hover'] ) ) {
            $borderStyle = $block['attrs']['responsiveStyles']['borderStyle']['hover'];
            if (is_array($borderStyle)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderStyle['top'])) $inlineStyles .= 'border-top-style:' . $borderStyle['top'] . ';';
                if (!empty($borderStyle['right'])) $inlineStyles .= 'border-right-style:' . $borderStyle['right'] . ';';
                if (!empty($borderStyle['bottom'])) $inlineStyles .= 'border-bottom-style:' . $borderStyle['bottom'] . ';';
                if (!empty($borderStyle['left'])) $inlineStyles .= 'border-left-style:' . $borderStyle['left'] . ';';
            } else {
                $inlineStyles .= 'border-style:' . $borderStyle . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderColor']['hover'] ) ) {
            $borderColor = $block['attrs']['responsiveStyles']['borderColor']['hover'];
            if (is_array($borderColor)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderColor['top'])) $inlineStyles .= 'border-top-color:' . $borderColor['top'] . ';';
                if (!empty($borderColor['right'])) $inlineStyles .= 'border-right-color:' . $borderColor['right'] . ';';
                if (!empty($borderColor['bottom'])) $inlineStyles .= 'border-bottom-color:' . $borderColor['bottom'] . ';';
                if (!empty($borderColor['left'])) $inlineStyles .= 'border-left-color:' . $borderColor['left'] . ';';
            } else {
                $inlineStyles .= 'border-color:' . $borderColor . ';';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['hover'] ) ) {
            $borderWidth = $block['attrs']['responsiveStyles']['borderWidth']['hover'];
            if (is_array($borderWidth)) {
                // Handle array format with top, right, bottom, left
                if (!empty($borderWidth['top'])) $inlineStyles .= 'border-top-width:' . $borderWidth['top'] . ';';
                if (!empty($borderWidth['right'])) $inlineStyles .= 'border-right-width:' . $borderWidth['right'] . ';';
                if (!empty($borderWidth['bottom'])) $inlineStyles .= 'border-bottom-width:' . $borderWidth['bottom'] . ';';
                if (!empty($borderWidth['left'])) $inlineStyles .= 'border-left-width:' . $borderWidth['left'] . ';';
            } else {
                $inlineStyles .= 'border-width:' . $borderWidth . ';';
            }
        }

        // Visual Effects - Hover (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['opacity']['hover'] ) ) {
            $inlineStyles .= 'opacity:' . $block['attrs']['responsiveStyles']['opacity']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['transform']['hover'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['responsiveStyles']['transform']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['transition']['hover'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['responsiveStyles']['transition']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['hover'] ) ) {
            $inlineStyles .= 'box-shadow:' . $block['attrs']['responsiveStyles']['box_shadow']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['filter']['hover'] ) ) {
            $inlineStyles .= 'filter:' . $block['attrs']['responsiveStyles']['filter']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['backdrop_filter']['hover'] ) ) {
            $inlineStyles .= 'backdrop-filter:' . $block['attrs']['responsiveStyles']['backdrop_filter']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['cursor']['hover'] ) ) {
            $inlineStyles .= 'cursor:' . $block['attrs']['responsiveStyles']['cursor']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['user_select']['hover'] ) ) {
            $inlineStyles .= 'user-select:' . $block['attrs']['responsiveStyles']['user_select']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['gap']['hover'] ) ) {
            $inlineStyles .= 'gap:' . $block['attrs']['responsiveStyles']['gap']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_fit']['hover'] ) ) {
            $inlineStyles .= 'object-fit:' . $block['attrs']['responsiveStyles']['object_fit']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_position']['hover'] ) ) {
            $inlineStyles .= 'object-position:' . $block['attrs']['responsiveStyles']['object_position']['hover'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['pointer_events']['hover'] ) ) {
            $inlineStyles .= 'pointer-events:' . $block['attrs']['responsiveStyles']['pointer_events']['hover'] . ';';
        }

        // Object-based attributes - Hover (using responsiveStyles object)
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['hover']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['responsiveStyles']['padding']['hover']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['hover']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['responsiveStyles']['padding']['hover']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['hover']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['responsiveStyles']['padding']['hover']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['hover']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['responsiveStyles']['padding']['hover']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['hover']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['responsiveStyles']['margin']['hover']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['hover']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['responsiveStyles']['margin']['hover']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['hover']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['responsiveStyles']['margin']['hover']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['hover']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['responsiveStyles']['margin']['hover']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['hover']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['hover']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['hover']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['hover']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['hover']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['hover']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['hover']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['hover']['bottomRight'] . ';';
        }
        
        $inlineStyles .= '}';

        // Custom CSS with smart this_block replacement
        if ( ! empty( $block['attrs']['custom_css'] ) ) {
            $custom_css = $block['attrs']['custom_css'];
            $block_selector = '#block_' . $block['attrs']['customId'];
            
            // Process custom CSS rules properly
            $processed_css = stepfox_process_custom_css($custom_css, $block_selector);
            $processed_css = str_replace( 'block_anchor_', '', $processed_css );
            $inlineStyles .= $processed_css;
        }

        return $inlineStyles;
    }

    return $block_content ?? '';
}


function stepfox_block_scripts() {
    wp_reset_postdata();
    global $_wp_current_template_content;
    
    // Get current page/post info for cache key generation
    $post_id = get_the_ID();
    $template_slug = get_page_template_slug();
    $is_front_page = is_front_page();
    $is_home = is_home();
    $is_archive = is_archive();
    $is_single = is_single();
    
    // Build content for cache key generation
    $page_content = get_the_content();
    $full_content = $_wp_current_template_content . $page_content;
    
    // Create unique cache key based on content hash and context
    $cache_context = array(
        'post_id' => $post_id,
        'template_slug' => $template_slug,
        'is_front_page' => $is_front_page,
        'is_home' => $is_home,
        'is_archive' => $is_archive,
        'is_single' => $is_single,
        'plugin_version' => STEPFOX_LOOKS_VERSION,
        'content_hash' => md5($full_content)
    );
    
    $cache_key = 'stepfox_styles_' . md5(serialize($cache_context));
    
    // Try to get cached styles
    $cached_data = get_transient($cache_key);
    
    if ($cached_data !== false && is_array($cached_data)) {
        // Use cached styles
        $inline_style = $cached_data['css'];
        $inline_script = $cached_data['js'];
        
        // Enqueue cached styles
        wp_register_style( 'stepfox-responsive-style', false );
        wp_enqueue_style( 'stepfox-responsive-style' );
        
        if (!empty($inline_style)) {
            wp_add_inline_style( 'stepfox-responsive-style', $inline_style);
        }
        
        if (!empty($inline_script)) {
            wp_register_script( 'stepfox-responsive-inline-js', '', array(), STEPFOX_LOOKS_VERSION, true );
            wp_enqueue_script( 'stepfox-responsive-inline-js' );
            wp_add_inline_script( 'stepfox-responsive-inline-js', $inline_script);
        }
        
        return; // Exit early with cached data
    }
    
    // No cache found, generate styles
    if ( has_blocks( $full_content ) ) {
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        
        // Get template parts content (only if not cached)
        foreach ( $all_blocks as $block ) {
            $full_content .= get_template_parts_as_content( $block );
        }
        
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        $inline_style = '';
        $inline_script = '';
        
        wp_register_style( 'stepfox-responsive-style', false );
        wp_enqueue_style( 'stepfox-responsive-style' );

        foreach ( $all_blocks as $block ) {
            if ( ( $block['blockName'] === 'core/block' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ||
                ( $block['blockName'] === 'core/navigation' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ) {
                $content = get_post_field( 'post_content', $block['attrs']['ref'] );
                $reusable_blocks = parse_blocks( $content );
                $all_reusable_blocks = search( $reusable_blocks, 'blockName' );
                foreach ( $all_reusable_blocks as $reusable_block ) {
                    $inline_style .= inline_styles_for_blocks( $reusable_block );
                    $inline_script .= inline_scripts_for_blocks( $reusable_block );
                }
            }

            // Process all blocks with inline styles and scripts
            $inline_style .= inline_styles_for_blocks( $block );
            $inline_script .= inline_scripts_for_blocks( $block );
        }

        // Cache styles for 1 hour
        $cache_data = array(
            'css' => $inline_style,
            'js' => $inline_script,
            'generated_at' => current_time('timestamp')
        );
        
        set_transient($cache_key, $cache_data, HOUR_IN_SECONDS);
        
        // Output CSS
        if (!empty($inline_style)) {
            wp_add_inline_style( 'stepfox-responsive-style', $inline_style);
        }

        // Output JavaScript
        if (!empty($inline_script)) {
            wp_register_script( 'stepfox-responsive-inline-js', '', array(), STEPFOX_LOOKS_VERSION, true );
            wp_enqueue_script( 'stepfox-responsive-inline-js' );
            wp_add_inline_script( 'stepfox-responsive-inline-js', $inline_script);
        }
    }
}

add_action( 'wp_head', 'stepfox_block_scripts' );

/**
 * Clear Stepfox styles cache when content is updated
 */
function stepfox_clear_styles_cache($post_id = null) {
    // Clear all stepfox style transients
    global $wpdb;
    
    // Delete all transients that start with 'stepfox_styles_' and 'stepfox_editor_styles_'
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_stepfox_styles_%',
            '_transient_stepfox_editor_styles_%'
        )
    );
    
    // Also delete timeout transients
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_timeout_stepfox_styles_%',
            '_transient_timeout_stepfox_editor_styles_%'
        )
    );
    
    // Clear object cache
    if (function_exists('wp_cache_flush_group')) {
        wp_cache_flush_group('stepfox_styles');
    }
}

/**
 * Clear cache when posts/pages are saved
 */
function stepfox_clear_cache_on_save($post_id) {
    // Only clear cache for published posts
    if (get_post_status($post_id) === 'publish') {
        stepfox_clear_styles_cache($post_id);
    }
}

/**
 * Clear cache when template parts are updated
 */
function stepfox_clear_cache_on_template_update($post_id) {
    $post_type = get_post_type($post_id);
    if ($post_type === 'wp_template' || $post_type === 'wp_template_part') {
        stepfox_clear_styles_cache($post_id);
    }
}

/**
 * Clear cache when theme is switched or customizer is saved
 */
function stepfox_clear_cache_on_theme_change() {
    stepfox_clear_styles_cache();
}

// Hook cache clearing functions
add_action('save_post', 'stepfox_clear_cache_on_save');

// Add manual cache clearing via URL parameter (for testing)
add_action('init', function() {
    if (current_user_can('manage_options') && isset($_GET['stepfox_clear_cache'])) {
        stepfox_clear_styles_cache();
        wp_redirect(remove_query_arg('stepfox_clear_cache'));
        exit;
    }
});
add_action('wp_update_nav_menu', 'stepfox_clear_styles_cache');
add_action('switch_theme', 'stepfox_clear_cache_on_theme_change');
add_action('customize_save_after', 'stepfox_clear_cache_on_theme_change');
add_action('rest_after_save_wp_template', 'stepfox_clear_cache_on_template_update');
add_action('rest_after_save_wp_template_part', 'stepfox_clear_cache_on_template_update');

/**
 * Add admin action to manually clear Stepfox cache
 */
function stepfox_add_admin_cache_clear() {
    if (current_user_can('manage_options') && isset($_GET['stepfox_clear_cache']) && wp_verify_nonce($_GET['_wpnonce'], 'stepfox_clear_cache')) {
        stepfox_clear_styles_cache();
        add_action('admin_notices', function() {
            echo '<div class="notice notice-success is-dismissible"><p>Stepfox styles cache cleared successfully!</p></div>';
        });
    }
}
add_action('admin_init', 'stepfox_add_admin_cache_clear');

/**
 * Generate and output custom CSS and responsive styles for the Gutenberg editor
 * This ensures that custom_css and responsive styles are visible in the backend editor
 */
function stepfox_block_editor_scripts() {
    // Only run in admin/editor context
    if (!is_admin()) {
        return;
    }

    // Get the current post content for the editor
    global $post;
    if (!$post || !has_blocks($post->post_content)) {
        return;
    }

    // Create cache key for editor styles
    $editor_cache_key = 'stepfox_editor_styles_' . md5($post->ID . '_' . md5($post->post_content) . '_' . STEPFOX_LOOKS_VERSION);
    
    // Try to get cached editor styles
    $cached_editor_style = get_transient($editor_cache_key);
    
    if ($cached_editor_style !== false) {
        // Use cached styles
        wp_register_style('stepfox-editor-custom-css', false);
        wp_enqueue_style('stepfox-editor-custom-css');
        
        if (!empty($cached_editor_style)) {
            wp_add_inline_style('stepfox-editor-custom-css', $cached_editor_style);
        }
        return; // Exit early with cached data
    }

    // Generate editor styles
    $blocks = parse_blocks($post->post_content);
    $all_blocks = search($blocks, 'blockName');
    $inline_style = '';

    // Register and enqueue a style handle for editor custom CSS
    wp_register_style('stepfox-editor-custom-css', false);
    wp_enqueue_style('stepfox-editor-custom-css');

    foreach ($all_blocks as $block) {
        // Handle reusable blocks and navigation blocks
        if (($block['blockName'] === 'core/block' && isset($block['attrs']) && !empty($block['attrs']['ref'])) ||
            ($block['blockName'] === 'core/navigation' && isset($block['attrs']) && !empty($block['attrs']['ref']))) {
            $content = get_post_field('post_content', $block['attrs']['ref']);
            $reusable_blocks = parse_blocks($content);
            $all_reusable_blocks = search($reusable_blocks, 'blockName');
            foreach ($all_reusable_blocks as $reusable_block) {
                $inline_style .= inline_styles_for_blocks($reusable_block);
            }
        }

        // Process all blocks with inline styles
        $inline_style .= inline_styles_for_blocks($block);
    }

    // Cache editor styles for 30 minutes
    set_transient($editor_cache_key, $inline_style, 30 * MINUTE_IN_SECONDS);

    // Output CSS for editor
    if (!empty($inline_style)) {
        wp_add_inline_style('stepfox-editor-custom-css', $inline_style);
    }
}

// Hook into the block editor assets to ensure custom CSS is loaded in the editor
add_action('enqueue_block_editor_assets', 'stepfox_block_editor_scripts');

function inline_scripts_for_blocks($block) {
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['attrs']) || !is_array($block['attrs'])) {
        return '';
    }
    
    if(!empty($block['attrs']['custom_js'])) {
        $customId = isset($block['attrs']['customId']) ? $block['attrs']['customId'] : 'default-block-id';
        $block_selector = '#block_' . $customId;
        
        // Use the same smart replacement logic for custom JS
        return stepfox_process_custom_css($block['attrs']['custom_js'], $block_selector);
    }
    return '';
}