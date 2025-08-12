(function(){
  const { registerBlockType } = wp.blocks;
  const { createElement: el, Fragment } = wp.element;
  const { InnerBlocks, InspectorControls, URLInput } = wp.blockEditor;
  const { PanelBody, ToggleControl, TextControl, ToggleControl: Toggle } = wp.components;

  const settings = {
    title: 'Navigation Mega',
    icon: 'menu',
    category: 'design',
    // Parent restriction only applied on the main registration in PHP when needed
    supports: { 
      inserter: true, 
      html: false,
      anchor: true,
      color: {
        text: true,
        background: true,
        gradients: true,
      },
      spacing: {
        padding: true,
        margin: true,
      },
    },
    attributes: {
      label: { type: 'string', default: 'Menu' },
      url: { type: 'string', default: '' },
      opensInNewTab: { type: 'boolean', default: false },
      rel: { type: 'string', default: '' },

      customId: { type: 'string', default: '' },
      autoOpen: { type: 'boolean', default: false },
      fullWidth: { type: 'boolean', default: true },
      insideNavigation: { type: 'boolean', default: false },
    },
    edit: (props) => {
      const { attributes, setAttributes, clientId } = props;
      // Extract background from block supports to preview in editor
      const bg = (attributes.style && attributes.style.color && (attributes.style.color.background || attributes.style.color.gradient)) || undefined;
      const panelStyle = Object.assign({}, attributes.autoOpen ? { display: 'block' } : {}, bg ? { background: bg } : {});
      
      // Generate consistent block ID for responsive extension compatibility
      const blockId = `block_${(attributes.customId || clientId).toString().replace(/^anchor_/, '')}`;

      // Detect if this block is inside a core/navigation tree
      const isInsideNavigation = !!wp.data.select('core/block-editor').getBlockParentsByBlockName(clientId, ['core/navigation','core/navigation-link','core/navigation-submenu']).length;
      if (attributes.insideNavigation !== isInsideNavigation) {
        setAttributes({ insideNavigation: isInsideNavigation });
      }

      const wrapperTag = isInsideNavigation ? 'li' : 'div';
      const wrapperClasses = 'wp-block-stepfox-navigation-mega-item wp-block-navigation-item' + (attributes.autoOpen ? ' is-open' : '');

      return el(wrapperTag, { className: wrapperClasses, style: { listStyle: 'none' }, 'data-editor-auto-open': attributes.autoOpen ? '1' : undefined },
        el(InspectorControls, {},
          el(PanelBody, { title: 'Settings', initialOpen: false },
            el(TextControl, {
              label: 'Label',
              value: attributes.label,
              onChange: (v)=> setAttributes({ label: v })
            }),
            el(URLInput, {
              label: 'Link',
              value: attributes.url,
              onChange: (v)=> setAttributes({ url: v })
            }),
            el(Toggle, {
              label: 'Open in new tab',
              checked: !!attributes.opensInNewTab,
              onChange: (v)=> setAttributes({ opensInNewTab: !!v })
            }),
            el(TextControl, {
              label: 'Rel',
              value: attributes.rel,
              onChange: (v)=> setAttributes({ rel: v })
            }),

            el(ToggleControl, {
              label: 'Open in editor',
              checked: !!attributes.autoOpen,
              onChange: (v)=> setAttributes({ autoOpen: !!v })
            }),
            el(ToggleControl, {
              label: 'Full width (100vw)',
              checked: !!attributes.fullWidth,
              onChange: (v)=> setAttributes({ fullWidth: !!v })
            })
          )
        ),
        el('a', { 
          id: blockId,
          className: 'wp-block-navigation-item__content', 
          href: attributes.url || '#', 
          target: attributes.opensInNewTab ? '_blank' : undefined, 
          rel: attributes.rel || undefined 
        }, attributes.label || 'Menu'),
        el('div', { 
          className: 'wp-block-stepfox-navigation-mega' + (attributes.fullWidth ? ' is-fullwidth' : ''), 
          style: panelStyle 
        },
          el(InnerBlocks, { templateLock: false })
        )
      );
    },
    // Persist inner blocks so they re-open with content after resets/recovery
    save: () => el(InnerBlocks.Content)
  };

  registerBlockType('stepfox/navigation-mega', settings);
  registerBlockType('stepfox/navigation-mega-standalone', settings);
})();


