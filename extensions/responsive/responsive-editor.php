<?php
/**
 * Editor CSS generation for responsive styles
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

function stepfox_block_editor_scripts() {
    if (!is_admin()) {
        return;
    }
    global $post;
    if (!$post || !has_blocks($post->post_content)) {
        return;
    }

    $editor_cache_key = 'stepfox_editor_styles_' . md5($post->ID . '_' . md5($post->post_content) . '_' . (defined('STEPFOX_LOOKS_VERSION') ? STEPFOX_LOOKS_VERSION : '1.0.0'));

    $cached_editor_style = false;
    if (stepfox_is_cache_enabled()) {
        $cached_editor_style = get_transient($editor_cache_key);
    }

    if ($cached_editor_style !== false) {
        wp_register_style('stepfox-editor-custom-css', false);
        wp_enqueue_style('stepfox-editor-custom-css');
        if (!empty($cached_editor_style)) {
            wp_add_inline_style('stepfox-editor-custom-css', $cached_editor_style);
        }
        return;
    }

    $blocks = parse_blocks($post->post_content);
    $all_blocks = stepfox_search($blocks, 'blockName');
    $inline_style = '';

    wp_register_style('stepfox-editor-custom-css', false);
    wp_enqueue_style('stepfox-editor-custom-css');

    foreach ($all_blocks as $block) {
        if (($block['blockName'] === 'core/block' && isset($block['attrs']) && !empty($block['attrs']['ref'])) ||
            ($block['blockName'] === 'core/navigation' && isset($block['attrs']) && !empty($block['attrs']['ref']))) {
            $content = get_post_field('post_content', $block['attrs']['ref']);
            $reusable_blocks = parse_blocks($content);
            $all_reusable_blocks = stepfox_search($reusable_blocks, 'blockName');
            foreach ($all_reusable_blocks as $reusable_block) {
                $inline_style .= stepfox_inline_styles_for_blocks($reusable_block);
            }
        }
        $inline_style .= stepfox_inline_styles_for_blocks($block);
    }

    if (stepfox_is_cache_enabled()) {
        set_transient($editor_cache_key, $inline_style, 30 * MINUTE_IN_SECONDS);
    }

    if (!empty($inline_style)) {
        wp_add_inline_style('stepfox-editor-custom-css', $inline_style);
    }
}

add_action('enqueue_block_editor_assets', 'stepfox_block_editor_scripts');


