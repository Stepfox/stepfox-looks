(function (blocks, editor, element, components, $) {
  const { createElement: el, Fragment, useEffect } = wp.element;
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


  // Register tablet‑only attributes (excluding general ones).
  const addTabletAttributes = (settings) => {
    settings.attributes = {
      ...settings.attributes,
      font_size_tablet: { type: "string", default: "" },
      line_height_tablet: { type: "string", default: "" },
      letter_spacing_tablet: { type: "string", default: "" },
      order_tablet: { type: "string", default: "" },
      width_tablet: { type: "string", default: "" },
      tablet_padding: {
        type: "object",
        default: { top: "", left: "", right: "", bottom: "" },
      },
      tablet_margin: {
        type: "object",
        default: { top: "", left: "", right: "", bottom: "" },
      },
      tablet_border: {
        type: "object",
        default: { top: "", left: "", right: "", bottom: "" },
      },
      tablet_borderStyle: { type: "string", default: "" },
      tablet_borderColor: { type: "string", default: "" },
      tablet_borderRadius: {
        type: "object",
        default: { topLeft: "", topRight: "", bottomLeft: "", bottomRight: "" },
      },
      tablet_pos: {
        type: "object",
        default: { top: "", left: "", right: "", bottom: "" },
      },
      tablet_position: { type: "string", default: "" },
      tablet_display: { type: "string", default: "" },
      tablet_textShadow: { type: "string", default: "" },
      tablet_flexWrap: { type: "string", default: "" },
      tablet_columns: { type: "string", default: "" },

tablet_justify: { type: "string", default: "" },
tablet_textAlign: { type: "string", default: "" },
tablet_z_index: { type: "string", default: "" },
tablet_overflow: { type: "string", default: "" },
tablet_zoom: { type: "string", default: "" },
tablet_height: { type: "string", default: "" },
tablet_flex_direction: { type: "string", default: "" },
tablet_opacity: { type: "string", default: "" },
tablet_white_space: { type: "string", default: "" },
tablet_flex_grow: { type: "string", default: "" },
tablet_transition: { type: "string", default: "" },

    };
    return settings;
  };

  wp.hooks.addFilter("blocks.registerBlockType", "core/column", addTabletAttributes);
  const TabletInspectorControls =   (props) => {
    return el(
                  "div",
                  {style: {display: "flex", flexDirection: "column", gap: "10px"}},
            el("h2", {style: {fontSize: "20px"}}, "Tablet"),
            el(
                "div",
                {style: {display: "flex", gap: "10px"}},
                el(UnitControl, {
                  label: "Font Size",
                  labelPosition: "top",
                  onChange: (value) => props.setAttributes({font_size_tablet: value}),
                  type: "number",
                  value: props.attributes.font_size_tablet,
                }),
                el(UnitControl, {
                  label: "Line Height",
                  labelPosition: "top",
                  onChange: (value) => props.setAttributes({line_height_tablet: value}),
                  type: "number",
                  value: props.attributes.line_height_tablet,
                })
            ),
            el(
                "div",
                {style: {display: "flex", gap: "10px"}},
                el(UnitControl, {
                  label: "Width",
                  labelPosition: "top",
                  onChange: (value) => props.setAttributes({width_tablet: value}),
                  type: "number",
                  value: props.attributes.width_tablet,
                }),
                el(NumberControl, {
                  label: "Order",
                  labelPosition: "top",
                  onChange: (value) => props.setAttributes({order_tablet: value}),
                  type: "number",
                  value: props.attributes.order_tablet,
                })
            ),
            el(BoxControl, {
              label: "Padding",
              values: props.attributes.tablet_padding,
              onChange: (nextVals) => props.setAttributes({tablet_padding: nextVals}),
            }),
              el(UnitControl, {
                disabledUnits: false,
                label: "Margin Top",
                labelPosition: "top",
                size: "small",
                style: { width: "150px", margin: "0 auto" },
                units: [
                  { value: "px", label: "px", default: 0 },
                  { value: "%", label: "%", default: 10 },
                  { value: "em", label: "em", default: 0 },
                ],
                value: props.attributes.tablet_margin.top,
                onChange: (nextVal) =>
                  props.setAttributes({
                    tablet_margin: { ...props.attributes.tablet_margin, top: nextVal },
                  }),
              }),
              el(
                "div",
                { style: { display: "flex", gap: "10px" } },
                el(UnitControl, {
                  disabledUnits: false,
                  label: "Margin Left",
                  labelPosition: "top",
                  size: "small",
                  style: { width: "150px", margin: "0 auto" },
                  units: [
                    { value: "px", label: "px", default: 0 },
                    { value: "%", label: "%", default: 10 },
                    { value: "em", label: "em", default: 0 },
                  ],
                  value: props.attributes.tablet_margin.left,
                  onChange: (nextVal) =>
                    props.setAttributes({
                      tablet_margin: { ...props.attributes.tablet_margin, left: nextVal },
                    }),
                }),
                el(UnitControl, {
                  disabledUnits: false,
                  label: "Margin Right",
                  labelPosition: "top",
                  size: "small",
                  style: { width: "150px", margin: "0 auto" },
                  units: [
                    { value: "px", label: "px", default: 0 },
                    { value: "%", label: "%", default: 10 },
                    { value: "em", label: "em", default: 0 },
                  ],
                  value: props.attributes.tablet_margin.right,
                  onChange: (nextVal) =>
                    props.setAttributes({
                      tablet_margin: { ...props.attributes.tablet_margin, right: nextVal },
                    }),
                })
              ),
              el(UnitControl, {
                disabledUnits: false,
                label: "Margin Bottom",
                labelPosition: "top",
                size: "small",
                style: { width: "150px", margin: "0 auto" },
                units: [
                  { value: "px", label: "px", default: 0 },
                  { value: "%", label: "%", default: 10 },
                  { value: "em", label: "em", default: 0 },
                ],
                value: props.attributes.tablet_margin.bottom,
                onChange: (nextVal) =>
                  props.setAttributes({
                    tablet_margin: { ...props.attributes.tablet_margin, bottom: nextVal },
                  }),
              }),
            el(BoxControl, {
              label: "Border",
              values: props.attributes.tablet_border,
              onChange: (nextVals) => props.setAttributes({tablet_border: nextVals}),
            }),
            el("h4", {style: {fontSize: "17px", marginTop: "10px"}}, "Advanced Options"),
            el('div', {className: 'advanced'},
                el(SelectControl, {
                    label: "Position",
                    value: props.attributes.tablet_position,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Initial", value: "initial"},
                        {label: "Static", value: "static"},
                        {label: "Relative", value: "relative"},
                        {label: "Absolute", value: "absolute"},
                        {label: "Fixed", value: "fixed"},
                        {label: "Sticky", value: "sticky"},
                    ],
                    onChange: (value) => props.setAttributes({tablet_position: value}),
                }),
                el(SelectControl, {
                    label: "Display",
                    value: props.attributes.tablet_display,
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
                    onChange: (value) => props.setAttributes({tablet_display: value}),
                }),
                el(TextControl, {
                    label: "Text Shadow",
                    value: props.attributes.tablet_textShadow,
                    onChange: (value) => props.setAttributes({tablet_textShadow: value}),
                }),
                el(UnitControl, {
                  label: "Letter Spacing",
                  labelPosition: "top",
                  onChange: (value) => props.setAttributes({letter_spacing_tablet: value}),
                  type: "number",
                  value: props.attributes.letter_spacing_tablet,
                }),
                el(SelectControl, {
                    label: "Flex Wrap",
                    value: props.attributes.tablet_flexWrap,
                    options: [
                        {label: "Default", value: ""},
                        {label: "No Wrap", value: "nowrap"},
                        {label: "Wrap", value: "wrap"},
                        {label: "Wrap Reverse", value: "wrap-reverse"},
                    ],
                    onChange: (value) => props.setAttributes({tablet_flexWrap: value}),
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
                    value: props.attributes.tablet_z_index,
                    onChange: (value) => props.setAttributes({tablet_z_index: value}),
                    type: "number",
                    value: props.attributes.tablet_overflow,
                }),
                el(SelectControl, {
                    label: "Overflow",
                    value: props.attributes.tablet_overflow,
                    onChange: (value) => props.setAttributes({tablet_overflow: value}),
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
                    value: props.attributes.tablet_zoom,
                    onChange: (value) => props.setAttributes({tablet_zoom: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(NumberControl, {
                    label: "Height",
                    value: props.attributes.tablet_height,
                    onChange: (value) => props.setAttributes({tablet_height: value}),
                    type: "number",
                    value: props.attributes.tablet_columns,
                }),
                el(UnitControl, {
                    label: "Height",
                    labelPosition: "top",
                    onChange: (value) => props.setAttributes({tablet_height: value}),
                    type: "number",
                    value: props.attributes.tablet_height,
                }),
                el(SelectControl, {
                    label: "Flex Direction",
                    value: props.attributes.tablet_flex_direction,
                    onChange: (value) => props.setAttributes({tablet_flex_direction: value}),
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
    value: props.attributes.tablet_justify,
    onChange: (value) => props.setAttributes({ tablet_justify: value }),
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
    value: props.attributes.tablet_textAlign,
    onChange: (value) => props.setAttributes({ tablet_textAlign: value }),
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
                    value: props.attributes.tablet_opacity,
                    onChange: (value) => props.setAttributes({tablet_opacity: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(SelectControl, {
                    label: "White Space",
                    value: props.attributes.tablet_white_space,
                    onChange: (value) => props.setAttributes({tablet_white_space: value}),
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
                    value: props.attributes.tablet_flex_grow,
                    onChange: (value) => props.setAttributes({tablet_flex_grow: value}),
                    options: [
                        {label: "Default", value: ""},
                        {label: "Grow", value: "1"},
                        {label: "Dont Grow", value: "0"},
                    ]
                }),
                el(NumberControl, {
                    label: "Transition",
                    value: props.attributes.tablet_transition,
                    onChange: (value) => props.setAttributes({tablet_transition: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(SelectControl, {
                    label: "Border Style",
                    value: props.attributes.tablet_borderStyle,
                    options: [
                        {label: "Default", value: ""},
                        {label: "Solid", value: "solid"},
                        {label: "Dashed", value: "dashed"},
                        {label: "Dotted", value: "dotted"},
                        {label: "Double", value: "double"},
                        {label: "Groove", value: "groove"},
                        {label: "Ridge", value: "ridge"},
                    ],
                    onChange: (value) => props.setAttributes({tablet_borderStyle: value}),
                }),
                el('p', {style: {margin: "1em 0"}}, 'Border Color'),
                el(ColorPalette, {
                    colors: wp.data.select("core/block-editor").getSettings().colors,
                    value: props.attributes.tablet_borderColor,
                    onChange: (value) => props.setAttributes({tablet_borderColor: value}),
                }),
                el('p', {style: {margin: "1em 0"}}, 'Border Radius'),
                el(UnitControl, {
                    label: "Top Left",
                    onChange: (value) => props.setAttributes({tablet_borderRadius: {...props.attributes.tablet_borderRadius, topLeft: value}}),
                    value: props.attributes.tablet_borderRadius.topLeft,
                }),
                el(UnitControl, {
                    label: "Top Right",
                    onChange: (value) => props.setAttributes({tablet_borderRadius: {...props.attributes.tablet_borderRadius, topRight: value}}),
                    value: props.attributes.tablet_borderRadius.topRight,
                }),
                el(UnitControl, {
                    label: "Bottom Left",
                    onChange: (value) => props.setAttributes({tablet_borderRadius: {...props.attributes.tablet_borderRadius, bottomLeft: value}}),
                    value: props.attributes.tablet_borderRadius.bottomLeft,
                }),
                el(UnitControl, {
                    label: "Bottom Right",
                    onChange: (value) => props.setAttributes({tablet_borderRadius: {...props.attributes.tablet_borderRadius, bottomRight: value}}),
                    value: props.attributes.tablet_borderRadius.bottomRight,
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
                value: props.attributes.tablet_pos.top,
                onChange: (nextVal) =>
                    props.setAttributes({
                        tablet_pos: {...props.attributes.tablet_pos, top: nextVal},
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
                    value: props.attributes.tablet_pos.left,
                    onChange: (nextVal) =>
                        props.setAttributes({
                            tablet_pos: {...props.attributes.tablet_pos, left: nextVal},
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
                    value: props.attributes.tablet_pos.right,
                    onChange: (nextVal) =>
                        props.setAttributes({
                            tablet_pos: {...props.attributes.tablet_pos, right: nextVal},
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
                value: props.attributes.tablet_pos.bottom,
                onChange: (nextVal) =>
                    props.setAttributes({
                        tablet_pos: {...props.attributes.tablet_pos, bottom: nextVal},
                    }),
            }),

    )
  }
  window.TabletInspectorControls = TabletInspectorControls;
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);