<?php
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'wp_loaded', function() {

    $registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

    foreach( $registered_blocks as $name => $block ) {
        // For core/group block, set some basic attributes.
        if ($block->name == 'core/query') {
            $block->attributes['customPostsPerPage'] = [ "type" => "string", "default" => "" ];
        }
    }
    }, 100);

function stepfox_register_load_more_block()
{
    wp_register_script(
        "stepfox-load-block-gutenberg",
        STEPFOX_LOOKS_URL . "blocks/load-more/load-more-editor.js",
        array("wp-blocks", "wp-block-editor", "wp-api", "jquery", "wp-i18n"),
        defined('STEPFOX_LOOKS_VERSION') ? STEPFOX_LOOKS_VERSION : false,
        true
    );
    // Provide translations for the editor script
    if ( function_exists( 'wp_set_script_translations' ) ) {
        wp_set_script_translations( 'stepfox-load-block-gutenberg', 'stepfox-looks', STEPFOX_LOOKS_PATH . 'languages' );
    }
    register_block_type('stepfox/query-loop-load-more', array(
        'editor_script' => 'stepfox-load-block-gutenberg', // This enqueues the JS in the editor.
        'render_callback' => 'stepfox_render_load_more_block',
        'category' => 'stepfox',
        'parent' => array('core/query'), // Restrict to Query Loop.
    ));
}

add_action('init', 'stepfox_register_load_more_block');


function stepfox_render_load_more_block($attributes, $content, $block)
{
    return '<button type="button" class="query-loop-load-more-button">' . esc_html__( 'Load More', 'stepfox-looks' ) . '</button>';
}


function stepfox_load_more_scripts()
{
    $script_path = STEPFOX_LOOKS_PATH . 'blocks/load-more/my-load-more.js';
    $ver = STEPFOX_LOOKS_VERSION;
    if (file_exists($script_path)) {
        $ver .= '-' . filemtime($script_path);
    }
    wp_enqueue_script('stepfox-load-more', STEPFOX_LOOKS_URL . 'blocks/load-more/my-load-more.js', array('jquery'), $ver, true);
    wp_localize_script('stepfox-load-more', 'stepfox_load_more_params', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('stepfox_load_more_nonce'),
        'strings' => array(
            'loading' => __( 'Loading...', 'stepfox-looks' ),
            'loadMore' => __( 'Load More', 'stepfox-looks' ),
            'errorTryAgain' => __( 'Error - Try Again', 'stepfox-looks' )
        )
    ));
    // Provide translations for the frontend script if available
    if ( function_exists( 'wp_set_script_translations' ) ) {
        wp_set_script_translations( 'stepfox-load-more', 'stepfox-looks', STEPFOX_LOOKS_PATH . 'languages' );
    }
}

add_action('wp_enqueue_scripts', 'stepfox_load_more_scripts');


