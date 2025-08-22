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
            $meta_value = get_post_meta( $post_id, $meta_field, true );
            if ( is_array( $meta_value ) ) {
                $meta_value = implode( ', ', array_map( function( $v ) { return is_scalar($v) ? (string) $v : ''; }, $meta_value ) );
            }
            $string = esc_html( (string) $meta_value );
            break;
    }
    $css_variable = '';
if($attributes['element_type'] == 'css_attribute') {
    $css_variable = 'style="--meta-variable: '. esc_attr($string).' ;"';
    $attributes['element_type'] = 'div';
    $string = do_blocks( $attributes['innerContent'] );
}
    // Build element properties
    $className      = isset( $block->parsed_block['attrs']['className'] ) ? $block->parsed_block['attrs']['className'] : '';
    $element_props  = 'id="block_' . esc_attr( $attributes['customId'] ) . '" class="' . esc_attr( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $attributes['align'] ) . '" '.$css_variable;

    // Render output based on element type
    switch ( $attributes['element_type'] ) {
        case 'image':
            echo '<img ' . $element_props . ' src="' . esc_url( $string ) . '"/>';
            break;
        case 'stat':
            echo '<img ' . $element_props . ' src="' . esc_url( $string ) . '"/>';
            break;
        case 'link':
        case 'button':
            // Use inner content if available.
            if ( ! empty( $content ) ) {
                $attributes['innerContent'] = $content;
            }
            // Open link in a new window with nofollow if required.
            $new_window = ( $meta_field === 'review_list_setting_list_link_url' ) ? 'target="_blank" rel="nofollow"' : '';
            // Remove id for link/button elements.
            $element_props = 'class="' . esc_attr( $counter . ' ' . $className . ' ' . $block_name_class . ' ' . $attributes['align'] ) . '"';
            echo '<a ' . $element_props . ' ' . $new_window . ' href="' . esc_url( $string ) . '">';
            echo do_blocks( $attributes['innerContent'] );
            echo '</a>';
            break;
        default:
            echo '<' . esc_attr( $attributes['element_type'] ) . ' ' . $element_props . '  '.$css_variable.'>';
            echo wp_kses_post($string);
            echo '</' . esc_attr( $attributes['element_type'] ) . '>';
            break;
    }

    return ob_get_clean();
}
