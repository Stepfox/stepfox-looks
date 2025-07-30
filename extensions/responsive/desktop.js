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


    // Register desktop‑only attributes (excluding the general attributes which are registered separately).
    const addDesktopAttributes = (settings) => {
        settings.attributes = {
            ...settings.attributes,
            font_size_desktop: {type: "string", default: ""},
            line_height_desktop: {type: "string", default: ""},
            letter_spacing_desktop: {type: "string", default: ""},
            order_desktop: {type: "string", default: ""},
            width_desktop: {type: "string", default: ""},
            desktop_padding: {
                type: "object",
                default: {top: "", left: "", right: "", bottom: ""},
            },
            desktop_margin: {
                type: "object",
                default: {top: "", left: "", right: "", bottom: ""},
            },
            desktop_border: {
                type: "object",
                default: {top: "", left: "", right: "", bottom: ""},
            },
            desktop_borderStyle: { type: "string", default: "" },
            desktop_borderColor: { type: "string", default: "" },
            desktop_borderRadius: {
                type: "object",
                default: { topLeft: "", topRight: "", bottomLeft: "", bottomRight: "" },
            },
            desktop_pos: {
                type: "object",
                default: {top: "", left: "", right: "", bottom: ""},
            },

            desktop_position: {type: "string", default: ""},
            desktop_display: {type: "string", default: ""},
            desktop_textShadow: {type: "string", default: ""},
            desktop_flexWrap: {type: "string", default: ""},
            desktop_textAlign: {type: "string", default: ""},
            desktop_justify: {type: "string", default: ""},
            desktop_columns: {type: "string", default: ""},


            desktop_z_index: {type: "string", default: ""},
            desktop_overflow: {type: "string", default: ""},
            desktop_zoom: {type: "string", default: ""},
            desktop_height: {type: "string", default: ""},
            desktop_flex_direction: {type: "string", default: ""},
            desktop_opacity: {type: "string", default: ""},
            desktop_white_space: {type: "string", default: ""},
            desktop_flex_grow: {type: "string", default: ""},
            desktop_transition: {type: "string", default: ""},
            /*


            ?
        "max-height",
        "max-width",
        "min-height",
        "min-width",



             */
        };
        return settings;
    };

    wp.hooks.addFilter("blocks.registerBlockType", "core/column", addDesktopAttributes);


    const DesktopInspectorControls = (props) => {
        return el(
            "div",
            {style: {display: "flex", flexDirection: "column", gap: "10px"}},
            // Visibility Controls
            el(
                "div",
                {style: {display: "flex", gap: "10px"}},
                el(UnitControl, {
                    label: "Font Size",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({font_size_desktop: value}),
                    type: "number",
                    value: props.attributes.font_size_desktop,
                }),
                el(UnitControl, {
                    label: "Line Height",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({line_height_desktop: value}),
                    type: "number",
                    value: props.attributes.line_height_desktop,
                })
            ),
            el(
                "div",
                {style: {display: "flex", gap: "10px"}},
                el(UnitControl, {
                    label: "Width",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({width_desktop: value}),
                    type: "number",
                    value: props.attributes.width_desktop,
                }),
                el(NumberControl, {
                    label: "Order",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({order_desktop: value}),
                    type: "number",
                    value: props.attributes.order_desktop,
                })
            ),
            // Spacing Controls
            el(BoxControl, {
                label: "Padding",
                values: props.attributes.desktop_padding,
                onChange: (nextVals) => props.setAttributes({desktop_padding: nextVals}),
            }),
            el(UnitControl, {
                disabledUnits: false,
                label: "Margin Top",
                labelPosition: "top",
                size: "small",
                style: {width: "115px", margin: "0 auto"},
                units: [
                    {value: "px", label: "px", default: 0},
                    {value: "%", label: "%", default: 10},
                    {value: "em", label: "em", default: 0},
                ],
                value: props.attributes.desktop_margin.top,
                onChange: (nextVal) =>
                    props.setAttributes({
                        desktop_margin: {...props.attributes.desktop_margin, top: nextVal},
                    }),
            }),
            el(
                "div",
                {style: {display: "flex", gap: "10px"}},
                el(UnitControl, {
                    disabledUnits: false,
                    label: "Margin Left",
                    labelPosition: "top",
                    size: "small",
                    style: {width: "115px", margin: "0 auto"},
                    units: [
                        {value: "px", label: "px", default: 0},
                        {value: "%", label: "%", default: 10},
                        {value: "em", label: "em", default: 0},
                    ],
                    value: props.attributes.desktop_margin.left,
                    onChange: (nextVal) =>
                        props.setAttributes({
                            desktop_margin: {...props.attributes.desktop_margin, left: nextVal},
                        }),
                }),
                el(UnitControl, {
                    disabledUnits: false,
                    label: "Margin Right",
                    labelPosition: "top",
                    size: "small",
                    style: {width: "115px", margin: "0 auto"},
                    units: [
                        {value: "px", label: "px", default: 0},
                        {value: "%", label: "%", default: 10},
                        {value: "em", label: "em", default: 0},
                    ],
                    value: props.attributes.desktop_margin.right,
                    onChange: (nextVal) =>
                        props.setAttributes({
                            desktop_margin: {...props.attributes.desktop_margin, right: nextVal},
                        }),
                })
            ),
            el(UnitControl, {
                disabledUnits: false,
                label: "Margin Bottom",
                labelPosition: "top",
                size: "small",
                style: {width: "115px", margin: "0 auto"},
                units: [
                    {value: "px", label: "px", default: 0},
                    {value: "%", label: "%", default: 10},
                    {value: "em", label: "em", default: 0},
                ],
                value: props.attributes.desktop_margin.bottom,
                onChange: (nextVal) =>
                    props.setAttributes({
                        desktop_margin: {...props.attributes.desktop_margin, bottom: nextVal},
                    }),
            }),
            el(BoxControl, {
                label: "Border",
                values: props.attributes.desktop_border,
                onChange: (nextVals) => props.setAttributes({desktop_border: nextVals}),
            }),
            // Advanced Options
            el("h4", {style: {fontSize: "17px", marginTop: "10px"}}, "Advanced Options"),
            el('div', {className: 'advanced'},
                el(SelectControl, {
                    label: "Position",
                    value: props.attributes.desktop_position,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Initial", value: "initial"},
                        {label: "Static", value: "static"},
                        {label: "Relative", value: "relative"},
                        {label: "Absolute", value: "absolute"},
                        {label: "Fixed", value: "fixed"},
                        {label: "Sticky", value: "sticky"},
                    ],
                    onChange: (value) => props.setAttributes({desktop_position: value}),
                }),
                el(SelectControl, {
                    label: "Display",
                    value: props.attributes.desktop_display,
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
                    onChange: (value) => props.setAttributes({desktop_display: value}),
                }),
                el(TextControl, {
                    label: "Text Shadow",
                    value: props.attributes.desktop_textShadow,
                    onChange: (value) => props.setAttributes({desktop_textShadow: value}),
                }),
                el(UnitControl, {
                    label: "Letter Spacing",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({letter_spacing_desktop: value}),
                    type: "number",
                    value: props.attributes.letter_spacing_desktop,
                }),
                el(SelectControl, {
                    label: "Flex Wrap",
                    value: props.attributes.desktop_flexWrap,
                    options: [
                        {label: "Default", value: ""},
                        {label: "No Wrap", value: "nowrap"},
                        {label: "Wrap", value: "wrap"},
                        {label: "Wrap Reverse", value: "wrap-reverse"},
                    ],
                    onChange: (value) => props.setAttributes({desktop_flexWrap: value}),
                }),
                el(NumberControl, {
                    label: "Columns",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({tablet_columns: value}),
                    type: "number",
                    value: props.attributes.tablet_columns,
                }),
                el(NumberControl, {
                    label: "Z-index",
                    value: props.attributes.desktop_z_index,
                    onChange: (value) => props.setAttributes({desktop_z_index: value}),
                    type: "number",
                    value: props.attributes.desktop_overflow,
                }),
                el(SelectControl, {
                    label: "Overflow",
                    value: props.attributes.desktop_overflow,
                    onChange: (value) => props.setAttributes({desktop_overflow: value}),
                    options: [
                        {label: "Default", value: ""},
                        {label: "Visible", value: "visible"},
                        {label: "Hidden", value: "hidden"},
                        {label: "Scroll", value: "scroll"},
                        {label: "Auto", value: "auto"},
                        {label: "Clip", value: "clip"},
                        {label: "Initial", value: "initial"},
                        {label: "Inherit", value: "inherit"},
                        {label: "Unset", value: "unset"}
                    ],
                }),
                el(NumberControl, {
                    label: "Zoom",
                    value: props.attributes.desktop_zoom,
                    onChange: (value) => props.setAttributes({desktop_zoom: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(NumberControl, {
                    label: "Height",
                    value: props.attributes.desktop_height,
                    onChange: (value) => props.setAttributes({desktop_height: value}),
                    type: "number",
                    value: props.attributes.tablet_columns,
                }),
                el(UnitControl, {
                    label: "Height",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({desktop_height: value}),
                    type: "number",
                    value: props.attributes.desktop_height,
                }),
                el(SelectControl, {
                    label: "Flex Direction",
                    value: props.attributes.desktop_flex_direction,
                    onChange: (value) => props.setAttributes({desktop_flex_direction: value}),
                    options: [
                        {label: "Default", value: ""},
                        {label: "Row", value: "row"},
                        {label: "Row Reverse", value: "row-reverse"},
                        {label: "Column", value: "column"},
                        {label: "Column Reverse", value: "column-reverse"},
                    ],
                }),
el(SelectControl, {
    label: "Justify",
    value: props.attributes.desktop_justify,
    onChange: (value) => props.setAttributes({ desktop_justify: value }),
    options: [
        { label: "flex‑start", value: "flex-start" },
        { label: "center", value: "center" },
        { label: "flex‑end", value: "flex-end" },
        { label: "space‑around", value: "space-around" },
        { label: "space‑between", value: "space-between" },
        { label: "space‑evenly", value: "space-evenly" },
    ],
}),
el(SelectControl, {
    label: "Text Align",
    value: props.attributes.desktop_textAlign,
    onChange: (value) => props.setAttributes({ desktop_textAlign: value }),
    options: [
        { label: "Default", value: "" },
        { label: "left", value: "left" },
        { label: "center", value: "center" },
        { label: "right", value: "right" },
        { label: "justify", value: "justify" },

    ],
}),

                el(NumberControl, {
                    label: "Opacity",
                    value: props.attributes.desktop_opacity,
                    onChange: (value) => props.setAttributes({desktop_opacity: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(SelectControl, {
                    label: "White Space",
                    value: props.attributes.desktop_white_space,
                    onChange: (value) => props.setAttributes({desktop_white_space: value}),
                    options: [
                        {label: "Default", value: ""},
                        {label: "Normal", value: "normal"},
                        {label: "No Wrap", value: "nowrap"},
                        {label: "Pre", value: "pre"},
                        {label: "Pre Wrap", value: "pre-wrap"},
                        {label: "Pre Line", value: "pre-line"},
                        {label: "Break Spaces", value: "break-spaces"},
                    ],
                }),
                el(SelectControl, {
                    label: "Flex Grow",
                    value: props.attributes.desktop_flex_grow,
                    onChange: (value) => props.setAttributes({desktop_flex_grow: value}),
                    options: [
                        {label: "Default", value: ""},
                        {label: "Grow", value: "1"},
                        {label: "Dont Grow", value: "0"},
                    ]
                }),
                el(NumberControl, {
                    label: "Transition",
                    value: props.attributes.desktop_transition,
                    onChange: (value) => props.setAttributes({desktop_transition: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(SelectControl, {
                    label: "Border Style",
                    value: props.attributes.desktop_borderStyle,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Solid", value: "solid"},
                        {label: "Dashed", value: "dashed"},
                        {label: "Dotted", value: "dotted"},
                        {label: "Double", value: "double"},
                        {label: "Groove", value: "groove"},
                        {label: "Ridge", value: "ridge"},
                    ],
                    onChange: (value) => props.setAttributes({desktop_borderStyle: value}),
                }),
                el('p', {style: {margin: "1em 0"}}, 'Border Color'),
                el(ColorPalette, {
                    colors: wp.data.select("core/block-editor").getSettings().colors,
                    value: props.attributes.desktop_borderColor,
                    onChange: (value) => props.setAttributes({desktop_borderColor: value}),
                }),
                el('p', {style: {margin: "1em 0"}}, 'Border Radius'),
                el(UnitControl, {
                    label: "Top Left",
                    onChange: (value) => props.setAttributes({desktop_borderRadius: {...props.attributes.desktop_borderRadius, topLeft: value}}),
                    value: props.attributes.desktop_borderRadius.topLeft,
                }),
                el(UnitControl, {
                    label: "Top Right",
                    onChange: (value) => props.setAttributes({desktop_borderRadius: {...props.attributes.desktop_borderRadius, topRight: value}}),
                    value: props.attributes.desktop_borderRadius.topRight,
                }),
                el(UnitControl, {
                    label: "Bottom Left",
                    onChange: (value) => props.setAttributes({desktop_borderRadius: {...props.attributes.desktop_borderRadius, bottomLeft: value}}),
                    value: props.attributes.desktop_borderRadius.bottomLeft,
                }),
                el(UnitControl, {
                    label: "Bottom Right",
                    onChange: (value) => props.setAttributes({desktop_borderRadius: {...props.attributes.desktop_borderRadius, bottomRight: value}}),
                    value: props.attributes.desktop_borderRadius.bottomRight,
                }),
            ),
            el(UnitControl, {
                disabledUnits: false,
                label: "Top",
                labelPosition: "top",
                size: "small",
                style: {width: "100px", margin: "0 auto"},
                units: [
                    {value: "px", label: "px", default: 0},
                    {value: "%", label: "%", default: 10},
                    {value: "em", label: "em", default: 0},
                ],
                value: props.attributes.desktop_pos.top,
                onChange: (nextVal) =>
                    props.setAttributes({
                        desktop_pos: {...props.attributes.desktop_pos, top: nextVal},
                    }),
            }),
            el(
                "div",
                {style: {display: "flex", gap: "10px", maxWidth: "100%;"}},
                el(UnitControl, {
                    disabledUnits: false,
                    label: "Left",
                    labelPosition: "top",
                    size: "small",
                    style: {width: "115px", margin: "0 auto"},
                    units: [
                        {value: "px", label: "px", default: 0},
                        {value: "%", label: "%", default: 10},
                        {value: "em", label: "em", default: 0},
                    ],
                    value: props.attributes.desktop_pos.left,
                    onChange: (nextVal) =>
                        props.setAttributes({
                            desktop_pos: {...props.attributes.desktop_pos, left: nextVal},
                        }),
                }),
                el(UnitControl, {
                    disabledUnits: false,
                    label: "Right",
                    labelPosition: "top",
                    size: "small",
                    style: {width: "115px", margin: "0 auto"},
                    units: [
                        {value: "px", label: "px", default: 0},
                        {value: "%", label: "%", default: 10},
                        {value: "em", label: "em", default: 0},
                    ],
                    value: props.attributes.desktop_pos.right,
                    onChange: (nextVal) =>
                        props.setAttributes({
                            desktop_pos: {...props.attributes.desktop_pos, right: nextVal},
                        }),
                })
            ),
            el(UnitControl, {
                disabledUnits: false,
                label: "Bottom",
                labelPosition: "top",
                size: "small",
                style: {width: "100px", margin: "0 auto"},
                units: [
                    {value: "px", label: "px", default: 0},
                    {value: "%", label: "%", default: 10},
                    {value: "em", label: "em", default: 0},
                ],
                value: props.attributes.desktop_pos.bottom,
                onChange: (nextVal) =>
                    props.setAttributes({
                        desktop_pos: {...props.attributes.desktop_pos, bottom: nextVal},
                    }),
            }),
        )

    }

    window.DesktopInspectorControls = DesktopInspectorControls;
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);