function stepfox_load_more_posts_callback()
{
    // Security check
    $nonce = isset($_POST['nonce']) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
    if ( empty($nonce) || ! wp_verify_nonce( $nonce, 'stepfox_load_more_nonce' ) ) {
        wp_send_json_error(array('message' => __( 'Security check failed', 'stepfox-looks' )), 403);
        return;
    }
    
    // Validate required parameters
    if (!isset($_POST['context']) || !isset($_POST['innerBlocksString'])) {
        wp_send_json_error(array('message' => __( 'Missing required parameters', 'stepfox-looks' )), 400);
        return;
    }
    
    $paged = isset($_POST['paged']) ? max(1, intval($_POST['paged'])) : 1;
    $posts_per_page = isset($_POST['posts_per_page']) ? max(1, min(50, intval($_POST['posts_per_page']))) : 4;
    $innerBlocksString = isset($_POST['innerBlocksString']) ? wp_kses_post( wp_unslash( $_POST['innerBlocksString'] ) ) : '';

    // Validate and decode context JSON
    $context_raw = isset($_POST['context']) ? sanitize_text_field( wp_unslash( $_POST['context'] ) ) : '';
    $context = json_decode($context_raw, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        wp_send_json_error(array('message' => __( 'Invalid context data', 'stepfox-looks' )), 400);
        return;
    }
    
    // Validate context structure
    if (!is_array($context) || !isset($context['query']) || !isset($context['customPostsPerPage'])) {
        wp_send_json_error(array('message' => __( 'Invalid context structure', 'stepfox-looks' )), 400);
        return;
    }
    // Build query args fresh without mutating globals
    $args = array(
        'post_status'   => 'publish',
        'paged'         => $paged,
        'posts_per_page'=> isset($context['customPostsPerPage']) ? max(1, min(50, intval($context['customPostsPerPage']))) : $posts_per_page,
        'offset'        => isset($context['query']['offset']) ? max(0, intval($context['query']['offset'])) + ($paged - 1) * max(1, min(50, intval($context['customPostsPerPage']))) : 0,
    );

    if ( ! empty( $context['query']['inherit'] ) ) {
        // Derive scope from provided queried object safely
        $queried_object = array();
        $input_post = filter_input_array( INPUT_POST, array( 'query_args' => FILTER_DEFAULT ) );
        if ( is_array( $input_post ) && array_key_exists( 'query_args', $input_post ) ) {
            $raw_query_args = $input_post['query_args'];
            if ( is_string( $raw_query_args ) ) {
                $raw_query_args = sanitize_text_field( $raw_query_args );
                $decoded = json_decode( $raw_query_args, true );
                if ( json_last_error() === JSON_ERROR_NONE ) {
                    $queried_object = $decoded;
                }
            } elseif ( is_array( $raw_query_args ) ) {
                foreach ( $raw_query_args as $key => $value ) {
                    $safe_key = sanitize_key( $key );
                    if ( is_scalar( $value ) ) {
                        $queried_object[ $safe_key ] = sanitize_text_field( (string) $value );
                    }
                }
            }
        }
        if ( is_array( $queried_object ) && isset( $queried_object['taxonomy'], $queried_object['term_id'] ) ) {
            $taxonomy = sanitize_key( $queried_object['taxonomy'] );
            $term_id  = absint( $queried_object['term_id'] );
            if ( $taxonomy && $term_id ) {
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => $taxonomy,
                        'field'    => 'term_id',
                        'terms'    => $term_id,
                    ),
                );
            }
        } elseif ( is_object( $queried_object ) && isset( $queried_object->ID, $queried_object->display_name ) ) {
            $args['author'] = absint( $queried_object->ID );
        }
    }

    $query = new WP_Query( $args );
    // Extract post-template content and filter out load more button
    $blocks = parse_blocks($innerBlocksString);
    
    foreach ($blocks as $block) {
        if (isset($block['blockName']) && $block['blockName'] == 'core/post-template') {
            if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $innerBlocksString = serialize_blocks($block['innerBlocks']);
                break;
            }
        }
    }
    
    // Handle query execution with error handling
    if (!$query instanceof WP_Query) {
        wp_send_json_error(array('message' => __( 'Query initialization failed', 'stepfox-looks' )), 500);
        return;
    }
    
    if (is_wp_error($query)) {
        wp_send_json_error(array('message' => __( 'Query execution failed', 'stepfox-looks' )), 500);
        return;
    }
    
    // Generate response HTML
    ob_start();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            echo '<li class="post-item">';
            // Add error handling for block rendering
            $block_output = do_blocks($innerBlocksString);
            if ($block_output === false) {
                // In production, avoid logging; skip the post
                continue;
            }
            echo wp_kses_post($block_output);
            echo '</li>';
        }
        wp_reset_postdata();
        
        $html_output = ob_get_clean();
        if (empty($html_output)) {
            wp_send_json_error(array('message' => __( 'No content generated', 'stepfox-looks' )), 404);
        } else {
            wp_send_json_success(array('html' => $html_output, 'found_posts' => $query->found_posts));
        }
    } else {
        ob_end_clean();
        wp_reset_postdata();
        wp_send_json_success(array('html' => '', 'found_posts' => 0, 'message' => __( 'No more posts', 'stepfox-looks' )));
    }
}

add_action('wp_ajax_stepfox_looks_load_more', 'stepfox_load_more_posts_callback');
add_action('wp_ajax_nopriv_stepfox_looks_load_more', 'stepfox_load_more_posts_callback');


