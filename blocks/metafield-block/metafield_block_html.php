<?php
/**
 * Metafield Block HTML Renderer
 * Renders metafield blocks with proper security measures
 * 
 * @package stepfox
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render metafield block with security measures
 * 
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @param WP_Block $block Block instance
 * @return string
 */
function stepfox_render_metafield_block( $attributes, $content, $block ) {
    ob_start();

    // Determine block name and class
    $block_name       = str_replace( "stepfox/", "", strtolower( $block->name ) );
    $block_name_class = str_replace( "-", "_", $block_name );

    // Determine the post ID. Prefer Query Loop context if available.
    $post_id = 0;
    if ( isset( $block->context['postId'] ) && $block->context['postId'] ) {
        $post_id = intval( $block->context['postId'] );
    } else {
        $post_id = get_the_ID();
    }
    // Note: Avoid using $_GET fallbacks without nonce verification to satisfy security best practices.
    if ( defined( 'REST_REQUEST' ) && REST_REQUEST && $block_name_class === 'metafield_block' && ! empty( $attributes['select_a_post'] ) ) {
        $post_id = intval( $attributes['select_a_post'] );
        $attributes['customId'] = '';
    }
    // Do not reset post data here; we rely on Query Loop context/global $post during render

    // Ensure we have a valid post ID
    if ( empty( $post_id ) ) {
        global $post;
        if ( $post instanceof WP_Post && ! empty( $post->ID ) ) {
            $post_id = intval( $post->ID );
        }
    }
    if ( empty( $post_id ) ) {
        $queried = get_queried_object_id();
        if ( $queried ) {
            $post_id = intval( $queried );
        }
    }
    if ( empty( $post_id ) ) {
        $post_id = get_the_ID();
    }

    // If still no valid post, render nothing gracefully
    if ( empty( $post_id ) || ! get_post( $post_id ) ) {
        return ob_get_clean();
    }

    // Determine meta field. Support built-ins and arbitrary custom keys.
    $built_in_fields   = array('post_title', 'post_content', 'post_excerpt', 'featured_image', 'permalink', 'month', 'counter');
    $meta_field_input  = ! empty( $attributes['meta_field'] ) ? sanitize_key( $attributes['meta_field'] ) : 'post_title';
    $meta_field        = $meta_field_input ? $meta_field_input : 'post_title';
    $counter    = ''; // default value

    // Determine the output string based on the meta_field.
    $raw_meta_value = null; // keep original for special handling (e.g., image IDs)
    switch ( $meta_field ) {
        case 'counter':
            $counter = 'counter';
            // Reliable per-Query Loop position using static counters, keyed by queryId.
            static $sfl_loop_counters = array();
            static $sfl_loop_seen = array();
            $query_key = isset( $block->context['queryId'] ) ? (string) $block->context['queryId'] : 'global';
            if ( ! isset( $sfl_loop_counters[ $query_key ] ) ) {
                $sfl_loop_counters[ $query_key ] = 0;
                $sfl_loop_seen[ $query_key ] = array();
            }
            if ( ! isset( $sfl_loop_seen[ $query_key ][ $post_id ] ) ) {
                $sfl_loop_counters[ $query_key ]++;
                $sfl_loop_seen[ $query_key ][ $post_id ] = true;
            }
            $string = (string) $sfl_loop_counters[ $query_key ];
            break;
        case 'post_title':
            $string = esc_html(get_the_title( $post_id ));
            break;
        case 'post_content':
            $post  = get_post( $post_id );
            $string = apply_filters( 'the_content', $post->post_content );
            break;
        case 'post_excerpt':
            $string = esc_html(get_the_excerpt( $post_id ));
            break;
        case 'featured_image':
            $string = esc_url(get_the_post_thumbnail_url( $post_id ));
            break;
        case 'permalink':
            $string = esc_url(get_permalink( $post_id ));
            break;
        case 'month':
            $string = esc_html(date_i18n( 'F' ));
            break;
        default:
            $raw_meta_value = get_post_meta( $post_id, $meta_field, true );
            $meta_value = $raw_meta_value;
            if ( is_array( $meta_value ) ) {
                $meta_value = implode( ', ', array_map( function( $v ) { return is_scalar($v) ? (string) $v : ''; }, $meta_value ) );
            }
            // Preserve HTML; sanitize on output below with wp_kses_post
            $string = (string) $meta_value;
            // Render inner blocks/shortcodes if stored in meta
            if ( has_blocks( $string ) ) {
                $string = do_blocks( $string );
            }
            if ( function_exists('do_shortcode') ) {
                $string = do_shortcode( $string );
            }
            break;
    }
    $style_attr_value = '';
    if ( isset( $attributes['element_type'] ) && $attributes['element_type'] === 'css_attribute' ) {
        $style_attr_value = '--meta-variable: ' . $string . ' ;';
        $attributes['element_type'] = 'div';
        if ( ! empty( $content ) ) {
            $string = $content;
        } elseif ( ! empty( $attributes['innerContent'] ) ) {
            $inner_content = is_array( $attributes['innerContent'] ) ? implode( '', $attributes['innerContent'] ) : $attributes['innerContent'];
            $string = do_blocks( $inner_content );
        } else {
            $string = '';
        }
    }
    // Build element properties
    $className      = isset( $block->parsed_block['attrs']['className'] ) ? $block->parsed_block['attrs']['className'] : '';
    $custom_id = isset( $attributes['customId'] ) ? (string) $attributes['customId'] : '';
    $align     = isset( $attributes['align'] ) ? (string) $attributes['align'] : '';
    $css_variable = '';
    $element_props  = 'id="block_' . esc_attr( $custom_id ) . '" class="' . esc_attr( trim( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $align ) ) . '" '.$css_variable;

    // Render output based on element type
    switch ( $attributes['element_type'] ) {
        case 'image':
            // Try to resolve image URLs if meta holds an attachment ID or ACF image array
            $src = $string;
            if ( $raw_meta_value !== null ) {
                if ( is_array( $raw_meta_value ) ) {
                    if ( isset( $raw_meta_value['url'] ) && $raw_meta_value['url'] ) {
                        $src = $raw_meta_value['url'];
                    } elseif ( isset( $raw_meta_value['ID'] ) && $raw_meta_value['ID'] ) {
                        $maybe = wp_get_attachment_image_url( intval( $raw_meta_value['ID'] ), 'full' );
                        if ( $maybe ) { $src = $maybe; }
                    } elseif ( isset( $raw_meta_value['id'] ) && $raw_meta_value['id'] ) {
                        $maybe = wp_get_attachment_image_url( intval( $raw_meta_value['id'] ), 'full' );
                        if ( $maybe ) { $src = $maybe; }
                    }
                } elseif ( is_numeric( $raw_meta_value ) ) {
                    $maybe = wp_get_attachment_image_url( intval( $raw_meta_value ), 'full' );
                    if ( $maybe ) { $src = $maybe; }
                } elseif ( is_string( $raw_meta_value ) ) {
                    $trim = trim( $raw_meta_value );
                    if ( strlen( $trim ) && ( $trim[0] === '{' || $trim[0] === '[' ) ) {
                        $decoded = json_decode( $trim, true );
                        if ( is_array( $decoded ) ) {
                            if ( isset( $decoded['url'] ) ) { $src = $decoded['url']; }
                            elseif ( isset( $decoded['ID'] ) && ($u = wp_get_attachment_image_url( intval($decoded['ID']), 'full')) ) { $src = $u; }
                            elseif ( isset( $decoded['id'] ) && ($u = wp_get_attachment_image_url( intval($decoded['id']), 'full')) ) { $src = $u; }
                        }
                    }
                }
            } elseif ( is_numeric( $string ) ) {
                $maybe = wp_get_attachment_image_url( intval( $string ), 'full' );
                if ( $maybe ) { $src = $maybe; }
            }
            $alt = '';
            if ( is_array( $raw_meta_value ) && isset( $raw_meta_value['alt'] ) ) {
                $alt = (string) $raw_meta_value['alt'];
            }
            // Build attributes explicitly for safe output
            echo '<img id="' . esc_attr( 'block_' . $custom_id ) . '" class="' . esc_attr( trim( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $align ) ) . '"' . ( $style_attr_value !== '' ? ' style="' . esc_attr( $style_attr_value ) . '"' : '' ) . ' src="' . esc_url( $src ) . '" alt="' . esc_attr( $alt ) . '"/>';
            break;
        case 'stat':
            $value_raw = trim( (string) $string );
            // Accept both percent like "70%" and absolute like "7" or "7/10"
            $stat_max = isset($attributes['stat_max']) ? intval($attributes['stat_max']) : 10;
            if ($stat_max <= 0) { $stat_max = 10; }
            $current = 0;
            $is_percent = false;
            if (strpos($value_raw, '%') !== false) {
                $is_percent = true;
                $pct = floatval(str_replace('%', '', $value_raw));
                $pct = max(0, min(100, $pct));
                $current = round(($pct / 100) * $stat_max, 2);
            } elseif (strpos($value_raw, '/') !== false) {
                list($num, $den) = array_map('trim', explode('/', $value_raw, 2));
                $num = floatval($num); $den = floatval($den ?: $stat_max);
                if ($den > 0) {
                    $current = max(0, min($stat_max, $num));
                }
            } else {
                $current = floatval($value_raw);
                $current = max(0, min($stat_max, $current));
            }
            $pct_fill = $is_percent ? max(0, min(100, floatval(str_replace('%','',$value_raw)))) : ($stat_max > 0 ? round(($current / $stat_max) * 100, 2) : 0);
            $label_mode = isset($attributes['stat_label_mode']) ? sanitize_key($attributes['stat_label_mode']) : 'ratio';
            if ($label_mode === 'hide') {
                $display_text = '';
            } elseif ($label_mode === 'percent') {
                $display_text = $pct_fill . '%';
            } elseif ($label_mode === 'number') {
                $display_text = (string)$current;
            } else { // ratio default
                $display_text = $current . '/' . $stat_max;
            }

            $stat_type = isset($attributes['stat_type']) ? sanitize_key($attributes['stat_type']) : 'star';
            $custom_img = isset($attributes['stat_custom_image']) ? esc_url($attributes['stat_custom_image']) : '';
            $base_id = 'block_' . $custom_id;
            $classes = trim( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $align );

            if ($stat_type === 'star') {
                $full = floor($current);
                $half = ($current - $full) >= 0.5 ? 1 : 0;
                $empty = max(0, $stat_max - $full - $half);
                echo '<div id="' . esc_attr( $base_id ) . '" class="' . esc_attr( $classes ) . ' sfl-stat sfl-stat--star"' . ( $style_attr_value !== '' ? ' style="' . esc_attr( $style_attr_value ) . '"' : '' ) . ' data-value="' . esc_attr($current) . '" data-max="' . esc_attr($stat_max) . '">';
                echo '<div class="sfl-stat-stars" aria-label="' . esc_attr($display_text) . '">';
                for ($i=0; $i<$full; $i++) { echo '<span class="sfl-star sfl-star--full">★</span>'; }
                if ($half) { echo '<span class="sfl-star sfl-star--half">★</span>'; }
                for ($i=0; $i<$empty; $i++) { echo '<span class="sfl-star sfl-star--empty">☆</span>'; }
                echo '</div>';
                if ($display_text !== '') { echo '<span class="sfl-stat-label">' . esc_html($display_text) . '</span>'; }
                echo '</div>';
            } elseif ($stat_type === 'line') {
                echo '<div id="' . esc_attr( $base_id ) . '" class="' . esc_attr( $classes ) . ' sfl-stat sfl-stat--line"' . ( $style_attr_value !== '' ? ' style="' . esc_attr( $style_attr_value ) . '"' : '' ) . ' data-value="' . esc_attr($current) . '" data-max="' . esc_attr($stat_max) . '">';
                echo '<div class="sfl-line-track"><div class="sfl-line-fill" style="width:' . esc_attr($pct_fill) . '%"></div></div>';
                if ($display_text !== '') { echo '<span class="sfl-stat-label">' . esc_html($display_text) . '</span>'; }
                echo '</div>';
            } elseif ($stat_type === 'circle') {
                $circumference = 2 * M_PI * 45; // r=45
                $dash = ($pct_fill/100) * $circumference;
                echo '<div id="' . esc_attr( $base_id ) . '" class="' . esc_attr( $classes ) . ' sfl-stat sfl-stat--circle"' . ( $style_attr_value !== '' ? ' style="' . esc_attr( $style_attr_value ) . '"' : '' ) . ' data-value="' . esc_attr($current) . '" data-max="' . esc_attr($stat_max) . '">';
                echo '<svg class="sfl-circle" viewBox="0 0 100 100" role="img" aria-label="' . esc_attr($display_text) . '">';
                echo '<circle class="sfl-circle-track" cx="50" cy="50" r="45" />';
                echo '<circle class="sfl-circle-fill" cx="50" cy="50" r="45" stroke-dasharray="' . esc_attr($dash) . ' ' . esc_attr($circumference) . '" />';
                if ($display_text !== '') { echo '<text class="sfl-circle-label" x="50" y="55" text-anchor="middle">' . esc_html($display_text) . '</text>'; }
                echo '</svg>';
                echo '</div>';
            } else { // custom
                echo '<div id="' . esc_attr( $base_id ) . '" class="' . esc_attr( $classes ) . ' sfl-stat sfl-stat--custom"' . ( $style_attr_value !== '' ? ' style="' . esc_attr( $style_attr_value ) . '"' : '' ) . ' data-value="' . esc_attr($current) . '" data-max="' . esc_attr($stat_max) . '">';
                echo '<div class="sfl-custom-row">';
                $units = intval(round($current));
                $units = max(0, min(1000, $units));
                if ($custom_img) {
                    for ($i=0; $i<$units; $i++) {
                        echo '<img class="sfl-custom-unit" src="' . esc_url($custom_img) . '" alt="" />';
                    }
                } else {
                    for ($i=0; $i<$units; $i++) {
                        echo '<span class="sfl-custom-unit">■</span>';
                    }
                }
                echo '</div>';
                if ($display_text !== '') { echo '<span class="sfl-stat-label">' . esc_html($display_text) . '</span>'; }
                echo '</div>';
            }
            break;
        case 'link':
        case 'button':
            // Determine inner HTML safely.
            $inner_html = '';
            if ( ! empty( $content ) ) {
                $inner_html = $content; // already-rendered inner blocks
            } elseif ( ! empty( $attributes['innerContent'] ) ) {
                $inner_content = is_array( $attributes['innerContent'] ) ? implode( '', $attributes['innerContent'] ) : $attributes['innerContent'];
                $inner_html = do_blocks( $inner_content );
            }
            // Open link in a new window with nofollow if required.
            $new_window = ( $meta_field === 'review_list_setting_list_link_url' );
            // Remove id for link/button elements.
            echo '<a class="' . esc_attr( trim( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $align ) ) . '"' . ( $new_window ? ' target="_blank" rel="nofollow"' : '' ) . ' href="' . esc_url( $string ) . '">';
            echo wp_kses_post( $inner_html );
            echo '</a>';
            break;
        default:
            echo '<' . esc_attr( $attributes['element_type'] ) . ' id="' . esc_attr( 'block_' . $custom_id ) . '" class="' . esc_attr( trim( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $align ) ) . '"' . ( $style_attr_value !== '' ? ' style="' . esc_attr( $style_attr_value ) . '"' : '' ) . '>';
            // Allow safe HTML output for custom meta
            echo wp_kses_post( $string );
            echo '</' . esc_attr( $attributes['element_type'] ) . '>';
            break;
    }

    return ob_get_clean();
}
