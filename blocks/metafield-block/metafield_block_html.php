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

    // Determine the post ID. Default to current post.
    $post_id = get_the_ID();
    if ( defined( 'REST_REQUEST' ) && REST_REQUEST && $block_name_class === 'metafield_block' && ! empty( $attributes['select_a_post'] ) ) {
        $post_id = $attributes['select_a_post'];
        $attributes['customId'] = '';
    }
    wp_reset_postdata();

    // Ensure we have a valid post ID
    if ( empty( $post_id ) ) {
        $post_id = get_the_ID();
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
            if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
                $string = '1';
            } else {
                $counter = 'counter';
                $count = get_post_meta( $post_id, 'stepfox_post_views_count', true );
                $string = $count ? esc_html($count) : '0';
            }
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
            echo '<img id="' . esc_attr( 'block_' . $custom_id ) . '" class="' . esc_attr( trim( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $align ) ) . '"' . ( $style_attr_value !== '' ? ' style="' . esc_attr( $style_attr_value ) . '"' : '' ) . ' src="' . esc_url( $string ) . '" alt=""/>';
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
