(function(){
  const { registerBlockType } = wp.blocks;
  const { createElement: el, Fragment } = wp.element;
  const { InnerBlocks, InspectorControls, URLInput } = wp.blockEditor;
  const { PanelBody, ToggleControl, TextControl, ToggleControl: Toggle } = wp.components;

  registerBlockType('stepfox/navigation-mega', {
    title: 'Navigation Mega',
    icon: 'menu',
    category: 'design',
    parent: ['core/navigation','core/navigation-link','core/navigation-submenu'],
    supports: { inserter: true, html: false },
    attributes: {
      label: { type: 'string', default: 'Menu' },
      url: { type: 'string', default: '' },
      opensInNewTab: { type: 'boolean', default: false },
      rel: { type: 'string', default: '' },

      autoOpen: { type: 'boolean', default: false },
    },
    edit: (props) => {
      const { attributes, setAttributes, clientId } = props;
      // Extract background from block supports to preview in editor
      const bg = (attributes.style && attributes.style.color && (attributes.style.color.background || attributes.style.color.gradient)) || undefined;
      const panelStyle = Object.assign({}, attributes.autoOpen ? { display: 'block' } : {}, bg ? { background: bg } : {});
      
      // Generate consistent block ID for responsive extension compatibility
      const blockId = `block-${clientId}`;

      return el('li', { className: 'wp-block-stepfox-navigation-mega-item wp-block-navigation-item', style: { listStyle: 'none' } },
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
          className: 'wp-block-stepfox-navigation-mega', 
          style: panelStyle 
        },
          el(InnerBlocks, { templateLock: false })
        )
      );
    },
    // Persist inner blocks so they re-open with content after resets/recovery
    save: () => el(InnerBlocks.Content)
  });
})();


