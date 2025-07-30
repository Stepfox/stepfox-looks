/**
 * Modern Responsive Attributes
 * Defines all responsive attributes for blocks
 */

(function (blocks, editor, element, components, $) {
    
    // Register attributes for all modern responsive properties
    const addModernResponsiveAttributes = (settings) => {
        settings.attributes = {
            ...settings.attributes,
            
            // Desktop attributes - only the ones used in the form
            font_size_desktop: { type: "string", default: "" },
            line_height_desktop: { type: "string", default: "" },
            letter_spacing_desktop: { type: "string", default: "" },
            word_spacing_desktop: { type: "string", default: "" },
            textAlign_desktop: { type: "string", default: "" },
            font_weight_desktop: { type: "string", default: "" },
            font_style_desktop: { type: "string", default: "" },
            text_transform_desktop: { type: "string", default: "" },
            text_decoration_desktop: { type: "string", default: "" },
            text_shadow_desktop: { type: "string", default: "" },
            
            width_desktop: { type: "string", default: "" },
            height_desktop: { type: "string", default: "" },
            min_width_desktop: { type: "string", default: "" },
            max_width_desktop: { type: "string", default: "" },
            min_height_desktop: { type: "string", default: "" },
            max_height_desktop: { type: "string", default: "" },
            box_sizing_desktop: { type: "string", default: "" },
            visibility_desktop: { type: "string", default: "" },
            float_desktop: { type: "string", default: "" },
            clear_desktop: { type: "string", default: "" },
            overflow_desktop: { type: "string", default: "" },
            zoom_desktop: { type: "string", default: "" },
            animation_desktop: { type: "string", default: "" },
            animation_duration_desktop: { type: "string", default: "" },
            animation_delay_desktop: { type: "string", default: "" },
            order_desktop: { type: "string", default: "" },
            z_index_desktop: { type: "string", default: "" },
            top_desktop: { type: "string", default: "" },
            right_desktop: { type: "string", default: "" },
            bottom_desktop: { type: "string", default: "" },
            left_desktop: { type: "string", default: "" },
            
            desktop_position: { type: "string", default: "" },
            desktop_display: { type: "string", default: "" },
            desktop_flex_direction: { type: "string", default: "" },
            desktop_justify: { type: "string", default: "" },
            desktop_flexWrap: { type: "string", default: "" },
            desktop_flex_grow: { type: "string", default: "" },
            flex_shrink_desktop: { type: "string", default: "" },
            flex_basis_desktop: { type: "string", default: "" },
            align_items_desktop: { type: "string", default: "" },
            align_self_desktop: { type: "string", default: "" },
            align_content_desktop: { type: "string", default: "" },
            grid_template_columns_desktop: { type: "string", default: "" },
            
            desktop_padding: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            desktop_margin: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            desktop_borderStyle: { type: "string", default: "" },
            desktop_borderColor: { type: "string", default: "" },
            borderWidth_desktop: { type: "string", default: "" },
            desktop_borderRadius: {
                type: "object",
                default: { topLeft: "", topRight: "", bottomLeft: "", bottomRight: "" },
            },
            
            transform_desktop: { type: "string", default: "" },
            transition_desktop: { type: "string", default: "" },
            box_shadow_desktop: { type: "string", default: "" },
            filter_desktop: { type: "string", default: "" },
            cursor_desktop: { type: "string", default: "" },
            user_select_desktop: { type: "string", default: "" },
            pointer_events_desktop: { type: "string", default: "" },
            opacity_desktop: { type: "string", default: "" },
            
            // Text and Background colors
            color_desktop: { type: "string", default: "" },
            background_color_desktop: { type: "string", default: "" },
            background_image_desktop: { type: "string", default: "" },
            background_size_desktop: { type: "string", default: "" },
            background_position_desktop: { type: "string", default: "" },
            background_repeat_desktop: { type: "string", default: "" },
            
            // Tablet attributes - only the ones used in the form
            font_size_tablet: { type: "string", default: "" },
            line_height_tablet: { type: "string", default: "" },
            letter_spacing_tablet: { type: "string", default: "" },
            word_spacing_tablet: { type: "string", default: "" },
            textAlign_tablet: { type: "string", default: "" },
            font_weight_tablet: { type: "string", default: "" },
            font_style_tablet: { type: "string", default: "" },
            text_transform_tablet: { type: "string", default: "" },
            text_decoration_tablet: { type: "string", default: "" },
            text_shadow_tablet: { type: "string", default: "" },
            
            width_tablet: { type: "string", default: "" },
            height_tablet: { type: "string", default: "" },
            min_width_tablet: { type: "string", default: "" },
            max_width_tablet: { type: "string", default: "" },
            min_height_tablet: { type: "string", default: "" },
            max_height_tablet: { type: "string", default: "" },
            box_sizing_tablet: { type: "string", default: "" },
            visibility_tablet: { type: "string", default: "" },
            float_tablet: { type: "string", default: "" },
            clear_tablet: { type: "string", default: "" },
            overflow_tablet: { type: "string", default: "" },
            zoom_tablet: { type: "string", default: "" },
            animation_tablet: { type: "string", default: "" },
            animation_duration_tablet: { type: "string", default: "" },
            animation_delay_tablet: { type: "string", default: "" },
            order_tablet: { type: "string", default: "" },
            z_index_tablet: { type: "string", default: "" },
            top_tablet: { type: "string", default: "" },
            right_tablet: { type: "string", default: "" },
            bottom_tablet: { type: "string", default: "" },
            left_tablet: { type: "string", default: "" },
            
            tablet_position: { type: "string", default: "" },
            tablet_display: { type: "string", default: "" },
            tablet_flex_direction: { type: "string", default: "" },
            tablet_justify: { type: "string", default: "" },
            tablet_flexWrap: { type: "string", default: "" },
            tablet_flex_grow: { type: "string", default: "" },
            flex_shrink_tablet: { type: "string", default: "" },
            flex_basis_tablet: { type: "string", default: "" },
            align_items_tablet: { type: "string", default: "" },
            align_self_tablet: { type: "string", default: "" },
            align_content_tablet: { type: "string", default: "" },
            grid_template_columns_tablet: { type: "string", default: "" },
            
            tablet_padding: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            tablet_margin: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            tablet_borderStyle: { type: "string", default: "" },
            tablet_borderColor: { type: "string", default: "" },
            borderWidth_tablet: { type: "string", default: "" },
            tablet_borderRadius: {
                type: "object",
                default: { topLeft: "", topRight: "", bottomLeft: "", bottomRight: "" },
            },
            
            transform_tablet: { type: "string", default: "" },
            transition_tablet: { type: "string", default: "" },
            box_shadow_tablet: { type: "string", default: "" },
            filter_tablet: { type: "string", default: "" },
            cursor_tablet: { type: "string", default: "" },
            user_select_tablet: { type: "string", default: "" },
            pointer_events_tablet: { type: "string", default: "" },
            opacity_tablet: { type: "string", default: "" },
            
            // Text and Background colors
            color_tablet: { type: "string", default: "" },
            background_color_tablet: { type: "string", default: "" },
            background_image_tablet: { type: "string", default: "" },
            background_size_tablet: { type: "string", default: "" },
            background_position_tablet: { type: "string", default: "" },
            background_repeat_tablet: { type: "string", default: "" },
            
            // Mobile attributes - only the ones used in the form
            font_size_mobile: { type: "string", default: "" },
            line_height_mobile: { type: "string", default: "" },
            letter_spacing_mobile: { type: "string", default: "" },
            word_spacing_mobile: { type: "string", default: "" },
            textAlign_mobile: { type: "string", default: "" },
            font_weight_mobile: { type: "string", default: "" },
            font_style_mobile: { type: "string", default: "" },
            text_transform_mobile: { type: "string", default: "" },
            text_decoration_mobile: { type: "string", default: "" },
            text_shadow_mobile: { type: "string", default: "" },
            
            width_mobile: { type: "string", default: "" },
            height_mobile: { type: "string", default: "" },
            min_width_mobile: { type: "string", default: "" },
            max_width_mobile: { type: "string", default: "" },
            min_height_mobile: { type: "string", default: "" },
            max_height_mobile: { type: "string", default: "" },
            box_sizing_mobile: { type: "string", default: "" },
            visibility_mobile: { type: "string", default: "" },
            float_mobile: { type: "string", default: "" },
            clear_mobile: { type: "string", default: "" },
            overflow_mobile: { type: "string", default: "" },
            zoom_mobile: { type: "string", default: "" },
            animation_mobile: { type: "string", default: "" },
            animation_duration_mobile: { type: "string", default: "" },
            animation_delay_mobile: { type: "string", default: "" },
            order_mobile: { type: "string", default: "" },
            z_index_mobile: { type: "string", default: "" },
            top_mobile: { type: "string", default: "" },
            right_mobile: { type: "string", default: "" },
            bottom_mobile: { type: "string", default: "" },
            left_mobile: { type: "string", default: "" },
            
            mobile_position: { type: "string", default: "" },
            mobile_display: { type: "string", default: "" },
            mobile_flex_direction: { type: "string", default: "" },
            mobile_justify: { type: "string", default: "" },
            mobile_flexWrap: { type: "string", default: "" },
            mobile_flex_grow: { type: "string", default: "" },
            flex_shrink_mobile: { type: "string", default: "" },
            flex_basis_mobile: { type: "string", default: "" },
            align_items_mobile: { type: "string", default: "" },
            align_self_mobile: { type: "string", default: "" },
            align_content_mobile: { type: "string", default: "" },
            grid_template_columns_mobile: { type: "string", default: "" },
            
            mobile_padding: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            mobile_margin: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            mobile_borderStyle: { type: "string", default: "" },
            mobile_borderColor: { type: "string", default: "" },
            borderWidth_mobile: { type: "string", default: "" },
            mobile_borderRadius: {
                type: "object",
                default: { topLeft: "", topRight: "", bottomLeft: "", bottomRight: "" },
            },
            
            transform_mobile: { type: "string", default: "" },
            transition_mobile: { type: "string", default: "" },
            box_shadow_mobile: { type: "string", default: "" },
            filter_mobile: { type: "string", default: "" },
            cursor_mobile: { type: "string", default: "" },
            user_select_mobile: { type: "string", default: "" },
            pointer_events_mobile: { type: "string", default: "" },
            opacity_mobile: { type: "string", default: "" },
            
            // Text and Background colors
            color_mobile: { type: "string", default: "" },
            background_color_mobile: { type: "string", default: "" },
            background_image_mobile: { type: "string", default: "" },
            background_size_mobile: { type: "string", default: "" },
            background_position_mobile: { type: "string", default: "" },
            background_repeat_mobile: { type: "string", default: "" },
            
            // Hover attributes - only the ones used in the form
            font_size_hover: { type: "string", default: "" },
            line_height_hover: { type: "string", default: "" },
            letter_spacing_hover: { type: "string", default: "" },
            word_spacing_hover: { type: "string", default: "" },
            textAlign_hover: { type: "string", default: "" },
            font_weight_hover: { type: "string", default: "" },
            font_style_hover: { type: "string", default: "" },
            text_transform_hover: { type: "string", default: "" },
            text_decoration_hover: { type: "string", default: "" },
            text_shadow_hover: { type: "string", default: "" },
            
            width_hover: { type: "string", default: "" },
            height_hover: { type: "string", default: "" },
            min_width_hover: { type: "string", default: "" },
            max_width_hover: { type: "string", default: "" },
            min_height_hover: { type: "string", default: "" },
            max_height_hover: { type: "string", default: "" },
            box_sizing_hover: { type: "string", default: "" },
            visibility_hover: { type: "string", default: "" },
            float_hover: { type: "string", default: "" },
            clear_hover: { type: "string", default: "" },
            overflow_hover: { type: "string", default: "" },
            zoom_hover: { type: "string", default: "" },
            animation_hover: { type: "string", default: "" },
            animation_duration_hover: { type: "string", default: "" },
            animation_delay_hover: { type: "string", default: "" },
            order_hover: { type: "string", default: "" },
            z_index_hover: { type: "string", default: "" },
            top_hover: { type: "string", default: "" },
            right_hover: { type: "string", default: "" },
            bottom_hover: { type: "string", default: "" },
            left_hover: { type: "string", default: "" },
            
            hover_position: { type: "string", default: "" },
            hover_display: { type: "string", default: "" },
            hover_flex_direction: { type: "string", default: "" },
            hover_justify: { type: "string", default: "" },
            hover_flexWrap: { type: "string", default: "" },
            hover_flex_grow: { type: "string", default: "" },
            flex_shrink_hover: { type: "string", default: "" },
            flex_basis_hover: { type: "string", default: "" },
            align_items_hover: { type: "string", default: "" },
            align_self_hover: { type: "string", default: "" },
            align_content_hover: { type: "string", default: "" },
            grid_template_columns_hover: { type: "string", default: "" },
            
            hover_padding: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            hover_margin: {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" },
            },
            hover_borderStyle: { type: "string", default: "" },
            hover_borderColor: { type: "string", default: "" },
            borderWidth_hover: { type: "string", default: "" },
            hover_borderRadius: {
                type: "object",
                default: { topLeft: "", topRight: "", bottomLeft: "", bottomRight: "" },
            },
            
            transform_hover: { type: "string", default: "" },
            transition_hover: { type: "string", default: "" },
            box_shadow_hover: { type: "string", default: "" },
            filter_hover: { type: "string", default: "" },
            cursor_hover: { type: "string", default: "" },
            user_select_hover: { type: "string", default: "" },
            pointer_events_hover: { type: "string", default: "" },
            opacity_hover: { type: "string", default: "" },
            
            // Text and Background colors
            color_hover: { type: "string", default: "" },
            background_color_hover: { type: "string", default: "" },
            background_image_hover: { type: "string", default: "" },
            background_size_hover: { type: "string", default: "" },
            background_position_hover: { type: "string", default: "" },
            background_repeat_hover: { type: "string", default: "" },
        };
        return settings;
    };

    // Function to add attributes to all blocks
    const addAttributesToAllBlocks = (settings, name) => {
        // Add responsive attributes to ALL blocks without any exclusions
        return addModernResponsiveAttributes(settings);
    };

    // Register attributes for specific block types to avoid conflicts
    wp.hooks.addFilter("blocks.registerBlockType", "modern-responsive/add-attributes", addAttributesToAllBlocks);

    // Export for use in other modules
    window.ModernResponsiveAttributes = {
        addModernResponsiveAttributes
    };

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);