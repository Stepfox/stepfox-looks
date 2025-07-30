<?php
// Missing border
// submenu z-index i background
// dynamic micro parts button i id ili smeni go u metafield block


add_filter( 'register_block_type_args', 'modify_core_group_block_args', 10, 2 );
function modify_core_group_block_args( $args, $name ) {
    
    // Helper function to safely add attributes
    $safe_add_attr = function($attr_name, $definition) use (&$args) {
        if (!isset($args['attributes'][$attr_name])) {
            $args['attributes'][$attr_name] = $definition;
        }
    };

    // System attributes
    $safe_add_attr('customId', [ "type" => "string", "default" => "stepfox-not-set-id" ]);
    $safe_add_attr('custom_css', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('custom_js', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('device', [ "type" => "string", "default" => "" ]);
    
    // Animation attributes (moved from general.js to prevent duplicates)
    $safe_add_attr('animation', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('animation_delay', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('animation_duration', [ "type" => "string", "default" => "" ]);

    // Typography - Simple properties (property_device format)
    $safe_add_attr('font_size_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_size_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_size_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_size_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('line_height_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('line_height_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('line_height_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('line_height_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('letter_spacing_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('letter_spacing_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('letter_spacing_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('letter_spacing_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('word_spacing_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('word_spacing_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('word_spacing_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('word_spacing_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('textAlign_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('textAlign_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('textAlign_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('textAlign_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('font_weight_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_weight_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_weight_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_weight_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('font_style_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_style_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_style_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('font_style_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('text_transform_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_transform_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_transform_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_transform_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('text_decoration_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_decoration_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_decoration_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_decoration_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('text_shadow_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_shadow_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_shadow_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('text_shadow_hover', [ "type" => "string", "default" => "" ]);

    // Text and Background colors
    $safe_add_attr('color_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('color_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('color_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('color_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('background_color_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_color_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_color_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_color_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('background_image_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_image_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_image_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_image_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('background_size_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_size_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_size_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_size_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('background_position_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_position_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_position_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_position_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('background_repeat_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_repeat_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_repeat_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('background_repeat_hover', [ "type" => "string", "default" => "" ]);

    // Layout & Positioning - Simple properties (property_device format)
    $safe_add_attr('width_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('width_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('width_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('width_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('height_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('height_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('height_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('height_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('min_width_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('min_width_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('min_width_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('min_width_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('max_width_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('max_width_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('max_width_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('max_width_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('min_height_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('min_height_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('min_height_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('min_height_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('max_height_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('max_height_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('max_height_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('max_height_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('box_sizing_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('box_sizing_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('box_sizing_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('box_sizing_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('visibility_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('visibility_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('visibility_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('visibility_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('float_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('float_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('float_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('float_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('clear_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('clear_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('clear_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('clear_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('order_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('order_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('order_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('order_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('z_index_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('z_index_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('z_index_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('z_index_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('top_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('top_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('top_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('top_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('right_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('right_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('right_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('right_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('bottom_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('bottom_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('bottom_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('bottom_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('left_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('left_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('left_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('left_hover', [ "type" => "string", "default" => "" ]);

    // Layout & Positioning - Object properties (device_property format)
    $safe_add_attr('desktop_position', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_position', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_position', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_position', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('desktop_display', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_display', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_display', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_display', [ "type" => "string", "default" => "" ]);

    // Flexbox properties - Object properties (device_property format)
    $safe_add_attr('desktop_flex_direction', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_flex_direction', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_flex_direction', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_flex_direction', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('desktop_justify', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_justify', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_justify', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_justify', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('desktop_flexWrap', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_flexWrap', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_flexWrap', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_flexWrap', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('desktop_flex_grow', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_flex_grow', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_flex_grow', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_flex_grow', [ "type" => "string", "default" => "" ]);

    // Flexbox properties - Simple properties (property_device format)
    $safe_add_attr('flex_shrink_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('flex_shrink_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('flex_shrink_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('flex_shrink_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('flex_basis_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('flex_basis_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('flex_basis_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('flex_basis_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('align_items_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_items_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_items_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_items_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('align_self_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_self_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_self_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_self_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('align_content_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_content_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_content_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('align_content_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('grid_template_columns_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('grid_template_columns_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('grid_template_columns_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('grid_template_columns_hover', [ "type" => "string", "default" => "" ]);

    // Border properties - Object properties (device_property format)
    $safe_add_attr('desktop_borderStyle', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_borderStyle', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_borderStyle', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_borderStyle', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('desktop_borderColor', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('tablet_borderColor', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('mobile_borderColor', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('hover_borderColor', [ "type" => "string", "default" => "" ]);

    // Border width - Simple properties (property_device format)
    $safe_add_attr('borderWidth_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('borderWidth_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('borderWidth_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('borderWidth_hover', [ "type" => "string", "default" => "" ]);

    // Visual Effects - Simple properties (property_device format)
    $safe_add_attr('opacity_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('opacity_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('opacity_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('opacity_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('transform_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('transform_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('transform_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('transform_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('transition_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('transition_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('transition_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('transition_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('box_shadow_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('box_shadow_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('box_shadow_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('box_shadow_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('filter_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('filter_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('filter_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('filter_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('cursor_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('cursor_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('cursor_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('cursor_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('user_select_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('user_select_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('user_select_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('user_select_hover', [ "type" => "string", "default" => "" ]);
    
    $safe_add_attr('pointer_events_desktop', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('pointer_events_tablet', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('pointer_events_mobile', [ "type" => "string", "default" => "" ]);
    $safe_add_attr('pointer_events_hover', [ "type" => "string", "default" => "" ]);

    // Object-based attributes - Complex object properties (device_property format)
    $safe_add_attr('desktop_padding', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    $safe_add_attr('tablet_padding', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    $safe_add_attr('mobile_padding', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    $safe_add_attr('hover_padding', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    
    $safe_add_attr('desktop_margin', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    $safe_add_attr('tablet_margin', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    $safe_add_attr('mobile_margin', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    $safe_add_attr('hover_margin', [
        'type' => 'object',
        'default' => ['top' => '', 'left' => '', 'right' => '', 'bottom' => ''],
    ]);
    
    $safe_add_attr('desktop_borderRadius', [
        'type' => 'object',
        'default' => ['topLeft' => '', 'topRight' => '', 'bottomLeft' => '', 'bottomRight' => ''],
    ]);
    $safe_add_attr('tablet_borderRadius', [
        'type' => 'object',
        'default' => ['topLeft' => '', 'topRight' => '', 'bottomLeft' => '', 'bottomRight' => ''],
    ]);
    $safe_add_attr('mobile_borderRadius', [
        'type' => 'object',
        'default' => ['topLeft' => '', 'topRight' => '', 'bottomLeft' => '', 'bottomRight' => ''],
    ]);
    $safe_add_attr('hover_borderRadius', [
        'type' => 'object',
        'default' => ['topLeft' => '', 'topRight' => '', 'bottomLeft' => '', 'bottomRight' => ''],
    ]);

    return $args;
}


add_action( 'wp_loaded', function() {

//    $registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
//
//    foreach( $registered_blocks as $name => $block ) {
//        // For core/group block, set some basic attributes.
//        if ( $block->name == 'core/group' ) {
//
//            $block->attributes['layout'] = [ "type" => "object", "default" => [ "type" => "default" ] ];
//            $block->attributes['backgroundColor'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['gradient'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['linkColor'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['textColor'] = [ "type" => "string", "default" => "" ];
//            // Overwrite layout attribute again (if needed).
//            $block->attributes['layout'] = [ "type" => "object", "default" => [ "type" => "default" ] ];
//        }
//
//        // For our custom stepfox blocks.

//
//
//            $block->attributes['theme_colors'] = [ "type" => "object", "default" => [ "white" => "#FFF" ] ];
//            $block->attributes['theme_colors_update'] = [ "type" => "string", "default" => [] ];
//
//            // Change hide attributes from boolean to string with a default of "not-selected"
//            $block->attributes['hide_tablet'] = [ "type" => "string", "default" => "not-selected" ];
//            $block->attributes['text_align_tablet'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['hide_mobile'] = [ "type" => "string", "default" => "not-selected" ];

//            $block->attributes['text_align_mobile'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['justify_tablet'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['justify_mobile'] = [ "type" => "string", "default" => "" ];
//
//            $block->attributes['backgroundColor'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['gradient'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['linkColor'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['textColor'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['layout'] = [ "type" => "object", "default" => [ "type" => "default" ] ];
//
//            $block->attributes['font_size_desktop'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['line_height_desktop'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['order_desktop'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['width_desktop'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['desktop_padding'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['desktop_margin'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['desktop_border'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['desktop_pos'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['desktop_position'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['desktop_display'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['desktop_textShadow'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['desktop_flexWrap'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['desktop_columns'] = [ "type" => "string", "default" => "" ];
//
//            $block->attributes['font_size_tablet'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['line_height_tablet'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['order_tablet'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['width_tablet'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['tablet_padding'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['tablet_margin'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['tablet_border'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['tablet_pos'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['tablet_position'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['tablet_display'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['tablet_textShadow'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['tablet_flexWrap'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['tablet_columns'] = [ "type" => "string", "default" => "" ];
//
//            $block->attributes['font_size_mobile'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['line_height_mobile'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['order_mobile'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['width_mobile'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['mobile_padding'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['mobile_margin'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['mobile_border'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//
//            $block->attributes['mobile_pos'] = [ "type" => "object", "default" => [ "top" => "0", "left" => "0", "right" => "0", "bottom" => "0" ] ];
//            $block->attributes['mobile_position'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['mobile_display'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['mobile_textShadow'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['mobile_flexWrap'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['mobile_columns'] = [ "type" => "string", "default" => "" ];
//
//
//
//
//
//
//
//
//            $block->attributes['customId'] = [ "type" => "string", "default" => "stepfox-not-set-id" ];
//            $block->attributes['custom_css'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['custom_js'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['device'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['desktop_textAlign'] = [ "type" => "string", "default" => "" ];
//            $block->attributes['desktop_justify'] = [ "type" => "string", "default" => "" ];
//
//
//
//        }
//    }

}, 100);





function wrap_group_and_columns($block_content = '', $block = [])
{
    // Safety check for parameters
    if (empty($block_content) && empty($block)) {
        return '';
    }
    // Check if block has any responsive attributes that would need an ID
    $hasResponsiveAttrs = false;
    $responsiveAttrs = [
        'font_size_desktop', 'font_size_tablet', 'font_size_mobile', 'font_size_hover',
        'line_height_desktop', 'line_height_tablet', 'line_height_mobile', 'line_height_hover',
        'letter_spacing_desktop', 'letter_spacing_tablet', 'letter_spacing_mobile', 'letter_spacing_hover',
        'width_desktop', 'width_tablet', 'width_mobile', 'width_hover',
        'height_desktop', 'height_tablet', 'height_mobile', 'height_hover',
        'order_desktop', 'order_tablet', 'order_mobile', 'order_hover',
        'desktop_borderStyle', 'tablet_borderStyle', 'mobile_borderStyle', 'hover_borderStyle',
        'desktop_borderColor', 'tablet_borderColor', 'mobile_borderColor', 'hover_borderColor',
        'borderWidth_desktop', 'borderWidth_tablet', 'borderWidth_mobile', 'borderWidth_hover',
        'z_index_desktop', 'z_index_tablet', 'z_index_mobile', 'z_index_hover',
        'desktop_position', 'tablet_position', 'mobile_position', 'hover_position',
        'top_desktop', 'top_tablet', 'top_mobile', 'top_hover',
        'right_desktop', 'right_tablet', 'right_mobile', 'right_hover',
        'bottom_desktop', 'bottom_tablet', 'bottom_mobile', 'bottom_hover',
        'left_desktop', 'left_tablet', 'left_mobile', 'left_hover',
        'desktop_display', 'tablet_display', 'mobile_display', 'hover_display',
        'opacity_desktop', 'opacity_tablet', 'opacity_mobile', 'opacity_hover',
        'overflow_desktop', 'overflow_tablet', 'overflow_mobile', 'overflow_hover',
        'flexDirection_desktop', 'flexDirection_tablet', 'flexDirection_mobile', 'flexDirection_hover',
        'justifyContent_desktop', 'justifyContent_tablet', 'justifyContent_mobile', 'justifyContent_hover',
        'flexWrap_desktop', 'flexWrap_tablet', 'flexWrap_mobile', 'flexWrap_hover',
        'flexGrow_desktop', 'flexGrow_tablet', 'flexGrow_mobile', 'flexGrow_hover',
        'textAlign_desktop', 'textAlign_tablet', 'textAlign_mobile', 'textAlign_hover',
        'transform_desktop', 'transform_tablet', 'transform_mobile', 'transform_hover',
        'transition_desktop', 'transition_tablet', 'transition_mobile', 'transition_hover',
        'desktop_borderRadius', 'tablet_borderRadius', 'mobile_borderRadius', 'hover_borderRadius',
        'desktop_padding', 'tablet_padding', 'mobile_padding', 'hover_padding',
        'desktop_margin', 'tablet_margin', 'mobile_margin', 'hover_margin'
    ];
    
    foreach ($responsiveAttrs as $attr) {
        if (!empty($block['attrs'][$attr])) {
            $hasResponsiveAttrs = true;
            break;
        }
    }
    
    // If block has responsive attributes but no customId, generate one based on block content hash
    if ($hasResponsiveAttrs && isset($block['attrs']) && empty($block['attrs']['customId']) && $block['blockName'] != 'core/spacer') {
        // Create a consistent ID based on block content and attributes
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }

    // If the block has a customId (and is not a spacer) add the custom id to the outer tag.
    if ( isset($block['attrs']) && ! empty( $block['attrs']['customId'] ) && $block['blockName'] != 'core/spacer' ) {
$block['attrs']['customId'] = str_replace( 'anchor_', '', $block['attrs']['customId'] );
        $content = preg_replace( '(>+)', ' id="block_' . $block['attrs']['customId'] . '" > ', $block_content, 1 );

        if ( !empty($content) ) {
            preg_match( '/(<[^>]*>)/i', $content, $first_line );
        } else {
            $first_line = [];
        }
        if(!empty($first_line[0])) {
            if (strpos($first_line[0], 'style="') !== false &&
                strpos($first_line[0], 'id="block_' . $block['attrs']['customId'] . '"') !== false) {
                $content = preg_replace('/(<[^>]+) style=".*?"/i', '$1', $content, 1);
            }
        }

        return $content;
    }

    if ( isset($block['attrs']) && ! empty( $block['attrs']['image_block_id'] ) ) {
        // Additional image_block_id processing if needed.
    }

    return $block_content;
}
add_filter( 'render_block', 'wrap_group_and_columns', 10, 2 );


function search($array, $key)
{
    $results = array();

    if ( is_array( $array ) ) {
        if ( isset( $array[$key] ) ) {
            $results[] = $array;
        }
        foreach ( $array as $subarray ) {
            $results = array_merge( $results, search( $subarray, $key ) );
        }
    }

    return $results;
}


function stepfox_styling() {
    wp_reset_postdata();
    global $_wp_current_template_content;
    $page_content = get_the_content();
    $full_content = $_wp_current_template_content . $page_content;

    if ( has_blocks( $full_content ) ) {
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        // Get template parts content.
        foreach ( $all_blocks as $block ) {
            $full_content .= get_template_parts_as_content( $block );
        }
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        $inline_style = '';
        wp_register_style( 'stepfox-responsive-style', false );
        wp_enqueue_style( 'stepfox-responsive-style' );

        foreach ( $all_blocks as $block ) {
            if ( ( $block['blockName'] === 'core/block' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ||
                ( $block['blockName'] === 'core/navigation' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ) {
                $content = get_post_field( 'post_content', $block['attrs']['ref'] );
                $reusable_blocks = parse_blocks( $content );
                $all_reusable_blocks = search( $reusable_blocks, 'blockName' );
                foreach ( $all_reusable_blocks as $reusable_block ) {
                    $inline_style .= inline_styles_for_blocks( $reusable_block );
                }
            }

            // Process all blocks with inline styles
            $inline_style .= inline_styles_for_blocks( $block );
        }

        wp_add_inline_style( 'stepfox-responsive-style', $inline_style );
    }
}
add_action( 'wp_head', 'stepfox_styling' );


function get_template_parts_as_content($block) {
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['blockName'])) {
        return '';
    }
    
    $template_parts_content = '';
    if ( $block['blockName'] == 'core/template-part' && isset($block['attrs']) ) {
        $theme = isset($block['attrs']['theme']) ? $block['attrs']['theme'] : '';
        $slug = isset($block['attrs']['slug']) ? $block['attrs']['slug'] : '';
        $template_part = get_block_template( $theme . '//' . $slug, 'wp_template_part' );
        if ( $template_part && isset($template_part->content) ) {
            $template_part_content = $template_part->content;
            $template_blocks = parse_blocks( $template_part_content );
            $all_template_blocks = search( $template_blocks, 'blockName' );
            $template_parts_content .= $template_part_content;
            
            foreach ( $all_template_blocks as $template_block ) {
            if ( $template_block['blockName'] == 'core/template-part' && isset($template_block['attrs']) ) {
                $theme = isset($template_block['attrs']['theme']) ? $template_block['attrs']['theme'] : '';
                $slug = isset($template_block['attrs']['slug']) ? $template_block['attrs']['slug'] : '';
                $template_part_1 = get_block_template( $theme . '//' . $slug, 'wp_template_part' );
                if ( $template_part_1 && isset($template_part_1->content) ) {
                    $template_part_content_1 = $template_part_1->content;
                    $template_parts_content .= $template_part_content_1;
                }
            }
            }
        }
    }
    return $template_parts_content;
}

function decode_css_var( $input ) {
    // Safety check for null or non-string input
    if ( empty($input) || !is_string($input) ) {
        return $input;
    }
    
    // Check if the string starts with "var:"
    if ( strpos( $input, 'var:' ) === 0 ) {
        // Remove the "var:" prefix.
        $trimmed = substr( $input, 4 );
        // Replace '|' with '--'
        $variable_part = str_replace( '|', '--', $trimmed );
        // Return the final CSS variable format.
        return 'var(--wp--' . $variable_part . ')';
    }

    // If the string doesn't start with "var:", return it unchanged.
    return $input;
}

function inline_styles_for_blocks($block) {
    
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['blockName'])) {
        return '';
    }
    
    // Ensure attrs exists and is an array, initialize as empty array if not
    if (!isset($block['attrs']) || !is_array($block['attrs'])) {
        $block['attrs'] = [];
    }

    // Check if block has any responsive attributes that would need an ID
    $hasResponsiveAttrs = false;
    $responsiveAttrs = [
        // Typography Properties
        'font_size_desktop', 'font_size_tablet', 'font_size_mobile', 'font_size_hover',
        'line_height_desktop', 'line_height_tablet', 'line_height_mobile', 'line_height_hover',
        'letter_spacing_desktop', 'letter_spacing_tablet', 'letter_spacing_mobile', 'letter_spacing_hover',
        'word_spacing_desktop', 'word_spacing_tablet', 'word_spacing_mobile', 'word_spacing_hover',
        'textAlign_desktop', 'textAlign_tablet', 'textAlign_mobile', 'textAlign_hover',
        'font_weight_desktop', 'font_weight_tablet', 'font_weight_mobile', 'font_weight_hover',
        'font_style_desktop', 'font_style_tablet', 'font_style_mobile', 'font_style_hover',
        'text_transform_desktop', 'text_transform_tablet', 'text_transform_mobile', 'text_transform_hover',
        'text_decoration_desktop', 'text_decoration_tablet', 'text_decoration_mobile', 'text_decoration_hover',
        'text_shadow_desktop', 'text_shadow_tablet', 'text_shadow_mobile', 'text_shadow_hover',
        
        // Text and Background colors
        'color_desktop', 'color_tablet', 'color_mobile', 'color_hover',
        'background_color_desktop', 'background_color_tablet', 'background_color_mobile', 'background_color_hover',
        'background_image_desktop', 'background_image_tablet', 'background_image_mobile', 'background_image_hover',
        'background_size_desktop', 'background_size_tablet', 'background_size_mobile', 'background_size_hover',
        'background_position_desktop', 'background_position_tablet', 'background_position_mobile', 'background_position_hover',
        'background_repeat_desktop', 'background_repeat_tablet', 'background_repeat_mobile', 'background_repeat_hover',
        
        // Layout & Positioning Properties
        'width_desktop', 'width_tablet', 'width_mobile', 'width_hover',
        'height_desktop', 'height_tablet', 'height_mobile', 'height_hover',
        'min_width_desktop', 'min_width_tablet', 'min_width_mobile', 'min_width_hover',
        'max_width_desktop', 'max_width_tablet', 'max_width_mobile', 'max_width_hover',
        'min_height_desktop', 'min_height_tablet', 'min_height_mobile', 'min_height_hover',
        'max_height_desktop', 'max_height_tablet', 'max_height_mobile', 'max_height_hover',
        'box_sizing_desktop', 'box_sizing_tablet', 'box_sizing_mobile', 'box_sizing_hover',
        'visibility_desktop', 'visibility_tablet', 'visibility_mobile', 'visibility_hover',
        'float_desktop', 'float_tablet', 'float_mobile', 'float_hover',
        'clear_desktop', 'clear_tablet', 'clear_mobile', 'clear_hover',
        'order_desktop', 'order_tablet', 'order_mobile', 'order_hover',
        'z_index_desktop', 'z_index_tablet', 'z_index_mobile', 'z_index_hover',
        'top_desktop', 'top_tablet', 'top_mobile', 'top_hover',
        'right_desktop', 'right_tablet', 'right_mobile', 'right_hover',
        'bottom_desktop', 'bottom_tablet', 'bottom_mobile', 'bottom_hover',
        'left_desktop', 'left_tablet', 'left_mobile', 'left_hover',
        'desktop_position', 'tablet_position', 'mobile_position', 'hover_position',
        'desktop_display', 'tablet_display', 'mobile_display', 'hover_display',
        
        // Flexbox Properties
        'desktop_flex_direction', 'tablet_flex_direction', 'mobile_flex_direction', 'hover_flex_direction',
        'desktop_justify', 'tablet_justify', 'mobile_justify', 'hover_justify',
        'desktop_flexWrap', 'tablet_flexWrap', 'mobile_flexWrap', 'hover_flexWrap',
        'desktop_flex_grow', 'tablet_flex_grow', 'mobile_flex_grow', 'hover_flex_grow',
        'flex_shrink_desktop', 'flex_shrink_tablet', 'flex_shrink_mobile', 'flex_shrink_hover',
        'flex_basis_desktop', 'flex_basis_tablet', 'flex_basis_mobile', 'flex_basis_hover',
        'align_items_desktop', 'align_items_tablet', 'align_items_mobile', 'align_items_hover',
        'align_self_desktop', 'align_self_tablet', 'align_self_mobile', 'align_self_hover',
        'align_content_desktop', 'align_content_tablet', 'align_content_mobile', 'align_content_hover',
        'grid_template_columns_desktop', 'grid_template_columns_tablet', 'grid_template_columns_mobile', 'grid_template_columns_hover',
        
        // Border Properties
        'desktop_borderStyle', 'tablet_borderStyle', 'mobile_borderStyle', 'hover_borderStyle',
        'desktop_borderColor', 'tablet_borderColor', 'mobile_borderColor', 'hover_borderColor',
        'borderWidth_desktop', 'borderWidth_tablet', 'borderWidth_mobile', 'borderWidth_hover',
        
        // Visual Effects Properties
        'opacity_desktop', 'opacity_tablet', 'opacity_mobile', 'opacity_hover',
        'transform_desktop', 'transform_tablet', 'transform_mobile', 'transform_hover',
        'transition_desktop', 'transition_tablet', 'transition_mobile', 'transition_hover',
        'box_shadow_desktop', 'box_shadow_tablet', 'box_shadow_mobile', 'box_shadow_hover',
        'filter_desktop', 'filter_tablet', 'filter_mobile', 'filter_hover',
        'cursor_desktop', 'cursor_tablet', 'cursor_mobile', 'cursor_hover',
        'user_select_desktop', 'user_select_tablet', 'user_select_mobile', 'user_select_hover',
        'pointer_events_desktop', 'pointer_events_tablet', 'pointer_events_mobile', 'pointer_events_hover',
        
        // Object-based attributes
        'desktop_borderRadius', 'tablet_borderRadius', 'mobile_borderRadius', 'hover_borderRadius',
        'desktop_padding', 'tablet_padding', 'mobile_padding', 'hover_padding',
        'desktop_margin', 'tablet_margin', 'mobile_margin', 'hover_margin'
    ];
    
    foreach ($responsiveAttrs as $attr) {
        if (!empty($block['attrs'][$attr])) {
            $hasResponsiveAttrs = true;
            break;
        }
    }
    
    // If block has responsive attributes but no customId, generate one based on block content hash
    if ($hasResponsiveAttrs && isset($block['attrs']) && empty($block['attrs']['customId'])) {
        // Create a consistent ID based on block content and attributes
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }

    if ( isset($block['attrs']) && ( ! empty( $block['attrs']['customId'] ) || ! empty( $block['attrs']['image_block_id'] ) ) ) {

        // Set width if desktop width is provided.
        if ( ! empty( $block['attrs']['width_desktop'] ) ) {
            $block['attrs']['width'] = $block['attrs']['width_desktop'];
        }
        // REMOVED: font_size_desktop and line_height_desktop WordPress style assignments to prevent duplicates
        // REMOVED: desktop_padding WordPress style assignments to prevent duplicates

        if ( ! empty( $block['attrs']['desktop_border']['right'] ) ) {
            $block['attrs']['style']['spacing']['border']['right'] = $block['attrs']['desktop_border']['right'];
        }
        if ( ! empty( $block['attrs']['desktop_border']['left'] ) ) {
            $block['attrs']['style']['spacing']['border']['left'] = $block['attrs']['desktop_border']['left'];
        }
        if ( ! empty( $block['attrs']['desktop_border']['bottom'] ) ) {
            $block['attrs']['style']['spacing']['border']['bottom'] = $block['attrs']['desktop_border']['bottom'];
        }
        if ( ! empty( $block['attrs']['desktop_border']['top'] ) ) {
            $block['attrs']['style']['spacing']['border']['top'] = $block['attrs']['desktop_border']['top'];
        }

        // REMOVED: desktop_margin WordPress style assignments to prevent duplicates

        if ( ! empty( $block['attrs']['tablet_padding'] ) ) {
            $block['attrs']['padding_tablet'] = $block['attrs']['tablet_padding'];
        }
        if ( ! empty( $block['attrs']['tablet_margin'] ) ) {
            $block['attrs']['margin_tablet'] = $block['attrs']['tablet_margin'];
        }

        if ( ! empty( $block['attrs']['mobile_padding'] ) ) {
            $block['attrs']['padding_mobile'] = $block['attrs']['mobile_padding'];
        }
        if ( ! empty( $block['attrs']['mobile_margin'] ) ) {
            $block['attrs']['margin_mobile'] = $block['attrs']['mobile_margin'];
        }

        if ( strpos( $block['blockName'], 'acf/' ) !== false ) {
            $block['attrs']['customId'] = str_replace( 'block_', '', $block['attrs']['customId'] );
        }
        if ( ! empty( $block['attrs']['image_block_id'] ) ) {
            $block['attrs']['customId'] = $block['attrs']['image_block_id'];
        }

        $inlineStyles = '#block_' . $block['attrs']['customId'] . '{';
        $inlineStyles = str_replace( 'block_anchor_', '', $inlineStyles );
        if ( ! empty( $block['attrs']['style']['color']['background'] ) ) {
            $inlineStyles .= 'background-color:' . $block['attrs']['style']['color']['background'] . ';';
        }

        if ( ! empty( $block['attrs']['style']['background']['backgroundImage'] ) ) {
            $inlineStyles .= 'background:url(' . $block['attrs']['style']['background']['backgroundImage']['url'] . ');background-size: 100%;';
        }
        if ( ! empty( $block['attrs']['theme_colors'] ) ) {
            foreach ( $block['attrs']['theme_colors'] as $theme_color => $value ) {
                if ( $theme_color == 'gradient_override' ) {
                    $inlineStyles .= '--wp--preset--gradient--flag: ' . $value . ';';
                } else {
                    $inlineStyles .= '--wp--preset--color--' . $theme_color . ':' . $value . ';';
                }
            }
        }

        if ( ! empty( $block['attrs']['start_from'] ) ) {
            $inlineStyles .= '--start-from:' . $block['attrs']['start_from'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['color']['gradient'] ) ) {
            $inlineStyles .= 'background:' . $block['attrs']['style']['color']['gradient'] . ';';
        }
        if ( ! empty( $block['attrs']['backgroundColor'] ) ) {
            $inlineStyles .= 'background-color:var(--wp--preset--color--' . $block['attrs']['backgroundColor'] . ');';
        }
        if ( ! empty( $block['attrs']['style']['color']['text'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['style']['color']['text'] . ';';
        }
        if ( ! empty( $block['attrs']['textColor'] ) ) {
            $inlineStyles .= 'color:var(--wp--preset--color--' . $block['attrs']['textColor'] . ');';
        }
        // shadow
        if ( ! empty( $block['attrs']['style']['shadow'] ) ) {
            $inlineStyles .= 'box-shadow:' . $block['attrs']['style']['shadow'] . ';';
        }
        if ( ! empty( $block['attrs']['animation'] ) ) {
            $inlineStyles .= 'animation:' . $block['attrs']['animation'] . ';';
        }
        if ( ! empty( $block['attrs']['animation_delay'] ) ) {
            $inlineStyles .= 'animation-delay:' . $block['attrs']['animation_delay'] . 's;';
        }
        if ( ! empty( $block['attrs']['animation_duration'] ) ) {
            $inlineStyles .= 'animation-duration:' . $block['attrs']['animation_duration'] . 's;';
        }

        // Typography
        if ( ! empty( $block['attrs']['style']['typography']['fontSize'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['style']['typography']['fontSize'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['textDecoration'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['style']['typography']['textDecoration'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['letterSpacing'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['style']['typography']['letterSpacing'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['lineHeight'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['style']['typography']['lineHeight'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['fontWeight'] ) ) {
            $inlineStyles .= 'font-weight:' . $block['attrs']['style']['typography']['fontWeight'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['fontStyle'] ) ) {
            $inlineStyles .= 'font-style:' . $block['attrs']['style']['typography']['fontStyle'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['textTransform'] ) ) {
            $inlineStyles .= 'text-transform:' . $block['attrs']['style']['typography']['textTransform'] . ';';
        }

        if ( ! empty( $block['attrs']['style']['border']['width'] ) ) {
            $inlineStyles .= 'border-width:' . $block['attrs']['style']['border']['width'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['border']['style'] ) ) {
            $inlineStyles .= 'border-style:' . $block['attrs']['style']['border']['style'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['border']['radius'] ) ) {
            $inlineStyles .= 'border-radius:' . $block['attrs']['style']['border']['radius'] . ';';
            $inlineStyles .= 'overflow:hidden;';
        }
        if ( ! empty( $block['attrs']['style']['border']['color'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['style']['border']['color'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['borderColor'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['style']['borderColor'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['border'] ) ) {
            foreach ( $block['attrs']['style']['border'] as $border_side_key => $border_side_value ) {
                if ( ! empty( $border_side_value["width"] ) ) {
                    $inlineStyles .= 'border-' . $border_side_key . '-width:' . decode_css_var($border_side_value['width']) . ';';
                    if(!empty($border_side_value['color'])) {
                        $inlineStyles .= 'border-' . $border_side_key . '-color:' . decode_css_var($border_side_value['color']) . ';';
                    }
                    $inlineStyles .= 'border-' . $border_side_key . '-style:solid;';
                    if(!empty($border_side_value['radius'])) {
                        $inlineStyles .= 'border-' . $border_side_key . '-radius:' . decode_css_var($border_side_value['radius']) . ';';
                    }
                }
            }
        }
        if ( ! empty( $block['attrs']['desktop_border']['top'] ) ) {
            $inlineStyles .= 'border-top-width:' . $block['attrs']['desktop_border']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_border']['bottom'] ) ) {
            $inlineStyles .= 'border-bottom-width:' . $block['attrs']['desktop_border']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_border']['left'] ) ) {
            $inlineStyles .= 'border-left-width:' . $block['attrs']['desktop_border']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_border']['right'] ) ) {
            $inlineStyles .= 'border-right-width:' . $block['attrs']['desktop_border']['right'] . ';';
        }

        if ( ! empty( $block['attrs']['image_block_id'] ) ) {
            if ( ! empty( $block['attrs']['width'] ) ) {
                $inlineStyles .= 'width:' . $block['attrs']['width'] . 'px;';
                $block['attrs']['width'] = '';
            }
            if ( ! empty( $block['attrs']['height'] ) ) {
                $inlineStyles .= 'height:' . $block['attrs']['height'] . 'px;';
                $block['attrs']['height'] = '';
            }
        }
        // Block width
        if ( ! empty( $block['attrs']['layout']['contentSize'] ) && $block['blockName'] != 'core/group' ) {
            $inlineStyles .= 'max-width:' . $block['attrs']['layout']['contentSize'] . ';';
        }
        if ( ! empty( $block['attrs']['layout']['contentSize'] ) && $block['blockName'] == 'core/group' ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['layout']['contentSize'] . '; max-width:100%;';
        }
        if ( ! empty( $block['attrs']['width'] ) && $block['blockName'] != 'core/column' ) {
            $inlineStyles .= 'width:' . $block['attrs']['width'] . ';';
        }
        if ( ! empty( $block['attrs']['width'] ) && $block['blockName'] === 'core/column' ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['width'] . ' !important;';
        }

        if ( ! empty( $block['attrs']['layout']['type'] ) && $block['attrs']['layout']['type'] == 'flex' ) {
            $inlineStyles .= 'display:' . $block['attrs']['layout']['type'] . ';';
            if ( ! empty( $block['attrs']['layout']['flexWrap'] ) ) {
                $inlineStyles .= 'flex-wrap:' . $block['attrs']['layout']['flexWrap'] . ';';
            } else {
                $inlineStyles .= 'flex-wrap:wrap;';
            }
            if ( ! empty( $block['attrs']['layout']['verticalAlignment'] ) ) {
                $verticalAlignment = 'center';
                if ( $block['attrs']['layout']['verticalAlignment'] == 'bottom' ) {
                    $verticalAlignment = 'flex-end';
                } elseif ( $block['attrs']['layout']['verticalAlignment'] == 'top' ) {
                    $verticalAlignment = 'flex-start';
                }
                $inlineStyles .= 'align-items:' . $verticalAlignment . ';';
            } else {
                $inlineStyles .= 'align-items:center;';
            }
            if ( ! empty( $block['attrs']['layout']['justifyContent'] ) ) {
                if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                    $inlineStyles .= 'justify-content:flex-start;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                    $inlineStyles .= 'justify-content:center;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                    $inlineStyles .= 'justify-content:flex-end;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'space-between' ) {
                    $inlineStyles .= 'justify-content:space-between;';
                }
            }
            if ( ! empty( $block['attrs']['layout']['orientation'] ) ) {
                if ( $block['attrs']['layout']['orientation'] == 'vertical' ) {
                    $inlineStyles .= 'flex-direction:column;';
                    if ( ! empty( $block['attrs']['layout']['justifyContent'] ) ) {
                        if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                            $inlineStyles .= 'align-items:flex-start;';
                        }
                        if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                            $inlineStyles .= 'align-items:center;';
                        }
                        if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                            $inlineStyles .= 'align-items:flex-end;';
                        }
                    }
                } else {
                    $inlineStyles .= 'flex-direction:row;';
                    if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                        $inlineStyles .= 'justify-content:flex-start;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                        $inlineStyles .= 'justify-content:center;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                        $inlineStyles .= 'justify-content:flex-end;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'space-between' ) {
                        $inlineStyles .= 'justify-content:space-between;';
                    }
                }
            }
        }
        if ( strpos( $block['blockName'], 'core/column' ) !== false ) {
            if ( ! empty( $block['attrs']['align'] ) ) {
                $inlineStyles .= 'align-self:' . $block['attrs']['align'] . ';';
            }
        }

        if ( ! empty( $block['attrs']['minHeight'] ) ) {
            if ( empty( $block['attrs']['minHeightUnit'] ) ) {
                $block['attrs']['minHeightUnit'] = 'px';
            }
            $inlineStyles .= 'min-height:' . $block['attrs']['minHeight'] . $block['attrs']['minHeightUnit'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['dimensions']['minHeight'] ) ) {
            $inlineStyles .= 'min-height:' . $block['attrs']['style']['dimensions']['minHeight']. ';';
        }
        // Spacing (gap, padding, margin)
        if ( ! empty( $block['attrs']['style']['spacing']['blockGap'] ) ) {
    $blockGap = $block['attrs']['style']['spacing']['blockGap'];
    if ( is_array( $blockGap ) ) {
        // Convert array to string, e.g., join with a space or comma.
        $blockGap = implode(' ', $blockGap);
    }
    $inlineStyles .= 'gap:' . $blockGap . ';';
}
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['style']['spacing']['padding']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['style']['spacing']['padding']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['style']['spacing']['padding']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['style']['spacing']['padding']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['style']['spacing']['margin']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['style']['spacing']['margin']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['style']['spacing']['margin']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['style']['spacing']['margin']['left'] . ';';
        }
        // ================================
        // RESPONSIVE CSS GENERATION - DESKTOP STYLES
        // ================================
        
        // Typography - Desktop
if ( ! empty( $block['attrs']['font_size_desktop'] ) ) {
    $inlineStyles .= 'font-size:' . $block['attrs']['font_size_desktop'] . ';';
}
if ( ! empty( $block['attrs']['line_height_desktop'] ) ) {
    $inlineStyles .= 'line-height:' . $block['attrs']['line_height_desktop'] . ';';
}
if ( ! empty( $block['attrs']['letter_spacing_desktop'] ) ) {
    $inlineStyles .= 'letter-spacing:' . $block['attrs']['letter_spacing_desktop'] . ';';
}
        if ( ! empty( $block['attrs']['word_spacing_desktop'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['word_spacing_desktop'] . ';';
        }
if ( ! empty( $block['attrs']['textAlign_desktop'] ) ) {
    $inlineStyles .= 'text-align:' . $block['attrs']['textAlign_desktop'] . ';';
}
if ( ! empty( $block['attrs']['font_weight_desktop'] ) ) {
    $inlineStyles .= 'font-weight:' . $block['attrs']['font_weight_desktop'] . ';';
}
if ( ! empty( $block['attrs']['font_style_desktop'] ) ) {
    $inlineStyles .= 'font-style:' . $block['attrs']['font_style_desktop'] . ';';
}
if ( ! empty( $block['attrs']['text_transform_desktop'] ) ) {
    $inlineStyles .= 'text-transform:' . $block['attrs']['text_transform_desktop'] . ';';
}
if ( ! empty( $block['attrs']['text_decoration_desktop'] ) ) {
    $inlineStyles .= 'text-decoration:' . $block['attrs']['text_decoration_desktop'] . ';';
}
if ( ! empty( $block['attrs']['text_shadow_desktop'] ) ) {
    $inlineStyles .= 'text-shadow:' . $block['attrs']['text_shadow_desktop'] . ';';
}

        // Text and Background colors - Desktop (High Priority)
        if ( ! empty( $block['attrs']['color_desktop'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['color_desktop'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_color_desktop'] ) ) {
            if (strpos($block['attrs']['background_color_desktop'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['background_color_desktop'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['background_color_desktop'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['background_image_desktop'] ) ) {
            $bg_image = $block['attrs']['background_image_desktop'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_size_desktop'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['background_size_desktop'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_position_desktop'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['background_position_desktop'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_repeat_desktop'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['background_repeat_desktop'] . ' !important;';
        }

        // Layout & Positioning - Desktop
        if ( ! empty( $block['attrs']['width_desktop'] ) ) {
            $inlineStyles .= 'width:' . $block['attrs']['width_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['height_desktop'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['height_desktop'] . ';';
        }
if ( ! empty( $block['attrs']['min_width_desktop'] ) ) {
    $inlineStyles .= 'min-width:' . $block['attrs']['min_width_desktop'] . ';';
}
if ( ! empty( $block['attrs']['max_width_desktop'] ) ) {
    $inlineStyles .= 'max-width:' . $block['attrs']['max_width_desktop'] . ';';
}
if ( ! empty( $block['attrs']['min_height_desktop'] ) ) {
    $inlineStyles .= 'min-height:' . $block['attrs']['min_height_desktop'] . ';';
}
if ( ! empty( $block['attrs']['max_height_desktop'] ) ) {
    $inlineStyles .= 'max-height:' . $block['attrs']['max_height_desktop'] . ';';
}
if ( ! empty( $block['attrs']['box_sizing_desktop'] ) ) {
    $inlineStyles .= 'box-sizing:' . $block['attrs']['box_sizing_desktop'] . ';';
}
if ( ! empty( $block['attrs']['visibility_desktop'] ) ) {
    $inlineStyles .= 'visibility:' . $block['attrs']['visibility_desktop'] . ';';
}
if ( ! empty( $block['attrs']['float_desktop'] ) ) {
    $inlineStyles .= 'float:' . $block['attrs']['float_desktop'] . ';';
}
if ( ! empty( $block['attrs']['clear_desktop'] ) ) {
    $inlineStyles .= 'clear:' . $block['attrs']['clear_desktop'] . ';';
}
        if ( ! empty( $block['attrs']['order_desktop'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['order_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['z_index_desktop'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['z_index_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['top_desktop'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['top_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['right_desktop'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['right_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['bottom_desktop'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['bottom_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['left_desktop'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['left_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_position'] ) ) {
            $inlineStyles .= 'position:' . $block['attrs']['desktop_position'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_display'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['desktop_display'] . ';';
        }
        // Flexbox - Desktop
        if ( ! empty( $block['attrs']['desktop_flex_direction'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['desktop_flex_direction'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_justify'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['desktop_justify'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_flexWrap'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['desktop_flexWrap'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_flex_grow'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['desktop_flex_grow'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_shrink_desktop'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['flex_shrink_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_basis_desktop'] ) ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['flex_basis_desktop'] . ';';
        }
if ( ! empty( $block['attrs']['align_items_desktop'] ) ) {
    $inlineStyles .= 'align-items:' . $block['attrs']['align_items_desktop'] . ';';
}
if ( ! empty( $block['attrs']['align_self_desktop'] ) ) {
    $inlineStyles .= 'align-self:' . $block['attrs']['align_self_desktop'] . ';';
}
if ( ! empty( $block['attrs']['align_content_desktop'] ) ) {
    $inlineStyles .= 'align-content:' . $block['attrs']['align_content_desktop'] . ';';
}
if ( ! empty( $block['attrs']['grid_template_columns_desktop'] ) ) {
    $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['grid_template_columns_desktop'] . ', 1fr);';
}

        // Border - Desktop
        if ( ! empty( $block['attrs']['desktop_borderStyle'] ) ) {
            $inlineStyles .= 'border-style:' . $block['attrs']['desktop_borderStyle'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_borderColor'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['desktop_borderColor'] . ';';
        }
        if ( ! empty( $block['attrs']['borderWidth_desktop'] ) ) {
            $inlineStyles .= 'border-width:' . $block['attrs']['borderWidth_desktop'] . ';';
        }

        // Visual Effects - Desktop
if ( ! empty( $block['attrs']['opacity_desktop'] ) ) {
    $inlineStyles .= 'opacity:' . $block['attrs']['opacity_desktop'] . ';';
}
        if ( ! empty( $block['attrs']['transform_desktop'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['transform_desktop'] . ';';
        }
        if ( ! empty( $block['attrs']['transition_desktop'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['transition_desktop'] . ';';
}
if ( ! empty( $block['attrs']['box_shadow_desktop'] ) ) {
    $inlineStyles .= 'box-shadow:' . $block['attrs']['box_shadow_desktop'] . ';';
}
if ( ! empty( $block['attrs']['filter_desktop'] ) ) {
    $inlineStyles .= 'filter:' . $block['attrs']['filter_desktop'] . ';';
}
if ( ! empty( $block['attrs']['cursor_desktop'] ) ) {
    $inlineStyles .= 'cursor:' . $block['attrs']['cursor_desktop'] . ';';
}
if ( ! empty( $block['attrs']['user_select_desktop'] ) ) {
    $inlineStyles .= 'user-select:' . $block['attrs']['user_select_desktop'] . ';';
}
if ( ! empty( $block['attrs']['pointer_events_desktop'] ) ) {
    $inlineStyles .= 'pointer-events:' . $block['attrs']['pointer_events_desktop'] . ';';
}

        // Object-based attributes - Desktop
if ( ! empty( $block['attrs']['desktop_padding']['top'] ) ) {
    $inlineStyles .= 'padding-top:' . $block['attrs']['desktop_padding']['top'] . ';';
}
if ( ! empty( $block['attrs']['desktop_padding']['right'] ) ) {
    $inlineStyles .= 'padding-right:' . $block['attrs']['desktop_padding']['right'] . ';';
}
if ( ! empty( $block['attrs']['desktop_padding']['bottom'] ) ) {
    $inlineStyles .= 'padding-bottom:' . $block['attrs']['desktop_padding']['bottom'] . ';';
}
if ( ! empty( $block['attrs']['desktop_padding']['left'] ) ) {
    $inlineStyles .= 'padding-left:' . $block['attrs']['desktop_padding']['left'] . ';';
}
if ( ! empty( $block['attrs']['desktop_margin']['top'] ) ) {
    $inlineStyles .= 'margin-top:' . $block['attrs']['desktop_margin']['top'] . ';';
}
if ( ! empty( $block['attrs']['desktop_margin']['right'] ) ) {
    $inlineStyles .= 'margin-right:' . $block['attrs']['desktop_margin']['right'] . ';';
}
if ( ! empty( $block['attrs']['desktop_margin']['bottom'] ) ) {
    $inlineStyles .= 'margin-bottom:' . $block['attrs']['desktop_margin']['bottom'] . ';';
}
if ( ! empty( $block['attrs']['desktop_margin']['left'] ) ) {
    $inlineStyles .= 'margin-left:' . $block['attrs']['desktop_margin']['left'] . ';';
}
        if ( ! empty( $block['attrs']['desktop_borderRadius']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['desktop_borderRadius']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_borderRadius']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['desktop_borderRadius']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_borderRadius']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['desktop_borderRadius']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['desktop_borderRadius']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['desktop_borderRadius']['bottomRight'] . ';';
        }
        $inlineStyles .= '}';

        // ================================
        // RESPONSIVE CSS GENERATION - TABLET STYLES
        // ================================
        $inlineStyles .= '@media screen and (max-width: 1024px){ #block_' . $block['attrs']['customId'] . '{';
        
        // Typography - Tablet
        if ( ! empty( $block['attrs']['font_size_tablet'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['font_size_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['line_height_tablet'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['line_height_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['letter_spacing_tablet'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['letter_spacing_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['word_spacing_tablet'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['word_spacing_tablet'] . ';';
        }
if ( ! empty( $block['attrs']['textAlign_tablet'] ) ) {
    $inlineStyles .= 'text-align:' . $block['attrs']['textAlign_tablet'] . ';';
}
if ( ! empty( $block['attrs']['font_weight_tablet'] ) ) {
    $inlineStyles .= 'font-weight:' . $block['attrs']['font_weight_tablet'] . ';';
}
if ( ! empty( $block['attrs']['font_style_tablet'] ) ) {
    $inlineStyles .= 'font-style:' . $block['attrs']['font_style_tablet'] . ';';
}
if ( ! empty( $block['attrs']['text_transform_tablet'] ) ) {
    $inlineStyles .= 'text-transform:' . $block['attrs']['text_transform_tablet'] . ';';
}
if ( ! empty( $block['attrs']['text_decoration_tablet'] ) ) {
    $inlineStyles .= 'text-decoration:' . $block['attrs']['text_decoration_tablet'] . ';';
}
if ( ! empty( $block['attrs']['text_shadow_tablet'] ) ) {
    $inlineStyles .= 'text-shadow:' . $block['attrs']['text_shadow_tablet'] . ';';
}

        // Text and Background colors - Tablet (High Priority)
        if ( ! empty( $block['attrs']['color_tablet'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['color_tablet'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_color_tablet'] ) ) {
            if (strpos($block['attrs']['background_color_tablet'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['background_color_tablet'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['background_color_tablet'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['background_image_tablet'] ) ) {
            $bg_image = $block['attrs']['background_image_tablet'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_size_tablet'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['background_size_tablet'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_position_tablet'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['background_position_tablet'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_repeat_tablet'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['background_repeat_tablet'] . ' !important;';
        }

        // Layout & Positioning - Tablet
        if ( ! empty( $block['attrs']['width_tablet'] ) ) {
            $inlineStyles .= 'width:' . $block['attrs']['width_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['height_tablet'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['height_tablet'] . ';';
        }
if ( ! empty( $block['attrs']['min_width_tablet'] ) ) {
    $inlineStyles .= 'min-width:' . $block['attrs']['min_width_tablet'] . ';';
}
if ( ! empty( $block['attrs']['max_width_tablet'] ) ) {
    $inlineStyles .= 'max-width:' . $block['attrs']['max_width_tablet'] . ';';
}
if ( ! empty( $block['attrs']['min_height_tablet'] ) ) {
    $inlineStyles .= 'min-height:' . $block['attrs']['min_height_tablet'] . ';';
}
if ( ! empty( $block['attrs']['max_height_tablet'] ) ) {
    $inlineStyles .= 'max-height:' . $block['attrs']['max_height_tablet'] . ';';
}
if ( ! empty( $block['attrs']['box_sizing_tablet'] ) ) {
    $inlineStyles .= 'box-sizing:' . $block['attrs']['box_sizing_tablet'] . ';';
}
if ( ! empty( $block['attrs']['visibility_tablet'] ) ) {
    $inlineStyles .= 'visibility:' . $block['attrs']['visibility_tablet'] . ';';
}
if ( ! empty( $block['attrs']['float_tablet'] ) ) {
    $inlineStyles .= 'float:' . $block['attrs']['float_tablet'] . ';';
}
if ( ! empty( $block['attrs']['clear_tablet'] ) ) {
    $inlineStyles .= 'clear:' . $block['attrs']['clear_tablet'] . ';';
}
        if ( ! empty( $block['attrs']['order_tablet'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['order_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['z_index_tablet'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['z_index_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['top_tablet'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['top_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['right_tablet'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['right_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['bottom_tablet'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['bottom_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['left_tablet'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['left_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_position'] ) ) {
            $inlineStyles .= 'position:' . $block['attrs']['tablet_position'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_display'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['tablet_display'] . ';';
        }

        // Flexbox - Tablet
        if ( ! empty( $block['attrs']['tablet_flex_direction'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['tablet_flex_direction'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_justify'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['tablet_justify'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_flexWrap'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['tablet_flexWrap'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_flex_grow'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['tablet_flex_grow'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_shrink_tablet'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['flex_shrink_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_basis_tablet'] ) ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['flex_basis_tablet'] . ';';
        }
if ( ! empty( $block['attrs']['align_items_tablet'] ) ) {
    $inlineStyles .= 'align-items:' . $block['attrs']['align_items_tablet'] . ';';
}
if ( ! empty( $block['attrs']['align_self_tablet'] ) ) {
    $inlineStyles .= 'align-self:' . $block['attrs']['align_self_tablet'] . ';';
}
if ( ! empty( $block['attrs']['align_content_tablet'] ) ) {
    $inlineStyles .= 'align-content:' . $block['attrs']['align_content_tablet'] . ';';
}
if ( ! empty( $block['attrs']['grid_template_columns_tablet'] ) ) {
    $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['grid_template_columns_tablet'] . ', 1fr);';
}

        // Border - Tablet
        if ( ! empty( $block['attrs']['tablet_borderStyle'] ) ) {
            $inlineStyles .= 'border-style:' . $block['attrs']['tablet_borderStyle'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_borderColor'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['tablet_borderColor'] . ';';
        }
        if ( ! empty( $block['attrs']['borderWidth_tablet'] ) ) {
            $inlineStyles .= 'border-width:' . $block['attrs']['borderWidth_tablet'] . ';';
        }

        // Visual Effects - Tablet
if ( ! empty( $block['attrs']['opacity_tablet'] ) ) {
    $inlineStyles .= 'opacity:' . $block['attrs']['opacity_tablet'] . ';';
}
        if ( ! empty( $block['attrs']['transform_tablet'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['transform_tablet'] . ';';
        }
        if ( ! empty( $block['attrs']['transition_tablet'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['transition_tablet'] . ';';
}
if ( ! empty( $block['attrs']['box_shadow_tablet'] ) ) {
    $inlineStyles .= 'box-shadow:' . $block['attrs']['box_shadow_tablet'] . ';';
}
if ( ! empty( $block['attrs']['filter_tablet'] ) ) {
    $inlineStyles .= 'filter:' . $block['attrs']['filter_tablet'] . ';';
}
if ( ! empty( $block['attrs']['cursor_tablet'] ) ) {
    $inlineStyles .= 'cursor:' . $block['attrs']['cursor_tablet'] . ';';
}
if ( ! empty( $block['attrs']['user_select_tablet'] ) ) {
    $inlineStyles .= 'user-select:' . $block['attrs']['user_select_tablet'] . ';';
}
if ( ! empty( $block['attrs']['pointer_events_tablet'] ) ) {
    $inlineStyles .= 'pointer-events:' . $block['attrs']['pointer_events_tablet'] . ';';
}

        // Object-based attributes - Tablet
        if ( ! empty( $block['attrs']['tablet_padding']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['tablet_padding']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_padding']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['tablet_padding']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_padding']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['tablet_padding']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_padding']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['tablet_padding']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_margin']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['tablet_margin']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_margin']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['tablet_margin']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_margin']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['tablet_margin']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_margin']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['tablet_margin']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_borderRadius']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['tablet_borderRadius']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_borderRadius']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['tablet_borderRadius']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_borderRadius']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['tablet_borderRadius']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['tablet_borderRadius']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['tablet_borderRadius']['bottomRight'] . ';';
}

        $inlineStyles .= '} }';
        // ================================
        // RESPONSIVE CSS GENERATION - MOBILE STYLES
        // ================================
        $inlineStyles .= '@media screen and (max-width: 768px){ #block_' . $block['attrs']['customId'] . '{';
        // Typography - Mobile
        if ( ! empty( $block['attrs']['font_size_mobile'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['font_size_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['line_height_mobile'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['line_height_mobile'] . ';';
        }
if ( ! empty( $block['attrs']['letter_spacing_mobile'] ) ) {
    $inlineStyles .= 'letter-spacing:' . $block['attrs']['letter_spacing_mobile'] . ';';
}
        if ( ! empty( $block['attrs']['word_spacing_mobile'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['word_spacing_mobile'] . ';';
        }
if ( ! empty( $block['attrs']['textAlign_mobile'] ) ) {
    $inlineStyles .= 'text-align:' . $block['attrs']['textAlign_mobile'] . ';';
}
if ( ! empty( $block['attrs']['font_weight_mobile'] ) ) {
    $inlineStyles .= 'font-weight:' . $block['attrs']['font_weight_mobile'] . ';';
}
if ( ! empty( $block['attrs']['font_style_mobile'] ) ) {
    $inlineStyles .= 'font-style:' . $block['attrs']['font_style_mobile'] . ';';
}
if ( ! empty( $block['attrs']['text_transform_mobile'] ) ) {
    $inlineStyles .= 'text-transform:' . $block['attrs']['text_transform_mobile'] . ';';
}
if ( ! empty( $block['attrs']['text_decoration_mobile'] ) ) {
    $inlineStyles .= 'text-decoration:' . $block['attrs']['text_decoration_mobile'] . ';';
}
if ( ! empty( $block['attrs']['text_shadow_mobile'] ) ) {
    $inlineStyles .= 'text-shadow:' . $block['attrs']['text_shadow_mobile'] . ';';
}

        // Text and Background colors - Mobile (High Priority)
        if ( ! empty( $block['attrs']['color_mobile'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['color_mobile'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_color_mobile'] ) ) {
            if (strpos($block['attrs']['background_color_mobile'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['background_color_mobile'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['background_color_mobile'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['background_image_mobile'] ) ) {
            $bg_image = $block['attrs']['background_image_mobile'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_size_mobile'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['background_size_mobile'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_position_mobile'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['background_position_mobile'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_repeat_mobile'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['background_repeat_mobile'] . ' !important;';
        }

        // Layout & Positioning - Mobile
        if ( ! empty( $block['attrs']['width_mobile'] ) ) {
            $inlineStyles .= 'width:' . $block['attrs']['width_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['height_mobile'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['height_mobile'] . ';';
        }
if ( ! empty( $block['attrs']['min_width_mobile'] ) ) {
    $inlineStyles .= 'min-width:' . $block['attrs']['min_width_mobile'] . ';';
}
if ( ! empty( $block['attrs']['max_width_mobile'] ) ) {
    $inlineStyles .= 'max-width:' . $block['attrs']['max_width_mobile'] . ';';
}
if ( ! empty( $block['attrs']['min_height_mobile'] ) ) {
    $inlineStyles .= 'min-height:' . $block['attrs']['min_height_mobile'] . ';';
}
if ( ! empty( $block['attrs']['max_height_mobile'] ) ) {
    $inlineStyles .= 'max-height:' . $block['attrs']['max_height_mobile'] . ';';
}
if ( ! empty( $block['attrs']['box_sizing_mobile'] ) ) {
    $inlineStyles .= 'box-sizing:' . $block['attrs']['box_sizing_mobile'] . ';';
}
if ( ! empty( $block['attrs']['visibility_mobile'] ) ) {
    $inlineStyles .= 'visibility:' . $block['attrs']['visibility_mobile'] . ';';
}
if ( ! empty( $block['attrs']['float_mobile'] ) ) {
    $inlineStyles .= 'float:' . $block['attrs']['float_mobile'] . ';';
}
if ( ! empty( $block['attrs']['clear_mobile'] ) ) {
    $inlineStyles .= 'clear:' . $block['attrs']['clear_mobile'] . ';';
}
        if ( ! empty( $block['attrs']['order_mobile'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['order_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['z_index_mobile'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['z_index_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['top_mobile'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['top_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['right_mobile'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['right_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['bottom_mobile'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['bottom_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['left_mobile'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['left_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_position'] ) ) {
            $inlineStyles .= 'position:' . $block['attrs']['mobile_position'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_display'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['mobile_display'] . ';';
        }

        // Flexbox - Mobile
        if ( ! empty( $block['attrs']['mobile_flex_direction'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['mobile_flex_direction'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_justify'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['mobile_justify'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_flexWrap'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['mobile_flexWrap'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_flex_grow'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['mobile_flex_grow'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_shrink_mobile'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['flex_shrink_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_basis_mobile'] ) ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['flex_basis_mobile'] . ';';
        }
if ( ! empty( $block['attrs']['align_items_mobile'] ) ) {
    $inlineStyles .= 'align-items:' . $block['attrs']['align_items_mobile'] . ';';
}
if ( ! empty( $block['attrs']['align_self_mobile'] ) ) {
    $inlineStyles .= 'align-self:' . $block['attrs']['align_self_mobile'] . ';';
}
if ( ! empty( $block['attrs']['align_content_mobile'] ) ) {
    $inlineStyles .= 'align-content:' . $block['attrs']['align_content_mobile'] . ';';
}
if ( ! empty( $block['attrs']['grid_template_columns_mobile'] ) ) {
    $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['grid_template_columns_mobile'] . ', 1fr);';
}

        // Border - Mobile
        if ( ! empty( $block['attrs']['mobile_borderStyle'] ) ) {
            $inlineStyles .= 'border-style:' . $block['attrs']['mobile_borderStyle'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_borderColor'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['mobile_borderColor'] . ';';
        }
        if ( ! empty( $block['attrs']['borderWidth_mobile'] ) ) {
            $inlineStyles .= 'border-width:' . $block['attrs']['borderWidth_mobile'] . ';';
        }

        // Visual Effects - Mobile
if ( ! empty( $block['attrs']['opacity_mobile'] ) ) {
    $inlineStyles .= 'opacity:' . $block['attrs']['opacity_mobile'] . ';';
}
        if ( ! empty( $block['attrs']['transform_mobile'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['transform_mobile'] . ';';
        }
        if ( ! empty( $block['attrs']['transition_mobile'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['transition_mobile'] . ';';
}
if ( ! empty( $block['attrs']['box_shadow_mobile'] ) ) {
    $inlineStyles .= 'box-shadow:' . $block['attrs']['box_shadow_mobile'] . ';';
}
if ( ! empty( $block['attrs']['filter_mobile'] ) ) {
    $inlineStyles .= 'filter:' . $block['attrs']['filter_mobile'] . ';';
}
if ( ! empty( $block['attrs']['cursor_mobile'] ) ) {
    $inlineStyles .= 'cursor:' . $block['attrs']['cursor_mobile'] . ';';
}
if ( ! empty( $block['attrs']['user_select_mobile'] ) ) {
    $inlineStyles .= 'user-select:' . $block['attrs']['user_select_mobile'] . ';';
}
if ( ! empty( $block['attrs']['pointer_events_mobile'] ) ) {
    $inlineStyles .= 'pointer-events:' . $block['attrs']['pointer_events_mobile'] . ';';
}

        // Object-based attributes - Mobile
        if ( ! empty( $block['attrs']['mobile_padding']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['mobile_padding']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_padding']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['mobile_padding']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_padding']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['mobile_padding']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_padding']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['mobile_padding']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_margin']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['mobile_margin']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_margin']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['mobile_margin']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_margin']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['mobile_margin']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_margin']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['mobile_margin']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_borderRadius']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['mobile_borderRadius']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_borderRadius']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['mobile_borderRadius']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_borderRadius']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['mobile_borderRadius']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['mobile_borderRadius']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['mobile_borderRadius']['bottomRight'] . ';';
}

        $inlineStyles .= '} }';
        // ================================
        // RESPONSIVE CSS GENERATION - HOVER STYLES
        // ================================
        $inlineStyles .= '#block_' . $block['attrs']['customId'] . ':hover{';
        
        // Typography - Hover
        if ( ! empty( $block['attrs']['font_size_hover'] ) ) {
            $inlineStyles .= 'font-size:' . $block['attrs']['font_size_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['line_height_hover'] ) ) {
            $inlineStyles .= 'line-height:' . $block['attrs']['line_height_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['letter_spacing_hover'] ) ) {
            $inlineStyles .= 'letter-spacing:' . $block['attrs']['letter_spacing_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['word_spacing_hover'] ) ) {
            $inlineStyles .= 'word-spacing:' . $block['attrs']['word_spacing_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['textAlign_hover'] ) ) {
            $inlineStyles .= 'text-align:' . $block['attrs']['textAlign_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['font_weight_hover'] ) ) {
            $inlineStyles .= 'font-weight:' . $block['attrs']['font_weight_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['font_style_hover'] ) ) {
            $inlineStyles .= 'font-style:' . $block['attrs']['font_style_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['text_transform_hover'] ) ) {
            $inlineStyles .= 'text-transform:' . $block['attrs']['text_transform_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['text_decoration_hover'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['text_decoration_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['text_shadow_hover'] ) ) {
            $inlineStyles .= 'text-shadow:' . $block['attrs']['text_shadow_hover'] . ';';
        }

        // Text and Background colors - Hover (High Priority)
        if ( ! empty( $block['attrs']['color_hover'] ) ) {
            $inlineStyles .= 'color:' . $block['attrs']['color_hover'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_color_hover'] ) ) {
            if (strpos($block['attrs']['background_color_hover'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['background_color_hover'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['background_color_hover'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['background_image_hover'] ) ) {
            $bg_image = $block['attrs']['background_image_hover'];
            if (strpos($bg_image, 'url(') !== 0) {
                $bg_image = 'url(' . $bg_image . ')';
            }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_size_hover'] ) ) {
            $inlineStyles .= 'background-size:' . $block['attrs']['background_size_hover'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_position_hover'] ) ) {
            $inlineStyles .= 'background-position:' . $block['attrs']['background_position_hover'] . ' !important;';
        }
        if ( ! empty( $block['attrs']['background_repeat_hover'] ) ) {
            $inlineStyles .= 'background-repeat:' . $block['attrs']['background_repeat_hover'] . ' !important;';
        }

        // Layout & Positioning - Hover
        if ( ! empty( $block['attrs']['width_hover'] ) ) {
            $inlineStyles .= 'width:' . $block['attrs']['width_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['height_hover'] ) ) {
            $inlineStyles .= 'height:' . $block['attrs']['height_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['min_width_hover'] ) ) {
            $inlineStyles .= 'min-width:' . $block['attrs']['min_width_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['max_width_hover'] ) ) {
            $inlineStyles .= 'max-width:' . $block['attrs']['max_width_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['min_height_hover'] ) ) {
            $inlineStyles .= 'min-height:' . $block['attrs']['min_height_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['max_height_hover'] ) ) {
            $inlineStyles .= 'max-height:' . $block['attrs']['max_height_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['box_sizing_hover'] ) ) {
            $inlineStyles .= 'box-sizing:' . $block['attrs']['box_sizing_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['visibility_hover'] ) ) {
            $inlineStyles .= 'visibility:' . $block['attrs']['visibility_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['float_hover'] ) ) {
            $inlineStyles .= 'float:' . $block['attrs']['float_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['clear_hover'] ) ) {
            $inlineStyles .= 'clear:' . $block['attrs']['clear_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['order_hover'] ) ) {
            $inlineStyles .= 'order:' . $block['attrs']['order_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['z_index_hover'] ) ) {
            $inlineStyles .= 'z-index:' . $block['attrs']['z_index_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['top_hover'] ) ) {
            $inlineStyles .= 'top:' . $block['attrs']['top_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['right_hover'] ) ) {
            $inlineStyles .= 'right:' . $block['attrs']['right_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['bottom_hover'] ) ) {
            $inlineStyles .= 'bottom:' . $block['attrs']['bottom_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['left_hover'] ) ) {
            $inlineStyles .= 'left:' . $block['attrs']['left_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_position'] ) ) {
            $inlineStyles .= 'position:' . $block['attrs']['hover_position'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_display'] ) ) {
            $inlineStyles .= 'display:' . $block['attrs']['hover_display'] . ';';
        }

        // Flexbox - Hover
        if ( ! empty( $block['attrs']['hover_flex_direction'] ) ) {
            $inlineStyles .= 'flex-direction:' . $block['attrs']['hover_flex_direction'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_justify'] ) ) {
            $inlineStyles .= 'justify-content:' . $block['attrs']['hover_justify'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_flexWrap'] ) ) {
            $inlineStyles .= 'flex-wrap:' . $block['attrs']['hover_flexWrap'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_flex_grow'] ) ) {
            $inlineStyles .= 'flex-grow:' . $block['attrs']['hover_flex_grow'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_shrink_hover'] ) ) {
            $inlineStyles .= 'flex-shrink:' . $block['attrs']['flex_shrink_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['flex_basis_hover'] ) ) {
            $inlineStyles .= 'flex-basis:' . $block['attrs']['flex_basis_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['align_items_hover'] ) ) {
            $inlineStyles .= 'align-items:' . $block['attrs']['align_items_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['align_self_hover'] ) ) {
            $inlineStyles .= 'align-self:' . $block['attrs']['align_self_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['align_content_hover'] ) ) {
            $inlineStyles .= 'align-content:' . $block['attrs']['align_content_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['grid_template_columns_hover'] ) ) {
            $inlineStyles .= 'grid-template-columns:repeat(' . $block['attrs']['grid_template_columns_hover'] . ', 1fr);';
        }

        // Border - Hover
        if ( ! empty( $block['attrs']['hover_borderStyle'] ) ) {
            $inlineStyles .= 'border-style:' . $block['attrs']['hover_borderStyle'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_borderColor'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['hover_borderColor'] . ';';
        }
        if ( ! empty( $block['attrs']['borderWidth_hover'] ) ) {
            $inlineStyles .= 'border-width:' . $block['attrs']['borderWidth_hover'] . ';';
        }

        // Visual Effects - Hover
        if ( ! empty( $block['attrs']['opacity_hover'] ) ) {
            $inlineStyles .= 'opacity:' . $block['attrs']['opacity_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['transform_hover'] ) ) {
            $inlineStyles .= 'transform:' . $block['attrs']['transform_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['transition_hover'] ) ) {
            $inlineStyles .= 'transition:' . $block['attrs']['transition_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['box_shadow_hover'] ) ) {
            $inlineStyles .= 'box-shadow:' . $block['attrs']['box_shadow_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['filter_hover'] ) ) {
            $inlineStyles .= 'filter:' . $block['attrs']['filter_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['cursor_hover'] ) ) {
            $inlineStyles .= 'cursor:' . $block['attrs']['cursor_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['user_select_hover'] ) ) {
            $inlineStyles .= 'user-select:' . $block['attrs']['user_select_hover'] . ';';
        }
        if ( ! empty( $block['attrs']['pointer_events_hover'] ) ) {
            $inlineStyles .= 'pointer-events:' . $block['attrs']['pointer_events_hover'] . ';';
        }

        // Object-based attributes - Hover
        if ( ! empty( $block['attrs']['hover_padding']['top'] ) ) {
            $inlineStyles .= 'padding-top:' . $block['attrs']['hover_padding']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_padding']['right'] ) ) {
            $inlineStyles .= 'padding-right:' . $block['attrs']['hover_padding']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_padding']['bottom'] ) ) {
            $inlineStyles .= 'padding-bottom:' . $block['attrs']['hover_padding']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_padding']['left'] ) ) {
            $inlineStyles .= 'padding-left:' . $block['attrs']['hover_padding']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_margin']['top'] ) ) {
            $inlineStyles .= 'margin-top:' . $block['attrs']['hover_margin']['top'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_margin']['right'] ) ) {
            $inlineStyles .= 'margin-right:' . $block['attrs']['hover_margin']['right'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_margin']['bottom'] ) ) {
            $inlineStyles .= 'margin-bottom:' . $block['attrs']['hover_margin']['bottom'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_margin']['left'] ) ) {
            $inlineStyles .= 'margin-left:' . $block['attrs']['hover_margin']['left'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_borderRadius']['topLeft'] ) ) {
            $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['hover_borderRadius']['topLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_borderRadius']['topRight'] ) ) {
            $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['hover_borderRadius']['topRight'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_borderRadius']['bottomLeft'] ) ) {
            $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['hover_borderRadius']['bottomLeft'] . ';';
        }
        if ( ! empty( $block['attrs']['hover_borderRadius']['bottomRight'] ) ) {
            $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['hover_borderRadius']['bottomRight'] . ';';
        }
        
        $inlineStyles .= '}';

        // Custom CSS
        if ( ! empty( $block['attrs']['custom_css'] ) ) {
            $good_id = str_replace( 'this_block', '#block_' . $block['attrs']['customId'], $block['attrs']['custom_css'] );
            $good_id = str_replace( 'block_anchor_', '', $good_id );
            $inlineStyles .= $good_id;
        }

        return $inlineStyles;
    }

    return $block_content ?? '';
}


function stepfox_block_scripts() {
    wp_reset_postdata();
    global $_wp_current_template_content;
    $page_content = get_the_content();
    $full_content = $_wp_current_template_content . $page_content;

    if ( has_blocks( $full_content ) ) {
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        // Get template parts content.
        foreach ( $all_blocks as $block ) {
            $full_content .= get_template_parts_as_content( $block );
        }
        $blocks = parse_blocks( $full_content );
        $all_blocks = search( $blocks, 'blockName' );
        $inline_style = '';
        $inline_script = '';
        wp_register_style( 'stepfox-responsive-style', false );
        wp_enqueue_style( 'stepfox-responsive-style' );

        foreach ( $all_blocks as $block ) {
            if ( ( $block['blockName'] === 'core/block' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ||
                ( $block['blockName'] === 'core/navigation' && isset($block['attrs']) && ! empty( $block['attrs']['ref'] ) ) ) {
                $content = get_post_field( 'post_content', $block['attrs']['ref'] );
                $reusable_blocks = parse_blocks( $content );
                $all_reusable_blocks = search( $reusable_blocks, 'blockName' );
                foreach ( $all_reusable_blocks as $reusable_block ) {
                    $inline_style .= inline_styles_for_blocks( $reusable_block );
                    $inline_script .= inline_scripts_for_blocks( $reusable_block );
                }
            }

            // Process all blocks with inline styles and scripts
            $inline_style .= inline_styles_for_blocks( $block );
            $inline_script .= inline_scripts_for_blocks( $block );
        }

        // Output CSS
        if (!empty($inline_style)) {
            wp_add_inline_style( 'stepfox-responsive-style', $inline_style);
        }

        // Output JavaScript
        if (!empty($inline_script)) {
            wp_register_script( 'myprefix-dummy-js-header', '',);
            wp_enqueue_script( 'myprefix-dummy-js-header' );
            wp_add_inline_script( 'myprefix-dummy-js-header', $inline_script);
        }
    }
}

add_action( 'wp_head', 'stepfox_block_scripts' );

function inline_scripts_for_blocks($block) {
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['attrs']) || !is_array($block['attrs'])) {
        return '';
    }
    
    if(!empty($block['attrs']['custom_js'])) {
        $customId = isset($block['attrs']['customId']) ? $block['attrs']['customId'] : 'default-block-id';
        return str_replace('this_block', '#block_' . $customId, $block['attrs']['custom_js']);
    }
    return '';
}