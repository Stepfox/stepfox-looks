<?php
/**
 * Responsive Extension
 * Provides responsive controls for all blocks
 * 
 * @package Examiner
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include responsive styles with security check
$responsive_style_file = STEPFOX_LOOKS_PATH . 'extensions/responsive/responsive-style.php';
if (file_exists($responsive_style_file)) {
    require_once $responsive_style_file;
}

/**
 * Enqueue responsive extension assets for block editor
 * Only loads in admin context to improve frontend performance
 */
function examiner_enqueue_responsive_assets() {
    // Only load in block editor
    if (!is_admin()) {
        return;
    }
    // Get plugin version for cache busting
    $plugin_version = STEPFOX_LOOKS_VERSION;
    
    // Enqueue modern responsive interface
    $modern_script_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/modern-responsive.js';
    if (file_exists($modern_script_path)) {
        wp_enqueue_script(
            'examiner-modern-responsive',
            STEPFOX_LOOKS_URL . 'extensions/responsive/modern-responsive.js',
            array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }

    // Enqueue general responsive controls
    $script_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/general.js';
    if (file_exists($script_path)) {
        wp_enqueue_script(
            'examiner-responsive-general',
            STEPFOX_LOOKS_URL . 'extensions/responsive/general.js',
            array('wp-blocks', 'wp-editor', 'wp-api', 'examiner-modern-responsive'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    // Enqueue editor styles
    $editor_css_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/responsive-editor.css';
    if (file_exists($editor_css_path)) {
        wp_enqueue_style(
            'examiner-responsive-editor',
            STEPFOX_LOOKS_URL . 'extensions/responsive/responsive-editor.css',
            array(),
            STEPFOX_LOOKS_VERSION
        );
    }


}
add_action('enqueue_block_editor_assets', 'examiner_enqueue_responsive_assets');

/**
 * Enqueue frontend animations CSS
 * Only loads on frontend for better performance
 */
function examiner_enqueue_animations_css() {
    // Don't load in admin to improve performance
    if (is_admin()) {
        return;
    }
    
    $animations_css_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/animations.css';
    if (file_exists($animations_css_path)) {
        wp_enqueue_style(
            'examiner-animations',
            STEPFOX_LOOKS_URL . 'extensions/responsive/animations.css',
            array(),
            STEPFOX_LOOKS_VERSION
        );
    }
}

add_action('wp_enqueue_scripts', 'examiner_enqueue_animations_css');