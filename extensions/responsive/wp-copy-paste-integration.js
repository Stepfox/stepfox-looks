/**
 * Stepfox Copy/Paste Integration
 * Adds stepfox responsive attributes to WordPress native copy/paste styles functionality
 * 
 * @package stepfox-looks
 * @since 1.0.0
 */
(function() {
    'use strict';

    // Wait for WordPress to be ready
    const waitForWP = () => {
        return new Promise((resolve) => {
            const checkWP = () => {
                if (typeof wp !== 'undefined' && wp.data && wp.data.select) {
                    resolve();
                } else {
                    setTimeout(checkWP, 100);
                }
            };
            checkWP();
        });
    };

    waitForWP().then(() => {
        // Define the stepfox attributes to copy/paste
        const STEPFOX_ATTRIBUTES = [
            'responsiveStyles',
            'custom_css', 
            'custom_js',
            'animation',
            'animation_delay',
            'animation_duration',
            'stepfox_looks'
        ];

        // Storage for copied styles
        let copiedStepfoxData = null;

        // Listen for copy/paste button clicks
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button || !button.textContent) return;

            const buttonText = button.textContent.trim();
            
            if (buttonText.includes('Copy styles')) {
                handleCopyStyles();
            } else if (buttonText.includes('Paste styles')) {
                handlePasteStyles();
            }
        });

        function handleCopyStyles() {
            try {
                const { select, dispatch } = wp.data;
                const blockEditor = select('core/block-editor');
                const selectedIds = blockEditor.getSelectedBlockClientIds();
                
                if (selectedIds && selectedIds.length > 0) {
                    const block = blockEditor.getBlock(selectedIds[0]);
                    
                    if (block && block.attributes) {
                        const stepfoxData = {};
                        let hasStepfoxData = false;
                        
                        STEPFOX_ATTRIBUTES.forEach(attr => {
                            if (block.attributes[attr] !== undefined) {
                                stepfoxData[attr] = block.attributes[attr];
                                hasStepfoxData = true;
                            }
                        });
                        
                        if (hasStepfoxData) {
                            copiedStepfoxData = {
                                attributes: stepfoxData,
                                timestamp: Date.now()
                            };
                            
                            // Store in localStorage for persistence
                            localStorage.setItem('stepfox_copied_styles', JSON.stringify(copiedStepfoxData));
                            
                            // Show success notification
                            dispatch('core/notices').createSuccessNotice(
                                'Stepfox responsive styles copied!',
                                { type: 'snackbar', isDismissible: true }
                            );
                        }
                    }
                }
            } catch (error) {
                // Silent error handling in production
                if (window.console && console.warn) {
                    console.warn('Stepfox copy styles error:', error);
                }
            }
        }

        function handlePasteStyles() {
            try {
                // Try memory first, then localStorage
                let dataToApply = copiedStepfoxData;
                if (!dataToApply) {
                    const stored = localStorage.getItem('stepfox_copied_styles');
                    if (stored) {
                        try {
                            dataToApply = JSON.parse(stored);
                        } catch (e) {
                            return; // Invalid stored data
                        }
                    }
                }
                
                if (!dataToApply || !dataToApply.attributes) {
                    return; // No data to paste
                }
                
                const { select, dispatch } = wp.data;
                const blockEditor = select('core/block-editor');
                const selectedIds = blockEditor.getSelectedBlockClientIds();
                
                if (selectedIds && selectedIds.length > 0) {
                    // Apply to all selected blocks
                    selectedIds.forEach(blockId => {
                        dispatch('core/block-editor').updateBlockAttributes(
                            blockId,
                            dataToApply.attributes
                        );
                    });
                    
                    // Show success notification
                    const blockCount = selectedIds.length;
                    const message = blockCount === 1 ? 
                        'Stepfox responsive styles applied!' : 
                        `Stepfox responsive styles applied to ${blockCount} blocks!`;
                    
                    dispatch('core/notices').createSuccessNotice(
                        message,
                        { type: 'snackbar', isDismissible: true }
                    );
                }
                
            } catch (error) {
                // Silent error handling in production
                if (window.console && console.warn) {
                    console.warn('Stepfox paste styles error:', error);
                }
            }
        }
    });

})();