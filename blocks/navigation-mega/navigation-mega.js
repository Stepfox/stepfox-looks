(function(){
  const { registerBlockType } = wp.blocks;
  const { createElement: el, Fragment } = wp.element;
  const { InnerBlocks, InspectorControls, URLInput, MediaUpload, MediaUploadCheck } = wp.blockEditor;
  const { PanelBody, ToggleControl, TextControl, ToggleControl: Toggle, Button } = wp.components;

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
      iconUrl: { type: 'string', default: '' },
      iconAlt: { type: 'string', default: '' },
      iconAfter: { type: 'boolean', default: false },
      iconWidth: { type: 'string', default: '24' },
      iconHeight: { type: 'string', default: '24' },
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
            el('div', { className: 'stepfox-mega-icon-control' },
              el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                attributes.iconUrl ? el('img', { src: attributes.iconUrl, alt: attributes.iconAlt || '', style: { width: (parseInt(attributes.iconWidth)||24) + 'px', height: (parseInt(attributes.iconHeight)||24) + 'px', objectFit: 'cover', borderRadius: '3px' } }) : null,
                el(MediaUploadCheck, {},
                  el(MediaUpload, {
                    onSelect: (media)=> setAttributes({ iconUrl: media?.url || '', iconAlt: media?.alt || media?.title || '' }),
                    allowedTypes: ['image'],
                    value: attributes.iconUrl,
                    render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, attributes.iconUrl ? 'Replace icon' : 'Select icon')
                  })
                ),
                attributes.iconUrl ? el(Button, { isDestructive: true, variant: 'link', onClick: ()=> setAttributes({ iconUrl: '', iconAlt: '' }) }, 'Remove') : null
              )
            ),
            el('div', { style: { display: 'flex', gap: '8px' } },
              el(TextControl, { label: 'Icon width (px)', type: 'number', value: attributes.iconWidth, onChange: (v)=> setAttributes({ iconWidth: v }) }),
              el(TextControl, { label: 'Icon height (px)', type: 'number', value: attributes.iconHeight, onChange: (v)=> setAttributes({ iconHeight: v }) })
            ),
            el(ToggleControl, {
              label: 'Place icon after text',
              checked: !!attributes.iconAfter,
              onChange: (v)=> setAttributes({ iconAfter: !!v })
            }),
            el(ToggleControl, {
              label: 'Full width (100vw)',
              checked: !!attributes.fullWidth,
              onChange: (v)=> setAttributes({ fullWidth: !!v })
            })
          )
        ),
        (function(){
          // Backend-only visual gap support so it previews like frontend
          const gap = (attributes.responsiveStyles && attributes.responsiveStyles.gap && (attributes.responsiveStyles.gap.desktop || attributes.responsiveStyles.gap.all)) || (attributes.style && attributes.style.spacing && attributes.style.spacing.blockGap);
          const linkStyle = gap ? { display: 'flex', alignItems: 'center', gap: gap } : undefined;
          const iconStyle = { width: (parseInt(attributes.iconWidth)||24) + 'px', height: (parseInt(attributes.iconHeight)||24) + 'px', objectFit: 'cover' };
          const icon = attributes.iconUrl ? el('img', { className: 'wp-block-stepfox-navigation-mega__icon' + (attributes.iconAfter ? ' is-after' : ''), src: attributes.iconUrl, alt: attributes.iconAlt || '', style: iconStyle }) : null;
          const label = el(Fragment, {}, attributes.label || 'Menu');
          const contents = attributes.iconAfter ? [label, icon] : [icon, label];
          return el('a', {
            id: blockId,
            className: 'wp-block-navigation-item__content',
            href: attributes.url || '#',
            target: attributes.opensInNewTab ? '_blank' : undefined,
            rel: attributes.rel || undefined,
            style: linkStyle
          }, contents);
        })(),
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