function stepfox_prepare_load_more_data()
{
    wp_reset_postdata();
    global $_wp_current_template_content;
    $page_content = get_the_content();
    $full_content = $_wp_current_template_content . $page_content;
    // Inline data will be attached to the main front-end handle instead of direct wp_head output
    $all_data = array();
    if (has_blocks($full_content)) {
        $blocks = parse_blocks($full_content);
        $all_blocks = stepfox_search($blocks, 'blockName');
        // Get template parts content.
        foreach ($all_blocks as $block) {
            $full_content .= stepfox_get_template_parts_as_content($block);
        }
        $blocks = parse_blocks($full_content);
        $all_blocks = stepfox_search($blocks, 'blockName');
        foreach ($all_blocks as $block) {
            if ($block['blockName'] === 'core/query') {
                // Recursively detect if this Query contains the Load More block anywhere inside
                $contains_load_more = (function ($b) use (&$contains_load_more) {
                    if (!isset($b['innerBlocks']) || !is_array($b['innerBlocks'])) {
                        return false;
                    }
                    foreach ($b['innerBlocks'] as $child) {
                        if (isset($child['blockName']) && $child['blockName'] === 'stepfox/query-loop-load-more') {
                            return true;
                        }
                        if ((isset($child['innerBlocks']) && !empty($child['innerBlocks'])) && $contains_load_more($child)) {
                            return true;
                        }
                    }
                    return false;
                });

                if ($contains_load_more($block)) {
                    $customId = isset($block['attrs']['customId']) ? $block['attrs']['customId'] : 'default-query-id';
                    $all_data[$customId] = [
                        'context' => json_encode(isset($block['attrs']) ? $block['attrs'] : []),
                        'query_args' => get_queried_object(), // scoped parent
                        'paged' => '1',
                        'innerBlocksString' => serialize_blocks($block['innerBlocks']),
                    ];
                }
            }
        }
    }
    if(!empty($all_data)) {
        // Ensure the main script is enqueued so our inline data attaches correctly
        if (wp_script_is('stepfox-load-more', 'enqueued') || wp_script_is('stepfox-load-more', 'registered')) {
            wp_add_inline_script('stepfox-load-more', 'window.stepfoxHeya = ' . wp_json_encode($all_data) . ';', 'before');
        }
    }


}

// Attach after scripts are enqueued but before they are printed (footer)
add_action('wp_print_footer_scripts', 'stepfox_prepare_load_more_data', 1);


function stepfox_render_query_block_custom($block_content, $block)
{
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['blockName'])) {
        return $block_content;
    }


    // Check if this is a Query Loop block.
    if (isset($block['blockName']) && 'core/query' === $block['blockName']) {
        // Check for our custom attribute.
        if (isset($block['attrs']['customPostsPerPage']) && !empty($block['attrs']['customPostsPerPage']) && isset($block['attrs']['query']['inherit']) && $block['attrs']['query']['inherit'] && get_option('posts_per_page') != $block['attrs']['customPostsPerPage']) {
            $custom_posts_per_page = absint($block['attrs']['customPostsPerPage']);

            // Get main query vars as a baseline.
            global $wp_query;
            $main_query_vars = $wp_query->query_vars;

            // Build new query args: override posts_per_page.
            $args = wp_parse_args(
                array('posts_per_page' => $custom_posts_per_page),
                $main_query_vars
            );

            // Optionally, remove or adjust parameters that might conflict.
            // For example, if pagination is handled differently, you might unset 'paged'.

            // Run a new query with our custom arguments.
            $query = new WP_Query($args);
            ob_start();
            
            $post_template = '';
            $columns = '';
$customId = isset($block['attrs']['customId']) ? $block['attrs']['customId'] : 'default-block-id';
$wrapper_attr_raw = stepfox_query_wrapper_attributes($block);
$wrapper_class = '';
if (preg_match('/class="([^"]*)"/i', $wrapper_attr_raw, $m)) {
    $wrapper_class = $m[1];
}
echo '<div class="' . esc_attr($wrapper_class) . '" id="block_' . esc_attr($customId) . '">';
            
            // Ensure innerBlocks exists before processing
            if (!isset($block['innerBlocks']) || !is_array($block['innerBlocks'])) {
                echo '</div>';
                return $block_content;
            }
            
            foreach ($block['innerBlocks'] as $block_child) {
                // Ensure block_child is properly structured
                if (!is_array($block_child) || !isset($block_child['blockName'])) {
                    continue;
                }
                
                if ($block_child['blockName'] == 'core/post-template') {
                    $post_classes = get_post_class('wp-block-post');

                    // Convert the array of classes into a space-separated string.
                    $classes = implode(' ', $post_classes);

                    // Ensure innerBlocks exists for the child block
                    $innerBlocks = isset($block_child['innerBlocks']) && is_array($block_child['innerBlocks']) ? $block_child['innerBlocks'] : [];
                    $post_template = serialize_blocks($innerBlocks);
                    $columnCount = isset($block_child['attrs']['layout']['columnCount']) ? $block_child['attrs']['layout']['columnCount'] : 1;
                    $columns = 'columns-' . $columnCount;
                    $get_block_wrapper_attributes = stepfox_wrapper_attributes($block_child);
                    $child_id = isset($block_child['attrs']['customId']) ? esc_attr($block_child['attrs']['customId']) : 'default-child-id';

                    if ($query->have_posts()) {

                        $ul_class_raw = $get_block_wrapper_attributes;
                        $ul_class = '';
                        if (preg_match('/class="([^"]*)"/i', $ul_class_raw, $m2)) {
                            $ul_class = $m2[1];
                        }
                        echo '<ul class="' . esc_attr($ul_class) . '" id="block_' . esc_attr($child_id) . '">';
                        // (This example simply outputs the post titles.)
                        while ($query->have_posts()) {
                            $query->the_post();
                            echo '<li class="' . esc_attr($classes) . '">' . wp_kses_post( do_blocks($post_template) ) . '</li>';
                        }
                        echo '</ul>';

                    } else {
                        echo '<p>' . esc_html__( 'No posts found.', 'stepfox-looks' ) . '</p>';
                    }
                } else {
                    echo wp_kses_post( render_block($block_child) );

                }

            }
            echo '</div>';
            wp_reset_postdata();
            // Replace the block content with our new content.
            return ob_get_clean();
        }
    }

    return $block_content;
}

