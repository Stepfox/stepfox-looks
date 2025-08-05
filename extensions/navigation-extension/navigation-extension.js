/**
 * Navigation Extension JavaScript
 * Properly extends navigation blocks to accept all child blocks
 */

(function() {
    'use strict';

    const { addFilter } = wp.hooks;
    const { createHigherOrderComponent } = wp.compose;
    const { useSelect, useDispatch } = wp.data;
    const { createElement } = wp.element;

    /**
     * Override block settings to remove restrictions
     */
    function removeNavigationRestrictions(settings, name) {
        const navigationBlocks = [
            'core/navigation',
            'core/navigation-link', 
            'core/navigation-submenu'
        ];

        if (navigationBlocks.includes(name)) {
            return {
                ...settings,
                // Remove any allowedBlocks restrictions
                allowedBlocks: undefined,
                
                // Override parent to allow all blocks
                parent: undefined,
                
                // Ensure supports object allows everything we need
                supports: {
                    ...settings.supports,
                    inserter: true,
                    multiple: true,
                    reusable: true,
                },
                
                // Remove any template lock
                templateLock: false,
                
                // Override any experimental restrictions
                __experimentalOnSplit: undefined,
                __experimentalOnSplitMiddle: undefined,
                __experimentalOnMerge: undefined,
            };
        }

        return settings;
    }

    /**
     * Higher-order component to modify navigation block behavior
     */
    const withNavigationEnhancement = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            const { name, clientId } = props;
            
            // Only modify navigation blocks
            const navigationBlocks = [
                'core/navigation',
                'core/navigation-link',
                'core/navigation-submenu'
            ];

            if (navigationBlocks.includes(name)) {
                // Use useSelect to get block editor data
                const { getBlocksByClientId, getBlocks } = useSelect((select) => ({
                    getBlocksByClientId: select('core/block-editor').getBlocksByClientId,
                    getBlocks: select('core/block-editor').getBlocks,
                }));

                // Override the allowedBlocks prop to allow everything
                const enhancedProps = {
                    ...props,
                    allowedBlocks: true, // Allow all blocks
                    templateLock: false, // Remove template lock
                };

                return createElement(BlockEdit, enhancedProps);
            }

            return createElement(BlockEdit, props);
        };
    }, 'withNavigationEnhancement');

    /**
     * Override block inserter restrictions
     */
    function overrideInserterRestrictions(blockTypes, rootClientId, __experimentalDefaultBlock) {
        // Get the parent block type
        const { getBlock } = wp.data.select('core/block-editor');
        
        if (rootClientId) {
            const parentBlock = getBlock(rootClientId);
            
            if (parentBlock && [
                'core/navigation',
                'core/navigation-link',
                'core/navigation-submenu'
            ].includes(parentBlock.name)) {
                // Return all available block types for navigation
                return blockTypes;
            }
        }
        
        return blockTypes;
    }

    /**
     * Remove template restrictions on navigation blocks
     */
    function removeTemplateRestrictions(element, blockType, attributes) {
        if ([
            'core/navigation',
            'core/navigation-link',
            'core/navigation-submenu'
        ].includes(blockType.name)) {
            
            // Ensure no template lock on save
            if (attributes.templateLock) {
                delete attributes.templateLock;
            }
        }
        
        return element;
    }

    /**
     * Initialize when WordPress is ready
     */
    wp.domReady(() => {
        // Filter to modify block registration
        addFilter(
            'blocks.registerBlockType',
            'stepfox/navigation-remove-restrictions',
            removeNavigationRestrictions,
            5 // High priority
        );

        // Filter to modify block editing behavior
        addFilter(
            'editor.BlockEdit',
            'stepfox/navigation-enhancement',
            withNavigationEnhancement,
            5 // High priority
        );

        // Filter to override inserter restrictions
        addFilter(
            'blocks.getBlockTypes',
            'stepfox/navigation-inserter-override', 
            overrideInserterRestrictions,
            5 // High priority
        );

        // Filter to remove template restrictions on save
        addFilter(
            'blocks.getSaveElement',
            'stepfox/navigation-template-override',
            removeTemplateRestrictions,
            5 // High priority
        );
    });

    /**
     * Additional compatibility for older WordPress versions
     */
    if (wp.blocks && wp.blocks.registerBlockType) {
        // Directly modify existing blocks if they're already registered
        const tryModifyExistingBlocks = () => {
            const { getBlockTypes } = wp.blocks;
            const blockTypes = getBlockTypes();
            
            blockTypes.forEach(blockType => {
                if ([
                    'core/navigation',
                    'core/navigation-link',
                    'core/navigation-submenu'
                ].includes(blockType.name)) {
                    
                    // Remove restrictions directly
                    if (blockType.allowedBlocks) {
                        blockType.allowedBlocks = undefined;
                    }
                    
                    if (blockType.parent) {
                        blockType.parent = undefined;
                    }
                }
            });
        };

        // Try to modify existing blocks
        setTimeout(tryModifyExistingBlocks, 100);
    }

})();