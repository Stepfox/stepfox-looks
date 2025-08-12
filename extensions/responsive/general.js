(function (blocks, editor, element, components, $) {

  // Minimal CSS generation for custom CSS and animations only
  function generateCustomStyles(props) {
    // Determine the block's CSS selector
    let blockSelector = `#block-${props.clientId}`;
    if (props.attributes.customId) {
      blockSelector = `#block_${props.attributes.customId}`;
    }

    let css = '';

    // Handle animations
    if (props.attributes.animation) {
      css += `${blockSelector} {
        animation-name: ${props.attributes.animation} !important;
        animation-duration: ${props.attributes.animation_duration || '1'}s !important;
        animation-delay: ${props.attributes.animation_delay || '0'}s !important;
        animation-fill-mode: both !important;
      }`;
    }

    // Handle custom CSS
    if (props.attributes.custom_css) {
      const customCSS = props.attributes.custom_css;
      const rules = customCSS.split(',').map(rule => rule.trim());
      const processedRules = [];
      
      rules.forEach(rule => {
        if (rule.includes('this_block')) {
          const processedRule = rule.replace(/this_block/g, blockSelector);
          processedRules.push(processedRule);
        } else {
          processedRules.push(rule);
        }
      });
      
      css += processedRules.join(', ');
    }

    return css ? `<style>${css}</style>` : '';
  }




  // 1. General attributes now handled by modern-responsive-attributes.js
  // This prevents conflicts and duplicate registrations
  const addGeneralAttributes = (settings) => {
    // All general attributes (customId, custom_css, device, animation, etc.) 
    // are now registered by the modern responsive system
    // This function kept for backward compatibility but no longer adds attributes
    return settings;
  };


    if ( window.MobileInspectorControls ) {
    // Mobile Inspector Controls are loaded and available

    // // For example, you might add another hook:
    // wp.hooks.addFilter(
    //   'editor.BlockEdit',
    //   'your-namespace/mobile-inspector-additional',
    //   window.MobileInspectorControls
    // );
  } else {
    // Mobile Inspector Controls are not loaded yet
  }



  // DISABLED: Duplicate attribute registration - handled by PHP responsive-style.php instead
  // wp.hooks.addFilter("blocks.registerBlockType", "core/column", addGeneralAttributes);
  const {
    TextControl,
    TextareaControl,
    __experimentalCodeControl: CodeControl,
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

  // Fallback to TextareaControl if CodeControl is not available
  const SafeCodeControl = CodeControl || TextareaControl;

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
    const { PanelBody, TextareaControl, Button, __experimentalCodeControl: CodeControl } = wp.components;
    
    // Fallback to TextareaControl if CodeControl is not available
    const SafeCodeControl = CodeControl || TextareaControl;
    var stepfox_icon = el('svg', { width : '28px', height: '28px',  viewBox: '0 0 102.000000 123.000000'},
        el('g', {transform: 'translate(0.000000, 123.000000) scale(0.100000, -0.100000)', fill: '#3999f1', stroke: 'none',},
            el(
            'path', {d: 'M0 873 l0 -348 125 -68 124 -69 3 -126 3 -127 128 -65 127 -65 128 65 127 65 3 127 3 126 124 69 125 68 0 348 c0 191 -3 347 -7 347 -3 0 -118 -57 -254 -127 l-249 -127 -248 127 c-137 70 -252 127 -256 127 -3 0 -6 -156 -6 -347z m310 52 c105 -58 195 -105 200 -105 5 0 95 47 200 105 105 58 193 105 196 105 3 0 4 -34 2 -76 l-3 -76 -122 -70 -123 -69 0 -55 c0 -30 2 -54 3 -54 2 0 57 29 122 65 64 36 119 65 122 65 2 0 3 -35 1 -77 l-3 -77 -120 -67 -120 -67 -5 -133 -5 -133 -65 -37 c-36 -21 -72 -38 -80 -38 -8 0 -44 17 -80 38 l-65 37 -5 132 -5 133 -120 67 -120 68 -3 77 c-2 42 -1 77 1 77 3 0 58 -29 122 -65 65 -36 120 -65 122 -65 1 0 3 24 3 54 l0 55 -122 69 -123 70 -3 76 c-2 42 -1 76 2 76 3 0 91 -47 196 -105z'}
            ),),
        );
    // Higher Order Component to add the general inspector controls.
    const withGeneralControls = wp.compose.createHigherOrderComponent((BlockEdit) => {
      return (props) => {
              // Only run client‑side code.
      if (typeof window !== "undefined") {

        useEffect(() => {
          const resizeHandler = () => {
            const cssCode = generateCustomStyles(props);
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

      // Function to run custom JS and CSS (ONLY if needed to avoid conflicts)
      useEffect(() => {
        // Only inject styles if block has custom CSS or animation (modern responsive system handles everything else)
        if (!props.attributes.custom_css && !props.attributes.animation) {
          return; // Skip CSS generation - handled by modern responsive system
        }
        
        const styleId = `dynamic-style-${props.clientId}`;
        
        // Function to inject styles into a document
        const injectStyles = (doc) => {
          let styleElement = doc.getElementById(styleId);
          if (!styleElement) {
            styleElement = doc.createElement("style");
            styleElement.id = styleId;
            doc.head.appendChild(styleElement);
          }
          styleElement.innerHTML = generateCustomStyles(props);
          return styleElement;
        };
        
        // Inject into main document
        const mainStyleElement = injectStyles(document);
        
        // Also inject into editor iframe if it exists
        let iframeStyleElement = null;
        const editorCanvas = document.querySelector('iframe[name="editor-canvas"]');
        if (editorCanvas && editorCanvas.contentDocument) {
          try {
            iframeStyleElement = injectStyles(editorCanvas.contentDocument);
          } catch (e) {
            // Iframe might not be accessible due to CORS, silently ignore
          }
        }
        
        return () => {
          // Cleanup main document styles
          if (mainStyleElement && mainStyleElement.parentNode) {
            mainStyleElement.parentNode.removeChild(mainStyleElement);
          }
          // Cleanup iframe styles
          if (iframeStyleElement && iframeStyleElement.parentNode) {
            iframeStyleElement.parentNode.removeChild(iframeStyleElement);
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
          props.setAttributes({ customId: props.attributes.anchor });
        }
      } else if (
        props.attributes.anchor === "" &&
        props.attributes.customId &&
        props.attributes.customId.includes("anchor_")
      ) {
        props.setAttributes({ customId: "stepfox-not-set-id" });
      }
      
      // Clean up any existing customId that has legacy anchor_ prefix
      if (props.attributes.customId && props.attributes.customId.startsWith("anchor_")) {
        const cleanId = props.attributes.customId.replace("anchor_", "");
        props.setAttributes({ customId: cleanId });
      }



        // Ensure that customId is always unique.
        useEffect(() => {
          // Get all blocks from the editor.
          const allBlocks = Object.entries(
            wp.data.select("core/block-editor").getBlocks()
          );
          // Find all objects that have a customId.
          const blocksWithCustomId = deepSearchByKey(allBlocks, "customId");
          // Extract the customId values.
          const blocksIds = blocksWithCustomId.map((item) => item.customId);
          // Function to find duplicates.
          const findDuplicates = (arr) =>
            arr.filter((item, index) => arr.indexOf(item) !== index);
          // If no customId is set, or if it's still the default, or if it's a duplicate...
          if (
            !props.attributes.customId ||
            props.attributes.customId === "stepfox-not-set-id" ||
            findDuplicates(blocksIds).includes(props.attributes.customId)
          ) {
            // Use a portion of the block's clientId as a new unique ID.
            const blockId = props.clientId.slice(0, 6);
            props.setAttributes({ customId: blockId });
          }
        }, []);

        // Function to run the custom JS entered by the user.
        const runCustomJS = () => {
          let blockSelector = `#block-${props.clientId}`;
          if (props.attributes.custom_js) {
            const jsCode = props.attributes.custom_js.replace(
              /this_block/g,
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
          el(
            InspectorControls,
            {},
            // Custom CSS Panel


                       el(
              PanelBody,
              { title: "Custom Css", initialOpen: false },
              el(SafeCodeControl, {
                label: "Custom CSS",
                language: CodeControl ? "css" : undefined,
                help:
                  "Write custom CSS. Use 'this_block' as selector placeholder. Example: this_block { color: red; }",
                onChange: (value) =>
                  props.setAttributes({ custom_css: value }),
                value: props.attributes.custom_css,
                style: { 
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
                  fontSize: '13px',
                  lineHeight: '1.4',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                },
                rows: 12,
                placeholder: CodeControl ? 'this_block {\n  /* Your CSS here */\n  color: #333;\n  background: #fff;\n}' : 'this_block { color: red; }'
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
              el(SafeCodeControl, {
                label: "Custom JavaScript",
                language: CodeControl ? "javascript" : undefined,
                help:
                  "Write custom JavaScript. Use 'this_block' as selector placeholder. Click 'Run' button to execute.",
                onChange: (value) =>
                  props.setAttributes({ custom_js: value }),
                value: props.attributes.custom_js,
                style: { 
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
                  fontSize: '13px',
                  lineHeight: '1.4',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                },
                rows: 10,
                placeholder: CodeControl ? '// Your JavaScript code here\n// Use this_block to reference this element\ndocument.querySelector(this_block).style.opacity = 0.8;\n\n// Example: Add click handler\n// document.querySelector(this_block).addEventListener("click", function() {\n//   alert("Block clicked!");\n// });' : '// Your JavaScript code here'
              })
            ),
            el(
              PanelBody,
              { title: "Animation", initialOpen: false },
                el(SelectControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "animation",
                    value: props.attributes.animation,
                    onChange: (value) => props.setAttributes({animation: value}),
                    options: [
                      {label:"none", value:""},

 {label:"bounce", value:"bounce"},
 {label:"flash", value:"flash"},
 {label:"pulse", value:"pulse"},
 {label:"rubberBand", value:"rubberBand"},
 {label:"shakeX", value:"shakeX"},
 {label:"shakeY", value:"shakeY"},
 {label:"headShake", value:"headShake"},
 {label:"swing", value:"swing"},
 {label:"tada", value:"tada"},
 {label:"wobble", value:"wobble"},
 {label:"jello", value:"jello"},
 {label:"heartBeat", value:"heartBeat"},
 {label:"backInDown", value:"backInDown"},
 {label:"backInLeft", value:"backInLeft"},
 {label:"backInRight", value:"backInRight"},
 {label:"backInUp", value:"backInUp"},
 {label:"backOutDown", value:"backOutDown"},
 {label:"backOutLeft", value:"backOutLeft"},
 {label:"backOutRight", value:"backOutRight"},
 {label:"backOutUp", value:"backOutUp"},
 {label:"bounceIn", value:"bounceIn"},
 {label:"bounceInDown", value:"bounceInDown"},
 {label:"bounceInLeft", value:"bounceInLeft"},
 {label:"bounceInRight", value:"bounceInRight"},
 {label:"bounceInUp", value:"bounceInUp"},
 {label:"bounceOut", value:"bounceOut"},
 {label:"bounceOutDown", value:"bounceOutDown"},
 {label:"bounceOutLeft", value:"bounceOutLeft"},
 {label:"bounceOutRight", value:"bounceOutRight"},
 {label:"bounceOutUp", value:"bounceOutUp"},
 {label:"fadeIn", value:"fadeIn"},
 {label:"fadeInDown", value:"fadeInDown"},
 {label:"fadeInDownBig", value:"fadeInDownBig"},
 {label:"fadeInLeft", value:"fadeInLeft"},
 {label:"fadeInLeftBig", value:"fadeInLeftBig"},
 {label:"fadeInRight", value:"fadeInRight"},
 {label:"fadeInRightBig", value:"fadeInRightBig"},
 {label:"fadeInUp", value:"fadeInUp"},
 {label:"fadeInUpBig", value:"fadeInUpBig"},
 {label:"fadeInTopLeft", value:"fadeInTopLeft"},
 {label:"fadeInTopRight", value:"fadeInTopRight"},
 {label:"fadeInBottomLeft", value:"fadeInBottomLeft"},
 {label:"fadeInBottomRight", value:"fadeInBottomRight"},
 {label:"fadeOut", value:"fadeOut"},
 {label:"fadeOutDown", value:"fadeOutDown"},
 {label:"fadeOutDownBig", value:"fadeOutDownBig"},
 {label:"fadeOutLeft", value:"fadeOutLeft"},
 {label:"fadeOutLeftBig", value:"fadeOutLeftBig"},
 {label:"fadeOutRight", value:"fadeOutRight"},
 {label:"fadeOutRightBig", value:"fadeOutRightBig"},
 {label:"fadeOutUp", value:"fadeOutUp"},
 {label:"fadeOutUpBig", value:"fadeOutUpBig"},
 {label:"fadeOutTopLeft", value:"fadeOutTopLeft"},
 {label:"fadeOutTopRight", value:"fadeOutTopRight"},
 {label:"fadeOutBottomRight", value:"fadeOutBottomRight"},
 {label:"fadeOutBottomLeft", value:"fadeOutBottomLeft"},
 {label:"flip", value:"flip"},
 {label:"flipInX", value:"flipInX"},
 {label:"flipInY", value:"flipInY"},
 {label:"flipOutX", value:"flipOutX"},
 {label:"flipOutY", value:"flipOutY"},
 {label:"lightSpeedInRight", value:"lightSpeedInRight"},
 {label:"lightSpeedInLeft", value:"lightSpeedInLeft"},
 {label:"lightSpeedOutRight", value:"lightSpeedOutRight"},
 {label:"lightSpeedOutLeft", value:"lightSpeedOutLeft"},
 {label:"rotateIn", value:"rotateIn"},
 {label:"rotateInDownLeft", value:"rotateInDownLeft"},
 {label:"rotateInDownRight", value:"rotateInDownRight"},
 {label:"rotateInUpLeft", value:"rotateInUpLeft"},
 {label:"rotateInUpRight", value:"rotateInUpRight"},
 {label:"rotateOut", value:"rotateOut"},
 {label:"rotateOutDownLeft", value:"rotateOutDownLeft"},
 {label:"rotateOutDownRight", value:"rotateOutDownRight"},
 {label:"rotateOutUpLeft", value:"rotateOutUpLeft"},
 {label:"rotateOutUpRight", value:"rotateOutUpRight"},
 {label:"hinge", value:"hinge"},
 {label:"jackInTheBox", value:"jackInTheBox"},
 {label:"rollIn", value:"rollIn"},
 {label:"rollOut", value:"rollOut"},
 {label:"zoomIn", value:"zoomIn"},
 {label:"zoomInDown", value:"zoomInDown"},
 {label:"zoomInLeft", value:"zoomInLeft"},
 {label:"zoomInRight", value:"zoomInRight"},
 {label:"zoomInUp", value:"zoomInUp"},
 {label:"zoomOut", value:"zoomOut"},
 {label:"zoomOutDown", value:"zoomOutDown"},
 {label:"zoomOutLeft", value:"zoomOutLeft"},
 {label:"zoomOutRight", value:"zoomOutRight"},
 {label:"zoomOutUp", value:"zoomOutUp"},
 {label:"slideInDown", value:"slideInDown"},
 {label:"slideInLeft", value:"slideInLeft"},
 {label:"slideInRight", value:"slideInRight"},
 {label:"slideInUp", value:"slideInUp"},
 {label:"slideOutDown", value:"slideOutDown"},
 {label:"slideOutLeft", value:"slideOutLeft"},
 {label:"slideOutRight", value:"slideOutRight"},
 {label:"slideOutUp", value:"slideOutUp"},
                    ]
                }),
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "animation_delay",
                    value: props.attributes.animation_delay,
                    onChange: (value) => props.setAttributes({animation_delay: value}),
                    type: "number",
                    step: "0.1",
                }),
                el(NumberControl, {
                    __next40pxDefaultSize: true,
                    __nextHasNoMarginBottom: true,
                    label: "animation_duration",
                    value: props.attributes.animation_duration,
                    onChange: (value) => props.setAttributes({animation_duration: value}),
                    type: "number",
                    step: "0.1",
                })
              ),
          )
        );
      };
    }, "withGeneralControls");

    wp.hooks.addFilter("editor.BlockEdit", "core/column", withGeneralControls);
  })(window.wp, window.jQuery);

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);
