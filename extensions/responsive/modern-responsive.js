(function (blocks, editor, element, components, $) {
    // Safety check to ensure WordPress components are available
    if (!wp || !wp.element || !wp.components || !wp.blockEditor) {
        // WordPress components not fully loaded yet
        return;
    }

    const { createElement: el, Fragment, useState, useEffect } = wp.element;
    const {
        TextControl,
        __experimentalUnitControl: UnitControl,
        __experimentalNumberControl: NumberControl,
        __experimentalBoxControl: BoxControl,
        SelectControl,
        PanelBody,
        Button,
        ColorPalette,
        ColorPicker,
        Popover,
        __experimentalGradientPicker: GradientPicker,
        __experimentalColorGradientControl: ColorGradientControl,
        GradientPicker: StableGradientPicker,
    } = wp.components;
    
    const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
    
    const { InspectorControls } = wp.blockEditor;

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
            opacity_desktop: { type: "string", default: "" },
            cursor_desktop: { type: "string", default: "" },
            user_select_desktop: { type: "string", default: "" },
            pointer_events_desktop: { type: "string", default: "" },
            
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
            opacity_tablet: { type: "string", default: "" },
            cursor_tablet: { type: "string", default: "" },
            user_select_tablet: { type: "string", default: "" },
            pointer_events_tablet: { type: "string", default: "" },
            
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
            opacity_mobile: { type: "string", default: "" },
            cursor_mobile: { type: "string", default: "" },
            user_select_mobile: { type: "string", default: "" },
            pointer_events_mobile: { type: "string", default: "" },
            
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
            opacity_hover: { type: "string", default: "" },
            cursor_hover: { type: "string", default: "" },
            user_select_hover: { type: "string", default: "" },
            pointer_events_hover: { type: "string", default: "" },
            
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

    // Register attributes for specific block types to avoid conflicts
    const addAttributesToAllBlocks = (settings, name) => {
        // Add responsive attributes to ALL blocks without any exclusions
        return addModernResponsiveAttributes(settings);
    };

    wp.hooks.addFilter("blocks.registerBlockType", "modern-responsive/add-attributes", addAttributesToAllBlocks);

    // Modern CSS styles for the responsive panel
    const modernStyles = `
        .modern-responsive-panel {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            overflow: hidden;
            margin: 0 -16px 0 -16px;
            padding: 0;
            color: #fff !important;
        }
        
        .modern-responsive-panel .components-panel__body {
            border: none;
            background: #2a2a2a;
            border-radius: 6px;
            margin: 4px 8px;
            overflow: hidden;
        }
        
        .modern-responsive-panel .components-panel__body-toggle {
            background: #333 !important;
            color: #fff !important;
            padding: 12px 16px !important;
            border: none !important;
            border-radius: 6px 6px 0 0 !important;
            font-weight: 600 !important;
        }
        
        .modern-responsive-panel .components-panel__body-toggle:hover {
            background: #444 !important;
        }
        
        .modern-responsive-panel .components-panel__body-content {
            background: #2a2a2a !important;
            padding: 16px !important;
            border-radius: 0 0 6px 6px !important;
        }
        
        .modern-responsive-panel * {
            color: #fff !important;
        }
        
        .device-header {
            background: linear-gradient(135deg, #2b3048 0%, #263a64 50%, #764ba2 100%);
            padding: 12px 16px;
            text-align: center;
        }
        
        .device-title {
            font-size: 1.4em;
            font-weight: 700;
            margin: 0 0 16px 0;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: white;
        }
        
        .device-tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            justify-content: center;
            max-width: 320px;
            margin: 12px auto;
            padding: 8px;
        }
        
        .device-tab {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            color: white;
            font-size: 12px;
            text-transform:uppercase;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.16s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 28px;
            line-height: 1;
            position: relative;
            top: 0;
            user-select: none;
        }
        
        /* Desktop tab - Blue */
        .device-tab:nth-child(1) {
            background: #239dab;
            box-shadow: 0px 6px 0px 0px #1d7f8a, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(1):active {
            box-shadow: 0px 3px 0px 0px #1d7f8a;
            top: 3px;
        }
        
        .device-tab:nth-child(1).active {
            background: #1d7f8a;
            box-shadow: 0px 3px 0px 0px #155961, 0px 0px 15px 3px rgba(29, 127, 138, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Tablet tab - Purple */
        .device-tab:nth-child(2) {
            background: #8e44ad;
            box-shadow: 0px 6px 0px 0px #732d91, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(2):active {
            box-shadow: 0px 3px 0px 0px #732d91;
            top: 3px;
        }
        
        .device-tab:nth-child(2).active {
            background: #732d91;
            box-shadow: 0px 3px 0px 0px #5b2371, 0px 0px 15px 3px rgba(115, 45, 145, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Mobile tab - Green */
        .device-tab:nth-child(3) {
            background: #27ae60;
            box-shadow: 0px 6px 0px 0px #229954, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(3):active {
            box-shadow: 0px 3px 0px 0px #229954;
            top: 3px;
        }
        
        .device-tab:nth-child(3).active {
            background: #229954;
            box-shadow: 0px 3px 0px 0px #1e7e4a, 0px 0px 15px 3px rgba(34, 153, 84, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Hover tab - Red */
        .device-tab:nth-child(4) {
            background: #d03651;
            box-shadow: 0px 6px 0px 0px #a72b41, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(4):active {
            box-shadow: 0px 3px 0px 0px #a72b41;
            top: 3px;
        }
        
        .device-tab:nth-child(4).active {
            background: #a72b41;
            box-shadow: 0px 3px 0px 0px #8b2237, 0px 0px 15px 3px rgba(167, 43, 65, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .device-tab-icon {
            font-size: 16px;
            opacity: 1;
        }
        
        .device-tab-counter {
            animation: counterPulse 0.3s ease-in-out;
            transition: all 0.2s ease;
            position: absolute;
            top: -8px;
            right: -8px;
            background: #fff !important;
            color: #333 !important;
            border: 2px solid #333 !important;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        
        .device-tab-counter:hover {
            transform: scale(1.1);
        }
        
        @keyframes counterPulse {
            0% { opacity: 0; transform: scale(0.8); }
            50% { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .modern-responsive-panel .components-panel__body-toggle span[style*="background: #667eea"] {
            animation: counterPulse 0.3s ease-in-out;
            transition: all 0.2s ease;
        }
        
        .modern-responsive-panel .components-panel__body-toggle span[style*="background: #667eea"]:hover {
            transform: scale(1.1);
        }
        
        .content-area {
            padding: 0;
        }
        
        .property-group {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 0;
            margin-bottom: 4px;
            transition: all 0.3s ease;
            clear: both;
            overflow: hidden;
        }
        
        .property-group:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(103, 126, 234, 0.3);
        }
        
        .group-header {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin: 0;
            padding: 8px 12px;
            border-bottom: 1px solid #444;
            background: #333;
            min-height: 40px;
        }
        
        .group-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            flex-shrink: 0;
        }
        
        .group-title {
            font-size: 0.9em;
            font-weight: 600;
            margin: 0;
            color: #fff !important;
            letter-spacing: 0.3px;
            line-height: 1.2;
            display: flex;
            align-items: center;
        }
        
        .input-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 0;
            padding: 8px 0px;
            align-items: start;
        }
        
        .input-row > * {
            min-width: 0;
        }
        
        .input-row.single {
            grid-template-columns: 1fr;
        }
        
        .input-row .components-base-control {
            margin-bottom: 0 !important;
        }
        
        .input-row .components-base-control .components-base-control__label {
            color: #fff !important;
            font-size: 11px !important;
            margin-bottom: 4px !important;
        }
        
        .modern-responsive-panel .components-select-control__input,
        .modern-responsive-panel .components-text-control__input,
        .modern-responsive-panel .components-unit-control__input,
        .modern-responsive-panel .components-number-control__input,
        .modern-responsive-panel input[type="text"],
        .modern-responsive-panel input[type="number"],
        .modern-responsive-panel select {
            background: #2a2a2a !important;
            border: 1px solid #555 !important;
            border-radius: 4px !important;
            color: #fff !important;
            padding: 8px 10px !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
            height: auto !important;
            min-height: 32px !important;
        }
        
        .modern-responsive-panel .components-select-control__input:focus,
        .modern-responsive-panel .components-text-control__input:focus,
        .modern-responsive-panel .components-unit-control__input:focus,
        .modern-responsive-panel .components-number-control__input:focus,
        .modern-responsive-panel input:focus,
        .modern-responsive-panel select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
            outline: none !important;
        }
        
        .modern-responsive-panel .components-button {
            color: #fff !important;
        }
        
        .modern-responsive-panel .components-unit-control {
            margin-bottom: 8px;
        }
        
        .modern-responsive-panel .components-unit-control__select {
            background: #2a2a2a !important;
            border: 1px solid #555 !important;
            border-left: none !important;
            border-radius: 0 4px 4px 0 !important;
            color: #fff !important;
            font-size: 10px !important;
            padding: 4px 4px !important;
            min-height: 32px !important;
        }
        
        .modern-responsive-panel .components-unit-control__input {
            border-radius: 4px 0 0 4px !important;
        }
        
        .modern-responsive-panel .components-unit-control__select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
            outline: none !important;
        }
        
        .modern-responsive-panel .components-number-control {
            margin-bottom: 8px;
        }
        
        .modern-responsive-panel .components-number-control__input {
            width: 100% !important;
        }
        
        .modern-responsive-panel .components-select-control {
            margin-bottom: 8px;
        }
        
        .modern-responsive-panel .components-text-control {
            margin-bottom: 8px;
        }
        
        .modern-responsive-panel .components-box-control__input-controls-wrapper input,
        .modern-responsive-panel .components-box-control input {
            background: #2a2a2a !important;
            border: 1px solid #555 !important;
            border-radius: 4px !important;
            color: #fff !important;
            padding: 6px 8px !important;
            font-size: 13px !important;
            min-height: 28px !important;
        }
        
        .modern-responsive-panel .components-box-control__input-controls-wrapper input:focus,
        .modern-responsive-panel .components-box-control input:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 1px #667eea !important;
        }
        
        .modern-responsive-panel .components-box-control__label {
            color: #fff !important;
        }
        
        .reset-btn-modern {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 0.85em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .reset-btn-modern:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }
        
        .color-picker-section {
            margin: 0;
            background: #333;
            border-radius: 6px;
            padding: 12px;
        }
        
        .color-picker-header {
            text-align: center;
            margin-bottom: 12px;
        }
        
        .color-picker-label {
            color: #ccc !important;
            font-size: 12px;
            font-weight: 400;
        }
        
        .color-picker-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
            justify-items: center;
        }
        
        .color-swatch {
            width: 24px;
            height: 24px;
            border-radius: 3px;
            border: 1px solid #555;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .color-swatch:hover {
            transform: scale(1.05);
            border-color: #888;
        }
        
        .color-swatch.selected {
            border-color: #fff;
            box-shadow: 0 0 0 2px #667eea;
        }
        
        .color-swatch.clear-color {
            position: relative;
        }
        
        .color-swatch.clear-color::after {
            content: '×';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #333;
            font-size: 14px;
            font-weight: bold;
        }
        
        .border-radius-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 0;
            padding: 8px 12px;
        }
        
        .custom-color-picker {
            margin: 12px 0 0 0;
            padding: 12px;
            background: #333;
            border-radius: 6px;
        }
        
        .custom-color-picker .color-picker-label {
            color: #ccc !important;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 8px;
            display: block;
        }
        
        .custom-color-picker .components-color-palette {
            margin: 0;
        }
        
        .custom-color-picker .components-color-palette__item {
            border-radius: 3px !important;
            margin: 2px !important;
        }
        
        .custom-color-picker .components-color-palette__custom-color {
            border-radius: 3px !important;
            border: 1px solid #555 !important;
        }
        
        .color-section {
            margin-bottom: 16px;
        }
        
        .color-section-title {
            font-size: 12px;
            font-weight: 600;
            color: #fff !important;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .media-upload-wrapper {
            width: 100%;
        }
        
        .media-upload-wrapper .components-base-control__label {
            color: #fff !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            margin-bottom: 8px !important;
            display: block;
        }
        
        .image-selector-container {
            background: #333;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 12px;
            text-align: center;
        }
        
        .image-buttons {
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        
        .image-buttons .components-button {
            font-size: 12px !important;
        }
        
        .background-control-wrapper {
            width: 100%;
        }
        
        .background-control-wrapper .components-base-control__label {
            color: #fff !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            margin-bottom: 8px !important;
            display: block;
        }
        
        .background-control-wrapper .components-color-gradient-control {
            background: #333 !important;
            border: 1px solid #555 !important;
            border-radius: 4px !important;
        }
        
        .background-control-wrapper .components-color-gradient-control .components-tab-panel__tabs {
            background: #333 !important;
            border-bottom: 1px solid #555 !important;
        }
        
        .background-control-wrapper .components-color-gradient-control .components-tab-panel__tab {
            color: #fff !important;
            background: transparent !important;
            border: none !important;
        }
        
        .background-control-wrapper .components-color-gradient-control .components-tab-panel__tab.is-active {
            background: #667eea !important;
            color: #fff !important;
        }
        
        .background-control-wrapper .components-color-gradient-control .components-color-palette,
        .background-control-wrapper .components-color-gradient-control .components-custom-gradient-picker {
            background: #333 !important;
            padding: 12px !important;
        }
        
        .background-control-wrapper .components-color-gradient-control .components-gradient-picker {
            background: #333 !important;
        }
        
        .wp-background-picker-tabs {
            background: #333 !important;
            border: 1px solid #555 !important;
            border-radius: 4px !important;
            margin: 10px -16px;
            padding: 12px !important;
        }
        
        .wp-tab-buttons {
            display: flex;
            margin-bottom: 12px;
            border-bottom: 1px solid #555 !important;
        }
        
        .wp-tab-btn {
            background: transparent !important;
            border: none !important;
            color: #fff !important;
            padding: 8px 16px !important;
            cursor: pointer !important;
            border-radius: 4px 4px 0 0 !important;
            transition: background-color 0.2s ease !important;
        }
        
        .wp-tab-btn:hover {
            background: #444 !important;
        }
        
        .wp-tab-btn.active {
            background: #667eea !important;
            color: #fff !important;
        }
        
        .wp-tab-content {
            margin-top: 8px;
        }
        
        .wp-background-picker-tabs .components-custom-gradient-picker {
            background: transparent !important;
        }
        
        .wp-background-picker-tabs .components-gradient-picker {
            background: #333 !important;
            border: 1px solid #555 !important;
            border-radius: 4px !important;
            padding: 8px !important;
        }
        
        .wp-background-picker-tabs .components-custom-gradient-picker .components-custom-gradient-picker__gradient-bar {
            margin-bottom: 12px !important;
        }
        
        .wp-background-picker-tabs .components-custom-gradient-picker .components-custom-gradient-picker__ui-line {
            background: #444 !important;
            padding: 8px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
        }
        
        .wp-background-picker-tabs .components-circular-option-picker__option {
            border: 2px solid #555 !important;
        }
        
        .wp-background-picker-tabs .components-circular-option-picker__option[aria-selected="true"] {
            border: 2px solid #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3) !important;
        }
        
        .wp-background-picker-tabs .components-circular-option-picker__option:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        }
        

        
        /* Proper fix: Make text transparent to show gradients */
        .wp-background-picker-tabs .components-circular-option-picker__option {
            border: 2px solid #555 !important;
            color: transparent !important;
        }
        
        .wp-background-picker-tabs .components-circular-option-picker__option[aria-selected="true"] {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3) !important;
        }
        
        .wp-background-picker-tabs .components-circular-option-picker__option:hover {
            transform: scale(1.05) !important;
        }
        

        
        .wp-background-picker-tabs .components-text-control__input {
            background: #444 !important;
            border: 1px solid #666 !important;
            color: #fff !important;
            font-family: monospace !important;
            font-size: 12px !important;
        }
        
        .gradient-fallback {
            margin-top: 8px;
        }
        
        .gradient-presets {
            margin-bottom: 12px;
        }
        
        .preset-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 8px;
        }
        
        .preset-swatch {
            transition: all 0.2s ease !important;
        }
        
        .preset-swatch:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        }
        
        .preset-swatch.selected {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3) !important;
        }
    `;

    // Add styles to head
    if (!document.getElementById('modern-responsive-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modern-responsive-styles';
        styleSheet.textContent = modernStyles;
        document.head.appendChild(styleSheet);
    }

    const ModernResponsiveControls = (props) => {
        const [activeDevice, setActiveDevice] = useState('desktop');
        const [selectedColor, setSelectedColor] = useState('');
        const [showColorPicker, setShowColorPicker] = useState(false);
        const [hasClipboard, setHasClipboard] = useState(false);

        const colorOptions = [
            '#667eea', '#764ba2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'
        ];
        
        const gradientOptions = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        ];

        // Update selected color when device changes or component mounts
        useEffect(() => {
            const currentBorderColor = getAttribute('borderColor');
            setSelectedColor(currentBorderColor || '');
        }, [activeDevice]); // Removed props.attributes to prevent constant re-runs

        // Check for clipboard data on component mount and when needed
        useEffect(() => {
            const checkClipboard = () => {
                setHasClipboard(hasCopiedStyles());
            };
            
            checkClipboard();
            
            // Also check every few seconds to detect changes from other components
            const interval = setInterval(checkClipboard, 2000);
            
            return () => clearInterval(interval);
        }, []);

        const getAttribute = (property) => {
            try {
                let key;
                // Use old naming convention - mixed format based on property type
                // Object properties: device_property (desktop_padding, desktop_position)
                // Simple properties: property_device (font_size_desktop, width_desktop)
                
                const objectProperties = ['padding', 'margin', 'borderRadius', 'position', 'display', 'borderStyle', 'borderColor'];
                
                const flexProperties = ['flex_direction', 'justify', 'flex_grow', 'flexWrap'];
                
                if (objectProperties.includes(property)) {
                    // Use device_property format for complex properties
                    if (activeDevice === 'desktop') {
                        key = `desktop_${property}`;
                    } else if (activeDevice === 'hover') {
                        key = `hover_${property}`;
                    } else {
                        key = `${activeDevice}_${property}`;
                    }
                } else if (flexProperties.includes(property)) {
                    // Special handling for flex properties that use device_property format
                    if (activeDevice === 'desktop') {
                        key = `desktop_${property}`;
                    } else if (activeDevice === 'hover') {
                        key = `hover_${property}`;
                    } else {
                        key = `${activeDevice}_${property}`;
                    }
                } else {
                    // Use property_device format for simple properties
                    if (activeDevice === 'desktop') {
                        key = `${property}_desktop`;
                    } else if (activeDevice === 'hover') {
                        key = `${property}_hover`;
                    } else {
                        key = `${property}_${activeDevice}`;
                    }
                }
                
                const value = props.attributes?.[key];
                
                // Return appropriate defaults for object-based properties
                if (property === 'padding' || property === 'margin') {
                    return value || { top: '', left: '', right: '', bottom: '' };
                }
                
                return value || '';
            } catch (error) {
                console.warn('Error getting attribute:', property, error);
                // Return appropriate defaults for object-based properties even in error cases
                if (property === 'padding' || property === 'margin') {
                    return { top: '', left: '', right: '', bottom: '' };
                }
                return '';
            }
        };

        const setAttribute = (property, value) => {
            try {
                let key;
                // Use old naming convention - mixed format based on property type
                // Object properties: device_property (desktop_padding, desktop_position)
                // Simple properties: property_device (font_size_desktop, width_desktop)
                
                const objectProperties = ['padding', 'margin', 'borderRadius', 'position', 'display', 'borderStyle', 'borderColor'];
                const flexProperties = ['flex_direction', 'justify', 'flex_grow', 'flexWrap'];
                
                if (objectProperties.includes(property)) {
                    // Use device_property format for complex properties
                    if (activeDevice === 'desktop') {
                        key = `desktop_${property}`;
                    } else if (activeDevice === 'hover') {
                        key = `hover_${property}`;
                    } else {
                        key = `${activeDevice}_${property}`;
                    }
                } else if (flexProperties.includes(property)) {
                    // Special handling for flex properties that use device_property format
                    if (activeDevice === 'desktop') {
                        key = `desktop_${property}`;
                    } else if (activeDevice === 'hover') {
                        key = `hover_${property}`;
                    } else {
                        key = `${activeDevice}_${property}`;
                    }
                } else {
                    // Use property_device format for simple properties
                    if (activeDevice === 'desktop') {
                        key = `${property}_desktop`;
                    } else if (activeDevice === 'hover') {
                        key = `${property}_hover`;
                    } else {
                        key = `${property}_${activeDevice}`;
                    }
                }
                // Setting attribute for responsive control
                
                // Auto-generate customId if it doesn't exist and we're setting a responsive attribute
                const updates = { [key]: value };
                if (!props.attributes.customId && value && value !== '') {
                    updates.customId = props.clientId.replace(/-/g, '').substring(0, 8);
                }
                
                if (props.setAttributes) {
                    props.setAttributes(updates);
                }
            } catch (error) {
                console.warn('Error setting attribute:', property, error);
            }
        };

        const getBorderRadius = () => {
            try {
                let key;
                // Use old naming convention: device_borderRadius format (already correct)
                if (activeDevice === 'desktop') {
                    key = 'desktop_borderRadius';
                } else if (activeDevice === 'hover') {
                    key = 'hover_borderRadius';
                } else {
                    key = `${activeDevice}_borderRadius`;
                }
                return props.attributes?.[key] || { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
            } catch (error) {
                console.warn('Error getting border radius:', error);
                return { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
            }
        };

        const setBorderRadius = (corner, value) => {
            try {
                let key;
                // Use old naming convention: device_borderRadius format (already correct)
                if (activeDevice === 'desktop') {
                    key = 'desktop_borderRadius';
                } else if (activeDevice === 'hover') {
                    key = 'hover_borderRadius';
                } else {
                    key = `${activeDevice}_borderRadius`;
                }
                const current = props.attributes?.[key] || {};
                if (props.setAttributes) {
                    props.setAttributes({ 
                        [key]: { ...current, [corner]: value }
                    });
                }
            } catch (error) {
                console.warn('Error setting border radius:', error);
            }
        };

        // Count non-empty attributes for each sub-panel category
        const countPanelAttributes = (panelType) => {
            const attributes = props.attributes || {};
            let count = 0;
            
            const panelAttributeMap = {
                'layout': [
                    'position', 'display', 'width', 'height', 'min_width', 'max_width', 
                    'min_height', 'max_height', 'box_sizing', 'visibility', 'float', 'clear',
                    'z_index', 'order', 'top', 'right', 'bottom', 'left'
                ],
                'typography': [
                    'font_size', 'line_height', 'letter_spacing', 'word_spacing', 'textAlign',
                    'font_weight', 'font_style', 'text_transform', 'text_decoration', 'text_shadow', 'color'
                ],
                'spacing': ['padding', 'margin'],
                'borders': ['borderStyle', 'borderWidth', 'borderColor'],
                'borderRadius': ['borderRadius'],
                'background': [
                    'background_color', 'background_image', 'background_size', 
                    'background_position', 'background_repeat'
                ],
                'advanced': [
                    'flex_direction', 'justify', 'flexWrap', 'flex_grow', 'align_items', 
                    'align_self', 'align_content', 'transform', 'transition', 'box_shadow', 
                    'filter', 'opacity', 'cursor', 'user_select', 'pointer_events'
                ]
            };
            
            const attributesToCheck = panelAttributeMap[panelType] || [];
            
            attributesToCheck.forEach(prop => {
                const objectProperties = ['padding', 'margin', 'borderRadius', 'position', 'display'];
                const flexProperties = ['flex_direction', 'justify', 'flexWrap'];
                
                let key;
                if (objectProperties.includes(prop) || flexProperties.includes(prop)) {
                    // Use device_property format for complex properties
                    if (activeDevice === 'desktop') {
                        key = `desktop_${prop}`;
                    } else if (activeDevice === 'hover') {
                        key = `hover_${prop}`;
                    } else {
                        key = `${activeDevice}_${prop}`;
                    }
                } else {
                    // Use property_device format for simple properties
                    if (activeDevice === 'desktop') {
                        key = `${prop}_desktop`;
                    } else if (activeDevice === 'hover') {
                        key = `${prop}_hover`;
                    } else {
                        key = `${prop}_${activeDevice}`;
                    }
                }
                
                const value = attributes[key];
                if (value) {
                    // For object properties, count if any sub-property has a value
                    if (typeof value === 'object') {
                        const hasValue = Object.values(value).some(v => v && v !== '');
                        if (hasValue) count++;
                    } else if (value !== '') {
                        count++;
                    }
                }
            });
            
            return count;
        };

        // Count non-empty attributes for each device  
        const countDeviceAttributes = (device) => {
            const attributes = props.attributes || {};
            let count = 0;
            
            // Define all possible attribute patterns for counting
            const simpleProperties = [
                'font_size', 'line_height', 'letter_spacing', 'word_spacing', 'textAlign',
                'font_weight', 'font_style', 'text_transform', 'text_decoration', 'text_shadow', 'color',
                'width', 'height', 'min_width', 'max_width', 'min_height', 'max_height',
                'box_sizing', 'visibility', 'float', 'clear', 'z_index', 'order',
                'top', 'right', 'bottom', 'left', 'borderStyle', 'borderWidth', 'borderColor',
                'flex_grow', 'align_items', 'align_self', 'align_content', 'grid_template_columns',
                'transform', 'transition', 'box_shadow', 'filter', 'opacity', 'cursor',
                'user_select', 'pointer_events', 'background_color', 'background_image', 
                'background_size', 'background_position', 'background_repeat'
            ];
            
            const objectProperties = ['padding', 'margin', 'borderRadius', 'position', 'display'];
            const flexProperties = ['flex_direction', 'justify', 'flexWrap'];
            
            // Count simple properties (property_device format)
            simpleProperties.forEach(prop => {
                let key;
                if (device === 'desktop') {
                    key = `${prop}_desktop`;
                } else if (device === 'hover') {
                    key = `${prop}_hover`;
                } else {
                    key = `${prop}_${device}`;
                }
                
                if (attributes[key] && attributes[key] !== '') {
                    count++;
                }
            });
            
            // Count object properties (device_property format)
            [...objectProperties, ...flexProperties].forEach(prop => {
                let key;
                if (device === 'desktop') {
                    key = `desktop_${prop}`;
                } else if (device === 'hover') {
                    key = `hover_${prop}`;
                } else {
                    key = `${device}_${prop}`;
                }
                
                const value = attributes[key];
                if (value) {
                    // For object properties, count if any sub-property has a value
                    if (typeof value === 'object') {
                        const hasValue = Object.values(value).some(v => v && v !== '');
                        if (hasValue) count++;
                    } else if (value !== '') {
                        count++;
                    }
                }
            });
            
            return count;
        };

        // Reset all attributes for a specific device
        const resetDeviceAttributes = (device) => {
            const attributes = props.attributes || {};
            const updates = {};
            
            // All properties that can have responsive versions
            const simpleProperties = [
                'font_size', 'line_height', 'letter_spacing', 'word_spacing', 'textAlign',
                'font_weight', 'font_style', 'text_transform', 'text_decoration', 'text_shadow', 'color',
                'width', 'height', 'min_width', 'max_width', 'min_height', 'max_height',
                'box_sizing', 'visibility', 'float', 'clear', 'z_index', 'order',
                'top', 'right', 'bottom', 'left', 'borderStyle', 'borderWidth', 'borderColor',
                'flex_grow', 'align_items', 'align_self', 'align_content', 'grid_template_columns',
                'transform', 'transition', 'box_shadow', 'filter', 'opacity', 'cursor',
                'user_select', 'pointer_events', 'background_color', 'background_image', 
                'background_size', 'background_position', 'background_repeat'
            ];
            
            const objectProperties = ['padding', 'margin', 'borderRadius', 'position', 'display'];
            const flexProperties = ['flex_direction', 'justify', 'flexWrap'];
            
            // Reset simple properties (property_device format)
            simpleProperties.forEach(prop => {
                let key;
                if (device === 'desktop') {
                    key = `${prop}_desktop`;
                } else if (device === 'hover') {
                    key = `${prop}_hover`;
                } else {
                    key = `${prop}_${device}`;
                }
                updates[key] = '';
            });
            
            // Reset object properties (device_property format)
            [...objectProperties, ...flexProperties].forEach(prop => {
                let key;
                if (device === 'desktop') {
                    key = `desktop_${prop}`;
                } else if (device === 'hover') {
                    key = `hover_${prop}`;
                } else {
                    key = `${device}_${prop}`;
                }
                
                // For object properties, reset to default object
                if (objectProperties.includes(prop)) {
                    if (prop === 'padding' || prop === 'margin') {
                        updates[key] = { top: '', left: '', right: '', bottom: '' };
                    } else if (prop === 'borderRadius') {
                        updates[key] = { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                    } else {
                        updates[key] = '';
                    }
                } else {
                    updates[key] = '';
                }
            });
            
            // Apply all updates at once
            if (props.setAttributes) {
                props.setAttributes(updates);
            }
        };

        // Reset attributes for a specific panel category on current device
        const resetPanelAttributes = (panelType) => {
            const attributes = props.attributes || {};
            const updates = {};
            
            const panelAttributeMap = {
                'layout': [
                    'position', 'display', 'width', 'height', 'min_width', 'max_width', 
                    'min_height', 'max_height', 'box_sizing', 'visibility', 'float', 'clear',
                    'z_index', 'order', 'top', 'right', 'bottom', 'left', 'grid_template_columns'
                ],
                'typography': [
                    'font_size', 'line_height', 'letter_spacing', 'word_spacing', 'textAlign',
                    'font_weight', 'font_style', 'text_transform', 'text_decoration', 'text_shadow', 'color'
                ],
                'spacing': ['padding', 'margin'],
                'borders': ['borderStyle', 'borderWidth', 'borderColor'],
                'borderRadius': ['borderRadius'],
                'background': [
                    'background_color', 'background_image', 'background_size', 
                    'background_position', 'background_repeat'
                ],
                'advanced': [
                    'flex_direction', 'justify', 'flexWrap', 'flex_grow', 'align_items', 
                    'align_self', 'align_content', 'transform', 'transition', 'box_shadow', 
                    'filter', 'opacity', 'cursor', 'user_select', 'pointer_events'
                ]
            };
            
            const attributesToReset = panelAttributeMap[panelType] || [];
            
            attributesToReset.forEach(prop => {
                const objectProperties = ['padding', 'margin', 'borderRadius', 'position', 'display'];
                const flexProperties = ['flex_direction', 'justify', 'flexWrap'];
                
                let key;
                if (objectProperties.includes(prop) || flexProperties.includes(prop)) {
                    // Use device_property format for complex properties
                    if (activeDevice === 'desktop') {
                        key = `desktop_${prop}`;
                    } else if (activeDevice === 'hover') {
                        key = `hover_${prop}`;
                    } else {
                        key = `${activeDevice}_${prop}`;
                    }
                } else {
                    // Use property_device format for simple properties
                    if (activeDevice === 'desktop') {
                        key = `${prop}_desktop`;
                    } else if (activeDevice === 'hover') {
                        key = `${prop}_hover`;
                    } else {
                        key = `${prop}_${activeDevice}`;
                    }
                }
                
                // For object properties, reset to default object
                if (objectProperties.includes(prop)) {
                    if (prop === 'padding' || prop === 'margin') {
                        updates[key] = { top: '', left: '', right: '', bottom: '' };
                    } else if (prop === 'borderRadius') {
                        updates[key] = { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                    } else {
                        updates[key] = '';
                    }
                } else {
                    updates[key] = '';
                }
            });
            
            // Apply all updates at once
            if (props.setAttributes) {
                props.setAttributes(updates);
            }
        };

        // Copy all responsive styles from the current block
        const copyAllStyles = () => {
            const attributes = props.attributes || {};
            const stylesToCopy = {};
            
            // All responsive attributes that can be copied
            const allResponsiveProperties = [
                // Simple properties that use property_device format
                'font_size', 'line_height', 'letter_spacing', 'word_spacing', 'textAlign',
                'font_weight', 'font_style', 'text_transform', 'text_decoration', 'text_shadow',
                'width', 'height', 'min_width', 'max_width', 'min_height', 'max_height',
                'box_sizing', 'visibility', 'float', 'clear', 'z_index', 'order',
                'top', 'right', 'bottom', 'left', 'borderWidth', 'transform', 'transition',
                'box_shadow', 'filter', 'opacity', 'cursor', 'user_select', 'pointer_events',
                'color', 'background_color', 'background_image', 'background_size',
                'background_position', 'background_repeat', 'grid_template_columns',
                'flex_grow', 'align_items', 'align_self', 'align_content'
            ];
            
            // Object properties that use device_property format
            const objectProperties = [
                'padding', 'margin', 'borderRadius', 'position', 'display', 
                'borderStyle', 'borderColor', 'flex_direction', 'justify', 'flexWrap'
            ];
            
            const devices = ['desktop', 'tablet', 'mobile', 'hover'];
            
            // Copy simple properties for all devices
            devices.forEach(device => {
                allResponsiveProperties.forEach(prop => {
                    let key;
                    if (device === 'desktop') {
                        key = `${prop}_desktop`;
                    } else if (device === 'hover') {
                        key = `${prop}_hover`;
                    } else {
                        key = `${prop}_${device}`;
                    }
                    
                    if (attributes[key] && attributes[key] !== '') {
                        stylesToCopy[key] = attributes[key];
                    }
                });
                
                // Copy object properties for all devices
                objectProperties.forEach(prop => {
                    let key;
                    if (device === 'desktop') {
                        key = `desktop_${prop}`;
                    } else if (device === 'hover') {
                        key = `hover_${prop}`;
                    } else {
                        key = `${device}_${prop}`;
                    }
                    
                    const value = attributes[key];
                    if (value) {
                        // For object properties, only copy if they have actual values
                        if (typeof value === 'object') {
                            const hasValue = Object.values(value).some(v => v && v !== '');
                            if (hasValue) {
                                stylesToCopy[key] = { ...value };
                            }
                        } else if (value !== '') {
                            stylesToCopy[key] = value;
                        }
                    }
                });
            });
            
            // Store in localStorage with timestamp
            const copyData = {
                styles: stylesToCopy,
                timestamp: Date.now(),
                sourceBlock: props.name || 'Unknown Block'
            };
            
            try {
                localStorage.setItem('examiner_copied_styles', JSON.stringify(copyData));
                setHasClipboard(true); // Update state to show paste button
                return Object.keys(stylesToCopy).length;
            } catch (error) {
                console.warn('Failed to copy styles to localStorage:', error);
                return 0;
            }
        };

        // Paste all responsive styles to the current block
        const pasteAllStyles = () => {
            try {
                const storedData = localStorage.getItem('examiner_copied_styles');
                if (!storedData) {
                    return { success: false, message: 'No copied styles found' };
                }
                
                const copyData = JSON.parse(storedData);
                const { styles, timestamp, sourceBlock } = copyData;
                
                // Check if data is not too old (24 hours)
                const twentyFourHours = 24 * 60 * 60 * 1000;
                if (Date.now() - timestamp > twentyFourHours) {
                    localStorage.removeItem('examiner_copied_styles');
                    return { success: false, message: 'Copied styles have expired' };
                }
                
                if (!styles || Object.keys(styles).length === 0) {
                    return { success: false, message: 'No styles to paste' };
                }
                
                // Apply all copied styles at once
                if (props.setAttributes) {
                    props.setAttributes(styles);
                }
                
                return { 
                    success: true, 
                    count: Object.keys(styles).length,
                    sourceBlock: sourceBlock
                };
            } catch (error) {
                console.warn('Failed to paste styles from localStorage:', error);
                return { success: false, message: 'Failed to paste styles' };
            }
        };

        // Check if there are copied styles available
        const hasCopiedStyles = () => {
            try {
                const storedData = localStorage.getItem('examiner_copied_styles');
                if (!storedData) return false;
                
                const copyData = JSON.parse(storedData);
                const twentyFourHours = 24 * 60 * 60 * 1000;
                
                return copyData.styles && 
                       Object.keys(copyData.styles).length > 0 && 
                       (Date.now() - copyData.timestamp) <= twentyFourHours;
            } catch (error) {
                return false;
            }
        };

        return el('div', { className: 'modern-responsive-panel' },
            // Device Header
            el('div', { className: 'device-header' },
                el('h1', { className: 'device-title' }, 
                    activeDevice.charAt(0).toUpperCase() + activeDevice.slice(1)
                ),
                el('div', { className: 'device-tabs' },
                    el('button', {
                        className: `device-tab ${activeDevice === 'desktop' ? 'active' : ''}`,
                        onClick: () => setActiveDevice('desktop')
                    }, 
                        countDeviceAttributes('desktop') > 0 && el('span', { 
                            className: 'device-tab-counter'
                        }, countDeviceAttributes('desktop')),
                        el('span', { className: 'device-tab-icon' }, '🖥️'),
                        'Desktop'
                    ),
                    el('button', {
                        className: `device-tab ${activeDevice === 'tablet' ? 'active' : ''}`,
                        onClick: () => setActiveDevice('tablet')
                    }, 
                        countDeviceAttributes('tablet') > 0 && el('span', { 
                            className: 'device-tab-counter'
                        }, countDeviceAttributes('tablet')),
                        el('span', { className: 'device-tab-icon' }, '💻'),
                        'Tablet'
                    ),
                    el('button', {
                        className: `device-tab ${activeDevice === 'mobile' ? 'active' : ''}`,
                        onClick: () => setActiveDevice('mobile')
                    }, 
                        countDeviceAttributes('mobile') > 0 && el('span', { 
                            className: 'device-tab-counter'
                        }, countDeviceAttributes('mobile')),
                        el('span', { className: 'device-tab-icon' }, '📱'),
                        'Mobile'
                    ),
                    el('button', {
                        className: `device-tab ${activeDevice === 'hover' ? 'active' : ''}`,
                        onClick: () => setActiveDevice('hover')
                    }, 
                        countDeviceAttributes('hover') > 0 && el('span', { 
                            className: 'device-tab-counter'
                        }, countDeviceAttributes('hover')),
                        el('span', { className: 'device-tab-icon' }, '👆'),
                        'Hover'
                    )
                ),
                // Copy/Paste and Reset Actions
                el('div', {
                    className: 'device-actions',
                    style: {
                        display: 'flex',
                        gap: '4px',
                        marginTop: '8px',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                },
                    // Copy Styles Button
                    el('button', {
                        className: 'device-copy-btn',
                        onClick: () => {
                            const copiedCount = copyAllStyles();
                            if (copiedCount > 0) {
                                // Show success feedback
                                const button = document.querySelector('.device-copy-btn');
                                if (button) {
                                    const originalText = button.textContent;
                                    button.textContent = `✓ Copied ${copiedCount} styles`;
                                    button.style.background = '#28a745';
                                    setTimeout(() => {
                                        button.textContent = originalText;
                                        button.style.background = '#667eea';
                                    }, 1500);
                                }
                            } else {
                                alert('No responsive styles to copy from this block.');
                            }
                        },
                        style: {
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'background-color 0.2s ease',
                            whiteSpace: 'nowrap',
                            flex: '1'
                        },
                        onMouseOver: (e) => e.target.style.background = '#5a67d8',
                        onMouseOut: (e) => e.target.style.background = '#667eea'
                    }, 
                        el('span', { style: { fontSize: '10px' } }, '📋'), 
                        'Copy'
                    ),
                    
                    // Paste Styles Button
                    hasClipboard && el('button', {
                        className: 'device-paste-btn',
                        onClick: () => {
                            const result = pasteAllStyles();
                            const button = document.querySelector('.device-paste-btn');
                            
                            if (result.success) {
                                // Show success feedback
                                if (button) {
                                    const originalText = button.textContent;
                                    button.textContent = `✓ Pasted ${result.count} styles`;
                                    button.style.background = '#28a745';
                                    setTimeout(() => {
                                        button.textContent = originalText;
                                        button.style.background = '#28a745';
                                    }, 1500);
                                }
                            } else {
                                alert(result.message || 'Failed to paste styles');
                            }
                        },
                        style: {
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'background-color 0.2s ease',
                            whiteSpace: 'nowrap',
                            flex: '1'
                        },
                        onMouseOver: (e) => e.target.style.background = '#218838',
                        onMouseOut: (e) => e.target.style.background = '#28a745'
                    }, 
                        el('span', { style: { fontSize: '10px' } }, '📥'), 
                        'Paste'
                    ),
                    
                    // Device Reset Button
                    countDeviceAttributes(activeDevice) > 0 && el('button', {
                        className: 'device-reset-btn',
                        onClick: () => {
                            if (confirm(`Reset all ${activeDevice} styles for this block?`)) {
                                resetDeviceAttributes(activeDevice);
                            }
                        },
                        style: {
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'background-color 0.2s ease',
                            whiteSpace: 'nowrap',
                            flex: '1'
                        },
                        onMouseOver: (e) => e.target.style.background = '#c82333',
                        onMouseOut: (e) => e.target.style.background = '#dc3545'
                    }, 
                        el('span', { style: { fontSize: '10px' } }, '🗑️'), 
                        'Reset'
                    )
                )
            ),

            // Content Area
            el('div', { className: 'content-area' },
                
                // Layout & Positioning
                el(PanelBody, {
                    title: el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } },
                        el('span', { style: { fontSize: '16px' } }, '📐'),
                        'Layout & Positioning',
                        countPanelAttributes('layout') > 0 && el('span', {
                            style: {
                                marginLeft: 'auto',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #333',
                                padding: '1px'
                            }
                        }, countPanelAttributes('layout')),
                        countPanelAttributes('layout') > 0 && el('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                if (confirm(`Reset all Layout & Positioning styles for ${activeDevice}?`)) {
                                    resetPanelAttributes('layout');
                                }
                            },
                            style: {
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                fontSize: '9px',
                                cursor: 'pointer',
                                marginLeft: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            },
                            title: `Reset Layout & Positioning for ${activeDevice}`
                        }, '🗑️')
                    ),
                    initialOpen: false,
                    className: 'modern-responsive-panel'
                },
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Position',
                            value: getAttribute('position'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Static', value: 'static' },
                                { label: 'Relative', value: 'relative' },
                                { label: 'Absolute', value: 'absolute' },
                                { label: 'Fixed', value: 'fixed' },
                                { label: 'Sticky', value: 'sticky' }
                            ],
                            onChange: (value) => setAttribute('position', value)
                        }),
                        el(SelectControl, {
                            label: 'Display',
                            value: getAttribute('display'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Block', value: 'block' },
                                { label: 'Flex', value: 'flex' },
                                { label: 'Grid', value: 'grid' },
                                { label: 'Inline', value: 'inline' },
                                { label: 'Inline-Block', value: 'inline-block' },
                                { label: 'None', value: 'none' }
                            ],
                            onChange: (value) => setAttribute('display', value)
                        })
                    ),
                    // Grid Template Columns - Show only when display is grid
                    getAttribute('display') === 'grid' && el('div', { className: 'input-row' },
                        el(NumberControl, {
                            label: 'Grid Columns',
                            value: getAttribute('grid_template_columns'),
                            onChange: (value) => setAttribute('grid_template_columns', value),
                            min: 1,
                            max: 12,
                            step: 1,
                            help: 'Number of columns (creates repeat(X, 1fr))'
                        }),
                        el('div', { style: { width: '48%' } }) // Empty div to maintain grid layout
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Width',
                            value: getAttribute('width'),
                            onChange: (value) => setAttribute('width', value)
                        }),
                        el(UnitControl, {
                            label: 'Height',
                            value: getAttribute('height'),
                            onChange: (value) => setAttribute('height', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(NumberControl, {
                            label: 'Z-Index',
                            value: getAttribute('z_index'),
                            onChange: (value) => setAttribute('z_index', value)
                        }),
                        el(NumberControl, {
                            label: 'Order',
                            value: getAttribute('order'),
                            onChange: (value) => setAttribute('order', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Top',
                            value: getAttribute('top'),
                            onChange: (value) => setAttribute('top', value)
                        }),
                        el(UnitControl, {
                            label: 'Right',
                            value: getAttribute('right'),
                            onChange: (value) => setAttribute('right', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Bottom',
                            value: getAttribute('bottom'),
                            onChange: (value) => setAttribute('bottom', value)
                        }),
                        el(UnitControl, {
                            label: 'Left',
                            value: getAttribute('left'),
                            onChange: (value) => setAttribute('left', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Min Width',
                            value: getAttribute('min_width'),
                            onChange: (value) => setAttribute('min_width', value)
                        }),
                        el(UnitControl, {
                            label: 'Max Width',
                            value: getAttribute('max_width'),
                            onChange: (value) => setAttribute('max_width', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Min Height',
                            value: getAttribute('min_height'),
                            onChange: (value) => setAttribute('min_height', value)
                        }),
                        el(UnitControl, {
                            label: 'Max Height',
                            value: getAttribute('max_height'),
                            onChange: (value) => setAttribute('max_height', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Box Sizing',
                            value: getAttribute('box_sizing'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Content Box', value: 'content-box' },
                                { label: 'Border Box', value: 'border-box' }
                            ],
                            onChange: (value) => setAttribute('box_sizing', value)
                        }),
                        el(SelectControl, {
                            label: 'Visibility',
                            value: getAttribute('visibility'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Visible', value: 'visible' },
                                { label: 'Hidden', value: 'hidden' },
                                { label: 'Collapse', value: 'collapse' }
                            ],
                            onChange: (value) => setAttribute('visibility', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Float',
                            value: getAttribute('float'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'None', value: 'none' },
                                { label: 'Left', value: 'left' },
                                { label: 'Right', value: 'right' }
                            ],
                            onChange: (value) => setAttribute('float', value)
                        }),
                        el(SelectControl, {
                            label: 'Clear',
                            value: getAttribute('clear'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'None', value: 'none' },
                                { label: 'Left', value: 'left' },
                                { label: 'Right', value: 'right' },
                                { label: 'Both', value: 'both' }
                            ],
                            onChange: (value) => setAttribute('clear', value)
                        })
                    )
                ),

                // Typography
                el(PanelBody, {
                    title: el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } },
                        el('span', { style: { fontSize: '16px' } }, 'Aa'),
                        'Typography',
                        countPanelAttributes('typography') > 0 && el('span', {
                            style: {
                                marginLeft: 'auto',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #333',
                                padding: '1px'
                            }
                        }, countPanelAttributes('typography')),
                        countPanelAttributes('typography') > 0 && el('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                if (confirm(`Reset all Typography styles for ${activeDevice}?`)) {
                                    resetPanelAttributes('typography');
                                }
                            },
                            style: {
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                fontSize: '9px',
                                cursor: 'pointer',
                                marginLeft: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            },
                            title: `Reset Typography for ${activeDevice}`
                        }, '🗑️')
                    ),
                    initialOpen: false,
                    className: 'modern-responsive-panel'
                },
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Font Size',
                            value: getAttribute('font_size'),
                            onChange: (value) => setAttribute('font_size', value)
                        }),
                        el(UnitControl, {
                            label: 'Line Height',
                            value: getAttribute('line_height'),
                            onChange: (value) => setAttribute('line_height', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Letter Spacing',
                            value: getAttribute('letter_spacing'),
                            onChange: (value) => setAttribute('letter_spacing', value)
                        }),
                        el(UnitControl, {
                            label: 'Word Spacing',
                            value: getAttribute('word_spacing'),
                            onChange: (value) => setAttribute('word_spacing', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Text Align',
                            value: getAttribute('textAlign'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Left', value: 'left' },
                                { label: 'Center', value: 'center' },
                                { label: 'Right', value: 'right' },
                                { label: 'Justify', value: 'justify' }
                            ],
                            onChange: (value) => setAttribute('textAlign', value)
                        }),
                        el(SelectControl, {
                            label: 'Font Weight',
                            value: getAttribute('font_weight'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: '100', value: '100' },
                                { label: '200', value: '200' },
                                { label: '300', value: '300' },
                                { label: '400', value: '400' },
                                { label: '500', value: '500' },
                                { label: '600', value: '600' },
                                { label: '700', value: '700' },
                                { label: '800', value: '800' },
                                { label: '900', value: '900' }
                            ],
                            onChange: (value) => setAttribute('font_weight', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Font Style',
                            value: getAttribute('font_style'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Normal', value: 'normal' },
                                { label: 'Italic', value: 'italic' },
                                { label: 'Oblique', value: 'oblique' }
                            ],
                            onChange: (value) => setAttribute('font_style', value)
                        }),
                        el(SelectControl, {
                            label: 'Text Transform',
                            value: getAttribute('text_transform'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'None', value: 'none' },
                                { label: 'Uppercase', value: 'uppercase' },
                                { label: 'Lowercase', value: 'lowercase' },
                                { label: 'Capitalize', value: 'capitalize' }
                            ],
                            onChange: (value) => setAttribute('text_transform', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Text Decoration',
                            value: getAttribute('text_decoration'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'None', value: 'none' },
                                { label: 'Underline', value: 'underline' },
                                { label: 'Line Through', value: 'line-through' },
                                { label: 'Overline', value: 'overline' }
                            ],
                            onChange: (value) => setAttribute('text_decoration', value)
                        }),
                        el(TextControl, {
                            label: 'Text Shadow',
                            value: getAttribute('text_shadow'),
                            onChange: (value) => setAttribute('text_shadow', value),
                            placeholder: '2px 2px 4px rgba(0,0,0,0.5)'
                        })
                    ),
                    // Text Color Picker
                    el('div', { className: 'input-row single' },
                        el('div', { className: 'color-picker-section' },
                            el('div', { className: 'color-picker-header' },
                                el('span', { className: 'color-picker-label' }, 
                                    getAttribute('color') ? `Text Color: ${getAttribute('color')}` : 'No text color selected'
                                )
                            ),
                            el('div', { className: 'color-picker-grid' },
                                // Clear color option
                                el('div', {
                                    key: 'text-clear',
                                    className: `color-swatch clear-color ${getAttribute('color') === '' ? 'selected' : ''}`,
                                    style: { 
                                        background: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                        backgroundSize: '8px 8px',
                                        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                                    },
                                    onClick: () => {
                                        setAttribute('color', '');
                                    }
                                }),
                                ...colorOptions.map(color =>
                                    el('div', {
                                        key: 'text-' + color,
                                        className: `color-swatch ${getAttribute('color') === color ? 'selected' : ''}`,
                                        style: { backgroundColor: color },
                                        onClick: () => {
                                            setAttribute('color', color);
                                        }
                                    })
                                )
                            ),
                            // Custom Text Color Picker
                            el('div', { className: 'custom-color-picker' },
                                el('div', { className: 'color-picker-label' }, 'Custom Text Color:'),
                                el(ColorPalette, {
                                    value: getAttribute('color'),
                                    onChange: (color) => {
                                        const colorValue = color || '';
                                        setAttribute('color', colorValue);
                                    },
                                    colors: [],
                                    disableCustomColors: false,
                                    clearable: true
                                })
                            )
                        )
                    )
                ),

                // Spacing
                el(PanelBody, {
                    title: el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } },
                        el('span', { style: { fontSize: '16px' } }, '📏'),
                        'Spacing',
                        countPanelAttributes('spacing') > 0 && el('span', {
                            style: {
                                marginLeft: 'auto',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #333',
                                padding: '1px'
                            }
                        }, countPanelAttributes('spacing')),
                        countPanelAttributes('spacing') > 0 && el('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                if (confirm(`Reset all Spacing styles for ${activeDevice}?`)) {
                                    resetPanelAttributes('spacing');
                                }
                            },
                            style: {
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                fontSize: '9px',
                                cursor: 'pointer',
                                marginLeft: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            },
                            title: `Reset Spacing for ${activeDevice}`
                        }, '🗑️')
                    ),
                    initialOpen: false,
                    className: 'modern-responsive-panel'
                },
                    el('div', { className: 'input-row single' },
                        el(BoxControl, {
                            label: 'Padding',
                            values: getAttribute('padding'),
                            onChange: (value) => setAttribute('padding', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el('button', {
                            className: 'reset-btn-modern',
                            onClick: () => setAttribute('padding', { top: '', left: '', right: '', bottom: '' })
                        }, 'Reset'),
                        el('div', {})
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Margin Top',
                            value: getAttribute('margin').top || '',
                            onChange: (value) => {
                                const current = getAttribute('margin');
                                setAttribute('margin', { ...current, top: value });
                            }
                        }),
                        el(UnitControl, {
                            label: 'Margin Right',
                            value: getAttribute('margin').right || '',
                            onChange: (value) => {
                                const current = getAttribute('margin');
                                setAttribute('margin', { ...current, right: value });
                            }
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Margin Bottom',
                            value: getAttribute('margin').bottom || '',
                            onChange: (value) => {
                                const current = getAttribute('margin');
                                setAttribute('margin', { ...current, bottom: value });
                            }
                        }),
                        el(UnitControl, {
                            label: 'Margin Left',
                            value: getAttribute('margin').left || '',
                            onChange: (value) => {
                                const current = getAttribute('margin');
                                setAttribute('margin', { ...current, left: value });
                            }
                        })
                    )
                ),

                // Visual Effects (with colors)
                el(PanelBody, {
                    title: el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } },
                        el('span', { style: { fontSize: '16px' } }, '🎨'),
                        'Borders & Styling',
                        countPanelAttributes('borders') > 0 && el('span', {
                            style: {
                                marginLeft: 'auto',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #333',
                                padding: '1px'
                            }
                        }, countPanelAttributes('borders')),
                        countPanelAttributes('borders') > 0 && el('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                if (confirm(`Reset all Borders & Styling for ${activeDevice}?`)) {
                                    resetPanelAttributes('borders');
                                }
                            },
                            style: {
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                fontSize: '9px',
                                cursor: 'pointer',
                                marginLeft: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            },
                            title: `Reset Borders & Styling for ${activeDevice}`
                        }, '🗑️')
                    ),
                    initialOpen: false,
                    className: 'modern-responsive-panel'
                },
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Border Style',
                            value: getAttribute('borderStyle'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'None', value: 'none' },
                                { label: 'Solid', value: 'solid' },
                                { label: 'Dashed', value: 'dashed' },
                                { label: 'Dotted', value: 'dotted' }
                            ],
                            onChange: (value) => setAttribute('borderStyle', value)
                        }),
                        el(UnitControl, {
                            label: 'Border Width',
                            value: getAttribute('borderWidth'),
                            onChange: (value) => setAttribute('borderWidth', value)
                        })
                    ),
                    el('div', { className: 'color-picker-section' },
                        el('div', { className: 'color-picker-header' },
                            el('span', { className: 'color-picker-label' }, 
                                selectedColor ? `Border Color: ${selectedColor}` : 'No color selected'
                            )
                        ),
                        el('div', { className: 'color-picker-grid' },
                            // Clear color option
                            el('div', {
                                key: 'clear',
                                className: `color-swatch clear-color ${selectedColor === '' ? 'selected' : ''}`,
                                style: { 
                                    background: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                    backgroundSize: '8px 8px',
                                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                                },
                                onClick: () => {
                                    setSelectedColor('');
                                    setAttribute('borderColor', '');
                                }
                            }),
                            ...colorOptions.map(color =>
                                el('div', {
                                    key: color,
                                    className: `color-swatch ${selectedColor === color ? 'selected' : ''}`,
                                    style: { backgroundColor: color },
                                    onClick: () => {
                                        // Setting border color value
                                        setSelectedColor(color);
                                        setAttribute('borderColor', color);
                                        // Also set a default border width and style if not already set
                                        if (!getAttribute('borderWidth')) {
                                            setAttribute('borderWidth', '1px');
                                        }
                                        if (!getAttribute('borderStyle') || getAttribute('borderStyle') === 'none') {
                                            setAttribute('borderStyle', 'solid');
                                        }
                                    }
                                })
                            )
                        ),
                        // Custom Color Picker
                        el('div', { className: 'custom-color-picker' },
                            el('div', { className: 'color-picker-label' }, 'Custom Color:'),
                            el(ColorPalette, {
                                value: selectedColor,
                                onChange: (color) => {
                                    // ColorPalette value changed
                                    const colorValue = color || '';
                                    setSelectedColor(colorValue);
                                    setAttribute('borderColor', colorValue);
                                    
                                    // Also set a default border width and style if not already set
                                    if (colorValue && !getAttribute('borderWidth')) {
                                        setAttribute('borderWidth', '1px');
                                    }
                                    if (colorValue && (!getAttribute('borderStyle') || getAttribute('borderStyle') === 'none')) {
                                        setAttribute('borderStyle', 'solid');
                                    }
                                },
                                colors: [],
                                disableCustomColors: false,
                                clearable: true
                            })
                        )
                    )
                ),



                // Border Radius
                el(PanelBody, {
                    title: el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } },
                        el('span', { style: { fontSize: '16px' } }, '⭕'),
                        'Border Radius',
                        countPanelAttributes('borderRadius') > 0 && el('span', {
                            style: {
                                marginLeft: 'auto',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #333',
                                padding: '1px'
                            }
                        }, countPanelAttributes('borderRadius')),
                        countPanelAttributes('borderRadius') > 0 && el('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                if (confirm(`Reset all Border Radius for ${activeDevice}?`)) {
                                    resetPanelAttributes('borderRadius');
                                }
                            },
                            style: {
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                fontSize: '9px',
                                cursor: 'pointer',
                                marginLeft: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            },
                            title: `Reset Border Radius for ${activeDevice}`
                        }, '🗑️')
                    ),
                    initialOpen: false,
                    className: 'modern-responsive-panel'
                },
                    el('div', { className: 'border-radius-grid' },
                        el(UnitControl, {
                            label: 'Top Left',
                            value: getBorderRadius().topLeft,
                            onChange: (value) => setBorderRadius('topLeft', value)
                        }),
                        el(UnitControl, {
                            label: 'Top Right',
                            value: getBorderRadius().topRight,
                            onChange: (value) => setBorderRadius('topRight', value)
                        }),
                        el(UnitControl, {
                            label: 'Bottom Left',
                            value: getBorderRadius().bottomLeft,
                            onChange: (value) => setBorderRadius('bottomLeft', value)
                        }),
                        el(UnitControl, {
                            label: 'Bottom Right',
                            value: getBorderRadius().bottomRight,
                            onChange: (value) => setBorderRadius('bottomRight', value)
                        })
                    )
                ),

                // Advanced Properties
                el(PanelBody, {
                    title: el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } },
                        el('span', { style: { fontSize: '16px' } }, '⚙️'),
                        'Flexbox & Advanced',
                        countPanelAttributes('advanced') > 0 && el('span', {
                            style: {
                                marginLeft: 'auto',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #333',
                                padding: '1px'
                            }
                        }, countPanelAttributes('advanced')),
                        countPanelAttributes('advanced') > 0 && el('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                if (confirm(`Reset all Flexbox & Advanced styles for ${activeDevice}?`)) {
                                    resetPanelAttributes('advanced');
                                }
                            },
                            style: {
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                fontSize: '9px',
                                cursor: 'pointer',
                                marginLeft: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            },
                            title: `Reset Flexbox & Advanced for ${activeDevice}`
                        }, '🗑️')
                    ),
                    initialOpen: false,
                    className: 'modern-responsive-panel'
                },
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Flex Direction',
                            value: getAttribute('flex_direction'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Row', value: 'row' },
                                { label: 'Column', value: 'column' },
                                { label: 'Row Reverse', value: 'row-reverse' },
                                { label: 'Column Reverse', value: 'column-reverse' }
                            ],
                            onChange: (value) => setAttribute('flex_direction', value)
                        }),
                        el(SelectControl, {
                            label: 'Justify Content',
                            value: getAttribute('justify'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Flex Start', value: 'flex-start' },
                                { label: 'Center', value: 'center' },
                                { label: 'Flex End', value: 'flex-end' },
                                { label: 'Space Between', value: 'space-between' },
                                { label: 'Space Around', value: 'space-around' }
                            ],
                            onChange: (value) => setAttribute('justify', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Flex Wrap',
                            value: getAttribute('flexWrap'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'No Wrap', value: 'nowrap' },
                                { label: 'Wrap', value: 'wrap' },
                                { label: 'Wrap Reverse', value: 'wrap-reverse' }
                            ],
                            onChange: (value) => setAttribute('flexWrap', value)
                        }),
                        el(NumberControl, {
                            label: 'Flex Grow',
                            value: getAttribute('flex_grow'),
                            onChange: (value) => setAttribute('flex_grow', value)
                        }),
                        el(NumberControl, {
                            label: 'Flex Shrink',
                            value: getAttribute('flex_shrink'),
                            onChange: (value) => setAttribute('flex_shrink', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(UnitControl, {
                            label: 'Flex Basis',
                            value: getAttribute('flex_basis'),
                            onChange: (value) => setAttribute('flex_basis', value)
                        }),
                        el(SelectControl, {
                            label: 'Align Items',
                            value: getAttribute('align_items'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Flex Start', value: 'flex-start' },
                                { label: 'Center', value: 'center' },
                                { label: 'Flex End', value: 'flex-end' },
                                { label: 'Stretch', value: 'stretch' },
                                { label: 'Baseline', value: 'baseline' }
                            ],
                            onChange: (value) => setAttribute('align_items', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Align Self',
                            value: getAttribute('align_self'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Auto', value: 'auto' },
                                { label: 'Flex Start', value: 'flex-start' },
                                { label: 'Center', value: 'center' },
                                { label: 'Flex End', value: 'flex-end' },
                                { label: 'Stretch', value: 'stretch' },
                                { label: 'Baseline', value: 'baseline' }
                            ],
                            onChange: (value) => setAttribute('align_self', value)
                        }),
                        el(SelectControl, {
                            label: 'Align Content',
                            value: getAttribute('align_content'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Flex Start', value: 'flex-start' },
                                { label: 'Center', value: 'center' },
                                { label: 'Flex End', value: 'flex-end' },
                                { label: 'Space Between', value: 'space-between' },
                                { label: 'Space Around', value: 'space-around' },
                                { label: 'Stretch', value: 'stretch' }
                            ],
                            onChange: (value) => setAttribute('align_content', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(TextControl, {
                            label: 'Transform',
                            value: getAttribute('transform'),
                            onChange: (value) => setAttribute('transform', value)
                        }),
                        el(TextControl, {
                            label: 'Transition',
                            value: getAttribute('transition'),
                            onChange: (value) => setAttribute('transition', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(TextControl, {
                            label: 'Box Shadow',
                            value: getAttribute('box_shadow'),
                            onChange: (value) => setAttribute('box_shadow', value),
                            placeholder: '0 4px 8px rgba(0,0,0,0.1)'
                        }),
                        el(TextControl, {
                            label: 'Filter',
                            value: getAttribute('filter'),
                            onChange: (value) => setAttribute('filter', value),
                            placeholder: 'blur(5px) brightness(1.2)'
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(NumberControl, {
                            label: 'Opacity',
                            value: getAttribute('opacity'),
                            onChange: (value) => setAttribute('opacity', value),
                            min: 0,
                            max: 1,
                            step: 0.1
                        }),
                        el(SelectControl, {
                            label: 'Cursor',
                            value: getAttribute('cursor'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Auto', value: 'auto' },
                                { label: 'Pointer', value: 'pointer' },
                                { label: 'Crosshair', value: 'crosshair' },
                                { label: 'Move', value: 'move' },
                                { label: 'Text', value: 'text' },
                                { label: 'Wait', value: 'wait' },
                                { label: 'Help', value: 'help' },
                                { label: 'Not Allowed', value: 'not-allowed' }
                            ],
                            onChange: (value) => setAttribute('cursor', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'User Select',
                            value: getAttribute('user_select'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Auto', value: 'auto' },
                                { label: 'None', value: 'none' },
                                { label: 'Text', value: 'text' },
                                { label: 'All', value: 'all' }
                            ],
                            onChange: (value) => setAttribute('user_select', value)
                        }),
                        el(SelectControl, {
                            label: 'Pointer Events',
                            value: getAttribute('pointer_events'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Auto', value: 'auto' },
                                { label: 'None', value: 'none' },
                                { label: 'Visible', value: 'visible' },
                                { label: 'Fill', value: 'fill' }
                            ],
                            onChange: (value) => setAttribute('pointer_events', value)
                        })
                    )
                ),

                // Background Panel
                el(PanelBody, {
                    title: el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } },
                        el('span', { style: { fontSize: '16px' } }, '🎨'),
                        'Background',
                        countPanelAttributes('background') > 0 && el('span', {
                            style: {
                                marginLeft: 'auto',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #333',
                                padding: '1px'
                            }
                        }, countPanelAttributes('background')),
                        countPanelAttributes('background') > 0 && el('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                if (confirm(`Reset all Background styles for ${activeDevice}?`)) {
                                    resetPanelAttributes('background');
                                }
                            },
                            style: {
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                fontSize: '9px',
                                cursor: 'pointer',
                                marginLeft: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            },
                            title: `Reset Background for ${activeDevice}`
                        }, '🗑️')
                    ),
                    initialOpen: false,
                    className: 'modern-responsive-panel'
                },
                    // Background Color & Gradient
                    el('div', { className: 'input-row single' },
                        el('div', { className: 'background-control-wrapper' },
                            el('label', { className: 'components-base-control__label' }, 'Background'),
                            
                                                        // Background Color and Gradient Tabs
                            el('div', { className: 'wp-background-picker-tabs' },
                                // Tab buttons
                                el('div', { className: 'wp-tab-buttons' },
                                    el('button', {
                                        className: `wp-tab-btn ${!getAttribute('background_color').includes('gradient') ? 'active' : ''}`,
                                        onClick: () => {
                                            if (getAttribute('background_color').includes('gradient')) {
                                                setAttribute('background_color', '');
                                            }
                                        }
                                    }, 'Color'),
                                    el('button', {
                                        className: `wp-tab-btn ${getAttribute('background_color').includes('gradient') ? 'active' : ''}`,
                                        onClick: () => {
                                            if (!getAttribute('background_color').includes('gradient')) {
                                                setAttribute('background_color', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                                            }
                                        }
                                    }, 'Gradient')
                                ),
                                
                                // Tab content
                                el('div', { className: 'wp-tab-content' },
                                    !getAttribute('background_color').includes('gradient') ?
                                        // Color Tab
                                        el(ColorPalette, {
                                            value: getAttribute('background_color'),
                                            onChange: (color) => setAttribute('background_color', color || ''),
                                            colors: [
                                                { name: 'Primary', color: '#667eea' },
                                                { name: 'Secondary', color: '#764ba2' },
                                                { name: 'Red', color: '#ff6b6b' },
                                                { name: 'Teal', color: '#4ecdc4' },
                                                { name: 'Blue', color: '#45b7d1' },
                                                { name: 'Yellow', color: '#f9ca24' },
                                                { name: 'White', color: '#ffffff' },
                                                { name: 'Black', color: '#000000' }
                                            ],
                                            clearable: true
                                        }) :
                                                                                // Gradient Tab - Using WordPress GradientPicker
                                        (GradientPicker || StableGradientPicker) ?
                                            el(GradientPicker || StableGradientPicker, {
                                                value: getAttribute('background_color'),
                                                onChange: (gradient) => setAttribute('background_color', gradient || ''),
                                                gradients: [
                                                    {
                                                        name: 'Vivid cyan blue to vivid purple',
                                                        gradient: 'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
                                                        slug: 'vivid-cyan-blue-to-vivid-purple'
                                                    },
                                                    {
                                                        name: 'Light green cyan to vivid green cyan',
                                                        gradient: 'linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%)',
                                                        slug: 'light-green-cyan-to-vivid-green-cyan'
                                                    },
                                                    {
                                                        name: 'Luminous vivid amber to luminous vivid orange',
                                                        gradient: 'linear-gradient(135deg,rgba(252,185,0,1) 0%,rgba(255,105,0,1) 100%)',
                                                        slug: 'luminous-vivid-amber-to-luminous-vivid-orange'
                                                    },
                                                    {
                                                        name: 'Luminous vivid orange to vivid red',
                                                        gradient: 'linear-gradient(135deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%)',
                                                        slug: 'luminous-vivid-orange-to-vivid-red'
                                                    },
                                                    {
                                                        name: 'Very light gray to cyan bluish gray',
                                                        gradient: 'linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%)',
                                                        slug: 'very-light-gray-to-cyan-bluish-gray'
                                                    },
                                                    {
                                                        name: 'Cool to warm spectrum',
                                                        gradient: 'linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%)',
                                                        slug: 'cool-to-warm-spectrum'
                                                    }
                                                ],
                                                __nextHasNoMargin: true
                                            }) :
                                            // Enhanced fallback if GradientPicker not available
                                            el('div', { className: 'gradient-fallback' },
                                                                                                    el('div', { className: 'gradient-presets' },
                                                        el('label', { 
                                                            style: { 
                                                                color: '#fff', 
                                                                fontSize: '12px', 
                                                                marginBottom: '8px', 
                                                                display: 'block' 
                                                            } 
                                                        }, 'Gradient Presets'),
                                                        el('div', { className: 'preset-grid' },
                                                            [
                                                                { name: 'Purple Blue', gradient: 'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)' },
                                                                { name: 'Green Cyan', gradient: 'linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%)' },
                                                                { name: 'Purple Pink', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                                                                { name: 'Orange Red', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
                                                            ].map((preset, index) =>
                                                                el('div', {
                                                                    key: 'preset-' + index,
                                                                    className: `preset-swatch ${getAttribute('background_color') === preset.gradient ? 'selected' : ''}`,
                                                                    style: { 
                                                                        background: preset.gradient,
                                                                        width: '60px',
                                                                        height: '30px',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                        margin: '4px',
                                                                        border: '2px solid transparent',
                                                                        display: 'inline-block'
                                                                    },
                                                                    onClick: () => setAttribute('background_color', preset.gradient),
                                                                    title: preset.name
                                                                })
                                                            )
                                                        )
                                                    ),
                                                    el(TextControl, {
                                                        label: 'Custom Gradient',
                                                        value: getAttribute('background_color'),
                                                        onChange: (value) => setAttribute('background_color', value),
                                                        placeholder: 'linear-gradient() or radial-gradient()'
                                                    })
                                            )
                                )
                            )
                        )
                    ),
                    
                    // Background Image and Properties
                    el('div', { className: 'input-row' },
                        el('div', { className: 'media-upload-wrapper' },
                            el('label', { className: 'components-base-control__label' }, 'Background Image'),
                            el(MediaUploadCheck, {},
                                el(MediaUpload, {
                                    onSelect: (media) => {
                                        setAttribute('background_image', media.url);
                                    },
                                    allowedTypes: ['image'],
                                    value: getAttribute('background_image'),
                                    render: ({ open }) => 
                                        el('div', { className: 'image-selector-container' },
                                            getAttribute('background_image') && 
                                                el('img', {
                                                    src: getAttribute('background_image'),
                                                    style: { 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'cover', 
                                                        borderRadius: '4px', 
                                                        marginBottom: '8px',
                                                        display: 'block'
                                                    }
                                                }),
                                            el('div', { className: 'image-buttons' },
                                                el(Button, {
                                                    onClick: open,
                                                    variant: 'secondary',
                                                    style: { marginRight: '8px' }
                                                }, getAttribute('background_image') ? 'Replace Image' : 'Select Image'),
                                                getAttribute('background_image') &&
                                                    el(Button, {
                                                        onClick: () => setAttribute('background_image', ''),
                                                        variant: 'tertiary',
                                                        isDestructive: true
                                                    }, 'Remove')
                                            )
                                        )
                                })
                            )
                        ),
                        el(SelectControl, {
                            label: 'Background Size',
                            value: getAttribute('background_size'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Auto', value: 'auto' },
                                { label: 'Cover', value: 'cover' },
                                { label: 'Contain', value: 'contain' },
                                { label: '100%', value: '100%' },
                                { label: '100% 100%', value: '100% 100%' }
                            ],
                            onChange: (value) => setAttribute('background_size', value)
                        })
                    ),
                    el('div', { className: 'input-row' },
                        el(SelectControl, {
                            label: 'Background Position',
                            value: getAttribute('background_position'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'Center', value: 'center' },
                                { label: 'Top', value: 'top' },
                                { label: 'Bottom', value: 'bottom' },
                                { label: 'Left', value: 'left' },
                                { label: 'Right', value: 'right' },
                                { label: 'Top Left', value: 'top left' },
                                { label: 'Top Right', value: 'top right' },
                                { label: 'Bottom Left', value: 'bottom left' },
                                { label: 'Bottom Right', value: 'bottom right' }
                            ],
                            onChange: (value) => setAttribute('background_position', value)
                        }),
                        el(SelectControl, {
                            label: 'Background Repeat',
                            value: getAttribute('background_repeat'),
                            options: [
                                { label: 'Default', value: '' },
                                { label: 'No Repeat', value: 'no-repeat' },
                                { label: 'Repeat', value: 'repeat' },
                                { label: 'Repeat X', value: 'repeat-x' },
                                { label: 'Repeat Y', value: 'repeat-y' }
                            ],
                            onChange: (value) => setAttribute('background_repeat', value)
                        })
                    )
                )
            )
        );
    };

    // Generate CSS for modern responsive attributes
    const generateModernResponsiveCSS = (props) => {
        // Use customId if available, otherwise fall back to clientId
        const blockId = props.attributes?.customId || props.clientId.substring(0, 6);
        const blockSelector = `#block_${blockId}`;
        const fallbackSelector = `#block-${props.clientId}`;
        
        // Helper function to get attribute value safely
        const getAttr = (name) => props.attributes?.[name] || '';
        

        
        // Generate CSS for each device - CLEAN VERSION (no duplicates)
        const desktopCSS = `
            ${blockSelector}, ${fallbackSelector} {
                ${getAttr('font_size_desktop') ? `font-size: ${getAttr('font_size_desktop')} !important;` : ''}
                ${getAttr('line_height_desktop') ? `line-height: ${getAttr('line_height_desktop')} !important;` : ''}
                ${getAttr('letter_spacing_desktop') ? `letter-spacing: ${getAttr('letter_spacing_desktop')} !important;` : ''}
                ${getAttr('word_spacing_desktop') ? `word-spacing: ${getAttr('word_spacing_desktop')} !important;` : ''}
                ${getAttr('font_weight_desktop') ? `font-weight: ${getAttr('font_weight_desktop')} !important;` : ''}
                ${getAttr('font_style_desktop') ? `font-style: ${getAttr('font_style_desktop')} !important;` : ''}
                ${getAttr('text_transform_desktop') ? `text-transform: ${getAttr('text_transform_desktop')} !important;` : ''}
                ${getAttr('text_decoration_desktop') ? `text-decoration: ${getAttr('text_decoration_desktop')} !important;` : ''}
                ${getAttr('text_shadow_desktop') ? `text-shadow: ${getAttr('text_shadow_desktop')} !important;` : ''}
                ${getAttr('textAlign_desktop') ? `text-align: ${getAttr('textAlign_desktop')} !important;` : ''}
                ${getAttr('width_desktop') ? `width: ${getAttr('width_desktop')} !important;` : ''}
                ${getAttr('height_desktop') ? `height: ${getAttr('height_desktop')} !important;` : ''}
                ${getAttr('min_width_desktop') ? `min-width: ${getAttr('min_width_desktop')} !important;` : ''}
                ${getAttr('max_width_desktop') ? `max-width: ${getAttr('max_width_desktop')} !important;` : ''}
                ${getAttr('min_height_desktop') ? `min-height: ${getAttr('min_height_desktop')} !important;` : ''}
                ${getAttr('max_height_desktop') ? `max-height: ${getAttr('max_height_desktop')} !important;` : ''}
                ${getAttr('box_sizing_desktop') ? `box-sizing: ${getAttr('box_sizing_desktop')} !important;` : ''}
                ${getAttr('desktop_position') ? `position: ${getAttr('desktop_position')} !important;` : ''}
                ${getAttr('top_desktop') ? `top: ${getAttr('top_desktop')} !important;` : ''}
                ${getAttr('right_desktop') ? `right: ${getAttr('right_desktop')} !important;` : ''}
                ${getAttr('bottom_desktop') ? `bottom: ${getAttr('bottom_desktop')} !important;` : ''}
                ${getAttr('left_desktop') ? `left: ${getAttr('left_desktop')} !important;` : ''}
                ${getAttr('desktop_display') ? `display: ${getAttr('desktop_display')} !important;` : ''}
                ${getAttr('visibility_desktop') ? `visibility: ${getAttr('visibility_desktop')} !important;` : ''}
                ${getAttr('float_desktop') ? `float: ${getAttr('float_desktop')} !important;` : ''}
                ${getAttr('clear_desktop') ? `clear: ${getAttr('clear_desktop')} !important;` : ''}
                ${getAttr('order_desktop') ? `order: ${getAttr('order_desktop')} !important;` : ''}
                ${getAttr('z_index_desktop') ? `z-index: ${getAttr('z_index_desktop')} !important;` : ''}
                ${getAttr('overflow_desktop') ? `overflow: ${getAttr('overflow_desktop')} !important;` : ''}
                ${getAttr('desktop_flex_direction') ? `flex-direction: ${getAttr('desktop_flex_direction')} !important;` : ''}
                ${getAttr('desktop_justify') ? `justify-content: ${getAttr('desktop_justify')} !important;` : ''}
                ${getAttr('desktop_flexWrap') ? `flex-wrap: ${getAttr('desktop_flexWrap')} !important;` : ''}
                ${getAttr('desktop_flex_grow') ? `flex-grow: ${getAttr('desktop_flex_grow')} !important;` : ''}
                ${getAttr('flex_shrink_desktop') ? `flex-shrink: ${getAttr('flex_shrink_desktop')} !important;` : ''}
                ${getAttr('flex_basis_desktop') ? `flex-basis: ${getAttr('flex_basis_desktop')} !important;` : ''}
                ${getAttr('align_items_desktop') ? `align-items: ${getAttr('align_items_desktop')} !important;` : ''}
                ${getAttr('align_self_desktop') ? `align-self: ${getAttr('align_self_desktop')} !important;` : ''}
                ${getAttr('align_content_desktop') ? `align-content: ${getAttr('align_content_desktop')} !important;` : ''}
                ${getAttr('grid_template_columns_desktop') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_desktop')}, 1fr) !important;` : ''}
                ${getAttr('desktop_borderStyle') ? `border-style: ${getAttr('desktop_borderStyle')} !important;` : ''}
                ${getAttr('desktop_borderColor') ? `border-color: ${getAttr('desktop_borderColor')} !important;` : ''}
                ${getAttr('borderWidth_desktop') ? `border-width: ${getAttr('borderWidth_desktop')} !important;` : ''}
                ${getAttr('box_shadow_desktop') ? `box-shadow: ${getAttr('box_shadow_desktop')} !important;` : ''}
                ${getAttr('filter_desktop') ? `filter: ${getAttr('filter_desktop')} !important;` : ''}
                ${getAttr('opacity_desktop') ? `opacity: ${getAttr('opacity_desktop')} !important;` : ''}
                ${getAttr('transform_desktop') ? `transform: ${getAttr('transform_desktop')} !important;` : ''}
                ${getAttr('transition_desktop') ? `transition: ${getAttr('transition_desktop')} !important;` : ''}
                ${getAttr('cursor_desktop') ? `cursor: ${getAttr('cursor_desktop')} !important;` : ''}
                ${getAttr('user_select_desktop') ? `user-select: ${getAttr('user_select_desktop')} !important;` : ''}
                ${getAttr('pointer_events_desktop') ? `pointer-events: ${getAttr('pointer_events_desktop')} !important;` : ''}
                ${getAttr('color_desktop') ? `color: ${getAttr('color_desktop')} !important;` : ''}
                ${getAttr('background_color_desktop') ? (getAttr('background_color_desktop').includes('gradient') ? `background: ${getAttr('background_color_desktop')} !important;` : `background-color: ${getAttr('background_color_desktop')} !important;`) : ''}
                ${getAttr('background_image_desktop') ? `background-image: ${getAttr('background_image_desktop').startsWith('url(') ? getAttr('background_image_desktop') : `url(${getAttr('background_image_desktop')})`} !important;` : ''}
                ${getAttr('background_size_desktop') ? `background-size: ${getAttr('background_size_desktop')} !important;` : ''}
                ${getAttr('background_position_desktop') ? `background-position: ${getAttr('background_position_desktop')} !important;` : ''}
                ${getAttr('background_repeat_desktop') ? `background-repeat: ${getAttr('background_repeat_desktop')} !important;` : ''}
                ${getAttr('desktop_padding')?.top ? `padding-top: ${getAttr('desktop_padding').top} !important;` : ''}
                ${getAttr('desktop_padding')?.right ? `padding-right: ${getAttr('desktop_padding').right} !important;` : ''}
                ${getAttr('desktop_padding')?.bottom ? `padding-bottom: ${getAttr('desktop_padding').bottom} !important;` : ''}
                ${getAttr('desktop_padding')?.left ? `padding-left: ${getAttr('desktop_padding').left} !important;` : ''}
                ${getAttr('desktop_margin')?.top ? `margin-top: ${getAttr('desktop_margin').top} !important;` : ''}
                ${getAttr('desktop_margin')?.right ? `margin-right: ${getAttr('desktop_margin').right} !important;` : ''}
                ${getAttr('desktop_margin')?.bottom ? `margin-bottom: ${getAttr('desktop_margin').bottom} !important;` : ''}
                ${getAttr('desktop_margin')?.left ? `margin-left: ${getAttr('desktop_margin').left} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('desktop_borderRadius').topLeft} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('desktop_borderRadius').topRight} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('desktop_borderRadius').bottomLeft} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('desktop_borderRadius').bottomRight} !important;` : ''}
            }
        `;

        const tabletCSS = `
            @media (max-width: 1024px) {
                ${blockSelector}, ${fallbackSelector} {
                    ${getAttr('font_size_tablet') ? `font-size: ${getAttr('font_size_tablet')} !important;` : ''}
                    ${getAttr('line_height_tablet') ? `line-height: ${getAttr('line_height_tablet')} !important;` : ''}
                    ${getAttr('letter_spacing_tablet') ? `letter-spacing: ${getAttr('letter_spacing_tablet')} !important;` : ''}
                    ${getAttr('width_tablet') ? `width: ${getAttr('width_tablet')} !important;` : ''}
                    ${getAttr('height_tablet') ? `height: ${getAttr('height_tablet')} !important;` : ''}
                    ${getAttr('order_tablet') ? `order: ${getAttr('order_tablet')} !important;` : ''}
                    ${getAttr('z_index_tablet') ? `z-index: ${getAttr('z_index_tablet')} !important;` : ''}
                    ${getAttr('tablet_position') ? `position: ${getAttr('tablet_position')} !important;` : ''}
                    ${getAttr('top_tablet') ? `top: ${getAttr('top_tablet')} !important;` : ''}
                    ${getAttr('right_tablet') ? `right: ${getAttr('right_tablet')} !important;` : ''}
                    ${getAttr('bottom_tablet') ? `bottom: ${getAttr('bottom_tablet')} !important;` : ''}
                    ${getAttr('left_tablet') ? `left: ${getAttr('left_tablet')} !important;` : ''}
                    ${getAttr('tablet_display') ? `display: ${getAttr('tablet_display')} !important;` : ''}
                    ${getAttr('opacity_tablet') ? `opacity: ${getAttr('opacity_tablet')} !important;` : ''}
                    ${getAttr('overflow_tablet') ? `overflow: ${getAttr('overflow_tablet')} !important;` : ''}
                    ${getAttr('tablet_flex_direction') ? `flex-direction: ${getAttr('tablet_flex_direction')} !important;` : ''}
                    ${getAttr('tablet_justify') ? `justify-content: ${getAttr('tablet_justify')} !important;` : ''}
                    ${getAttr('tablet_flexWrap') ? `flex-wrap: ${getAttr('tablet_flexWrap')} !important;` : ''}
                    ${getAttr('tablet_flex_grow') ? `flex-grow: ${getAttr('tablet_flex_grow')} !important;` : ''}
                    ${getAttr('textAlign_tablet') ? `text-align: ${getAttr('textAlign_tablet')} !important;` : ''}
                    ${getAttr('transform_tablet') ? `transform: ${getAttr('transform_tablet')} !important;` : ''}
                    ${getAttr('transition_tablet') ? `transition: ${getAttr('transition_tablet')} !important;` : ''}
                    ${getAttr('tablet_borderStyle') ? `border-style: ${getAttr('tablet_borderStyle')} !important;` : ''}
                    ${getAttr('tablet_borderColor') ? `border-color: ${getAttr('tablet_borderColor')} !important;` : ''}
                    ${getAttr('borderWidth_tablet') ? `border-width: ${getAttr('borderWidth_tablet')} !important;` : ''}
                    ${getAttr('word_spacing_tablet') ? `word-spacing: ${getAttr('word_spacing_tablet')} !important;` : ''}
                    ${getAttr('font_weight_tablet') ? `font-weight: ${getAttr('font_weight_tablet')} !important;` : ''}
                    ${getAttr('font_style_tablet') ? `font-style: ${getAttr('font_style_tablet')} !important;` : ''}
                    ${getAttr('text_transform_tablet') ? `text-transform: ${getAttr('text_transform_tablet')} !important;` : ''}
                    ${getAttr('text_decoration_tablet') ? `text-decoration: ${getAttr('text_decoration_tablet')} !important;` : ''}
                    ${getAttr('text_shadow_tablet') ? `text-shadow: ${getAttr('text_shadow_tablet')} !important;` : ''}
                    ${getAttr('min_width_tablet') ? `min-width: ${getAttr('min_width_tablet')} !important;` : ''}
                    ${getAttr('max_width_tablet') ? `max-width: ${getAttr('max_width_tablet')} !important;` : ''}
                    ${getAttr('min_height_tablet') ? `min-height: ${getAttr('min_height_tablet')} !important;` : ''}
                    ${getAttr('max_height_tablet') ? `max-height: ${getAttr('max_height_tablet')} !important;` : ''}
                    ${getAttr('box_sizing_tablet') ? `box-sizing: ${getAttr('box_sizing_tablet')} !important;` : ''}
                    ${getAttr('visibility_tablet') ? `visibility: ${getAttr('visibility_tablet')} !important;` : ''}
                    ${getAttr('float_tablet') ? `float: ${getAttr('float_tablet')} !important;` : ''}
                    ${getAttr('clear_tablet') ? `clear: ${getAttr('clear_tablet')} !important;` : ''}
                    ${getAttr('flex_shrink_tablet') ? `flex-shrink: ${getAttr('flex_shrink_tablet')} !important;` : ''}
                    ${getAttr('flex_basis_tablet') ? `flex-basis: ${getAttr('flex_basis_tablet')} !important;` : ''}
                    ${getAttr('align_items_tablet') ? `align-items: ${getAttr('align_items_tablet')} !important;` : ''}
                    ${getAttr('align_self_tablet') ? `align-self: ${getAttr('align_self_tablet')} !important;` : ''}
                    ${getAttr('align_content_tablet') ? `align-content: ${getAttr('align_content_tablet')} !important;` : ''}
                ${getAttr('grid_template_columns_tablet') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_tablet')}, 1fr) !important;` : ''}
                    ${getAttr('box_shadow_tablet') ? `box-shadow: ${getAttr('box_shadow_tablet')} !important;` : ''}
                    ${getAttr('filter_tablet') ? `filter: ${getAttr('filter_tablet')} !important;` : ''}
                    ${getAttr('cursor_tablet') ? `cursor: ${getAttr('cursor_tablet')} !important;` : ''}
                    ${getAttr('user_select_tablet') ? `user-select: ${getAttr('user_select_tablet')} !important;` : ''}
                    ${getAttr('pointer_events_tablet') ? `pointer-events: ${getAttr('pointer_events_tablet')} !important;` : ''}
                    ${getAttr('color_tablet') ? `color: ${getAttr('color_tablet')} !important;` : ''}
                    ${getAttr('background_color_tablet') ? (getAttr('background_color_tablet').includes('gradient') ? `background: ${getAttr('background_color_tablet')} !important;` : `background-color: ${getAttr('background_color_tablet')} !important;`) : ''}
                    ${getAttr('background_image_tablet') ? `background-image: ${getAttr('background_image_tablet').startsWith('url(') ? getAttr('background_image_tablet') : `url(${getAttr('background_image_tablet')})`} !important;` : ''}
                    ${getAttr('background_size_tablet') ? `background-size: ${getAttr('background_size_tablet')} !important;` : ''}
                    ${getAttr('background_position_tablet') ? `background-position: ${getAttr('background_position_tablet')} !important;` : ''}
                    ${getAttr('background_repeat_tablet') ? `background-repeat: ${getAttr('background_repeat_tablet')} !important;` : ''}
                    ${getAttr('tablet_padding')?.top ? `padding-top: ${getAttr('tablet_padding').top} !important;` : ''}
                    ${getAttr('tablet_padding')?.right ? `padding-right: ${getAttr('tablet_padding').right} !important;` : ''}
                    ${getAttr('tablet_padding')?.bottom ? `padding-bottom: ${getAttr('tablet_padding').bottom} !important;` : ''}
                    ${getAttr('tablet_padding')?.left ? `padding-left: ${getAttr('tablet_padding').left} !important;` : ''}
                    ${getAttr('tablet_margin')?.top ? `margin-top: ${getAttr('tablet_margin').top} !important;` : ''}
                    ${getAttr('tablet_margin')?.right ? `margin-right: ${getAttr('tablet_margin').right} !important;` : ''}
                    ${getAttr('tablet_margin')?.bottom ? `margin-bottom: ${getAttr('tablet_margin').bottom} !important;` : ''}
                    ${getAttr('tablet_margin')?.left ? `margin-left: ${getAttr('tablet_margin').left} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('tablet_borderRadius').topLeft} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('tablet_borderRadius').topRight} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('tablet_borderRadius').bottomLeft} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('tablet_borderRadius').bottomRight} !important;` : ''}
                }
            }
        `;

        const mobileCSS = `
            @media (max-width: 768px) {
                ${blockSelector}, ${fallbackSelector} {
                    ${getAttr('font_size_mobile') ? `font-size: ${getAttr('font_size_mobile')} !important;` : ''}
                    ${getAttr('line_height_mobile') ? `line-height: ${getAttr('line_height_mobile')} !important;` : ''}
                    ${getAttr('letter_spacing_mobile') ? `letter-spacing: ${getAttr('letter_spacing_mobile')} !important;` : ''}
                    ${getAttr('width_mobile') ? `width: ${getAttr('width_mobile')} !important;` : ''}
                    ${getAttr('height_mobile') ? `height: ${getAttr('height_mobile')} !important;` : ''}
                    ${getAttr('order_mobile') ? `order: ${getAttr('order_mobile')} !important;` : ''}
                    ${getAttr('z_index_mobile') ? `z-index: ${getAttr('z_index_mobile')} !important;` : ''}
                    ${getAttr('mobile_position') ? `position: ${getAttr('mobile_position')} !important;` : ''}
                    ${getAttr('top_mobile') ? `top: ${getAttr('top_mobile')} !important;` : ''}
                    ${getAttr('right_mobile') ? `right: ${getAttr('right_mobile')} !important;` : ''}
                    ${getAttr('bottom_mobile') ? `bottom: ${getAttr('bottom_mobile')} !important;` : ''}
                    ${getAttr('left_mobile') ? `left: ${getAttr('left_mobile')} !important;` : ''}
                    ${getAttr('mobile_display') ? `display: ${getAttr('mobile_display')} !important;` : ''}
                    ${getAttr('opacity_mobile') ? `opacity: ${getAttr('opacity_mobile')} !important;` : ''}
                    ${getAttr('overflow_mobile') ? `overflow: ${getAttr('overflow_mobile')} !important;` : ''}
                    ${getAttr('mobile_flex_direction') ? `flex-direction: ${getAttr('mobile_flex_direction')} !important;` : ''}
                    ${getAttr('mobile_justify') ? `justify-content: ${getAttr('mobile_justify')} !important;` : ''}
                    ${getAttr('mobile_flexWrap') ? `flex-wrap: ${getAttr('mobile_flexWrap')} !important;` : ''}
                    ${getAttr('mobile_flex_grow') ? `flex-grow: ${getAttr('mobile_flex_grow')} !important;` : ''}
                    ${getAttr('grid_template_columns_mobile') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_mobile')}, 1fr) !important;` : ''}
                    ${getAttr('textAlign_mobile') ? `text-align: ${getAttr('textAlign_mobile')} !important;` : ''}
                    ${getAttr('transform_mobile') ? `transform: ${getAttr('transform_mobile')} !important;` : ''}
                    ${getAttr('transition_mobile') ? `transition: ${getAttr('transition_mobile')} !important;` : ''}
                    ${getAttr('mobile_borderStyle') ? `border-style: ${getAttr('mobile_borderStyle')} !important;` : ''}
                    ${getAttr('mobile_borderColor') ? `border-color: ${getAttr('mobile_borderColor')} !important;` : ''}
                    ${getAttr('borderWidth_mobile') ? `border-width: ${getAttr('borderWidth_mobile')} !important;` : ''}
                    ${getAttr('color_mobile') ? `color: ${getAttr('color_mobile')} !important;` : ''}
                    ${getAttr('background_color_mobile') ? (getAttr('background_color_mobile').includes('gradient') ? `background: ${getAttr('background_color_mobile')} !important;` : `background-color: ${getAttr('background_color_mobile')} !important;`) : ''}
                    ${getAttr('background_image_mobile') ? `background-image: ${getAttr('background_image_mobile').startsWith('url(') ? getAttr('background_image_mobile') : `url(${getAttr('background_image_mobile')})`} !important;` : ''}
                    ${getAttr('background_size_mobile') ? `background-size: ${getAttr('background_size_mobile')} !important;` : ''}
                    ${getAttr('background_position_mobile') ? `background-position: ${getAttr('background_position_mobile')} !important;` : ''}
                    ${getAttr('background_repeat_mobile') ? `background-repeat: ${getAttr('background_repeat_mobile')} !important;` : ''}
                    ${getAttr('mobile_padding')?.top ? `padding-top: ${getAttr('mobile_padding').top} !important;` : ''}
                    ${getAttr('mobile_padding')?.right ? `padding-right: ${getAttr('mobile_padding').right} !important;` : ''}
                    ${getAttr('mobile_padding')?.bottom ? `padding-bottom: ${getAttr('mobile_padding').bottom} !important;` : ''}
                    ${getAttr('mobile_padding')?.left ? `padding-left: ${getAttr('mobile_padding').left} !important;` : ''}
                    ${getAttr('mobile_margin')?.top ? `margin-top: ${getAttr('mobile_margin').top} !important;` : ''}
                    ${getAttr('mobile_margin')?.right ? `margin-right: ${getAttr('mobile_margin').right} !important;` : ''}
                    ${getAttr('mobile_margin')?.bottom ? `margin-bottom: ${getAttr('mobile_margin').bottom} !important;` : ''}
                    ${getAttr('mobile_margin')?.left ? `margin-left: ${getAttr('mobile_margin').left} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('mobile_borderRadius').topLeft} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('mobile_borderRadius').topRight} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('mobile_borderRadius').bottomLeft} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('mobile_borderRadius').bottomRight} !important;` : ''}
                }
            }
        `;

        const hoverCSS = `
            ${blockSelector}:hover, ${fallbackSelector}:hover {
                ${getAttr('font_size_hover') ? `font-size: ${getAttr('font_size_hover')} !important;` : ''}
                ${getAttr('line_height_hover') ? `line-height: ${getAttr('line_height_hover')} !important;` : ''}
                ${getAttr('letter_spacing_hover') ? `letter-spacing: ${getAttr('letter_spacing_hover')} !important;` : ''}
                ${getAttr('width_hover') ? `width: ${getAttr('width_hover')} !important;` : ''}
                ${getAttr('height_hover') ? `height: ${getAttr('height_hover')} !important;` : ''}
                ${getAttr('order_hover') ? `order: ${getAttr('order_hover')} !important;` : ''}
                ${getAttr('z_index_hover') ? `z-index: ${getAttr('z_index_hover')} !important;` : ''}
                ${getAttr('hover_position') ? `position: ${getAttr('hover_position')} !important;` : ''}
                ${getAttr('top_hover') ? `top: ${getAttr('top_hover')} !important;` : ''}
                ${getAttr('right_hover') ? `right: ${getAttr('right_hover')} !important;` : ''}
                ${getAttr('bottom_hover') ? `bottom: ${getAttr('bottom_hover')} !important;` : ''}
                ${getAttr('left_hover') ? `left: ${getAttr('left_hover')} !important;` : ''}
                ${getAttr('hover_display') ? `display: ${getAttr('hover_display')} !important;` : ''}
                ${getAttr('opacity_hover') ? `opacity: ${getAttr('opacity_hover')} !important;` : ''}
                ${getAttr('overflow_hover') ? `overflow: ${getAttr('overflow_hover')} !important;` : ''}
                ${getAttr('hover_flex_direction') ? `flex-direction: ${getAttr('hover_flex_direction')} !important;` : ''}
                ${getAttr('hover_justify') ? `justify-content: ${getAttr('hover_justify')} !important;` : ''}
                ${getAttr('hover_flexWrap') ? `flex-wrap: ${getAttr('hover_flexWrap')} !important;` : ''}
                ${getAttr('hover_flex_grow') ? `flex-grow: ${getAttr('hover_flex_grow')} !important;` : ''}
                ${getAttr('grid_template_columns_hover') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_hover')}, 1fr) !important;` : ''}
                ${getAttr('textAlign_hover') ? `text-align: ${getAttr('textAlign_hover')} !important;` : ''}
                ${getAttr('transform_hover') ? `transform: ${getAttr('transform_hover')} !important;` : ''}
                ${getAttr('transition_hover') ? `transition: ${getAttr('transition_hover')} !important;` : ''}
                ${getAttr('hover_borderStyle') ? `border-style: ${getAttr('hover_borderStyle')} !important;` : ''}
                ${getAttr('color_hover') ? `color: ${getAttr('color_hover')} !important;` : ''}
                ${getAttr('background_color_hover') ? (getAttr('background_color_hover').includes('gradient') ? `background: ${getAttr('background_color_hover')} !important;` : `background-color: ${getAttr('background_color_hover')} !important;`) : ''}
                ${getAttr('background_image_hover') ? `background-image: ${getAttr('background_image_hover').startsWith('url(') ? getAttr('background_image_hover') : `url(${getAttr('background_image_hover')})`} !important;` : ''}
                ${getAttr('background_size_hover') ? `background-size: ${getAttr('background_size_hover')} !important;` : ''}
                ${getAttr('background_position_hover') ? `background-position: ${getAttr('background_position_hover')} !important;` : ''}
                ${getAttr('background_repeat_hover') ? `background-repeat: ${getAttr('background_repeat_hover')} !important;` : ''}
                ${getAttr('hover_borderColor') ? `border-color: ${getAttr('hover_borderColor')} !important;` : ''}
                ${getAttr('borderWidth_hover') ? `border-width: ${getAttr('borderWidth_hover')} !important;` : ''}
                ${getAttr('hover_padding')?.top ? `padding-top: ${getAttr('hover_padding').top} !important;` : ''}
                ${getAttr('hover_padding')?.right ? `padding-right: ${getAttr('hover_padding').right} !important;` : ''}
                ${getAttr('hover_padding')?.bottom ? `padding-bottom: ${getAttr('hover_padding').bottom} !important;` : ''}
                ${getAttr('hover_padding')?.left ? `padding-left: ${getAttr('hover_padding').left} !important;` : ''}
                ${getAttr('hover_margin')?.top ? `margin-top: ${getAttr('hover_margin').top} !important;` : ''}
                ${getAttr('hover_margin')?.right ? `margin-right: ${getAttr('hover_margin').right} !important;` : ''}
                ${getAttr('hover_margin')?.bottom ? `margin-bottom: ${getAttr('hover_margin').bottom} !important;` : ''}
                ${getAttr('hover_margin')?.left ? `margin-left: ${getAttr('hover_margin').left} !important;` : ''}
                ${getAttr('hover_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('hover_borderRadius').topLeft} !important;` : ''}
                ${getAttr('hover_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('hover_borderRadius').topRight} !important;` : ''}
                ${getAttr('hover_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('hover_borderRadius').bottomLeft} !important;` : ''}
                ${getAttr('hover_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('hover_borderRadius').bottomRight} !important;` : ''}
            }
        `;

        const finalCSS = `<style>${desktopCSS}${tabletCSS}${mobileCSS}${hoverCSS}</style>`;
        return finalCSS;
    };

    // Add the modern responsive controls to ALL blocks
    const addModernResponsivePanel = (BlockEdit) => {
        return (props) => {
            // Ensure the block has a customId for frontend CSS to work
            if (!props.attributes.customId) {
                // Generate a customId from clientId (take first 6 characters)
                const customId = props.clientId.substring(0, 6);
                props.setAttributes({ customId: customId });
            }

            return el(Fragment, {},
                el(BlockEdit, props),
                // Inject CSS for modern responsive styles
                el('div', {
                    style: { display: 'none' },
                    dangerouslySetInnerHTML: { __html: generateModernResponsiveCSS(props) }
                }),
                el(InspectorControls, {},
                    el(PanelBody, {
                        title: 'Modern Responsive Design',
                        initialOpen: false
                    },
                        el(ModernResponsiveControls, props)
                    )
                )
            );
        };
    };

    wp.hooks.addFilter('editor.BlockEdit', 'modern-responsive/add-controls', addModernResponsivePanel);

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, jQuery); 