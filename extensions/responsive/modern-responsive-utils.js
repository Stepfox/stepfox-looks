/**
 * Modern Responsive Utilities
 * Utility functions for managing responsive attributes
 */

(function (blocks, editor, element, components, $) {
    
    // Create utility functions that can be used by the main component
    const createResponsiveUtils = (props, activeDevice, setHasClipboard) => {
        
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
                    'min_height', 'max_height', 'box_sizing', 'visibility', 'float', 'clear', 'overflow', 'zoom',
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
                'background_size', 'background_position', 'background_repeat', 'overflow', 'zoom',
                'animation', 'animation_duration', 'animation_delay'
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
                'background_size', 'background_position', 'background_repeat', 'overflow', 'zoom',
                'animation', 'animation_duration', 'animation_delay'
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
                    'min_height', 'max_height', 'box_sizing', 'visibility', 'float', 'clear', 'overflow', 'zoom',
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
                'flex_grow', 'align_items', 'align_self', 'align_content', 'overflow', 'zoom',
                'animation', 'animation_duration', 'animation_delay'
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

        return {
            getAttribute,
            setAttribute,
            getBorderRadius,
            setBorderRadius,
            countPanelAttributes,
            countDeviceAttributes,
            resetDeviceAttributes,
            resetPanelAttributes,
            copyAllStyles,
            pasteAllStyles,
            hasCopiedStyles
        };
    };

    // Export for use in other modules
    window.ModernResponsiveUtils = {
        createResponsiveUtils
    };

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);