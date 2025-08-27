<?php
/**
 * Responsive Inline Scripts generation
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

function stepfox_inline_scripts_for_blocks($block) {
    if (!is_array($block) || !isset($block['attrs']) || !is_array($block['attrs'])) {
        return '';
    }
    if ( ! get_option('stepfox_looks_allow_frontend_js', false) ) {
        return '';
    }
    if(!empty($block['attrs']['custom_js'])) {
        $customId = isset($block['attrs']['customId']) ? $block['attrs']['customId'] : 'default-block-id';
        $block_selector = '#block_' . $customId;
        return stepfox_process_custom_css($block['attrs']['custom_js'], $block_selector);
    }
    return '';
}


