<?php
/**
 * Plugin Name: Stepfox Looks
 * Plugin URI: https://stepfoxthemes.com/plugins/stepfox-looks
 * Description: Comprehensive block editor enhancements and responsive controls for Stepfox themes. Includes custom blocks, responsive extensions, and advanced styling options.
 * Version: 1.0.0
 * Author: Stepfox
 * Author URI: https://stepfoxthemes.com
 * Text Domain: stepfox-looks
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.7
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
if (!defined('STEPFOX_LOOKS_VERSION')) {
    define('STEPFOX_LOOKS_VERSION', '1.0.0');
}

if (!defined('STEPFOX_LOOKS_PATH')) {
    define('STEPFOX_LOOKS_PATH', plugin_dir_path(__FILE__));
}

if (!defined('STEPFOX_LOOKS_URL')) {
    define('STEPFOX_LOOKS_URL', plugin_dir_url(__FILE__));
}

/**
 * Main Stepfox Looks Plugin Class
 */
class Stepfox_Looks_Plugin {
    
    /**
     * Initialize the plugin
     */
    public static function init() {
        add_action('init', [__CLASS__, 'load_textdomain']);
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_frontend_assets']);
        add_action('wp_loaded', [__CLASS__, 'register_block_attributes'], 100);
        
        // Load plugin components
        self::load_components();
    }
    
    /**
     * Load plugin text domain for translations
     */
    public static function load_textdomain() {
        load_plugin_textdomain('stepfox-looks', false, dirname(plugin_basename(__FILE__)) . '/languages/');
    }

    /**
     * Enqueue frontend assets
     */
    public static function enqueue_frontend_assets() {
        // Frontend styles will be added here when needed
    }
    
    /**
     * Register block attributes for all blocks
     */
    public static function register_block_attributes() {
        $registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

        foreach ($registered_blocks as $name => $block) {
            // Core responsive attributes
            $block->attributes['resolution'] = ["type" => "string", "default" => "desktop"];
            $block->attributes['element_state'] = ["type" => "string", "default" => "normal"];

            // Layout attributes
            $block->attributes['position'] = ["type" => "object", "default" => ['desktop' => '', 'tablet' => '', 'mobile' => '']];
            $block->attributes['display'] = ["type" => "object", "default" => ['desktop' => '', 'tablet' => '', 'mobile' => '']];
            $block->attributes['flex_wrap'] = ["type" => "object", "default" => ['desktop' => '', 'tablet' => '', 'mobile' => '']];
            $block->attributes['flex_direction'] = ["type" => "object", "default" => ['desktop' => '', 'tablet' => '', 'mobile' => '']];
            
            // Main plugin toggle
            $block->attributes['stepfox_looks'] = ["type" => "object", "default" => ['toggle' => true, 'toggle2' => true]];
        }
    }
    
    /**
     * Load all plugin components
     */
    private static function load_components() {
        // Load blocks
        self::load_blocks();
        
        // Load extensions
        self::load_extensions();
    }
    
    /**
     * Load custom blocks
     */
    private static function load_blocks() {
        $blocks_path = STEPFOX_LOOKS_PATH . 'blocks/';
        
        // Load metafield block
        if (file_exists($blocks_path . 'metafield-block/metafield_block.php')) {
            require_once $blocks_path . 'metafield-block/metafield_block.php';
        }
        
        // Load load-more block
        if (file_exists($blocks_path . 'load-more/load-more.php')) {
            require_once $blocks_path . 'load-more/load-more.php';
        }
    }
    
    /**
     * Load extensions
     */
    private static function load_extensions() {
        $extensions_path = STEPFOX_LOOKS_PATH . 'extensions/';
        
        // Load responsive extension
        if (file_exists($extensions_path . 'responsive/responsive.php')) {
            require_once $extensions_path . 'responsive/responsive.php';
        }
        
        // Load social share extension
        if (file_exists($extensions_path . 'social-share/social-share.php')) {
            require_once $extensions_path . 'social-share/social-share.php';
        }
        
        // Load post template fallback
        if (file_exists($extensions_path . 'post-template-fallback/post-template-fallback.php')) {
            require_once $extensions_path . 'post-template-fallback/post-template-fallback.php';
        }
        
        // Load cover block extension
        if (file_exists($extensions_path . 'cover-block-extension/cover-block-extension.php')) {
            require_once $extensions_path . 'cover-block-extension/cover-block-extension.php';
        }
    }
}

// Initialize the plugin
Stepfox_Looks_Plugin::init();

// Activation hook
register_activation_hook(__FILE__, function() {
    // Flush rewrite rules on activation
    flush_rewrite_rules();
});

// Deactivation hook
register_deactivation_hook(__FILE__, function() {
    // Clean up on deactivation
    flush_rewrite_rules();
});

/**
 * Disable srcset for cover blocks to prevent layout issues
 * 
 * @param array $attr Image attributes
 * @param object $attachment Attachment object
 * @param string $size Image size
 * @return array Modified attributes
 */
function sfl_disable_cover_block_srcset($attr, $attachment, $size) {
    // Security check: ensure we have valid input
    if (!is_array($attr) || !isset($attr['class'])) {
        return $attr;
    }
    
    if (strpos($attr['class'], 'wp-block-cover') !== false) {
        unset($attr['srcset']);
    }
    return $attr;
}
add_filter('wp_get_attachment_image_attributes', 'sfl_disable_cover_block_srcset', 10, 3);