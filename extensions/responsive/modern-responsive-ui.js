/**
 * Modern Responsive UI Components
 * Reusable UI components for the responsive controls
 */

(function (blocks, editor, element, components, $) {
    
    const { createElement: el, Fragment, useState, useEffect } = wp.element;
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

    // Create reusable UI components
    const createResponsiveUI = (utils, activeDevice, setActiveDevice, hasClipboard) => {
        
        const {
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
        } = utils;

        // Device Header Component
        const DeviceHeader = () => el('div', { className: 'device-header' },
            el('h1', { className: 'device-title' }, 
                activeDevice.charAt(0).toUpperCase() + activeDevice.slice(1)
            ),
            el('div', { className: 'device-tabs' },
                el('button', {
                    className: `device-tab ${activeDevice === 'desktop' ? 'active' : ''}`,
                    onClick: () => setActiveDevice('desktop')
                }, 
                    countDeviceAttributes('desktop') > 0 && el('span', { 
                        className: 'device-tab-counter'
                    }, countDeviceAttributes('desktop')),
                    el('span', { 
                        className: 'device-tab-icon',
                        dangerouslySetInnerHTML: {
                            __html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="22" height="13" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/><rect x="7" y="17" width="10" height="3" rx="1.5" fill="currentColor"/><line x1="12" y1="17" x2="12" y2="20" stroke="currentColor" stroke-width="2.5"/></svg>'
                        }
                    }),
                    'Desktop'
                ),
                el('button', {
                    className: `device-tab ${activeDevice === 'tablet' ? 'active' : ''}`,
                    onClick: () => setActiveDevice('tablet')
                }, 
                    countDeviceAttributes('tablet') > 0 && el('span', { 
                        className: 'device-tab-counter'
                    }, countDeviceAttributes('tablet')),
                    el('span', { 
                        className: 'device-tab-icon',
                        dangerouslySetInnerHTML: {
                            __html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="16" rx="3" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="12" cy="21" r="1.5" fill="currentColor"/><rect x="4" y="5" width="16" height="11" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/></svg>'
                        }
                    }),
                    'Tablet'
                ),
                el('button', {
                    className: `device-tab ${activeDevice === 'mobile' ? 'active' : ''}`,
                    onClick: () => setActiveDevice('mobile')
                }, 
                    countDeviceAttributes('mobile') > 0 && el('span', { 
                        className: 'device-tab-counter'
                    }, countDeviceAttributes('mobile')),
                    el('span', { 
                        className: 'device-tab-icon',
                        dangerouslySetInnerHTML: {
                            __html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="1" width="12" height="22" rx="4" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/><rect x="8" y="3" width="8" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/><line x1="9" y1="4" x2="15" y2="4" stroke="currentColor" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/></svg>'
                        }
                    }),
                    'Mobile'
                ),
                el('button', {
                    className: `device-tab ${activeDevice === 'hover' ? 'active' : ''}`,
                    onClick: () => setActiveDevice('hover')
                }, 
                    countDeviceAttributes('hover') > 0 && el('span', { 
                        className: 'device-tab-counter'
                    }, countDeviceAttributes('hover')),
                    el('span', { 
                        className: 'device-tab-icon',
                        dangerouslySetInnerHTML: {
                            __html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L11 20L13.5 13.5L20 11L2 2Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="currentColor" fill-opacity="0.8"/><circle cx="17" cy="7" r="2" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/></svg>'
                        }
                    }),
                    'Hover'
                )
            ),
            // Copy/Paste and Reset Actions
            el('div', {
                className: 'device-actions',
                style: {
                    display: 'flex',
                    gap: '4px',
                    marginTop: '8px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            },
                // Copy Styles Button
                el('button', {
                    className: 'device-copy-btn',
                    onClick: () => {
                        const copiedCount = copyAllStyles();
                        if (copiedCount > 0) {
                            // Show success feedback
                            const button = document.querySelector('.device-copy-btn');
                            if (button) {
                                const originalText = button.textContent;
                                button.textContent = `✓ Copied ${copiedCount} styles`;
                                button.style.background = '#28a745';
                                setTimeout(() => {
                                    button.textContent = originalText;
                                    button.style.background = '#667eea';
                                }, 1500);
                            }
                        } else {
                            alert('No responsive styles to copy from this block.');
                        }
                    },
                    style: {
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        transition: 'background-color 0.2s ease',
                        whiteSpace: 'nowrap',
                        flex: '1'
                    },
                    onMouseOver: (e) => e.target.style.background = '#5a67d8',
                    onMouseOut: (e) => e.target.style.background = '#667eea'
                }, 
                    el('span', { style: { fontSize: '10px' } }, '📋'), 
                    'Copy'
                ),
                
                // Paste Styles Button
                hasClipboard && el('button', {
                    className: 'device-paste-btn',
                    onClick: () => {
                        const result = pasteAllStyles();
                        const button = document.querySelector('.device-paste-btn');
                        
                        if (result.success) {
                            // Show success feedback
                            if (button) {
                                const originalText = button.textContent;
                                button.textContent = `✓ Pasted ${result.count} styles`;
                                button.style.background = '#28a745';
                                setTimeout(() => {
                                    button.textContent = originalText;
                                    button.style.background = '#28a745';
                                }, 1500);
                            }
                        } else {
                            alert(result.message || 'Failed to paste styles');
                        }
                    },
                    style: {
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        transition: 'background-color 0.2s ease',
                        whiteSpace: 'nowrap',
                        flex: '1'
                    },
                    onMouseOver: (e) => e.target.style.background = '#218838',
                    onMouseOut: (e) => e.target.style.background = '#28a745'
                }, 
                    el('span', { style: { fontSize: '10px' } }, '📥'), 
                    'Paste'
                ),
                
                // Device Reset Button
                countDeviceAttributes(activeDevice) > 0 && el('button', {
                    className: 'device-reset-btn',
                    onClick: () => {
                        if (confirm(`Reset all ${activeDevice} styles for this block?`)) {
                            resetDeviceAttributes(activeDevice);
                        }
                    },
                    style: {
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        transition: 'background-color 0.2s ease',
                        whiteSpace: 'nowrap',
                        flex: '1'
                    },
                    onMouseOver: (e) => e.target.style.background = '#c82333',
                    onMouseOut: (e) => e.target.style.background = '#dc3545'
                }, 
                    el('span', { style: { fontSize: '10px' } }, '🗑️'), 
                    'Reset'
                )
            )
        );

        // Panel Header with Counter and Reset
        const PanelHeader = (icon, title, panelType) => el('div', { 
            style: { display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' } 
        },
            el('span', { style: { fontSize: '16px' } }, icon),
            title,
            countPanelAttributes(panelType) > 0 && el('span', {
                style: {
                    marginLeft: 'auto',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #333',
                    padding: '1px'
                }
            }, countPanelAttributes(panelType)),
            countPanelAttributes(panelType) > 0 && el('button', {
                onClick: (e) => {
                    e.stopPropagation();
                    if (confirm(`Reset all ${title} styles for ${activeDevice}?`)) {
                        resetPanelAttributes(panelType);
                    }
                },
                style: {
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '2px 4px',
                    fontSize: '9px',
                    cursor: 'pointer',
                    marginLeft: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                },
                title: `Reset ${title} for ${activeDevice}`
            }, '🗑️')
        );

        // Input Row Component
        const InputRow = (children) => el('div', { className: 'input-row' }, ...children);

        // Two Column Layout
        const TwoColumn = (left, right) => InputRow([left, right]);

        return {
            DeviceHeader,
            PanelHeader,
            InputRow,
            TwoColumn
        };
    };

    // Export for use in other modules
    window.ModernResponsiveUI = {
        createResponsiveUI
    };

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);