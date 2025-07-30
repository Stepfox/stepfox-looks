(function() {
    'use strict';

    const { createElement: el, useState, useEffect } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, SelectControl, UnitControl, NumberControl, TextControl, BoxControl, ColorPalette } = wp.components;

    // Add comprehensive responsive attributes
    const addComprehensiveResponsiveAttributes = (settings) => {
        const devices = ['desktop', 'tablet', 'mobile', 'hover'];
        const attributes = {};

        // Typography Properties
        const typographyProps = [
            'font_size', 'line_height', 'letter_spacing', 'font_weight', 'font_style', 
            'text_transform', 'text_decoration', 'word_spacing', 'text_shadow', 'textAlign'
        ];

        // Layout & Positioning Properties
        const layoutProps = [
            'width', 'height', 'min_width', 'max_width', 'min_height', 'max_height',
            'position', 'top', 'right', 'bottom', 'left', 'display', 'z_index', 'order',
            'box_sizing', 'overflow', 'visibility', 'float', 'clear'
        ];

        // Flexbox Properties
        const flexboxProps = [
            'flex_direction', 'justify', 'align_items', 'align_self', 'align_content',
            'flex_basis', 'flex_grow', 'flex_shrink', 'flexWrap'
        ];

        // Grid Properties
        const gridProps = [
            'grid_template_columns', 'grid_template_rows', 'grid_gap', 'column_gap', 'row_gap',
            'grid_column_start', 'grid_column_end', 'grid_row_start', 'grid_row_end', 'justify_items'
        ];

        // Background Properties
        const backgroundProps = [
            'background_color', 'background_image', 'background_size', 'background_position',
            'background_repeat', 'background_attachment'
        ];

        // Border Properties
        const borderProps = [
            'borderStyle', 'borderColor', 'borderWidth',
            'border_top_width', 'border_right_width', 'border_bottom_width', 'border_left_width',
            'border_top_style', 'border_right_style', 'border_bottom_style', 'border_left_style',
            'border_top_color', 'border_right_color', 'border_bottom_color', 'border_left_color'
        ];

        // Visual Effects Properties
        const visualProps = [
            'opacity', 'box_shadow', 'filter', 'backdrop_filter', 'clip_path'
        ];

        // Transform Properties
        const transformProps = [
            'transform', 'transform_origin', 'scale', 'scale_x', 'scale_y', 'rotate',
            'translate_x', 'translate_y', 'skew_x', 'skew_y'
        ];

        // Animation Properties
        const animationProps = [
            'animation_name', 'animation_duration', 'animation_timing_function', 'animation_delay',
            'animation_iteration_count', 'animation_direction', 'animation_fill_mode', 'transition'
        ];

        // Miscellaneous Properties
        const miscProps = [
            'cursor', 'user_select', 'pointer_events'
        ];

        // Add attributes for each device and property
        devices.forEach(device => {
            // Typography
            typographyProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Layout & Positioning
            layoutProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Flexbox
            flexboxProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Grid
            gridProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Background
            backgroundProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Border
            borderProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Visual Effects
            visualProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Transform
            transformProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Animation
            animationProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Miscellaneous
            miscProps.forEach(prop => {
                attributes[`${prop}_${device}`] = { type: "string", default: "" };
            });

            // Object-based attributes
            attributes[`${device}_padding`] = {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" }
            };
            attributes[`${device}_margin`] = {
                type: "object",
                default: { top: "", left: "", right: "", bottom: "" }
            };
            attributes[`${device}_borderRadius`] = {
                type: "object",
                default: { topLeft: "", topRight: "", bottomLeft: "", bottomRight: "" }
            };
        });

        settings.attributes = { ...settings.attributes, ...attributes };
        return settings;
    };

    // Register attributes for specific block types
    const addAttributesToSpecificBlocks = (settings, name) => {
        const supportedBlocks = [
            'core/group', 'core/column', 'core/columns', 'core/cover', 'core/media-text',
            'core/heading', 'core/paragraph', 'core/image', 'core/button', 'core/buttons',
            'core/query', 'core/query-loop', 'core/post-template', 'core/post-title',
            'core/post-content', 'core/post-featured-image'
        ];
        
        if (supportedBlocks.includes(name)) {
            return addComprehensiveResponsiveAttributes(settings);
        }
        return settings;
    };

    wp.hooks.addFilter("blocks.registerBlockType", "comprehensive-responsive/add-attributes", addAttributesToSpecificBlocks);

    // Comprehensive Responsive Controls Component
    const ComprehensiveResponsiveControls = (props) => {
        const [activeDevice, setActiveDevice] = useState('desktop');

        const getAttribute = (property) => {
            try {
                const key = `${property}_${activeDevice}`;
                return props.attributes?.[key] || '';
            } catch (error) {
                return '';
            }
        };

        const setAttribute = (property, value) => {
            try {
                const key = `${property}_${activeDevice}`;
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

        const getObjectAttribute = (property) => {
            try {
                const key = `${activeDevice}_${property}`;
                return props.attributes?.[key] || {};
            } catch (error) {
                return {};
            }
        };

        const setObjectAttribute = (property, value) => {
            try {
                const key = `${activeDevice}_${property}`;
                if (props.setAttributes) {
                    props.setAttributes({ [key]: value });
                }
            } catch (error) {
                console.warn('Error setting object attribute:', property, error);
            }
        };

        return el('div', { style: { background: '#1a1a1a', color: '#fff', padding: '16px', borderRadius: '8px' } },
            // Device Tabs
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } },
                el('button', {
                    style: {
                        padding: '8px 12px',
                        background: activeDevice === 'desktop' ? '#667eea' : '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    },
                    onClick: () => setActiveDevice('desktop')
                }, '🖥️ Desktop'),
                el('button', {
                    style: {
                        padding: '8px 12px',
                        background: activeDevice === 'tablet' ? '#667eea' : '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    },
                    onClick: () => setActiveDevice('tablet')
                }, '💻 Tablet'),
                el('button', {
                    style: {
                        padding: '8px 12px',
                        background: activeDevice === 'mobile' ? '#667eea' : '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    },
                    onClick: () => setActiveDevice('mobile')
                }, '📱 Mobile'),
                el('button', {
                    style: {
                        padding: '8px 12px',
                        background: activeDevice === 'hover' ? '#667eea' : '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    },
                    onClick: () => setActiveDevice('hover')
                }, '👆 Hover')
            ),

            // Typography Section
            el('div', { style: { marginBottom: '24px' } },
                el('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' } }, '📝 Typography'),
                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
                    el(UnitControl, {
                        label: 'Font Size',
                        value: getAttribute('font_size'),
                        onChange: (value) => setAttribute('font_size', value)
                    }),
                    el(UnitControl, {
                        label: 'Line Height',
                        value: getAttribute('line_height'),
                        onChange: (value) => setAttribute('line_height', value)
                    }),
                    el(UnitControl, {
                        label: 'Letter Spacing',
                        value: getAttribute('letter_spacing'),
                        onChange: (value) => setAttribute('letter_spacing', value)
                    }),
                    el(UnitControl, {
                        label: 'Word Spacing',
                        value: getAttribute('word_spacing'),
                        onChange: (value) => setAttribute('word_spacing', value)
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
                    }),
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
                    }),
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
                    el(TextControl, {
                        label: 'Text Shadow',
                        value: getAttribute('text_shadow'),
                        onChange: (value) => setAttribute('text_shadow', value),
                        placeholder: '2px 2px 4px rgba(0,0,0,0.5)'
                    })
                )
            ),

            // Layout & Positioning Section
            el('div', { style: { marginBottom: '24px' } },
                el('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' } }, '📐 Layout & Positioning'),
                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
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
                            { label: 'Inline Block', value: 'inline-block' },
                            { label: 'None', value: 'none' }
                        ],
                        onChange: (value) => setAttribute('display', value)
                    }),
                    el(UnitControl, {
                        label: 'Width',
                        value: getAttribute('width'),
                        onChange: (value) => setAttribute('width', value)
                    }),
                    el(UnitControl, {
                        label: 'Height',
                        value: getAttribute('height'),
                        onChange: (value) => setAttribute('height', value)
                    }),
                    el(UnitControl, {
                        label: 'Min Width',
                        value: getAttribute('min_width'),
                        onChange: (value) => setAttribute('min_width', value)
                    }),
                    el(UnitControl, {
                        label: 'Max Width',
                        value: getAttribute('max_width'),
                        onChange: (value) => setAttribute('max_width', value)
                    }),
                    el(UnitControl, {
                        label: 'Min Height',
                        value: getAttribute('min_height'),
                        onChange: (value) => setAttribute('min_height', value)
                    }),
                    el(UnitControl, {
                        label: 'Max Height',
                        value: getAttribute('max_height'),
                        onChange: (value) => setAttribute('max_height', value)
                    }),
                    el(UnitControl, {
                        label: 'Top',
                        value: getAttribute('top'),
                        onChange: (value) => setAttribute('top', value)
                    }),
                    el(UnitControl, {
                        label: 'Right',
                        value: getAttribute('right'),
                        onChange: (value) => setAttribute('right', value)
                    }),
                    el(UnitControl, {
                        label: 'Bottom',
                        value: getAttribute('bottom'),
                        onChange: (value) => setAttribute('bottom', value)
                    }),
                    el(UnitControl, {
                        label: 'Left',
                        value: getAttribute('left'),
                        onChange: (value) => setAttribute('left', value)
                    }),
                    el(NumberControl, {
                        label: 'Z-Index',
                        value: getAttribute('z_index'),
                        onChange: (value) => setAttribute('z_index', value)
                    }),
                    el(NumberControl, {
                        label: 'Order',
                        value: getAttribute('order'),
                        onChange: (value) => setAttribute('order', value)
                    }),
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
                        label: 'Overflow',
                        value: getAttribute('overflow'),
                        options: [
                            { label: 'Default', value: '' },
                            { label: 'Visible', value: 'visible' },
                            { label: 'Hidden', value: 'hidden' },
                            { label: 'Scroll', value: 'scroll' },
                            { label: 'Auto', value: 'auto' }
                        ],
                        onChange: (value) => setAttribute('overflow', value)
                    })
                )
            ),

            // Flexbox Section
            el('div', { style: { marginBottom: '24px' } },
                el('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' } }, '🔄 Flexbox'),
                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
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
                            { label: 'Space Around', value: 'space-around' },
                            { label: 'Space Evenly', value: 'space-evenly' }
                        ],
                        onChange: (value) => setAttribute('justify', value)
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
                    }),
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
                    el(UnitControl, {
                        label: 'Flex Basis',
                        value: getAttribute('flex_basis'),
                        onChange: (value) => setAttribute('flex_basis', value)
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
                )
            ),

            // Spacing Section
            el('div', { style: { marginBottom: '24px' } },
                el('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' } }, '📏 Spacing'),
                el('div', { style: { marginBottom: '12px' } },
                    el(BoxControl, {
                        label: 'Padding',
                        values: getObjectAttribute('padding'),
                        onChange: (value) => setObjectAttribute('padding', value)
                    })
                ),
                el('div', { style: { marginBottom: '12px' } },
                    el(BoxControl, {
                        label: 'Margin',
                        values: getObjectAttribute('margin'),
                        onChange: (value) => setObjectAttribute('margin', value)
                    })
                )
            ),

            // Visual Effects Section
            el('div', { style: { marginBottom: '24px' } },
                el('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' } }, '✨ Visual Effects'),
                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
                    el(UnitControl, {
                        label: 'Opacity',
                        value: getAttribute('opacity'),
                        onChange: (value) => setAttribute('opacity', value),
                        min: 0,
                        max: 1,
                        step: 0.1
                    }),
                    el(TextControl, {
                        label: 'Transform',
                        value: getAttribute('transform'),
                        onChange: (value) => setAttribute('transform', value),
                        placeholder: 'scale(1.1) rotate(45deg)'
                    }),
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
                )
            ),

            // Border Section  
            el('div', { style: { marginBottom: '24px' } },
                el('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' } }, '🔲 Border'),
                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
                    el(SelectControl, {
                        label: 'Border Style',
                        value: getAttribute('borderStyle'),
                        options: [
                            { label: 'Default', value: '' },
                            { label: 'None', value: 'none' },
                            { label: 'Solid', value: 'solid' },
                            { label: 'Dashed', value: 'dashed' },
                            { label: 'Dotted', value: 'dotted' },
                            { label: 'Double', value: 'double' }
                        ],
                        onChange: (value) => setAttribute('borderStyle', value)
                    }),
                    el(UnitControl, {
                        label: 'Border Width',
                        value: getAttribute('borderWidth'),
                        onChange: (value) => setAttribute('borderWidth', value)
                    })
                ),
                el('div', { style: { marginTop: '12px' } },
                    el('label', { style: { color: '#ccc', fontSize: '12px', marginBottom: '8px', display: 'block' } }, 'Border Color'),
                    el(ColorPalette, {
                        colors: [
                            { name: 'Red', color: '#ff6b6b' },
                            { name: 'Blue', color: '#667eea' },
                            { name: 'Green', color: '#4ecdc4' },
                            { name: 'Yellow', color: '#f9ca24' },
                            { name: 'Purple', color: '#764ba2' },
                            { name: 'Orange', color: '#ff9f43' }
                        ],
                        value: getAttribute('borderColor'),
                        onChange: (value) => setAttribute('borderColor', value)
                    })
                ),
                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' } },
                    el(UnitControl, {
                        label: 'Top Left Radius',
                        value: getObjectAttribute('borderRadius').topLeft || '',
                        onChange: (value) => {
                            const current = getObjectAttribute('borderRadius');
                            setObjectAttribute('borderRadius', { ...current, topLeft: value });
                        }
                    }),
                    el(UnitControl, {
                        label: 'Top Right Radius',
                        value: getObjectAttribute('borderRadius').topRight || '',
                        onChange: (value) => {
                            const current = getObjectAttribute('borderRadius');
                            setObjectAttribute('borderRadius', { ...current, topRight: value });
                        }
                    }),
                    el(UnitControl, {
                        label: 'Bottom Left Radius',
                        value: getObjectAttribute('borderRadius').bottomLeft || '',
                        onChange: (value) => {
                            const current = getObjectAttribute('borderRadius');
                            setObjectAttribute('borderRadius', { ...current, bottomLeft: value });
                        }
                    }),
                    el(UnitControl, {
                        label: 'Bottom Right Radius',
                        value: getObjectAttribute('borderRadius').bottomRight || '',
                        onChange: (value) => {
                            const current = getObjectAttribute('borderRadius');
                            setObjectAttribute('borderRadius', { ...current, bottomRight: value });
                        }
                    })
                )
            ),

            // Background Section
            el('div', { style: { marginBottom: '24px' } },
                el('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' } }, '🎨 Background'),
                el('div', { style: { marginBottom: '12px' } },
                    el('label', { style: { color: '#ccc', fontSize: '12px', marginBottom: '8px', display: 'block' } }, 'Background Color'),
                    el(ColorPalette, {
                        colors: [
                            { name: 'Red', color: '#ff6b6b' },
                            { name: 'Blue', color: '#667eea' },
                            { name: 'Green', color: '#4ecdc4' },
                            { name: 'Yellow', color: '#f9ca24' },
                            { name: 'Purple', color: '#764ba2' },
                            { name: 'Orange', color: '#ff9f43' }
                        ],
                        value: getAttribute('background_color'),
                        onChange: (value) => setAttribute('background_color', value)
                    })
                ),
                el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
                    el(TextControl, {
                        label: 'Background Image',
                        value: getAttribute('background_image'),
                        onChange: (value) => setAttribute('background_image', value),
                        placeholder: 'url(image.jpg)'
                    }),
                    el(SelectControl, {
                        label: 'Background Size',
                        value: getAttribute('background_size'),
                        options: [
                            { label: 'Default', value: '' },
                            { label: 'Auto', value: 'auto' },
                            { label: 'Cover', value: 'cover' },
                            { label: 'Contain', value: 'contain' },
                            { label: '100%', value: '100%' }
                        ],
                        onChange: (value) => setAttribute('background_size', value)
                    }),
                    el(SelectControl, {
                        label: 'Background Position',
                        value: getAttribute('background_position'),
                        options: [
                            { label: 'Default', value: '' },
                            { label: 'Center', value: 'center' },
                            { label: 'Top', value: 'top' },
                            { label: 'Bottom', value: 'bottom' },
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' }
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
         );
    };

    // Add the comprehensive responsive controls to supported blocks
    const addComprehensiveResponsivePanel = (BlockEdit) => {
        return (props) => {
            const supportedBlocks = [
                'core/group', 'core/column', 'core/columns', 'core/cover', 'core/media-text',
                'core/heading', 'core/paragraph', 'core/image', 'core/button', 'core/buttons'
            ];

            if (!supportedBlocks.includes(props.name)) {
                return el(BlockEdit, props);
            }

            return el('div', null,
                el(BlockEdit, props),
                el(InspectorControls, null,
                    el(PanelBody, {
                        title: 'Comprehensive Responsive',
                        initialOpen: false
                    },
                        el(ComprehensiveResponsiveControls, props)
                    )
                )
            );
        };
    };

    wp.hooks.addFilter("editor.BlockEdit", "comprehensive-responsive/add-panel", addComprehensiveResponsivePanel);

})(); 