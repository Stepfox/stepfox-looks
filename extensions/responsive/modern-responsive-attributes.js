/**
 * Modern Responsive Attributes
 * Unified attribute structure that matches PHP expectations
 */

(function (blocks, editor, element, components, $) {
    
    // Register unified responsiveStyles attribute that matches PHP structure exactly
    const addModernResponsiveAttributes = (settings, blockName) => {
        // Preserve any existing attributes from other extensions (like linkToPost for cover blocks)
        const newAttributes = {
            ...settings.attributes,
            
            // System attributes (custom to our plugin)
            customId: { type: "string", default: "stepfox-not-set-id" },
            device: { type: "string", default: "desktop" },
            
            // System state attributes  
            element_state: { type: "string", default: "normal" },
            
            // Unified responsive styles object - MINIMAL default to prevent URL overflow
            responsiveStyles: {
                type: "object",
                default: {}
            }
        };
        
        // Only add certain attributes to blocks that actually support them
        if (blockName !== 'core/spacer' && blockName !== 'core/separator') {
            newAttributes.custom_css = { type: "string", default: "" };
            newAttributes.custom_js = { type: "string", default: "" };
            newAttributes.animation = { type: "string", default: "" };
            newAttributes.animation_delay = { type: "string", default: "" };
            newAttributes.animation_duration = { type: "string", default: "" };
        }
        
        settings.attributes = newAttributes;
        return settings;
    };

    // Apply to all block types - LOWER PRIORITY to allow other extensions to run first
    wp.hooks.addFilter(
        'blocks.registerBlockType',
        'modern-responsive/add-attributes',
        addModernResponsiveAttributes,
        20
    );

    // Export for use by other modules
    window.ModernResponsiveAttributes = {
        addModernResponsiveAttributes: addModernResponsiveAttributes
    };

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);