<?php
/**
 * Navigation Extension for Stepfox Looks
 * Allows all blocks to be added as children in navigation blocks
 *
 * @package Stepfox_Looks
 * @subpackage Extensions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Navigation Extension Class
 */
class Stepfox_Navigation_Extension {
    
    /**
     * Initialize the extension
     */
    public static function init() {
        add_action('enqueue_block_editor_assets', [__CLASS__, 'enqueue_editor_assets']);
        add_action('init', [__CLASS__, 'modify_navigation_blocks'], 20);
        add_filter('register_block_type_args', [__CLASS__, 'modify_block_args'], 10, 2);
    }
    
    /**
     * Enqueue block editor assets
     */
    public static function enqueue_editor_assets() {
        wp_enqueue_script(
            'stepfox-navigation-extension',
            STEPFOX_LOOKS_URL . 'extensions/navigation-extension/navigation-extension.js',
            array('wp-blocks', 'wp-hooks', 'wp-element', 'wp-compose', 'wp-dom-ready'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
    
    /**
     * Modify navigation block arguments during registration
     */
    public static function modify_block_args($args, $block_type) {
        // Navigation blocks to modify
        $navigation_blocks = [
            'core/navigation',
            'core/navigation-link', 
            'core/navigation-submenu'
        ];
        
        if (in_array($block_type, $navigation_blocks)) {
            // Remove allowedBlocks restriction completely
            if (isset($args['allowedBlocks'])) {
                unset($args['allowedBlocks']);
            }
            
            // Enable inserter support
            if (!isset($args['supports'])) {
                $args['supports'] = array();
            }
            $args['supports']['inserter'] = true;
            $args['supports']['multiple'] = true;
            $args['supports']['reusable'] = true;
            
            // Ensure template lock doesn't restrict blocks
            if (isset($args['attributes']['templateLock'])) {
                unset($args['attributes']['templateLock']);
            }
        }
        
        return $args;
    }
    
    /**
     * Directly modify registered navigation blocks
     */
    public static function modify_navigation_blocks() {
        $registry = WP_Block_Type_Registry::get_instance();
        
        $blocks_to_modify = [
            'core/navigation',
            'core/navigation-link',
            'core/navigation-submenu'
        ];
        
        foreach ($blocks_to_modify as $block_name) {
            if ($registry->is_registered($block_name)) {
                $block = $registry->get_registered($block_name);
                
                // Remove allowed blocks restriction
                if (property_exists($block, 'allowed_blocks')) {
                    $block->allowed_blocks = null;
                }
                
                // Ensure supports array exists and has what we need
                if (!property_exists($block, 'supports') || !is_array($block->supports)) {
                    $block->supports = array();
                }
                
                $block->supports['inserter'] = true;
                $block->supports['multiple'] = true;
                $block->supports['reusable'] = true;
                
                // Remove template lock if it exists
                if (property_exists($block, 'attributes') && 
                    is_array($block->attributes) && 
                    isset($block->attributes['templateLock'])) {
                    unset($block->attributes['templateLock']);
                }
            }
        }
    }
}

// Initialize the extension
Stepfox_Navigation_Extension::init();