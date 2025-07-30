<?php
/**
 * Blocks Registration
 * Handles registration of all custom blocks
 * 
 * @package Stepfox_Looks
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register all custom blocks
 */
function stepfox_looks_register_blocks() {
    // Load metafield block
    $metafield_file = STEPFOX_LOOKS_PATH . 'blocks/metafield-block/metafield_block.php';
    if (file_exists($metafield_file)) {
        require_once $metafield_file;
    }
    
    // Load load-more block  
    $loadmore_file = STEPFOX_LOOKS_PATH . 'blocks/load-more/load-more.php';
    if (file_exists($loadmore_file)) {
        require_once $loadmore_file;
    }
}

// Hook the registration function
add_action('init', 'stepfox_looks_register_blocks', 5);
