<?php
/**
 * Cover Block Extension
 * Extends cover blocks with additional functionality
 * 
 * @package Examiner
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue cover block extension assets
 * Only loads in block editor context
 */
function examiner_enqueue_cover_extension_assets() {
    // Only load in block editor
    if (!is_admin()) {
        return;
    }
    
    $script_path = STEPFOX_LOOKS_PATH . 'extensions/cover-block-extension/cover-block-extension.js';
    if (file_exists($script_path)) {
        wp_enqueue_script(
            'examiner-cover-extension',
            STEPFOX_LOOKS_URL . 'extensions/cover-block-extension/cover-block-extension.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-compose'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
}
add_action('enqueue_block_editor_assets', 'examiner_enqueue_cover_extension_assets');

/**
 * Filter the output of the Cover block on the frontend
 * 
 * When the "Link to Post" toggle is enabled (linkToPost is true),
 * this function wraps the cover image element in an anchor linking to the current post.
 * 
 * @param string $block_content Block HTML content
 * @param array $block Block data
 * @return string Modified block content
 */
function examiner_cover_extension_render($block_content, $block) {
    if ( isset( $block['attrs']['linkToPost'] ) && $block['attrs']['linkToPost'] ) {
        $permalink = get_permalink();
        if ( $permalink ) {
            // Use a regex to find the first occurrence of the background image element.
            // The core Cover block outputs the image as a <span> with the class "wp-block-cover__background".
            $pattern = '/(<span[^>]*class="[^"]*wp-block-cover__background[^"]*"[^>]*>)(<\/span>)/i';
            $replacement = '<a href="' . esc_url( $permalink ) . '">$1$2</a>';
            // Replace only the first occurrence.
            $block_content = preg_replace( $pattern, $replacement, $block_content, 1 );
        }
    }
    return $block_content;
}
add_filter('render_block_core/cover', 'examiner_cover_extension_render', 10, 2);