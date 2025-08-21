<?php
/**
 * Post Template: Allow Template Part
 * Adds editor UI to replace a post-template's inner blocks with a template part
 * and relaxes editor-only constraints to allow using core/template-part inside core/post-template.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue the editor script for adding Template Part injection controls
 */
function stepfox_enqueue_post_template_allow_template_part_assets() {
    if (!is_admin()) {
        return;
    }

    $handle = 'stepfox-post-template-allow-template-part';
    $rel_path = 'extensions/post-template-allow-template-part/post-template-allow-template-part.js';
    $file_path = STEPFOX_LOOKS_PATH . $rel_path;
    $file_url  = STEPFOX_LOOKS_URL . $rel_path;

    if (file_exists($file_path)) {
        wp_enqueue_script(
            $handle,
            $file_url,
            array('wp-blocks', 'wp-block-editor', 'wp-components', 'wp-data', 'wp-element', 'wp-compose', 'wp-i18n', 'wp-core-data'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
}
add_action('enqueue_block_editor_assets', 'stepfox_enqueue_post_template_allow_template_part_assets');


