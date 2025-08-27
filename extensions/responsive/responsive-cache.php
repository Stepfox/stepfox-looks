<?php
/**
 * Responsive cache, generation, and hook wiring
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

function stepfox_block_scripts() {
    wp_reset_postdata();
    global $_wp_current_template_content;

    $post_id = get_the_ID();
    $template_slug = get_page_template_slug();
    $is_front_page = is_front_page();
    $is_home = is_home();
    $is_archive = is_archive();
    $is_single = is_single();

    $page_content = get_the_content();
    $full_content = $_wp_current_template_content . $page_content;

    $cache_context = array(
        'post_id' => $post_id,
        'template_slug' => $template_slug,
        'is_front_page' => $is_front_page,
        'is_home' => $is_home,
        'is_archive' => $is_archive,
        'is_single' => $is_single,
        'plugin_version' => defined('STEPFOX_LOOKS_VERSION') ? STEPFOX_LOOKS_VERSION : '1.0.0',
        'content_hash' => md5($full_content),
        'can_inject_js' => (bool) get_option('stepfox_looks_allow_frontend_js', false)
    );

    $cache_key = 'stepfox_styles_' . md5(serialize($cache_context));

    $cached_data = false;
    if (stepfox_is_cache_enabled()) {
        $cached_data = get_transient($cache_key);
    }

    if ($cached_data !== false && is_array($cached_data)) {
        $inline_style = $cached_data['css'];
        $inline_script = $cached_data['js'];

        wp_register_style( 'stepfox-responsive-style', false );
        wp_enqueue_style( 'stepfox-responsive-style' );

        if (!empty($inline_style)) {
            wp_add_inline_style( 'stepfox-responsive-style', $inline_style);
        }

        if (!empty($inline_script)) {
            wp_register_script( 'stepfox-responsive-inline-js', '', array(), defined('STEPFOX_LOOKS_VERSION') ? STEPFOX_LOOKS_VERSION : '1.0.0', true );
            wp_enqueue_script( 'stepfox-responsive-inline-js' );
            wp_add_inline_script( 'stepfox-responsive-inline-js', $inline_script);
        }

        return;
    }

    if ( has_blocks( $full_content ) ) {
        $blocks = parse_blocks( $full_content );
        $all_blocks = stepfox_search( $blocks, 'blockName' );

        foreach ( $all_blocks as $block ) {
            $full_content .= stepfox_get_template_parts_as_content( $block );
        }

        $blocks = parse_blocks( $full_content );
        $all_blocks = stepfox_search( $blocks, 'blockName' );
        $inline_style = '';
        $inline_script = '';

        wp_register_style( 'stepfox-responsive-style', false );
        wp_enqueue_style( 'stepfox-responsive-style' );

        foreach ( $all_blocks as $block ) {
            if ( ( $block['blockName'] === 'core/block' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ||
                ( $block['blockName'] === 'core/navigation' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ) {
                $content = get_post_field( 'post_content', $block['attrs']['ref'] );
                $reusable_blocks = parse_blocks( $content );
                $all_reusable_blocks = stepfox_search( $reusable_blocks, 'blockName' );
                foreach ( $all_reusable_blocks as $reusable_block ) {
                    $inline_style .= stepfox_inline_styles_for_blocks( $reusable_block );
                    $inline_script .= stepfox_inline_scripts_for_blocks( $reusable_block );
                }
            }

            $inline_style .= stepfox_inline_styles_for_blocks( $block );
            $inline_script .= stepfox_inline_scripts_for_blocks( $block );
        }

        if (stepfox_is_cache_enabled()) {
            $cache_data = array(
                'css' => $inline_style,
                'js' => $inline_script,
                'generated_at' => current_time('timestamp')
            );
            set_transient($cache_key, $cache_data, HOUR_IN_SECONDS);
        }

        if (!empty($inline_style)) {
            wp_add_inline_style( 'stepfox-responsive-style', $inline_style);
        }

        if (!empty($inline_script)) {
            wp_register_script( 'stepfox-responsive-inline-js', '', array(), defined('STEPFOX_LOOKS_VERSION') ? STEPFOX_LOOKS_VERSION : '1.0.0', true );
            wp_enqueue_script( 'stepfox-responsive-inline-js' );
            wp_add_inline_script( 'stepfox-responsive-inline-js', $inline_script);
        }
    }
}

add_action( 'wp_enqueue_scripts', 'stepfox_block_scripts' );

function stepfox_clear_styles_cache($post_id = null) {
    global $wpdb;

    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_stepfox_styles_%',
            '_transient_stepfox_editor_styles_%'
        )
    );
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_timeout_stepfox_styles_%',
            '_transient_timeout_stepfox_editor_styles_%'
        )
    );

    if (function_exists('wp_cache_flush_group')) {
        wp_cache_flush_group('stepfox_styles');
    }
}

function stepfox_clear_cache_on_save($post_id) {
    if (get_post_status($post_id) === 'publish') {
        stepfox_clear_styles_cache($post_id);
    }
}

function stepfox_clear_cache_on_template_update($post_id) {
    $post_type = get_post_type($post_id);
    if ($post_type === 'wp_template' || $post_type === 'wp_template_part') {
        stepfox_clear_styles_cache($post_id);
    }
}

function stepfox_clear_cache_on_theme_change() {
    stepfox_clear_styles_cache();
}

add_action('save_post', 'stepfox_clear_cache_on_save');
add_action('wp_update_nav_menu', 'stepfox_clear_styles_cache');
add_action('switch_theme', 'stepfox_clear_cache_on_theme_change');
add_action('customize_save_after', 'stepfox_clear_cache_on_theme_change');
add_action('rest_after_save_wp_template', 'stepfox_clear_cache_on_template_update');
add_action('rest_after_save_wp_template_part', 'stepfox_clear_cache_on_template_update');

function stepfox_add_admin_cache_clear() {
    if (current_user_can('manage_options') && isset($_GET['stepfox_clear_cache']) && isset($_GET['_wpnonce']) && wp_verify_nonce($_GET['_wpnonce'], 'stepfox_clear_cache')) {
        stepfox_clear_styles_cache();
        add_action('admin_notices', 'stepfox_admin_notice_cache_cleared');
    }
}
function stepfox_admin_notice_cache_cleared() {
    printf('<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html__('Stepfox styles cache cleared successfully!', 'stepfox-looks'));
}
add_action('admin_init', 'stepfox_add_admin_cache_clear');


