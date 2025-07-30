(function (blocks, editor, element, components, $) {
    const {createElement: el, Fragment, useEffect} = wp.element;
    const {
        TextControl,
        TextareaControl,
        __experimentalUnitControl: UnitControl,
        __experimentalNumberControl: NumberControl,
        __experimentalBoxControl: BoxControl,
        __experimentalRadioGroup: RadioGroup,
        __experimentalRadio: Radio,
        SelectControl,
        Panel,
        PanelBody,
        InspectorControls,
        ColorPalette,
        Button,
    } = components;

    const addHoverAttributes = (settings) => {
        const existingAttributes = settings.attributes || {};
        const hoverAttributes = {
            font_size_hover: {type: 'string', default: ''},
            line_height_hover: {type: 'string', default: ''},
            width_hover: {type: 'string', default: ''},
            order_hover: {type: 'string', default: ''},
            hover_textAlign: {type: 'string', default: ''},
            hover_justify: {type: 'string', default: ''},
            hover_padding: {type: "object", default: {top: "", left: "", right: "", bottom: ""}},
            hover_margin: {type: "object", default: {top: "", left: "", right: "", bottom: ""}},
            hover_border: {type: "object", default: {top: "", left: "", right: "", bottom: ""}},
            hover_borderStyle: {type: 'string', default: ''},
            hover_borderColor: {type: 'string', default: ''},
            hover_borderRadius: {type: 'object', default: {topLeft: '', topRight: '', bottomLeft: '', bottomRight: ''}},
            hover_position: {type: "string", default: ""},
            hover_display: {type: "string", default: ""},
            hover_textShadow: {type: "string", default: ""},
            letter_spacing_hover: {type: "string", default: ""},
            hover_flexWrap: {type: "string", default: ""},
            hover_columns: {type: "string", default: ""},
            hover_z_index: {type: "string", default: ""},
            hover_overflow: {type: "string", default: ""},
            hover_zoom: {type: "string", default: ""},
            hover_height: {type: "string", default: ""},
            hover_flex_direction: {type: "string", default: ""},
            hover_opacity: {type: "string", default: ""},
            hover_white_space: {type: "string", default: ""},
            hover_flex_grow: {type: "string", default: ""},
            hover_transition: {type: "string", default: ""},
        };
        settings.attributes = {
            ...existingAttributes,
            ...hoverAttributes
        };
        return settings;
    };

    wp.hooks.addFilter("blocks.registerBlockType", "core/column", addHoverAttributes);

    const HoverInspectorControls = (props) => {
        return el(
            Fragment,
            {},
            el(
                "div",
                {style: {display: "flex", gap: "10px"}},
                el(UnitControl, {
                    label: "Font Size",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({font_size_hover: value}),
                    type: "number",
                    value: props.attributes.font_size_hover,
                }),
                el(UnitControl, {
                    label: "Line Height",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({line_height_hover: value}),
                    type: "number",
                    value: props.attributes.line_height_hover,
                })
            ),
            el(
                "div",
                {style: {display: "flex", gap: "10px"}},
                el(UnitControl, {
                    label: "Width",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({width_hover: value}),
                    type: "number",
                    value: props.attributes.width_hover,
                }),
                el(NumberControl, {
                    label: "Order",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({order_hover: value}),
                    type: "number",
                    value: props.attributes.order_hover,
                })
            ),
            el(BoxControl, {
                label: "Padding",
                values: props.attributes.hover_padding,
                onChange: (nextVals) => props.setAttributes({hover_padding: nextVals}),
            }),
            el(BoxControl, {
                label: "Margin",
                values: props.attributes.hover_margin,
                onChange: (nextVals) => props.setAttributes({hover_margin: nextVals}),
            }),
            el(BoxControl, {
                label: "Border",
                values: props.attributes.hover_border,
                onChange: (nextVals) => props.setAttributes({hover_border: nextVals}),
            }),
            el("h4", {style: {fontSize: "17px", marginTop: "10px"}}, "Advanced Options"),
            el('div', {className: 'advanced'},
                el(SelectControl, {
                    label: "Position",
                    value: props.attributes.hover_position,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Initial", value: "initial"},
                        {label: "Static", value: "static"},
                        {label: "Relative", value: "relative"},
                        {label: "Absolute", value: "absolute"},
                        {label: "Fixed", value: "fixed"},
                        {label: "Sticky", value: "sticky"},
                    ],
                    onChange: (value) => props.setAttributes({hover_position: value}),
                }),
                el(SelectControl, {
                    label: "Display",
                    value: props.attributes.hover_display,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Block", value: "block"},
                        {label: "Inline", value: "inline"},
                        {label: "Inline-block", value: "inline-block"},
                        {label: "Flex", value: "flex"},
                        {label: "Inline-flex", value: "inline-flex"},
                        {label: "Grid", value: "grid"},
                        {label: "None", value: "none"},
                    ],
                    onChange: (value) => props.setAttributes({hover_display: value}),
                }),
                el(TextControl, {
                    label: "Text Shadow",
                    value: props.attributes.hover_textShadow,
                    onChange: (value) => props.setAttributes({hover_textShadow: value}),
                }),
                el(UnitControl, {
                    label: "Letter Spacing",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({letter_spacing_hover: value}),
                    type: "number",
                    value: props.attributes.letter_spacing_hover,
                }),
                el(SelectControl, {
                    label: "Flex Wrap",
                    value: props.attributes.hover_flexWrap,
                    options: [
                        {label: "Default", value: ""},
                        {label: "No Wrap", value: "nowrap"},
                        {label: "Wrap", value: "wrap"},
                        {label: "Wrap Reverse", value: "wrap-reverse"},
                    ],
                    onChange: (value) => props.setAttributes({hover_flexWrap: value}),
                }),
                el(NumberControl, {
                    label: "Columns",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({hover_columns: value}),
                    type: "number",
                    value: props.attributes.hover_columns,
                }),
                el(NumberControl, {
                    label: "Z-index",
                    value: props.attributes.hover_z_index,
                    onChange: (value) => props.setAttributes({hover_z_index: value}),
                    type: "number",
                }),
                el(SelectControl, {
                    label: "Overflow",
                    value: props.attributes.hover_overflow,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Visible", value: "visible"},
                        {label: "Hidden", value: "hidden"},
                        {label: "Scroll", value: "scroll"},
                        {label: "Auto", value: "auto"},
                    ],
                    onChange: (value) => props.setAttributes({hover_overflow: value}),
                }),
                el(NumberControl, {
                    label: "Zoom",
                    value: props.attributes.hover_zoom,
                    onChange: (value) => props.setAttributes({hover_zoom: value}),
                    type: "number",
                }),
                el(UnitControl, {
                    label: "Height",
                    value: props.attributes.hover_height,
                    onChange: (value) => props.setAttributes({hover_height: value}),
                }),
                el(SelectControl, {
                    label: "Flex Direction",
                    value: props.attributes.hover_flex_direction,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Row", value: "row"},
                        {label: "Row Reverse", value: "row-reverse"},
                        {label: "Column", value: "column"},
                        {label: "Column Reverse", value: "column-reverse"},
                    ],
                    onChange: (value) => props.setAttributes({hover_flex_direction: value}),
}),
                el(NumberControl, {
                    label: "Opacity",
                    value: props.attributes.hover_opacity,
                    onChange: (value) => props.setAttributes({hover_opacity: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(SelectControl, {
                    label: "White Space",
                    value: props.attributes.hover_white_space,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Normal", value: "normal"},
                        {label: "No Wrap", value: "nowrap"},
                        {label: "Pre", value: "pre"},
                        {label: "Pre Wrap", value: "pre-wrap"},
                        {label: "Pre Line", value: "pre-line"},
                    ],
                    onChange: (value) => props.setAttributes({hover_white_space: value}),
                }),
                el(NumberControl, {
                    label: "Flex Grow",
                    value: props.attributes.hover_flex_grow,
                    onChange: (value) => props.setAttributes({hover_flex_grow: value}),
                    type: "number",
                }),
                el(NumberControl, {
                    label: "Transition",
                    value: props.attributes.hover_transition,
                    onChange: (value) => props.setAttributes({hover_transition: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(SelectControl, {
                    label: 'Text Align',
                    value: props.attributes.hover_textAlign,
                    options: [
                        {label: 'Default', value: ''},
                        {label: 'Left', value: 'left'},
                        {label: 'Center', value: 'center'},
                        {label: 'Right', value: 'right'},
                    ],
                    onChange: (value) => props.setAttributes({hover_textAlign: value}),
                }),
                el(SelectControl, {
                    label: 'Justify',
                    value: props.attributes.hover_justify,
                    options: [
                        {label: 'Default', value: ''},
                        {label: 'Flex-start', value: 'flex-start'},
                        {label: 'Center', value: 'center'},
                        {label: 'Flex-end', value: 'flex-end'},
                        {label: 'Space-between', value: 'space-between'},
                        {label: 'Space-around', value: 'space-around'},
                    ],
                    onChange: (value) => props.setAttributes({hover_justify: value}),
                }),
                el(SelectControl, {
                    label: "Border Style",
                    value: props.attributes.hover_borderStyle,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Solid", value: "solid"},
                        {label: "Dashed", value: "dashed"},
                        {label: "Dotted", value: "dotted"},
                        {label: "Double", value: "double"},
                        {label: "Groove", value: "groove"},
                        {label: "Ridge", value: "ridge"},
                    ],
                    onChange: (value) => props.setAttributes({hover_borderStyle: value}),
                }),
                el('p', {style: {margin: "1em 0"}}, 'Border Color'),
                el(ColorPalette, {
                    colors: wp.data.select("core/block-editor").getSettings().colors,
                    value: props.attributes.hover_borderColor,
                    onChange: (value) => props.setAttributes({hover_borderColor: value}),
                }),
                el('p', {style: {margin: "1em 0"}}, 'Border Radius'),
                el(UnitControl, {
                    label: "Top Left",
                    onChange: (value) => props.setAttributes({hover_borderRadius: {...props.attributes.hover_borderRadius, topLeft: value}}),
                    value: props.attributes.hover_borderRadius.topLeft,
                }),
                el(UnitControl, {
                    label: "Top Right",
                    onChange: (value) => props.setAttributes({hover_borderRadius: {...props.attributes.hover_borderRadius, topRight: value}}),
                    value: props.attributes.hover_borderRadius.topRight,
                }),
                el(UnitControl, {
                    label: "Bottom Left",
                    onChange: (value) => props.setAttributes({hover_borderRadius: {...props.attributes.hover_borderRadius, bottomLeft: value}}),
                    value: props.attributes.hover_borderRadius.bottomLeft,
                }),
                el(UnitControl, {
                    label: "Bottom Right",
                    onChange: (value) => props.setAttributes({hover_borderRadius: {...props.attributes.hover_borderRadius, bottomRight: value}}),
                    value: props.attributes.hover_borderRadius.bottomRight,
                }),
            )
        );
    };

    window.HoverInspectorControls = HoverInspectorControls;
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);
