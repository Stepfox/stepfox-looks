<?php
/**
 * Responsive Extension
 * Provides responsive controls for all blocks
 * 
 * @package stepfox
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
function stepfox_enqueue_responsive_assets() {
    // Only load in block editor
    if (!is_admin()) {
        return;
    }
    // Get plugin version for cache busting
    $plugin_version = STEPFOX_LOOKS_VERSION;
    
    // Enqueue modern responsive interface - modular approach
    // Load in dependency order: attributes -> utils -> css -> ui -> main
    
    // 1. Attributes module
    $attributes_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/modern-responsive-attributes.js';
    if (file_exists($attributes_path)) {
        wp_enqueue_script(
            'stepfox-modern-responsive-attributes',
            STEPFOX_LOOKS_URL . 'extensions/responsive/modern-responsive-attributes.js',
            array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    // 2. Utils module
    $utils_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/modern-responsive-utils.js';
    if (file_exists($utils_path)) {
        wp_enqueue_script(
            'stepfox-modern-responsive-utils',
            STEPFOX_LOOKS_URL . 'extensions/responsive/modern-responsive-utils.js',
            array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'stepfox-modern-responsive-attributes'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    // 3. CSS generation module
    $css_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/modern-responsive-css.js';
    if (file_exists($css_path)) {
        wp_enqueue_script(
            'stepfox-modern-responsive-css',
            STEPFOX_LOOKS_URL . 'extensions/responsive/modern-responsive-css.js',
            array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'stepfox-modern-responsive-attributes'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    // 4. UI components module
    $ui_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/modern-responsive-ui.js';
    if (file_exists($ui_path)) {
        wp_enqueue_script(
            'stepfox-modern-responsive-ui',
            STEPFOX_LOOKS_URL . 'extensions/responsive/modern-responsive-ui.js',
            array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'stepfox-modern-responsive-utils'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    // 5. Panels module
    $panels_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/modern-responsive-panels.js';
    if (file_exists($panels_path)) {
        wp_enqueue_script(
            'stepfox-modern-responsive-panels',
            STEPFOX_LOOKS_URL . 'extensions/responsive/modern-responsive-panels.js',
            array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'stepfox-modern-responsive-utils', 'stepfox-modern-responsive-ui'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    // 6. Main controller module
    $main_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/modern-responsive-main.js';
    if (file_exists($main_path)) {
        wp_enqueue_script(
            'stepfox-modern-responsive',
            STEPFOX_LOOKS_URL . 'extensions/responsive/modern-responsive-main.js',
            array('wp-blocks', 'wp-editor', 'wp-element', 'wp-components', 'stepfox-modern-responsive-attributes', 'stepfox-modern-responsive-utils', 'stepfox-modern-responsive-css', 'stepfox-modern-responsive-ui', 'stepfox-modern-responsive-panels'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }

    // Enqueue general responsive controls
    $script_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/general.js';
    if (file_exists($script_path)) {
        wp_enqueue_script(
            'stepfox-responsive-general',
            STEPFOX_LOOKS_URL . 'extensions/responsive/general.js',
            array('wp-blocks', 'wp-editor', 'wp-api', 'stepfox-modern-responsive'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    // Enqueue editor styles
    $editor_css_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/responsive-editor.css';
    if (file_exists($editor_css_path)) {
        wp_enqueue_style(
            'stepfox-responsive-editor',
            STEPFOX_LOOKS_URL . 'extensions/responsive/responsive-editor.css',
            array(),
            STEPFOX_LOOKS_VERSION
        );
    }

    // Enqueue animations CSS for backend/editor
    $animations_css_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/animations.css';
    if (file_exists($animations_css_path)) {
        wp_enqueue_style(
            'stepfox-animations-editor',
            STEPFOX_LOOKS_URL . 'extensions/responsive/animations.css',
            array(),
            STEPFOX_LOOKS_VERSION
        );
    }

}
add_action('enqueue_block_editor_assets', 'stepfox_enqueue_responsive_assets');

/**
 * Enqueue animations CSS for both editor and preview
 * This ensures animations work in the preview iframe as well
 */
function stepfox_enqueue_animations_for_preview() {
    $animations_css_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/animations.css';
    if (file_exists($animations_css_path)) {
        wp_enqueue_style(
            'stepfox-animations-preview',
            STEPFOX_LOOKS_URL . 'extensions/responsive/animations.css',
            array(),
            STEPFOX_LOOKS_VERSION
        );
    }
}

add_action('enqueue_block_assets', 'stepfox_enqueue_animations_for_preview');

/**
 * Enqueue frontend animations CSS
 * Only loads on frontend for better performance
 */
function stepfox_enqueue_animations_css() {
    // Don't load in admin to improve performance
    if (is_admin()) {
        return;
    }
    
    $animations_css_path = STEPFOX_LOOKS_PATH . 'extensions/responsive/animations.css';
    if (file_exists($animations_css_path)) {
        wp_enqueue_style(
            'stepfox-animations',
            STEPFOX_LOOKS_URL . 'extensions/responsive/animations.css',
            array(),
            STEPFOX_LOOKS_VERSION
        );
    }
}

add_action('wp_enqueue_scripts', 'stepfox_enqueue_animations_css');