add_filter('render_block', 'stepfox_render_query_block_custom', 10, 2);


function stepfox_wrapper_attributes($block)
{
    // Default values.
    $columns = 1;       // Default inner items column count.
    $layout = 'list';  // Fallback layout type.
    $container_columns = 2;       // Default container column count (set to 2 by default).

    // Ensure attrs exists before attempting to access it
    if (!isset($block['attrs']) || !is_array($block['attrs'])) {
        // Return default wrapper attributes
        $extra_classes = sprintf('wp-block-post-template is-layout-%s wp-block-post-template-is-layout-%s columns-%d', $layout, $layout, $columns);
        return 'class="' . esc_attr($extra_classes) . '"';
    }

    // Check for layout attributes in the block.
    if (isset($block['attrs']['layout']) && is_array($block['attrs']['layout'])) {
        if (!empty($block['attrs']['layout']['columnCount'])) {
            $columns = absint($block['attrs']['layout']['columnCount']);
        }
        if (!empty($block['attrs']['layout']['type'])) {
            $layout = sanitize_html_class($block['attrs']['layout']['type']);
        }
        // If containerColumns is provided, use it; otherwise, it remains at the default of 2.
        if (!empty($block['attrs']['layout']['containerColumns'])) {
            $container_columns = absint($block['attrs']['layout']['containerColumns']);
        }
    }

    // Build the extra classes string.
    // This will generate, for example:
    // "columns-4 is-layout-grid wp-container-core-post-template-is-layout-2 wp-block-post-template-is-layout-grid"
    $extra_classes = sprintf(
        'columns-%d is-layout-%s wp-container-core-post-template-is-layout-%d wp-block-post-template-is-layout-%s',
        $columns,
        $layout,
        $container_columns,
        $layout
    );

    // Merge the extra classes with the block’s default wrapper classes.
    // Build wrapper attributes manually instead of using get_block_wrapper_attributes()
    // to avoid WordPress block context issues
    $classes = 'wp-block-post-template ' . esc_attr($extra_classes);
    
    // Add any custom classes from block attributes
    if (isset($block['attrs']['className']) && !empty($block['attrs']['className'])) {
        $classes .= ' ' . esc_attr($block['attrs']['className']);
    }

    return 'class="' . $classes . '"';
}


function stepfox_query_wrapper_attributes($block)
{
    // Default to "flow" if no layout is set.
    $layout = 'flow';

    // Ensure attrs exists before attempting to access it
    if (!isset($block['attrs']) || !is_array($block['attrs'])) {
        $extra_classes = sprintf('is-layout-%s wp-block-query-is-layout-%s', $layout, $layout);
        return 'class="wp-block-query ' . esc_attr($extra_classes) . '"';
    }

    // Check for a layout setting under "displayLayout" or "layout" attributes.
    if (isset($block['attrs']['displayLayout']) && is_array($block['attrs']['displayLayout'])) {
        if (!empty($block['attrs']['displayLayout']['type'])) {
            $layout = sanitize_html_class($block['attrs']['displayLayout']['type']);
        }
    } elseif (isset($block['attrs']['layout']) && is_array($block['attrs']['layout'])) {
        if (!empty($block['attrs']['layout']['type'])) {
            $layout = sanitize_html_class($block['attrs']['layout']['type']);
        }
    }

    $extra_classes = sprintf('is-layout-%s wp-block-query-is-layout-%s', $layout, $layout);

    // Build wrapper attributes manually instead of using get_block_wrapper_attributes()
    // to avoid WordPress block context issues
    $classes = 'wp-block-query ' . esc_attr($extra_classes);
    
    // Add any custom classes from block attributes
    if (isset($block['attrs']['className']) && !empty($block['attrs']['className'])) {
        $classes .= ' ' . esc_attr($block['attrs']['className']);
    }

    return 'class="' . $classes . '"';
}