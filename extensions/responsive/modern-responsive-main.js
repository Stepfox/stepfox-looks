/**
 * Modern Responsive Main Controller
 * Main file that coordinates all responsive modules
 */

(function (blocks, editor, element, components, $) {
    // Safety check to ensure WordPress components are available
    if (!wp || !wp.element || !wp.components || !wp.blockEditor) {
        // WordPress components not fully loaded yet
        return;
    }

    const { createElement: el, Fragment, useState, useEffect } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody } = wp.components;

    // Modern CSS styles for the responsive panel
    const modernStyles = `
        .modern-responsive-panel {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            overflow: hidden;
            margin: 0 -16px 0 -16px;
            padding: 0;
            color: #fff !important;
        }
        
        .modern-responsive-panel .components-panel__body {
            border: none;
            background: #2a2a2a;
            border-radius: 6px;
            margin: 4px 8px;
            overflow: hidden;
        }
        
        .modern-responsive-panel .components-panel__body-toggle {
            background: #333 !important;
            color: #fff !important;
            padding: 12px 16px !important;
            border: none !important;
            border-radius: 6px 6px 0 0 !important;
            font-weight: 600 !important;
        }
        
        .modern-responsive-panel .components-panel__body-toggle:hover {
            background: #444 !important;
        }
        
        .modern-responsive-panel .components-panel__body-content {
            background: #2a2a2a !important;
            padding: 16px !important;
            border-radius: 0 0 6px 6px !important;
        }
        
        .modern-responsive-panel label,
        .modern-responsive-panel .components-base-control__label,
        .modern-responsive-panel .components-base-control__help,
        .modern-responsive-panel .components-panel__body-title,
        .modern-responsive-panel .components-text-control__input,
        .modern-responsive-panel .components-select-control__input,
        .modern-responsive-panel .components-number-control__input,
        .modern-responsive-panel .components-unit-control__input,
        .modern-responsive-panel .components-toggle-control__label,
        .modern-responsive-panel input,
        .modern-responsive-panel select,
        .modern-responsive-panel textarea {
            color: #fff !important;
        }
        
        .device-header {
            background: linear-gradient(135deg, #2b3048 0%, #263a64 50%, #764ba2 100%);
            padding: 12px 10px;
            text-align: center;
        }
        
        .device-title {
            font-size: 1.4em;
            font-weight: 700;
            margin: 0 0 16px 0;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: white;
        }
        
        .device-tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            justify-content: center;
            max-width: 320px;
            margin: 12px auto;
            padding: 0px;
        }
        
        .device-tab {
            padding: 7px 10px;
            border: none;
            border-radius: 5px;
            color: white;
            font-size: 12px;
            text-transform:uppercase;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.16s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0px;
            min-height: 28px;
            line-height: 1;
            position: relative;
            top: 0;
            user-select: none;
            text-shadow: 1px 1px 1px #000;
        }
        
        /* Desktop tab - Blue */
        .device-tab:nth-child(1) {
            background: #239dab;
            box-shadow: 0px 6px 0px 0px #1d7f8a, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(1):active {
            box-shadow: 0px 3px 0px 0px #1d7f8a;
            top: 3px;
        }
        
        .device-tab:nth-child(1).active {
            background: #1d7f8a;
            box-shadow: 0px 3px 0px 0px #155961, 0px 0px 15px 3px rgba(29, 127, 138, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Tablet tab - Purple */
        .device-tab:nth-child(2) {
            background: #8e44ad;
            box-shadow: 0px 6px 0px 0px #732d91, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(2):active {
            box-shadow: 0px 3px 0px 0px #732d91;
            top: 3px;
        }
        
        .device-tab:nth-child(2).active {
            background: #732d91;
            box-shadow: 0px 3px 0px 0px #5b2371, 0px 0px 15px 3px rgba(115, 45, 145, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Mobile tab - Green */
        .device-tab:nth-child(3) {
            background: #27ae60;
            box-shadow: 0px 6px 0px 0px #229954, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(3):active {
            box-shadow: 0px 3px 0px 0px #229954;
            top: 3px;
        }
        
        .device-tab:nth-child(3).active {
            background: #229954;
            box-shadow: 0px 3px 0px 0px #1e7e4a, 0px 0px 15px 3px rgba(34, 153, 84, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Hover tab - Red */
        .device-tab:nth-child(4) {
            background: #d03651;
            box-shadow: 0px 6px 0px 0px #a72b41, 0px 0px 6px 0px rgba(120, 120, 120, 0.4);
        }
        
        .device-tab:nth-child(4):active {
            box-shadow: 0px 3px 0px 0px #a72b41;
            top: 3px;
        }
        
        .device-tab:nth-child(4).active {
            background: #a72b41;
            box-shadow: 0px 3px 0px 0px #8b2237, 0px 0px 15px 3px rgba(167, 43, 65, 0.6);
            top: 3px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .device-tab-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            opacity: 1;
            margin-right: 8px;
        }
        
        .device-tab-icon svg {
            width: 20px;
            height: 20px;
            color: white;
            vertical-align: middle;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
        }
        
        .device-tab-counter {
            animation: counterPulse 0.3s ease-in-out;
            transition: all 0.2s ease;
            position: absolute;
            top: -8px;
            right: -8px;
            background: #fff !important;
            color: #333 !important;
            border: 2px solid #333 !important;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        
        .device-tab-counter:hover {
            transform: scale(1.1);
        }
        
        @keyframes counterPulse {
            0% { opacity: 0; transform: scale(0.8); }
            50% { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .content-area {
            padding: 0;
        }
        
        .input-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 0;
            padding: 8px 0px;
            align-items: start;
        }
        
        .input-row > * {
            min-width: 0;
        }
        
        .input-row.single {
            grid-template-columns: 1fr;
        }
        
        .input-row .components-base-control {
            margin-bottom: 0 !important;
        }
        
        .input-row .components-base-control .components-base-control__label {
            color: #fff !important;
            font-size: 11px !important;
            margin-bottom: 4px !important;
        }
        
        .modern-responsive-panel .components-select-control__input,
        .modern-responsive-panel .components-text-control__input,
        .modern-responsive-panel .components-unit-control__input,
        .modern-responsive-panel .components-number-control__input,
        .modern-responsive-panel input[type="text"],
        .modern-responsive-panel input[type="number"],
        .modern-responsive-panel select {
            background: #2a2a2a !important;
            border: 1px solid #555 !important;
            border-radius: 4px !important;
            color: #fff !important;
            padding: 8px 10px !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
            height: auto !important;
            min-height: 32px !important;
        }
        
        .modern-responsive-panel .components-select-control__input:focus,
        .modern-responsive-panel .components-text-control__input:focus,
        .modern-responsive-panel .components-unit-control__input:focus,
        .modern-responsive-panel .components-number-control__input:focus,
        .modern-responsive-panel input:focus,
        .modern-responsive-panel select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
            outline: none !important;
        }
        
        .modern-responsive-panel .components-button:not(.components-circular-option-picker__option):not(.components-color-palette__item) {
            color: #fff !important;
        }
        
        .border-radius-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 0;
            padding: 8px 12px;
        }
    `;

    // Add styles to head
    if (!document.getElementById('modern-responsive-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modern-responsive-styles';
        styleSheet.textContent = modernStyles;
        document.head.appendChild(styleSheet);
    }

    // Main Responsive Controls Component
    const ModernResponsiveControls = (props) => {
        const [activeDevice, setActiveDevice] = useState('desktop');
        const [hasClipboard, setHasClipboard] = useState(false);

        // Check for clipboard data on component mount and periodically
        const checkClipboard = () => {
            if (window.ModernResponsiveUtils) {
                const utils = window.ModernResponsiveUtils.createResponsiveUtils(props, activeDevice, setHasClipboard);
                setHasClipboard(utils.hasCopiedStyles());
            }
        };

        useEffect(() => {
            checkClipboard();
            // Also check every few seconds to detect changes from other components
            const interval = setInterval(checkClipboard, 2000);
            return () => clearInterval(interval);
        }, []);

        // Ensure all required modules are loaded
        if (!window.ModernResponsiveUtils || !window.ModernResponsiveUI || !window.ModernResponsiveCSS || !window.ModernResponsivePanels) {
            return el('div', { style: { padding: '20px', textAlign: 'center', color: '#fff' } },
                'Loading responsive controls...'
            );
        }

        // Create utility functions
        const utils = window.ModernResponsiveUtils.createResponsiveUtils(props, activeDevice, setHasClipboard);
        
        // Create UI components
        const ui = window.ModernResponsiveUI.createResponsiveUI(utils, activeDevice, setActiveDevice, hasClipboard);
        
        // Create panels
        const panels = window.ModernResponsivePanels.createResponsivePanels(utils, ui);

        return el('div', { className: 'modern-responsive-panel' },
            // Device Header with tabs and actions
            ui.DeviceHeader(),

            // Content Area with all panels
            el('div', { className: 'content-area' },
                panels.LayoutPanel(),
                panels.TypographyPanel(),
                panels.SpacingPanel(),
                panels.BordersPanel(),
                panels.BorderRadiusPanel(),
                panels.FlexboxAdvancedPanel(),
                panels.BackgroundPanel()
            )
        );
    };

    // Add the modern responsive controls to ALL blocks
    const addModernResponsivePanel = (BlockEdit) => {
        return (props) => {
            // Ensure the block has a customId for frontend CSS to work
            if (!props.attributes.customId) {
                // Generate a customId from clientId (take first 6 characters)
                const customId = props.clientId.substring(0, 6);
                props.setAttributes({ customId: customId });
            }

            return el(Fragment, {},
                el(BlockEdit, props),
                // Inject CSS for modern responsive styles
                window.ModernResponsiveCSS && el('div', {
                    style: { display: 'none' },
                    dangerouslySetInnerHTML: { 
                        __html: window.ModernResponsiveCSS.generateModernResponsiveCSS(props) 
                    }
                }),
                el(InspectorControls, {},
                    el(PanelBody, {
                        title: 'Modern Responsive Design',
                        initialOpen: false
                    },
                        el(ModernResponsiveControls, props)
                    )
                )
            );
        };
    };

    wp.hooks.addFilter('editor.BlockEdit', 'modern-responsive/add-controls', addModernResponsivePanel);

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);