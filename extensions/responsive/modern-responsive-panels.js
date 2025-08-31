/**
 * Modern Responsive Panels
 * Complete UI panels for responsive controls
 */

(function (blocks, editor, element, components, $) {
    
    const { createElement: el, Fragment } = wp.element;
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

    // Create all responsive panels
    const createResponsivePanels = (utils, ui) => {
        
        // Layout & Positioning Panel
        const LayoutPanel = () => el(PanelBody, {
            title: ui.PanelHeader('📐', 'Layout & Positioning', 'layout'),
            initialOpen: false,
            className: 'modern-responsive-panel'
        },
            // Position and Display
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Position',
                    value: utils.getAttribute('position'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Static', value: 'static' },
                        { label: 'Relative', value: 'relative' },
                        { label: 'Absolute', value: 'absolute' },
                        { label: 'Fixed', value: 'fixed' },
                        { label: 'Sticky', value: 'sticky' }
                    ],
                    onChange: (value) => utils.setAttribute('position', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Display',
                    value: utils.getAttribute('display'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Block', value: 'block' },
                        { label: 'Flex', value: 'flex' },
                        { label: 'Grid', value: 'grid' },
                        { label: 'Inline', value: 'inline' },
                        { label: 'Inline-Block', value: 'inline-block' },
                        { label: 'None', value: 'none' }
                    ],
                    onChange: (value) => utils.setAttribute('display', value)
                })
            ),
            // Grid columns (only when display is grid)
            utils.getAttribute('display') === 'grid' && ui.InputRow([
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Grid Columns',
                    value: utils.getAttribute('grid_template_columns'),
                    onChange: (value) => utils.setAttribute('grid_template_columns', value),
                    min: 1,
                    max: 12,
                    step: 1,
                    help: 'Number of columns (creates repeat(X, 1fr))'
                }),
                el('div', { style: { width: '48%' } })
            ]),
            // Width and Height
            ui.TwoColumn(
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Width / Flex Basis',
                    value: utils.getAttribute('width'),
                    onChange: (value) => utils.setAttribute('width', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Height',
                    value: utils.getAttribute('height'),
                    onChange: (value) => utils.setAttribute('height', value)
                })
            ),
            // Z-Index and Order
            ui.TwoColumn(
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Z-Index',
                    value: utils.getAttribute('z_index'),
                    onChange: (value) => utils.setAttribute('z_index', value)
                }),
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Order',
                    value: utils.getAttribute('order'),
                    onChange: (value) => utils.setAttribute('order', value)
                })
            ),
            // Position coordinates
            ui.TwoColumn(
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Top',
                    value: utils.getAttribute('top'),
                    onChange: (value) => utils.setAttribute('top', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Right',
                    value: utils.getAttribute('right'),
                    onChange: (value) => utils.setAttribute('right', value)
                })
            ),
            ui.TwoColumn(
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Bottom',
                    value: utils.getAttribute('bottom'),
                    onChange: (value) => utils.setAttribute('bottom', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Left',
                    value: utils.getAttribute('left'),
                    onChange: (value) => utils.setAttribute('left', value)
                })
            ),
            // Min/Max Width
            ui.TwoColumn(
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Min Width',
                    value: utils.getAttribute('min_width'),
                    onChange: (value) => utils.setAttribute('min_width', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Max Width',
                    value: utils.getAttribute('max_width'),
                    onChange: (value) => utils.setAttribute('max_width', value)
                })
            ),
            // Min/Max Height
            ui.TwoColumn(
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Min Height',
                    value: utils.getAttribute('min_height'),
                    onChange: (value) => utils.setAttribute('min_height', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Max Height',
                    value: utils.getAttribute('max_height'),
                    onChange: (value) => utils.setAttribute('max_height', value)
                })
            ),
            // Box Sizing and Visibility
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Box Sizing',
                    value: utils.getAttribute('box_sizing'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Content Box', value: 'content-box' },
                        { label: 'Border Box', value: 'border-box' }
                    ],
                    onChange: (value) => utils.setAttribute('box_sizing', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Visibility',
                    value: utils.getAttribute('visibility'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Visible', value: 'visible' },
                        { label: 'Hidden', value: 'hidden' },
                        { label: 'Collapse', value: 'collapse' }
                    ],
                    onChange: (value) => utils.setAttribute('visibility', value)
                })
            ),
            // Float and Clear
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Float',
                    value: utils.getAttribute('float'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'None', value: 'none' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' }
                    ],
                    onChange: (value) => utils.setAttribute('float', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Clear',
                    value: utils.getAttribute('clear'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'None', value: 'none' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Both', value: 'both' }
                    ],
                    onChange: (value) => utils.setAttribute('clear', value)
                })
            ),
            // Overflow and Zoom
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Overflow',
                    value: utils.getAttribute('overflow'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Visible', value: 'visible' },
                        { label: 'Hidden', value: 'hidden' },
                        { label: 'Scroll', value: 'scroll' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'Clip', value: 'clip' }
                    ],
                    onChange: (value) => utils.setAttribute('overflow', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Zoom',
                    value: utils.getAttribute('zoom'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: '50%', value: '0.5' },
                        { label: '75%', value: '0.75' },
                        { label: '100%', value: '1' },
                        { label: '125%', value: '1.25' },
                        { label: '150%', value: '1.5' },
                        { label: '200%', value: '2' }
                    ],
                    onChange: (value) => utils.setAttribute('zoom', value)
                })
            )
        );

        // Typography Panel
        const TypographyPanel = () => el(PanelBody, {
            title: ui.PanelHeader('Aa', 'Typography', 'typography'),
            initialOpen: false,
            className: 'modern-responsive-panel'
        },
            // Font Size and Line Height
            ui.TwoColumn(
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Font Size',
                    value: utils.getAttribute('font_size'),
                    onChange: (value) => utils.setAttribute('font_size', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Line Height',
                    value: utils.getAttribute('line_height'),
                    onChange: (value) => utils.setAttribute('line_height', value)
                })
            ),
            // Font Weight and Style
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Font Weight',
                    value: utils.getAttribute('font_weight'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: '100 - Thin', value: '100' },
                        { label: '200 - Extra Light', value: '200' },
                        { label: '300 - Light', value: '300' },
                        { label: '400 - Normal', value: '400' },
                        { label: '500 - Medium', value: '500' },
                        { label: '600 - Semi Bold', value: '600' },
                        { label: '700 - Bold', value: '700' },
                        { label: '800 - Extra Bold', value: '800' },
                        { label: '900 - Black', value: '900' }
                    ],
                    onChange: (value) => utils.setAttribute('font_weight', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Font Style',
                    value: utils.getAttribute('font_style'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Normal', value: 'normal' },
                        { label: 'Italic', value: 'italic' },
                        { label: 'Oblique', value: 'oblique' }
                    ],
                    onChange: (value) => utils.setAttribute('font_style', value)
                })
            ),
            // Text Transform and Decoration
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Text Transform',
                    value: utils.getAttribute('text_transform'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'None', value: 'none' },
                        { label: 'Capitalize', value: 'capitalize' },
                        { label: 'Uppercase', value: 'uppercase' },
                        { label: 'Lowercase', value: 'lowercase' }
                    ],
                    onChange: (value) => utils.setAttribute('text_transform', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Text Decoration',
                    value: utils.getAttribute('text_decoration'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'None', value: 'none' },
                        { label: 'Underline', value: 'underline' },
                        { label: 'Overline', value: 'overline' },
                        { label: 'Line Through', value: 'line-through' }
                    ],
                    onChange: (value) => utils.setAttribute('text_decoration', value)
                })
            ),
            // Text Align and Letter Spacing
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Text Align',
                    value: utils.getAttribute('textAlign'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                        { label: 'Justify', value: 'justify' }
                    ],
                    onChange: (value) => utils.setAttribute('textAlign', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Letter Spacing',
                    value: utils.getAttribute('letter_spacing'),
                    onChange: (value) => utils.setAttribute('letter_spacing', value)
                })
            ),
            // Word Spacing and Text Shadow
            ui.TwoColumn(
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Word Spacing',
                    value: utils.getAttribute('word_spacing'),
                    onChange: (value) => utils.setAttribute('word_spacing', value)
                }),
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Text Shadow',
                    value: utils.getAttribute('text_shadow'),
                    onChange: (value) => utils.setAttribute('text_shadow', value),
                    help: 'e.g. 2px 2px 4px rgba(0,0,0,0.5)'
                })
            ),
            // Text Color
            el('div', { style: { marginTop: '8px', marginBottom: '16px' } },
                el('label', { 
                    style: { 
                        color: '#fff', 
                        fontSize: '11px', 
                        marginBottom: '8px', 
                        display: 'block' 
                    } 
                }, 'Text Color'),
                utils.getAttribute('color') ? 
                    el('div', { 
                        style: { 
                            padding: '8px', 
                            backgroundColor: '#444', 
                            borderRadius: '4px', 
                            marginBottom: '8px',
                            fontSize: '11px',
                            color: '#fff'
                        } 
                    }, `Current: ${utils.getAttribute('color')}`) : null,
                el(ColorPalette, {
                    value: utils.getAttribute('color'),
                    onChange: (color) => {
                        const colorValue = color || '';
                        utils.setAttribute('color', colorValue);
                    },
                    colors: [
                        { name: 'Black', color: '#000000' },
                        { name: 'Dark Gray', color: '#333333' },
                        { name: 'Gray', color: '#666666' },
                        { name: 'Light Gray', color: '#cccccc' },
                        { name: 'White', color: '#ffffff' },
                        { name: 'Primary', color: '#667eea' },
                        { name: 'Red', color: '#ff6b6b' },
                        { name: 'Blue', color: '#45b7d1' }
                    ],
                    clearable: true,
                    disableCustomColors: false
                }),
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Custom Color',
                    value: utils.getAttribute('color'),
                    onChange: (value) => utils.setAttribute('color', value),
                    placeholder: 'e.g. #333 or rgba(0,0,0,0.5)',
                    style: { marginTop: '8px' }
                })
            )
        );

        // Spacing Panel
        const SpacingPanel = () => el(PanelBody, {
            title: ui.PanelHeader('📏', 'Spacing', 'spacing'),
            initialOpen: false,
            className: 'modern-responsive-panel'
        },
            // Padding
            el('div', { style: { marginBottom: '16px' } },
                el('label', { 
                    style: { 
                        color: '#fff', 
                        fontSize: '11px', 
                        marginBottom: '4px', 
                        display: 'block' 
                    } 
                }, 'Padding'),
                el(BoxControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    values: utils.getAttribute('padding'),
                    onChange: (value) => utils.setAttribute('padding', value)
                })
            ),
            // Margin
            el('div', { style: { marginBottom: '16px' } },
                el('label', { 
                    style: { 
                        color: '#fff', 
                        fontSize: '11px', 
                        marginBottom: '4px', 
                        display: 'block' 
                    } 
                }, 'Margin'),
                el(BoxControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    allowReset: true,
                    resetValues: { top: '', right: '', bottom: '', left: '' },
                    inputProps: {
                        min: -9999,
                        max: 9999
                    },
                    values: utils.getAttribute('margin'),
                    onChange: (value) => utils.setAttribute('margin', value)
                })
            )
        );

        // Borders Panel
        const BordersPanel = () => el(PanelBody, {
            title: ui.PanelHeader('⬜', 'Borders', 'borders'),
            initialOpen: false,
            className: 'modern-responsive-panel'
        },
            // Border Width - Box Control for all 4 sides
            el('div', { style: { marginBottom: '16px' } },
                el('label', { 
                    style: { 
                        color: '#fff', 
                        fontSize: '11px', 
                        marginBottom: '4px', 
                        display: 'block' 
                    } 
                }, 'Border Width'),
                el(BoxControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    values: utils.getAttribute('borderWidth'),
                    onChange: (value) => utils.setAttribute('borderWidth', value)
                })
            ),
            
            // Border Style - Single control for all sides
            el('div', { style: { marginBottom: '16px' } },
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Border Style',
                    value: utils.getAttribute('borderStyle').top || utils.getAttribute('borderStyle').right || utils.getAttribute('borderStyle').bottom || utils.getAttribute('borderStyle').left || '',
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'None', value: 'none' },
                        { label: 'Solid', value: 'solid' },
                        { label: 'Dashed', value: 'dashed' },
                        { label: 'Dotted', value: 'dotted' },
                        { label: 'Double', value: 'double' },
                        { label: 'Groove', value: 'groove' },
                        { label: 'Ridge', value: 'ridge' },
                        { label: 'Inset', value: 'inset' },
                        { label: 'Outset', value: 'outset' }
                    ],
                    onChange: (value) => {
                        // Apply the same style to all sides
                        utils.setAttribute('borderStyle', { 
                            top: value, 
                            right: value, 
                            bottom: value, 
                            left: value 
                        });
                    }
                })
            ),
            
            // Border Color - Single color picker for all sides
            el('div', { style: { marginBottom: '16px' } },
                el('label', { 
                    style: { 
                        color: '#fff', 
                        fontSize: '11px', 
                        marginBottom: '8px', 
                        display: 'block' 
                    } 
                }, 'Border Color'),
                // Show current color if set
                (utils.getAttribute('borderColor').top || utils.getAttribute('borderColor').right || utils.getAttribute('borderColor').bottom || utils.getAttribute('borderColor').left) ? 
                    el('div', { 
                        style: { 
                            padding: '8px', 
                            backgroundColor: '#444', 
                            borderRadius: '4px', 
                            marginBottom: '8px',
                            fontSize: '11px',
                            color: '#fff'
                        } 
                    }, `Current: ${utils.getAttribute('borderColor').top || utils.getAttribute('borderColor').right || utils.getAttribute('borderColor').bottom || utils.getAttribute('borderColor').left}`) : null,
                el(ColorPalette, {
                    value: utils.getAttribute('borderColor').top || utils.getAttribute('borderColor').right || utils.getAttribute('borderColor').bottom || utils.getAttribute('borderColor').left,
                    onChange: (color) => {
                        // Apply the same color to all sides
                        const colorValue = color || '';
                        utils.setAttribute('borderColor', { 
                            top: colorValue, 
                            right: colorValue, 
                            bottom: colorValue, 
                            left: colorValue 
                        });
                    },
                    colors: [
                        { name: 'Black', color: '#000000' },
                        { name: 'Dark Gray', color: '#333333' },
                        { name: 'Gray', color: '#666666' },
                        { name: 'Light Gray', color: '#cccccc' },
                        { name: 'White', color: '#ffffff' },
                        { name: 'Primary', color: '#667eea' },
                        { name: 'Red', color: '#ff6b6b' },
                        { name: 'Blue', color: '#45b7d1' }
                    ],
                    clearable: true,
                    disableCustomColors: false
                }),
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Custom Color',
                    value: utils.getAttribute('borderColor').top || utils.getAttribute('borderColor').right || utils.getAttribute('borderColor').bottom || utils.getAttribute('borderColor').left,
                    onChange: (value) => {
                        // Apply the same color to all sides
                        utils.setAttribute('borderColor', { 
                            top: value, 
                            right: value, 
                            bottom: value, 
                            left: value 
                        });
                    },
                    placeholder: 'e.g. #333 or rgba(0,0,0,0.5)',
                    style: { marginTop: '8px' }
                })
            )
        );

        // Border Radius Panel
        const BorderRadiusPanel = () => el(PanelBody, {
            title: ui.PanelHeader('⭕', 'Border Radius', 'borderRadius'),
            initialOpen: false,
            className: 'modern-responsive-panel'
        },
            el('div', { className: 'border-radius-grid' },
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Top Left',
                    value: utils.getBorderRadius().topLeft,
                    onChange: (value) => utils.setBorderRadius('topLeft', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Top Right',
                    value: utils.getBorderRadius().topRight,
                    onChange: (value) => utils.setBorderRadius('topRight', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Bottom Left',
                    value: utils.getBorderRadius().bottomLeft,
                    onChange: (value) => utils.setBorderRadius('bottomLeft', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Bottom Right',
                    value: utils.getBorderRadius().bottomRight,
                    onChange: (value) => utils.setBorderRadius('bottomRight', value)
                })
            )
        );

        // Flexbox & Advanced Panel
        const FlexboxAdvancedPanel = () => el(PanelBody, {
            title: ui.PanelHeader('⚙️', 'Flexbox & Advanced', 'advanced'),
            initialOpen: false,
            className: 'modern-responsive-panel'
        },
            // Flex Direction and Justify Content
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Flex Direction',
                    value: utils.getAttribute('flex_direction'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Row', value: 'row' },
                        { label: 'Column', value: 'column' },
                        { label: 'Row Reverse', value: 'row-reverse' },
                        { label: 'Column Reverse', value: 'column-reverse' }
                    ],
                    onChange: (value) => utils.setAttribute('flex_direction', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Justify Content',
                    value: utils.getAttribute('justify'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Flex Start', value: 'flex-start' },
                        { label: 'Center', value: 'center' },
                        { label: 'Flex End', value: 'flex-end' },
                        { label: 'Space Between', value: 'space-between' },
                        { label: 'Space Around', value: 'space-around' }
                    ],
                    onChange: (value) => utils.setAttribute('justify', value)
                })
            ),
            // Flex Wrap and Flex Grow
            ui.InputRow([
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Flex Wrap',
                    value: utils.getAttribute('flexWrap'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'No Wrap', value: 'nowrap' },
                        { label: 'Wrap', value: 'wrap' },
                        { label: 'Wrap Reverse', value: 'wrap-reverse' }
                    ],
                    onChange: (value) => utils.setAttribute('flexWrap', value)
                }),
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Flex Grow',
                    value: utils.getAttribute('flex_grow'),
                    onChange: (value) => utils.setAttribute('flex_grow', value)
                })
            ]),
            // Flex Shrink (Flex Basis merged with Width field)
            ui.InputRow([
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Flex Shrink',
                    value: utils.getAttribute('flex_shrink'),
                    onChange: (value) => utils.setAttribute('flex_shrink', value)
                }),
                el('div', { style: { width: '48%' } })
            ]),
            // Align Items and Align Self
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Align Items',
                    value: utils.getAttribute('align_items'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Flex Start', value: 'flex-start' },
                        { label: 'Center', value: 'center' },
                        { label: 'Flex End', value: 'flex-end' },
                        { label: 'Stretch', value: 'stretch' },
                        { label: 'Baseline', value: 'baseline' }
                    ],
                    onChange: (value) => utils.setAttribute('align_items', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Align Self',
                    value: utils.getAttribute('align_self'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'Flex Start', value: 'flex-start' },
                        { label: 'Center', value: 'center' },
                        { label: 'Flex End', value: 'flex-end' },
                        { label: 'Stretch', value: 'stretch' },
                        { label: 'Baseline', value: 'baseline' }
                    ],
                    onChange: (value) => utils.setAttribute('align_self', value)
                })
            ),
            // Justify Self and Gap
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Justify Self',
                    value: utils.getAttribute('justify_self'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'Start', value: 'start' },
                        { label: 'Center', value: 'center' },
                        { label: 'End', value: 'end' },
                        { label: 'Stretch', value: 'stretch' }
                    ],
                    onChange: (value) => utils.setAttribute('justify_self', value)
                }),
                el(UnitControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Gap',
                    value: utils.getAttribute('gap'),
                    onChange: (value) => utils.setAttribute('gap', value)
                })
            ),
            // Align Content (single column)
            ui.InputRow([
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Align Content',
                    value: utils.getAttribute('align_content'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Flex Start', value: 'flex-start' },
                        { label: 'Center', value: 'center' },
                        { label: 'Flex End', value: 'flex-end' },
                        { label: 'Space Between', value: 'space-between' },
                        { label: 'Space Around', value: 'space-around' },
                        { label: 'Stretch', value: 'stretch' }
                    ],
                    onChange: (value) => utils.setAttribute('align_content', value)
                }),
                el('div', { style: { width: '48%' } })
            ]),
            // Transform and Transition
            ui.TwoColumn(
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Transform',
                    value: utils.getAttribute('transform'),
                    onChange: (value) => utils.setAttribute('transform', value),
                    placeholder: 'translateX(10px) rotate(45deg)'
                }),
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Transition',
                    value: utils.getAttribute('transition'),
                    onChange: (value) => utils.setAttribute('transition', value),
                    placeholder: 'all 0.3s ease'
                })
            ),
            // Box Shadow and Filter
            ui.TwoColumn(
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Box Shadow',
                    value: utils.getAttribute('box_shadow'),
                    onChange: (value) => utils.setAttribute('box_shadow', value),
                    placeholder: '0 4px 8px rgba(0,0,0,0.1)'
                }),
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Filter',
                    value: utils.getAttribute('filter'),
                    onChange: (value) => utils.setAttribute('filter', value),
                    placeholder: 'blur(5px) brightness(1.2)'
                })
            ),
            // Clip Path (single column)
            ui.InputRow([
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Clip Path',
                    value: utils.getAttribute('clip_path'),
                    onChange: (value) => utils.setAttribute('clip_path', value),
                    placeholder: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'
                }),
                el('div', { style: { width: '48%' } })
            ]),
            // Backdrop Filter and Object Fit
            ui.TwoColumn(
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Backdrop Filter',
                    value: utils.getAttribute('backdrop_filter'),
                    onChange: (value) => utils.setAttribute('backdrop_filter', value),
                    placeholder: 'blur(10px)'
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Object Fit',
                    value: utils.getAttribute('object_fit'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Fill', value: 'fill' },
                        { label: 'Contain', value: 'contain' },
                        { label: 'Cover', value: 'cover' },
                        { label: 'None', value: 'none' },
                        { label: 'Scale Down', value: 'scale-down' }
                    ],
                    onChange: (value) => utils.setAttribute('object_fit', value)
                })
            ),
            // Object Position (single column)
            ui.InputRow([
                el(TextControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Object Position',
                    value: utils.getAttribute('object_position'),
                    onChange: (value) => utils.setAttribute('object_position', value),
                    placeholder: 'center top'
                }),
                el('div', { style: { width: '48%' } })
            ]),
            // Opacity and Cursor
            ui.TwoColumn(
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Opacity',
                    value: utils.getAttribute('opacity'),
                    onChange: (value) => utils.setAttribute('opacity', value),
                    min: 0,
                    max: 1,
                    step: 0.1
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Cursor',
                    value: utils.getAttribute('cursor'),
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
                    onChange: (value) => utils.setAttribute('cursor', value)
                })
            ),
            // User Select and Pointer Events
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'User Select',
                    value: utils.getAttribute('user_select'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'None', value: 'none' },
                        { label: 'Text', value: 'text' },
                        { label: 'All', value: 'all' }
                    ],
                    onChange: (value) => utils.setAttribute('user_select', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Pointer Events',
                    value: utils.getAttribute('pointer_events'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'None', value: 'none' },
                        { label: 'Visible', value: 'visible' },
                        { label: 'Fill', value: 'fill' }
                    ],
                    onChange: (value) => utils.setAttribute('pointer_events', value)
                })
            )
        );

        // Background Panel
        const BackgroundPanel = () => el(PanelBody, {
            title: ui.PanelHeader('🎨', 'Background', 'background'),
            initialOpen: false,
            className: 'modern-responsive-panel'
        },
            // Background Color & Gradient with Tabs
            el('div', { style: { marginBottom: '16px' } },
                el('div', { className: 'background-control-wrapper' },
                    el('label', { 
                        style: { 
                            color: '#fff', 
                            fontSize: '11px', 
                            marginBottom: '8px', 
                            display: 'block' 
                        } 
                    }, 'Background'),
                    
                    // Background Color and Gradient Tabs
                    el('div', { className: 'wp-background-picker-tabs' },
                        // Tab buttons
                        el('div', { 
                            className: 'wp-tab-buttons',
                            style: {
                                display: 'flex',
                                marginBottom: '12px',
                                backgroundColor: '#333',
                                borderRadius: '4px',
                                padding: '2px'
                            }
                        },
                            el('button', {
                                className: `wp-tab-btn ${!utils.getAttribute('background_color') || !utils.getAttribute('background_color').includes('gradient') ? 'active' : ''}`,
                                style: {
                                    flex: 1,
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '2px',
                                    backgroundColor: (!utils.getAttribute('background_color') || !utils.getAttribute('background_color').includes('gradient')) ? '#667eea' : 'transparent',
                                    color: '#fff',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                },
                                onClick: () => {
                                    if (utils.getAttribute('background_color') && utils.getAttribute('background_color').includes('gradient')) {
                                        utils.setAttribute('background_color', '');
                                    }
                                }
                            }, 'Color'),
                            el('button', {
                                className: `wp-tab-btn ${utils.getAttribute('background_color') && utils.getAttribute('background_color').includes('gradient') ? 'active' : ''}`,
                                style: {
                                    flex: 1,
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '2px',
                                    backgroundColor: (utils.getAttribute('background_color') && utils.getAttribute('background_color').includes('gradient')) ? '#667eea' : 'transparent',
                                    color: '#fff',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                },
                                onClick: () => {
                                    if (!utils.getAttribute('background_color') || !utils.getAttribute('background_color').includes('gradient')) {
                                        utils.setAttribute('background_color', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                                    }
                                }
                            }, 'Gradient')
                        ),
                        
                        // Tab content
                        el('div', { className: 'wp-tab-content' },
                            (!utils.getAttribute('background_color') || !utils.getAttribute('background_color').includes('gradient')) ?
                                // Color Tab
                                el('div', {},
                                    utils.getAttribute('background_color') ? 
                                        el('div', { 
                                            style: { 
                                                padding: '8px', 
                                                backgroundColor: '#444', 
                                                borderRadius: '4px', 
                                                marginBottom: '8px',
                                                fontSize: '11px',
                                                color: '#fff'
                                            } 
                                        }, `Current: ${utils.getAttribute('background_color')}`) : null,
                                    el(ColorPalette, {
                                        value: utils.getAttribute('background_color'),
                                        onChange: (color) => {
                                            utils.setAttribute('background_color', color || '');
                                        },
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
                                        clearable: true,
                                        disableCustomColors: false
                                    })
                                ) :
                                // Gradient Tab - Check if GradientPicker is available
                                (window.wp && window.wp.components && (window.wp.components.GradientPicker || window.wp.components.__unstableGradientPicker)) ?
                                    el(window.wp.components.GradientPicker || window.wp.components.__unstableGradientPicker, {
                                        value: utils.getAttribute('background_color'),
                                        onChange: (gradient) => utils.setAttribute('background_color', gradient || ''),
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
                                                name: 'Purple Pink',
                                                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                slug: 'purple-pink'
                                            }
                                        ]
                                    }) :
                                    // Fallback if GradientPicker not available
                                    el('div', { className: 'gradient-fallback' },
                                        el('div', { className: 'gradient-presets', style: { marginBottom: '12px' } },
                                            el('label', { 
                                                style: { 
                                                    color: '#fff', 
                                                    fontSize: '11px', 
                                                    marginBottom: '8px', 
                                                    display: 'block' 
                                                } 
                                            }, 'Gradient Presets'),
                                            el('div', { 
                                                className: 'preset-grid',
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                                    gap: '6px'
                                                }
                                            },
                                                [
                                                    { name: 'Purple Blue', gradient: 'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)' },
                                                    { name: 'Green Cyan', gradient: 'linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%)' },
                                                    { name: 'Purple Pink', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                                                    { name: 'Orange Red', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
                                                ].map((preset, index) =>
                                                    el('div', {
                                                        key: 'preset-' + index,
                                                        className: `preset-swatch ${utils.getAttribute('background_color') === preset.gradient ? 'selected' : ''}`,
                                                        style: { 
                                                            background: preset.gradient,
                                                            width: '40px',
                                                            height: '30px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            border: utils.getAttribute('background_color') === preset.gradient ? '2px solid #667eea' : '2px solid transparent',
                                                            display: 'block'
                                                        },
                                                        onClick: () => utils.setAttribute('background_color', preset.gradient),
                                                        title: preset.name
                                                    })
                                                )
                                            )
                                        ),
                                        el(TextControl, {
                                            __next40pxDefaultSize: true,
                                            __nextHasNoMarginBottom: true,
                                            label: 'Custom Gradient',
                                            value: utils.getAttribute('background_color'),
                                            onChange: (value) => utils.setAttribute('background_color', value),
                                            placeholder: 'linear-gradient() or radial-gradient()',
                                            style: { marginTop: '12px' }
                                        })
                                    )
                        )
                    )
                )
            ),
            // Background Image Upload
            el('div', { style: { marginBottom: '16px' } },
                el('label', { 
                    style: { 
                        color: '#fff', 
                        fontSize: '11px', 
                        marginBottom: '8px', 
                        display: 'block' 
                    } 
                }, 'Background Image'),
                el(MediaUploadCheck, {},
                    el(MediaUpload, {
                        onSelect: (media) => {
                            utils.setAttribute('background_image', media.url);
                        },
                        allowedTypes: ['image'],
                        value: utils.getAttribute('background_image'),
                        render: ({ open }) => 
                            el('div', { 
                                style: { 
                                    background: '#333',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    padding: '12px',
                                    textAlign: 'center'
                                }
                            },
                                utils.getAttribute('background_image') && 
                                    el('img', {
                                        src: utils.getAttribute('background_image'),
                                        style: { 
                                            width: '100px', 
                                            height: '100px', 
                                            objectFit: 'cover', 
                                            borderRadius: '4px', 
                                            marginBottom: '8px',
                                            display: 'block',
                                            margin: '0 auto 8px auto'
                                        }
                                    }),
                                el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center' } },
                                    el(Button, {
                                        onClick: open,
                                        variant: 'secondary'
                                    }, utils.getAttribute('background_image') ? 'Replace Image' : 'Select Image'),
                                    utils.getAttribute('background_image') &&
                                        el(Button, {
                                            onClick: () => utils.setAttribute('background_image', ''),
                                            variant: 'tertiary',
                                            isDestructive: true
                                        }, 'Remove')
                                )
                            )
                    })
                )
            ),
            // Background Size and Position
            ui.TwoColumn(
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Background Size',
                    value: utils.getAttribute('background_size'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'Cover', value: 'cover' },
                        { label: 'Contain', value: 'contain' },
                        { label: '100%', value: '100%' },
                        { label: '100% 100%', value: '100% 100%' }
                    ],
                    onChange: (value) => utils.setAttribute('background_size', value)
                }),
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Background Position',
                    value: utils.getAttribute('background_position'),
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
                    onChange: (value) => utils.setAttribute('background_position', value)
                })
            ),
            // Background Repeat
            ui.InputRow([
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: 'Background Repeat',
                    value: utils.getAttribute('background_repeat'),
                    options: [
                        { label: 'Default', value: '' },
                        { label: 'No Repeat', value: 'no-repeat' },
                        { label: 'Repeat', value: 'repeat' },
                        { label: 'Repeat X', value: 'repeat-x' },
                        { label: 'Repeat Y', value: 'repeat-y' }
                    ],
                    onChange: (value) => utils.setAttribute('background_repeat', value)
                }),
                el('div', { style: { width: '48%' } })
            ])
        );

        return {
            LayoutPanel,
            TypographyPanel,
            SpacingPanel,
            BordersPanel,
            BorderRadiusPanel,
            FlexboxAdvancedPanel,
            BackgroundPanel
        };
    };

    // Export for use in other modules
    window.ModernResponsivePanels = {
        createResponsivePanels
    };

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);