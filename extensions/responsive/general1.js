(function (blocks, editor, element, components, $) {
  function blockStyleBackend(props) {
    // Helper: determine width for a given breakpoint.
    function getWidthFor(prefix) {
      let width = props.attributes[`width_${prefix}`];
      if (typeof props.attributes.width !== "undefined" && props.attributes.width) {
        width = props.attributes.width;
      }
      if (props.attributes.layout && props.attributes.layout.contentSize) {
        width = props.attributes.layout.contentSize;
      }
      return width;
    }

    // Helper: common advanced CSS for a given breakpoint.
    function advancedCSS(prefix) {
      let css = "";
      css += props.attributes[`${prefix}_position`]
        ? `position: ${props.attributes[`${prefix}_position`]} !important;`
        : "";
      css += props.attributes[`${prefix}_posTop`]
        ? `top: ${props.attributes[`${prefix}_posTop`]} !important;`
        : "";
      css += props.attributes[`${prefix}_posRight`]
        ? `right: ${props.attributes[`${prefix}_posRight`]} !important;`
        : "";
      css += props.attributes[`${prefix}_posBottom`]
        ? `bottom: ${props.attributes[`${prefix}_posBottom`]} !important;`
        : "";
      css += props.attributes[`${prefix}_posLeft`]
        ? `left: ${props.attributes[`${prefix}_posLeft`]} !important;`
        : "";
      css += props.attributes[`${prefix}_display`]
        ? `display: ${props.attributes[`${prefix}_display`]} !important;`
        : "";
      css += props.attributes[`${prefix}_textShadow`]
        ? `text-shadow: ${props.attributes[`${prefix}_textShadow`]} !important;`
        : "";
      css += props.attributes[`${prefix}_flexWrap`]
        ? `flex-wrap: ${props.attributes[`${prefix}_flexWrap`]} !important;`
        : "";
      // For mobile & tablet, include text alignment and justify controls.
      css += props.attributes[`${prefix}_textAlign`]
        ? `text-align: ${props.attributes[`${prefix}_textAlign`]} !important;`
        : "";
      css += props.attributes[`${prefix}_justify`]
        ? `justify-content: ${props.attributes[`${prefix}_justify`]} !important;`
        : "";
      return css;
    }

    // Determine the block's CSS selector.
    let blockSelector = `#block-${props.clientId}`;
    if (props.attributes.customId) {
      blockSelector = `#block_${props.attributes.customId}`;
    }

    // Get gap (if needed for desktop)
    var gap =
      (props.attributes.style &&
        props.attributes.style.spacing &&
        props.attributes.style.spacing.blockGap) ||
      "";

    // Desktop Attributes
    let desktopWidth = getWidthFor("desktop");

    const desktopAttributes = `
      {
      
        animation: ${props.attributes.animation} !important;
        animation-duration: ${props.attributes.animation_duration}s !important;
        animation-delay: ${props.attributes.animation_delay}s !important;
        order: ${props.attributes.order_desktop} !important;
        width: ${desktopWidth} !important;
        gap: ${gap} !important;
        flex-basis: ${desktopWidth} !important;
        font-size: ${props.attributes.font_size_desktop} !important;
        line-height: ${props.attributes.line_height_desktop} !important;
        padding-top: ${props.attributes.desktop_padding.top} !important;
        padding-left: ${props.attributes.desktop_padding.left} !important;
        padding-bottom: ${props.attributes.desktop_padding.bottom} !important;
        padding-right: ${props.attributes.desktop_padding.right} !important;
        margin-top: ${props.attributes.desktop_margin.top} !important;
        margin-left: ${props.attributes.desktop_margin.left} !important;
        margin-bottom: ${props.attributes.desktop_margin.bottom} !important;
        margin-right: ${props.attributes.desktop_margin.right} !important;
        border-top-width: ${props.attributes.desktop_border.top} !important;
        border-left-width: ${props.attributes.desktop_border.left} !important;
        border-bottom-width: ${props.attributes.desktop_border.bottom} !important;
        border-right-width: ${props.attributes.desktop_border.right} !important;
        top: ${props.attributes.desktop_pos.top} !important;
        left: ${props.attributes.desktop_pos.left} !important;
        bottom: ${props.attributes.desktop_pos.bottom} !important;
        right: ${props.attributes.desktop_pos.right} !important;
        position: ${props.attributes.desktop_position.right} !important;
        display: ${props.attributes.desktop_display.right} !important;
        text-shadow: ${props.attributes.desktop_textShadow.right} !important;
        flex-wrap: ${props.attributes.desktop_flexWrap.right} !important;  
        grid-template-columns: repeat(${props.attributes.desktop_columns}, minmax(0, 1fr)) !important; 
        container-type: normal;       
        
        z-index: ${props.attributes.desktop_z_index} !important;
        overflow: ${props.attributes.desktop_overflow} !important;
        zoom: ${props.attributes.desktop_zoom} !important;
        height: ${props.attributes.desktop_height} !important;
        min-height: ${props.attributes.desktop_height} !important;
        flex-direction: ${props.attributes.desktop_flex_direction} !important;
        opacity: ${props.attributes.desktop_opacity} !important;
        white-space: ${props.attributes.desktop_white_space} !important;
        flex-grow: ${props.attributes.desktop_flex_grow} !important;
        transition: all ${props.attributes.desktop_transition}s !important;
        text-align: ${props.attributes.desktop_textAlign} !important;
        justify-content: ${props.attributes.desktop_justify} !important;    
                
        ${advancedCSS("desktop")}
      }
    `;

    const tabletAttributes = `
      {
  
        order: ${props.attributes.order_tablet} !important;
        width: ${props.attributes.width_tablet} !important;
        flex-basis: ${props.attributes.width_tablet} !important;
        font-size: ${props.attributes.font_size_tablet} !important;
        line-height: ${props.attributes.line_height_tablet} !important;
        padding-top: ${props.attributes.tablet_padding.top} !important;
        padding-left: ${props.attributes.tablet_padding.left} !important;
        padding-bottom: ${props.attributes.tablet_padding.bottom} !important;
        padding-right: ${props.attributes.tablet_padding.right} !important;
        margin-top: ${props.attributes.tablet_margin.top} !important;
        margin-left: ${props.attributes.tablet_margin.left} !important;
        margin-bottom: ${props.attributes.tablet_margin.bottom} !important;
        margin-right: ${props.attributes.tablet_margin.right} !important;
        border-top-width: ${props.attributes.tablet_border.top} !important;
        border-left-width: ${props.attributes.tablet_border.left} !important;
        border-bottom-width: ${props.attributes.tablet_border.bottom} !important;
        border-right-width: ${props.attributes.tablet_border.right} !important;
        top: ${props.attributes.tablet_pos.top} !important;
        left: ${props.attributes.tablet_pos.left} !important;
        bottom: ${props.attributes.tablet_pos.bottom} !important;
        right: ${props.attributes.tablet_pos.right} !important;
    
        position: ${props.attributes.tablet_position.right} !important;
        display: ${props.attributes.tablet_display.right} !important;
        text-shadow: ${props.attributes.tablet_textShadow.right} !important;
        flex-wrap: ${props.attributes.tablet_flexWrap.right} !important;  
        
        grid-template-columns: repeat(${props.attributes.tablet_columns}, minmax(0, 1fr)) !important;  
        container-type: normal;
        z-index: ${props.attributes.tablet_z_index} !important;
        overflow: ${props.attributes.tablet_overflow} !important;
        zoom: ${props.attributes.tablet_zoom} !important;
        height: ${props.attributes.tablet_height} !important;
        min-height: ${props.attributes.tablet_height} !important;
        flex-direction: ${props.attributes.tablet_flex_direction} !important;
        opacity: ${props.attributes.tablet_opacity} !important;
        white-space: ${props.attributes.tablet_white_space} !important;
        flex-grow: ${props.attributes.tablet_flex_grow} !important;
        transition: all ${props.attributes.tablet_transition}s !important;
        text-align: ${props.attributes.tablet_textAlign} !important;
        justify-content: ${props.attributes.tablet_justify} !important; 
                
        ${advancedCSS("tablet")}
      }
    `;

    const mobileAttributes = `
      {
        order: ${props.attributes.order_mobile} !important;
        width: ${props.attributes.width_mobile} !important;
        flex-basis: ${props.attributes.width_mobile} !important;
        font-size: ${props.attributes.font_size_mobile} !important;
        line-height: ${props.attributes.line_height_mobile} !important;
        padding-top: ${props.attributes.mobile_padding.top} !important;
        padding-left: ${props.attributes.mobile_padding.left} !important;
        padding-bottom: ${props.attributes.mobile_padding.bottom} !important;
        padding-right: ${props.attributes.mobile_padding.right} !important;
        margin-top: ${props.attributes.mobile_margin.top} !important;
        margin-left: ${props.attributes.mobile_margin.left} !important;
        margin-bottom: ${props.attributes.mobile_margin.bottom} !important;
        margin-right: ${props.attributes.mobile_margin.right} !important;
        border-top-width: ${props.attributes.mobile_border.top} !important;
        border-left-width: ${props.attributes.mobile_border.left} !important;
        border-bottom-width: ${props.attributes.mobile_border.bottom} !important;
        border-right-width: ${props.attributes.mobile_border.right} !important;
        
        top: ${props.attributes.mobile_pos.top} !important;
        left: ${props.attributes.mobile_pos.left} !important;
        bottom: ${props.attributes.mobile_pos.bottom} !important;
        right: ${props.attributes.mobile_pos.right} !important;

        position: ${props.attributes.mobile_position.right} !important;
        display: ${props.attributes.mobile_display.right} !important;
        text-shadow: ${props.attributes.mobile_textShadow.right} !important;
        flex-wrap: ${props.attributes.mobile_flexWrap.right} !important; 
        grid-template-columns: repeat(${props.attributes.mobile_columns}, minmax(0, 1fr)) !important;   
        container-type: normal;  
        z-index: ${props.attributes.mobile_z_index} !important;
        overflow: ${props.attributes.mobile_overflow} !important;
        zoom: ${props.attributes.mobile_zoom} !important;
        height: ${props.attributes.mobile_height} !important;
        min-height: ${props.attributes.mobile_height} !important;
        flex-direction: ${props.attributes.mobile_flex_direction} !important;
        opacity: ${props.attributes.mobile_opacity} !important;
        white-space: ${props.attributes.mobile_white_space} !important;
        flex-grow: ${props.attributes.mobile_flex_grow} !important;
        transition: all ${props.attributes.mobile_transition}s !important;
        text-align: ${props.attributes.mobile_textAlign} !important;
        justify-content: ${props.attributes.mobile_justify} !important;      
                
        ${advancedCSS("mobile")}
      }
    `;

    // Combine all styles.
    return `<style>
      ${blockSelector} ${desktopAttributes}
      @media screen and (max-width:1024px) {
        ${blockSelector} ${tabletAttributes}
      }
      @media screen and (max-width:768px) {
        ${blockSelector} ${mobileAttributes}
      }
      ${props.attributes.custom_css.replaceAll("this_block", blockSelector)}
    </style>`;
  }

  // 1. Register general (common) attributes.
  const addGeneralAttributes = (settings) => {
    settings.attributes = {
      ...settings.attributes,
      customId: { type: "string", default: "stepfox-not-set-id" },
      custom_css: { type: "string", default: "" },
      custom_js: { type: "string", default: "" },

      device: { type: "string", default: "desktop" },

      animation: { type: "string", default: "" },
      animation_delay: { type: "string", default: "" },
      animation_duration: { type: "string", default: "" },
    };
    return settings;
  };

  if ( window.MobileInspectorControls ) {
    // Mobile Inspector Controls are loaded and available
  } else {
    // Mobile Inspector Controls are not loaded yet
  }

  wp.hooks.addFilter("blocks.registerBlockType", "core/column", addGeneralAttributes);
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
    Icon,
    Button,
  } = components;

  // 2. Define a helper function that recursively searches an object/array for all objects that contain a given key.
  const deepSearchByKey = (obj, key, matches = []) => {
    if (obj == null) return matches;
    if (Array.isArray(obj)) {
      obj.forEach((item) => deepSearchByKey(item, key, matches));
    } else if (typeof obj === "object") {
      Object.keys(obj).forEach((k) => {
        if (k === key) {
          matches.push(obj);
        } else {
          deepSearchByKey(obj[k], key, matches);
        }
      });
    }
    return matches;
  };

  // 3. Add Inspector Controls with a uniqueness check for customId
  (function (wp, $) {
    const { createElement: el, Fragment, useEffect } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, TextareaControl, Button } = wp.components;
    var stepfox_icon = el('svg', { width : '28px', height: '28px',  viewBox: '0 0 102.000000 123.000000'},
        el('g', {transform: 'translate(0.000000, 123.000000) scale(0.100000, -0.100000)', fill: '#3999f1', stroke: 'none'},
            el(
              'path', {d: 'M0 873 l0 -348 125 -68 124 -69 3 -126 3 -127 128 -65 127 -65 128 65 127 65 3 127 3 126 124 69 125 68 0 348 c0 191 -3 347 -7 347 -3 0 -118 -57 -254 -127 l-249 -127 -248 127 c-137 70 -252 127 -256 127 -3 0 -6 -156 -6 -347z m310 52 c105 -58 195 -105 200 -105 5 0 95 47 200 105 105 58 193 105 196 105 3 0 4 -34 2 -76 l-3 -76 -122 -70 -123 -69 0 -55 c0 -30 2 -54 3 -54 2 0 57 29 122 65 64 36 119 65 122 65 2 0 3 -35 1 -77 l-3 -77 -120 -67 -120 -67 -5 -133 -5 -133 -65 -37 c-36 -21 -72 -38 -80 -38 -8 0 -44 17 -80 38 l-65 37 -5 132 -5 133 -120 67 -120 68 -3 77 c-2 42 -1 76 2 76 3 0 91 -47 196 -105z'}
            )
        )
    );

    // Recursive function to collect all custom IDs, including query templates
    const collectAllCustomIds = (blocks = null) => {
      const customIds = new Set();
      const startTime = Date.now();
      const TIMEOUT_MS = 100; // Maximum 100ms to prevent freeze

      const traverseBlocks = (blocksToTraverse) => {
        blocksToTraverse.forEach(block => {
          // Safety timeout check to prevent freeze
          if (Date.now() - startTime > TIMEOUT_MS) {
            console.warn('Custom ID collection timeout - preventing freeze');
            return;
          }
          // Collect custom ID if it exists and is not the default
          if (block.attributes.customId && block.attributes.customId !== "stepfox-not-set-id") {
            customIds.add(block.attributes.customId);
          }

          // Recursively check inner blocks
          if (block.innerBlocks && block.innerBlocks.length > 0) {
            traverseBlocks(block.innerBlocks);
          }

          // Special handling for Query block templates (optimized for performance)
          if (block.name === 'core/query' && block.attributes.queryTemplateContent) {
            try {
              // Skip heavy parsing for performance - only parse if really needed
              const templateContent = block.attributes.queryTemplateContent;
              if (templateContent && templateContent.length < 10000) { // Limit size to prevent freeze
                const queryTemplateBlocks = wp.blocks.parse(templateContent);
                if (queryTemplateBlocks && queryTemplateBlocks.length < 50) { // Limit block count
                  traverseBlocks(queryTemplateBlocks);
                }
              }
            } catch (error) {
              // Silently skip problematic templates to prevent panel freeze
            }
          }
        });
      };

      // Use provided blocks or get blocks from editor (with performance limit)
      const blocksToSearch = blocks || wp.data.select("core/block-editor").getBlocks();
      
      // Performance safeguard - limit block processing for fighter post type
      if (blocksToSearch && blocksToSearch.length > 100) {
        console.warn('Too many blocks detected, skipping custom ID collection to prevent freeze');
        return Array.from(customIds);
      }

      // Start traversing
      traverseBlocks(blocksToSearch);

      // Additional sources of blocks (disabled for performance)
      // Skip template parts checking to prevent freeze with fighter post type
      /*
      try {
        // Check template parts
        const templateParts = wp.data.select('core').getEntityRecords('postType', 'wp_template_part');
        if (templateParts) {
          templateParts.forEach(templatePart => {
            if (templatePart.blocks) {
              traverseBlocks(templatePart.blocks);
            }
          });
        }

        // Check query templates
        const queryTemplates = wp.data.select('core').getEntityRecords('postType', 'wp_template');
        if (queryTemplates) {
          queryTemplates.forEach(template => {
            if (template.blocks) {
              traverseBlocks(template.blocks);
            }
          });
        }
      } catch (error) {
        console.warn('Error collecting additional block sources:', error);
      }
      */

      return Array.from(customIds);
    };

    // Generate a unique custom ID
    const generateUniqueCustomId = (props, existingIds) => {
      const generateId = () => {
        // Use a combination of block type, current timestamp, and random string
        const blockTypePart = props.name.replace('/', '-').slice(0, 10);
        const timePart = Date.now().toString(36).slice(-5);
        const randomPart = Math.random().toString(36).substring(2, 7);
        return `${blockTypePart}-${timePart}-${randomPart}`;
      };

      let newCustomId = generateId();
      while (existingIds.has(newCustomId)) {
        newCustomId = generateId();
      }

      return newCustomId;
    };

    // Higher Order Component to add the general inspector controls.
    const withGeneralControls = wp.compose.createHigherOrderComponent((BlockEdit) => {
      return (props) => {
        // Only run client‑side code.
        if (typeof window !== "undefined") {
          useEffect(() => {
            const resizeHandler = () => {
              const cssCode = blockStyleBackend(props);
              const styleId = `dynamic-style-${props.clientId}`;
              let styleElement = document.getElementById(styleId);
              if (!styleElement) {
                styleElement = document.createElement("style");
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
              }
              styleElement.innerHTML = cssCode;
            };
            $(document).on("click", ".block-editor-post-preview__button-resize", resizeHandler);
            return () => {
              $(document).off("click", ".block-editor-post-preview__button-resize", resizeHandler);
            };
          }, []);
        }

        // Function to run custom JS.
        useEffect(() => {
          const styleId = `dynamic-style-${props.clientId}`;
          let styleElement = document.getElementById(styleId);
          if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
          }
          styleElement.innerHTML = blockStyleBackend(props);
          return () => {
            if (styleElement && styleElement.parentNode) {
              styleElement.parentNode.removeChild(styleElement);
            }
          };
        }, [
          props.attributes.custom_css,
          props.attributes.custom_js,
          props.attributes.customId,
          props.attributes.anchor,
          props.attributes.style,
        ]);

        if (props.attributes.anchor) {
          if (props.attributes.anchor.length > 0) {
            props.setAttributes({ customId: `anchor_${props.attributes.anchor}` });
          }
        } else if (
          props.attributes.anchor === "" &&
          props.attributes.customId &&
          props.attributes.customId.includes("anchor_")
        ) {
          props.setAttributes({ customId: "stepfox-not-set-id" });
        }

        // Subscribe to block changes so that the unique ID check runs on paste and other changes.
        const { useSelect } = wp.data;
        const blocks = useSelect(
          (select) => select("core/block-editor").getBlocks(),
          []
        );

        // Unique ID checking effect.
        useEffect(() => {
          // Collect all existing custom IDs from multiple sources
          const existingCustomIds = collectAllCustomIds();
          // Check if current block needs a new custom ID
          if (
            !props.attributes.customId ||
            props.attributes.customId === "stepfox-not-set-id" ||
            existingCustomIds.has(props.attributes.customId)
          ) {
            // Generate a new unique custom ID
            const newCustomId = generateUniqueCustomId(props, existingCustomIds);
            // Set the new unique custom ID
            props.setAttributes({ customId: newCustomId });
          }
        }, [blocks]);

        // Function to run the custom JS entered by the user.
        const runCustomJS = () => {
          let blockSelector = `#block-${props.clientId}`;
          if (props.attributes.custom_js) {
            const jsCode = props.attributes.custom_js.replaceAll(
              "this_block",
              blockSelector
            );
            const scriptElement = document.createElement("script");
            scriptElement.textContent = jsCode;
            document.body.appendChild(scriptElement);
            setTimeout(() => {
              if (scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
              }
            }, 1000);
          }
        };

        return el(
          Fragment,
          {},
          el(BlockEdit, props),
          el("div", {
            style: { display: "none" },
            dangerouslySetInnerHTML: { __html: blockStyleBackend(props) },
          }),
          el(
            InspectorControls,
            {},
            // Custom CSS Panel
            el(
              PanelBody,
              {
                className: "stepfox-responsive-panel",
                title: el(
                  'span',
                  {},
                  el(Icon, { className: "stepfox-icon", icon: stepfox_icon, style: { marginRight: '5px' } }),
                  "Responsive"
                ),
                initialOpen: false
              },
              el(
                PanelBody,
                { title: "Desktop", initialOpen: false },
                window.DesktopInspectorControls ? el(window.DesktopInspectorControls, props) : null,
              ),
              el(
                PanelBody,
                { title: "Tablet", initialOpen: false },
                window.TabletInspectorControls ? el(window.TabletInspectorControls, props) : null,
              ),
              el(
                PanelBody,
                { title: "Mobile", initialOpen: false },
                window.MobileInspectorControls ? el(window.MobileInspectorControls, props) : null,
              ),
              el(
                PanelBody,
                { title: "Custom Css", initialOpen: false },
                el(TextareaControl, {
                  label: "Custom Css",
                  help:
                    "Here you can write custom CSS. Use 'this_block' as a placeholder for the block selector.",
                  onChange: (value) =>
                    props.setAttributes({ custom_css: value }),
                  value: props.attributes.custom_css,
                })
              ),
              // Custom JS Panel
              el(
                PanelBody,
                { title: "Custom JS", initialOpen: false },
                el(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    },
                  },
                  el(
                    "span",
                    { style: { fontWeight: "bold" } },
                    "Custom JS"
                  ),
                  el(
                    Button,
                    {
                      isSecondary: true,
                      onClick: runCustomJS,
                      style: { marginLeft: "5px" },
                    },
                    "Run"
                  )
                ),
                el(TextareaControl, {
                  help:
                    "Here you can write custom JavaScript. Use 'this_block' as a placeholder for the block selector.",
                  onChange: (value) =>
                    props.setAttributes({ custom_js: value }),
                  value: props.attributes.custom_js,
                })
              ),
              el(
                PanelBody,
                { title: "Animation", initialOpen: false },
                el(SelectControl, {
                  label: "animation",
                  value: props.attributes.animation,
                  onChange: (value) => props.setAttributes({ animation: value }),
                  options: [
                    { label: "none", value: "" },
                    // ... (the long list of animation options you had before)
                  ]
                }),
                el(NumberControl, {
                  label: "animation_delay",
                  value: props.attributes.animation_delay,
                  onChange: (value) => props.setAttributes({ animation_delay: value }),
                  type: "number",
                  step: "0.1",
                }),
                el(NumberControl, {
                  label: "animation_duration",
                  value: props.attributes.animation_duration,
                  onChange: (value) => props.setAttributes({ animation_duration: value }),
                  type: "number",
                  step: "0.1",
                })
              ),
            )
          )
        );
      };
    }, "withGeneralControls");

    wp.hooks.addFilter("editor.BlockEdit", "core/column", withGeneralControls);
  })(window.wp, window.jQuery);
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);
