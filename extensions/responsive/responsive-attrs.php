<?php
/**
 * Responsive Attribute Registration
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

add_filter( 'register_block_type_args', 'stepfox_modify_core_group_block_args', 20, 2 );
function stepfox_modify_core_group_block_args( $args, $name ) {
    $safe_add_attr = function($attr_name, $definition) use (&$args) {
        if (!isset($args['attributes'][$attr_name])) {
            $args['attributes'][$attr_name] = $definition;
        }
    };

    $safe_add_attr('customId', [ "type" => "string", "default" => "stepfox-not-set-id" ]);
    $safe_add_attr('device', [ "type" => "string", "default" => "desktop" ]);
    $safe_add_attr('element_state', [ "type" => "string", "default" => "normal" ]);

    if ($name !== 'core/spacer' && $name !== 'core/separator') {
        $safe_add_attr('custom_css', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('custom_js', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('animation', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('animation_delay', [ "type" => "string", "default" => "" ]);
        $safe_add_attr('animation_duration', [ "type" => "string", "default" => "" ]);
    }

    if ($name === 'core/cover') {
        $safe_add_attr('linkToPost', [ "type" => "boolean", "default" => false ]);
    }
    if ($name === 'core/social-link') {
        $safe_add_attr('shareThisPost', [ "type" => "boolean", "default" => false ]);
    }
    if ($name === 'core/query') {
        $safe_add_attr('customPostsPerPage', [ "type" => "string", "default" => "" ]);
    }

    $safe_add_attr('responsiveStyles', [ "type" => "object", "default" => [] ]);

    return $args;
}


