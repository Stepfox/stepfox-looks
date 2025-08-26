<?php
/**
 * Plugin Name: Stepfox Looks
 * Plugin URI: https://stepfoxthemes.com/plugins/stepfox-looks
 * Description: Comprehensive block editor enhancements and responsive controls for Stepfox themes. Includes custom blocks, responsive extensions, and advanced styling options.
 * Version: 1.1.0
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
    define('STEPFOX_LOOKS_VERSION', '1.1.0');
}

if (!defined('STEPFOX_LOOKS_PATH')) {
    define('STEPFOX_LOOKS_PATH', plugin_dir_path(__FILE__));
}

if (!defined('STEPFOX_LOOKS_URL')) {
    define('STEPFOX_LOOKS_URL', plugin_dir_url(__FILE__));
}

// Load GitHub updater early so update checks work in admin and cron
$sfl_admin_updater = __DIR__ . '/admin/class-stepfox-looks-updater.php';
if (file_exists($sfl_admin_updater)) {
    require_once $sfl_admin_updater;
    if (class_exists('Stepfox_Looks_Updater')) {
        Stepfox_Looks_Updater::init();
    }
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

        // Load navigation mega block
        if (file_exists($blocks_path . 'navigation-mega/navigation-mega.php')) {
            require_once $blocks_path . 'navigation-mega/navigation-mega.php';
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
        
        // Allow template parts inside post-template extension
        if (file_exists($extensions_path . 'post-template-allow-template-part/post-template-allow-template-part.php')) {
            require_once $extensions_path . 'post-template-allow-template-part/post-template-allow-template-part.php';
        }
        
        
        // Load admin functionality
        if (is_admin()) {
            self::load_admin();
        }
    }
    
    /**
     * Load admin functionality
     */
    private static function load_admin() {
        $admin_path = STEPFOX_LOOKS_PATH . 'admin/';
        
        if (file_exists($admin_path . 'class-stepfox-admin.php')) {
            require_once $admin_path . 'class-stepfox-admin.php';
        }

        // Remove the OCDI theme-about/branding panel from the import page
        add_filter('ocdi/disable_pt_branding', '__return_true');
        add_filter('pt-ocdi/disable_pt_branding', '__return_true'); // legacy filter name

        // Fallback: hard-hide the panel via admin CSS on the OCDI screen
        add_action('admin_head', function(){
            $screen = function_exists('get_current_screen') ? get_current_screen() : null;
            if ($screen && $screen->id === 'appearance_page_one-click-demo-import') {
                echo '<style>.ocdi__theme-about{display:none!important}</style>';
            }
        });

        // Provide demo definitions for OCDI
        add_filter('ocdi/import_files', function($files){
            $demos = array();
            // Demo 1 removed: Default demo intentionally disabled
            // Demo 2: Magazine
            $base2 = STEPFOX_LOOKS_PATH . 'demos/magazine/';
            $url2  = STEPFOX_LOOKS_URL . 'demos/magazine/';
            if (file_exists($base2 . 'content.xml')) {
                $demos[] = array(
                    'import_file_name'         => 'Examiner Magazine',
                    'local_import_file'        => $base2 . 'content.xml',
                    'import_preview_image_url' => file_exists($base2 . 'preview.jpg') ? ($url2 . 'preview.jpg') : '',
                    'categories'               => array('Examiner'),
                );
            }
            // Demo 3: Buzzed
            $base3 = STEPFOX_LOOKS_PATH . 'demos/buzzed/';
            $url3  = STEPFOX_LOOKS_URL . 'demos/buzzed/';
            if (file_exists($base3 . 'content.xml')) {
                $demos[] = array(
                    'import_file_name'         => 'Buzzed Magazine Demo',
                    'local_import_file'        => $base3 . 'content.xml',
                    'import_preview_image_url' => file_exists($base3 . 'preview.jpg') ? ($url3 . 'preview.jpg') : '',
                    'categories'               => array('Buzzed'),
                );
            }
            // Demo 4: Dawn Magazine
            $base4 = STEPFOX_LOOKS_PATH . 'demos/dawn-magazine/';
            $url4  = STEPFOX_LOOKS_URL . 'demos/dawn-magazine/';
            if (file_exists($base4 . 'content.xml')) {
                $demos[] = array(
                    'import_file_name'         => 'Dawn Magazine Demo',
                    'local_import_file'        => $base4 . 'content.xml',
                    'import_preview_image_url' => file_exists($base4 . 'preview.jpg') ? ($url4 . 'preview.jpg') : '',
                    'categories'               => array('Dawn'),
                );
            }
            return $demos;
        });

        // Mark import start so we can tag imported content
        $mark_start = function($selected_import = null){
            $slug = '';
            if (is_array($selected_import) && isset($selected_import['import_file_name'])) {
                $slug = sanitize_title($selected_import['import_file_name']);
            }
            update_option('stepfox_demo_importing', $slug ? $slug : 'demo');
        };
        add_action('ocdi/before_content_import', $mark_start, 10, 1);
        add_action('pt-ocdi/before_content_import', $mark_start, 10, 1);

        // Tag each imported post/term while import is running
        add_action('wp_import_insert_post', function($post_id){
            $tag = get_option('stepfox_demo_importing');
            if ($tag) { add_post_meta($post_id, '_stepfox_demo', $tag, true); }
        }, 10, 1);
        add_action('wp_import_insert_term', function($term_id){
            $tag = get_option('stepfox_demo_importing');
            if ($tag && function_exists('add_term_meta')) {
                add_term_meta($term_id, '_stepfox_demo', $tag, true);
            }
        }, 10, 1);

        // After import setup (set front page, menus, etc.)
        add_action('ocdi/after_import', function($selected_import = null){
            // Example: set a page titled "Home" as front page if exists
            $home = get_page_by_title('Home');
            if ($home) {
                update_option('show_on_front', 'page');
                update_option('page_on_front', $home->ID);
            }

            // Mark all content imported in the last request as demo by setting a flag option
            $slug = (is_array($selected_import) && isset($selected_import['import_file_name'])) ? sanitize_title($selected_import['import_file_name']) : 'demo';
            update_option('stepfox_demo_last_import', time());
            update_option('stepfox_demo_last_slug', $slug);
            delete_option('stepfox_demo_importing');
        });
        add_action('pt-ocdi/after_import', function($selected_import = null){
            $slug = (is_array($selected_import) && isset($selected_import['import_file_name'])) ? sanitize_title($selected_import['import_file_name']) : 'demo';
            update_option('stepfox_demo_last_import', time());
            update_option('stepfox_demo_last_slug', $slug);
            delete_option('stepfox_demo_importing');
        });
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