/**
 * Modern Responsive Utilities
 * Utility functions for managing responsive attributes
 */

(function (blocks, editor, element, components, $) {
    
    // Create utility functions that can be used by the main component
    const createResponsiveUtils = (props, activeDevice, setHasClipboard) => {
        
        const getAttribute = (property) => {
            try {
                // Get the responsive styles object
                const responsiveStyles = props.attributes?.responsiveStyles;
                if (!responsiveStyles) {
                    // Return appropriate defaults for object-based properties
                    if (property === 'padding' || property === 'margin' || property === 'borderWidth' || property === 'borderStyle' || property === 'borderColor') {
                        return { top: '', left: '', right: '', bottom: '' };
                    }
                    if (property === 'borderRadius') {
                        return { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                    }
                    return '';
                }
                
                // Access the property for the current device
                const propertyStyles = responsiveStyles[property];
                if (!propertyStyles) {
                    // Return appropriate defaults for object-based properties
                    if (property === 'padding' || property === 'margin' || property === 'borderWidth' || property === 'borderStyle' || property === 'borderColor') {
                        return { top: '', left: '', right: '', bottom: '' };
                    }
                    if (property === 'borderRadius') {
                        return { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                    }
                    return '';
                }
                
                // For object properties that have nested device structures
                if (property === 'padding' || property === 'margin' || property === 'borderWidth' || property === 'borderStyle' || property === 'borderColor' || property === 'borderRadius') {
                    return propertyStyles[activeDevice] || (property === 'borderRadius' ? 
                        { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' } : 
                        { top: '', left: '', right: '', bottom: '' });
                }
                
                // For simple properties
                return propertyStyles[activeDevice] || '';
                
            } catch (error) {
                console.warn('Error getting attribute:', property, error);
                // Return appropriate defaults for object-based properties even in error cases
                if (property === 'padding' || property === 'margin' || property === 'borderWidth' || property === 'borderStyle' || property === 'borderColor') {
                    return { top: '', left: '', right: '', bottom: '' };
                }
                if (property === 'borderRadius') {
                    return { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                }
                return '';
            }
        };

        const setAttribute = (property, value) => {
            try {
                // Get the current responsive styles object
                const currentResponsiveStyles = props.attributes?.responsiveStyles || {};
                
                // Create a deep copy to avoid mutation
                const newResponsiveStyles = JSON.parse(JSON.stringify(currentResponsiveStyles));
                
                // Initialize the property if it doesn't exist
                if (!newResponsiveStyles[property]) {
                    // For object properties, initialize with nested device structure
                    if (property === 'padding' || property === 'margin' || property === 'borderWidth' || property === 'borderStyle' || property === 'borderColor') {
                        newResponsiveStyles[property] = {
                            desktop: { top: '', left: '', right: '', bottom: '' },
                            tablet: { top: '', left: '', right: '', bottom: '' },
                            mobile: { top: '', left: '', right: '', bottom: '' },
                            hover: { top: '', left: '', right: '', bottom: '' }
                        };
                    } else if (property === 'borderRadius') {
                        newResponsiveStyles[property] = {
                            desktop: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
                            tablet: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
                            mobile: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
                            hover: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' }
                        };
                    } else {
                        // For simple properties
                        newResponsiveStyles[property] = {
                            desktop: '',
                            tablet: '',
                            mobile: '',
                            hover: ''
                        };
                    }
                }
                
                // Set the value for the current device
                newResponsiveStyles[property][activeDevice] = value;
                
                // Auto-generate customId if it doesn't exist and we're setting a responsive attribute
                const updates = { responsiveStyles: newResponsiveStyles };
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
                const responsiveStyles = props.attributes?.responsiveStyles;
                if (!responsiveStyles || !responsiveStyles.borderRadius) {
                    return { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                }
                return responsiveStyles.borderRadius[activeDevice] || { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
            } catch (error) {
                console.warn('Error getting border radius:', error);
                return { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
            }
        };

        const setBorderRadius = (corner, value) => {
            try {
                // Get the current responsive styles object
                const currentResponsiveStyles = props.attributes?.responsiveStyles || {};
                const newResponsiveStyles = JSON.parse(JSON.stringify(currentResponsiveStyles));
                
                // Initialize borderRadius if it doesn't exist
                if (!newResponsiveStyles.borderRadius) {
                    newResponsiveStyles.borderRadius = {
                        desktop: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
                        tablet: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
                        mobile: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
                        hover: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' }
                    };
                }
                
                // Initialize the device if it doesn't exist
                if (!newResponsiveStyles.borderRadius[activeDevice]) {
                    newResponsiveStyles.borderRadius[activeDevice] = { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                }
                
                // Set the specific corner value
                newResponsiveStyles.borderRadius[activeDevice][corner] = value;
                
                if (props.setAttributes) {
                    props.setAttributes({ responsiveStyles: newResponsiveStyles });
                }
            } catch (error) {
                console.warn('Error setting border radius:', error);
            }
        };

        // Count non-empty attributes for each sub-panel category
        const countPanelAttributes = (panelType) => {
            const responsiveStyles = props.attributes?.responsiveStyles || {};
            let count = 0;
            
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
                    'flex_direction', 'justify', 'flexWrap', 'flex_grow', 'flex_shrink', 'flex_basis',
                    'align_items', 'align_self', 'align_content', 'transform', 'transition', 'box_shadow', 
                    'filter', 'clip_path', 'opacity', 'cursor', 'user_select', 'pointer_events'
                ]
            };
            
            const attributesToCheck = panelAttributeMap[panelType] || [];
            
            attributesToCheck.forEach(prop => {
                const propertyStyles = responsiveStyles[prop];
                if (propertyStyles && propertyStyles[activeDevice]) {
                    const value = propertyStyles[activeDevice];
                    
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
            const responsiveStyles = props.attributes?.responsiveStyles || {};
            let count = 0;
            
            // Define all possible properties that can have values
            const allProperties = [
                // Typography
                'font_size', 'line_height', 'letter_spacing', 'word_spacing', 'textAlign',
                'font_weight', 'font_style', 'text_transform', 'text_decoration', 'text_shadow', 'color',
                // Layout & Positioning
                'width', 'height', 'min_width', 'max_width', 'min_height', 'max_height',
                'box_sizing', 'visibility', 'float', 'clear', 'overflow', 'zoom',
                'animation', 'animation_duration', 'animation_delay', 'order', 'z_index',
                'top', 'right', 'bottom', 'left', 'position', 'display',
                // Flexbox
                'flex_direction', 'justify', 'flexWrap', 'flex_grow', 'flex_shrink', 'flex_basis',
                'align_items', 'align_self', 'align_content', 'grid_template_columns',
                // Visual Effects
                'transform', 'transition', 'box_shadow', 'filter', 'clip_path', 'opacity', 'cursor',
                'user_select', 'pointer_events',
                // Background
                'background_color', 'background_image', 'background_size', 
                'background_position', 'background_repeat',
                // Spacing & Borders (object properties)
                'padding', 'margin', 'borderStyle', 'borderWidth', 'borderColor', 'borderRadius'
            ];
            
            // Count all properties that have values for the specified device
            allProperties.forEach(prop => {
                const propertyStyles = responsiveStyles[prop];
                if (propertyStyles && propertyStyles[device]) {
                    const value = propertyStyles[device];
                    
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
            const currentResponsiveStyles = props.attributes?.responsiveStyles || {};
            const newResponsiveStyles = JSON.parse(JSON.stringify(currentResponsiveStyles));
            
            // Define all possible properties that can have values
            const allProperties = [
                // Typography
                'font_size', 'line_height', 'letter_spacing', 'word_spacing', 'textAlign',
                'font_weight', 'font_style', 'text_transform', 'text_decoration', 'text_shadow', 'color',
                // Layout & Positioning
                'width', 'height', 'min_width', 'max_width', 'min_height', 'max_height',
                'box_sizing', 'visibility', 'float', 'clear', 'overflow', 'zoom',
                'animation', 'animation_duration', 'animation_delay', 'order', 'z_index',
                'top', 'right', 'bottom', 'left', 'position', 'display',
                // Flexbox
                'flex_direction', 'justify', 'flexWrap', 'flex_grow', 'flex_shrink', 'flex_basis',
                'align_items', 'align_self', 'align_content', 'grid_template_columns',
                // Visual Effects
                'transform', 'transition', 'box_shadow', 'filter', 'clip_path', 'opacity', 'cursor',
                'user_select', 'pointer_events',
                // Background
                'background_color', 'background_image', 'background_size', 
                'background_position', 'background_repeat',
                // Spacing & Borders (object properties)
                'padding', 'margin', 'borderStyle', 'borderWidth', 'borderColor', 'borderRadius'
            ];
            
            // Reset all properties for the specified device
            allProperties.forEach(prop => {
                if (newResponsiveStyles[prop]) {
                    // For object properties, reset to default object
                    if (prop === 'padding' || prop === 'margin' || prop === 'borderWidth' || prop === 'borderStyle' || prop === 'borderColor') {
                        newResponsiveStyles[prop][device] = { top: '', left: '', right: '', bottom: '' };
                    } else if (prop === 'borderRadius') {
                        newResponsiveStyles[prop][device] = { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                    } else {
                        // For simple properties
                        newResponsiveStyles[prop][device] = '';
                    }
                }
            });
            
            // Apply all updates at once
            if (props.setAttributes) {
                props.setAttributes({ responsiveStyles: newResponsiveStyles });
            }
        };

        // Reset attributes for a specific panel category on current device
        const resetPanelAttributes = (panelType) => {
            const currentResponsiveStyles = props.attributes?.responsiveStyles || {};
            const newResponsiveStyles = JSON.parse(JSON.stringify(currentResponsiveStyles));
            
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
                    'flex_direction', 'justify', 'flexWrap', 'flex_grow', 'flex_shrink', 'flex_basis',
                    'align_items', 'align_self', 'align_content', 'transform', 'transition', 'box_shadow', 
                    'filter', 'opacity', 'cursor', 'user_select', 'pointer_events'
                ]
            };
            
            const attributesToReset = panelAttributeMap[panelType] || [];
            
            attributesToReset.forEach(prop => {
                if (newResponsiveStyles[prop]) {
                    // For object properties, reset to default object
                    if (prop === 'padding' || prop === 'margin' || prop === 'borderWidth' || prop === 'borderStyle' || prop === 'borderColor') {
                        newResponsiveStyles[prop][activeDevice] = { top: '', left: '', right: '', bottom: '' };
                    } else if (prop === 'borderRadius') {
                        newResponsiveStyles[prop][activeDevice] = { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' };
                    } else {
                        // For simple properties
                        newResponsiveStyles[prop][activeDevice] = '';
                    }
                }
            });
            
            // Apply all updates at once
            if (props.setAttributes) {
                props.setAttributes({ responsiveStyles: newResponsiveStyles });
            }
        };

        // Copy all responsive styles from the current block
        const copyAllStyles = () => {
            const responsiveStyles = props.attributes?.responsiveStyles || {};
            
            // Check if there are any styles to copy
            let hasAnyStyles = false;
            Object.values(responsiveStyles).forEach(propertyStyles => {
                if (propertyStyles && typeof propertyStyles === 'object') {
                    Object.values(propertyStyles).forEach(deviceValue => {
                        if (typeof deviceValue === 'object') {
                            // For object properties (padding, margin, etc.)
                            if (Object.values(deviceValue).some(v => v && v !== '')) {
                                hasAnyStyles = true;
                            }
                        } else if (deviceValue && deviceValue !== '') {
                            // For simple properties
                            hasAnyStyles = true;
                        }
                    });
                }
            });
            
            if (!hasAnyStyles) {
                return 0;
            }
            
            // Store in localStorage with timestamp
            const copyData = {
                responsiveStyles: JSON.parse(JSON.stringify(responsiveStyles)),
                timestamp: Date.now(),
                sourceBlock: props.name || 'Unknown Block'
            };
            
            try {
                localStorage.setItem('stepfox_copied_styles', JSON.stringify(copyData));
                setHasClipboard(true); // Update state to show paste button
                
                // Count total number of style values
                let count = 0;
                Object.values(responsiveStyles).forEach(propertyStyles => {
                    if (propertyStyles && typeof propertyStyles === 'object') {
                        Object.values(propertyStyles).forEach(deviceValue => {
                            if (typeof deviceValue === 'object') {
                                // For object properties (padding, margin, etc.)
                                if (Object.values(deviceValue).some(v => v && v !== '')) {
                                    count++;
                                }
                            } else if (deviceValue && deviceValue !== '') {
                                count++;
                            }
                        });
                    }
                });
                
                return count;
            } catch (error) {
                console.warn('Failed to copy styles to localStorage:', error);
                return 0;
            }
        };

        // Paste all responsive styles to the current block
        const pasteAllStyles = () => {
            try {
                const storedData = localStorage.getItem('stepfox_copied_styles');
                if (!storedData) {
                    return { success: false, message: 'No copied styles found' };
                }
                
                const copyData = JSON.parse(storedData);
                const { responsiveStyles, timestamp, sourceBlock } = copyData;
                
                // Check if data is not too old (24 hours)
                const twentyFourHours = 24 * 60 * 60 * 1000;
                if (Date.now() - timestamp > twentyFourHours) {
                    localStorage.removeItem('stepfox_copied_styles');
                    return { success: false, message: 'Copied styles have expired' };
                }
                
                if (!responsiveStyles || Object.keys(responsiveStyles).length === 0) {
                    return { success: false, message: 'No styles to paste' };
                }
                
                // Apply all copied styles at once
                if (props.setAttributes) {
                    props.setAttributes({ responsiveStyles: responsiveStyles });
                }
                
                // Count total number of style values for feedback
                let count = 0;
                Object.values(responsiveStyles).forEach(propertyStyles => {
                    if (propertyStyles && typeof propertyStyles === 'object') {
                        Object.values(propertyStyles).forEach(deviceValue => {
                            if (typeof deviceValue === 'object') {
                                // For object properties (padding, margin, etc.)
                                if (Object.values(deviceValue).some(v => v && v !== '')) {
                                    count++;
                                }
                            } else if (deviceValue && deviceValue !== '') {
                                count++;
                            }
                        });
                    }
                });
                
                return { 
                    success: true, 
                    count: count,
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
                const storedData = localStorage.getItem('stepfox_copied_styles');
                if (!storedData) return false;
                
                const copyData = JSON.parse(storedData);
                const twentyFourHours = 24 * 60 * 60 * 1000;
                
                return copyData.responsiveStyles && 
                       Object.keys(copyData.responsiveStyles).length > 0 && 
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