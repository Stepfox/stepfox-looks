(function(wp){
    var addFilter = wp.hooks.addFilter;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var __ = wp.i18n.__;
    var useState = wp.element.useState;
    var useSelect = wp.data.useSelect;
    var parse = wp.blocks.parse;
    var BlockPreview = (wp.blockEditor && (wp.blockEditor.__experimentalBlockPreview || wp.blockEditor.BlockPreview)) || null;

    // Inject one-time styles to widen the modal
    (function ensureTemplateModalStyles(){
        var id = 'sfl-template-modal-styles';
        if (document.getElementById(id)) { return; }
        var css = '' +
            '.sfl-template-modal.components-modal__frame{width:80vw!important;max-width:1400px!important;max-height:85vh!important;}' +
            '.sfl-template-modal .components-card{width:100%;}' +
            '.sfl-template-modal .components-card__body{width:100%;}' +
            '.sfl-template-modal .components-modal__content{padding:16px;}' +
            '';
        var style = document.createElement('style');
        style.id = id;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    })();

    var allowedBlockTypesFilter = function( allowedBlockTypes, blockName, parentBlock ) {
        if ( blockName === 'core/template-part' && parentBlock && parentBlock.name === 'core/post-template' ) {
            return true; // allow
        }
        return allowedBlockTypes;
    };

    addFilter(
        'blocks.allowedBlocks',
        'stepfox/post-template-allow-template-part/allowed-blocks',
        allowedBlockTypesFilter
    );

    // Inspector control to inject a template part into a post-template
    var withTemplatePartInjector = createHigherOrderComponent( function( BlockEdit ) {
        return function( props ) {
            if ( props.name !== 'core/post-template' ) {
                return wp.element.createElement( BlockEdit, props );
            }

            var el = wp.element.createElement;
            var Fragment = wp.element.Fragment;
            var InspectorControls = wp.blockEditor.InspectorControls;
            var PanelBody = wp.components.PanelBody;
            var Button = wp.components.Button;
            var TextControl = wp.components.TextControl;

            var slug = (props.attributes && props.attributes.__sflTemplatePartSlug) || '';
            var theme = (props.attributes && props.attributes.__sflTemplatePartTheme) || '';
            var isOpenState = useState(false);
            var isOpen = isOpenState[0];
            var setOpen = isOpenState[1];

            var templateParts = useSelect(function(select){
                try {
                    return select('core').getEntityRecords('postType', 'wp_template_part', { per_page: -1 });
                } catch(e) { return []; }
            }, []);
            var filteredParts = (templateParts || []).filter(function(item){
                var slug = (item && item.slug) || '';
                return /-card$/.test(slug);
            });

            var onInject = function(){
                if (!slug) { return; }
                var templatePartBlock = wp.blocks.createBlock( 'core/template-part', { slug: slug, theme: theme || undefined } );
                wp.data.dispatch('core/block-editor').replaceInnerBlocks( props.clientId, [ templatePartBlock ], false );
            };

            return el( Fragment, {},
                el( InspectorControls, {},
                    el( PanelBody, { title: __('Template Part inside Post Template', 'stepfox-looks'), initialOpen: true },
                        el( Button, { variant: 'secondary', onClick: function(){ setOpen(true); } }, __('Choose Template', 'stepfox-looks') ),
                        slug ? el('div', { style: { marginTop: '8px', opacity: 0.8 } }, __('Selected:', 'stepfox-looks') + ' ' + slug + (theme ? ' (' + theme + ')' : '')) : null
                    ),
                    isOpen && el( wp.components.Modal, { className: 'sfl-template-modal', title: __('Select Template Part', 'stepfox-looks'), onRequestClose: function(){ setOpen(false); } },
                        !templateParts ? el( wp.components.Spinner, {} ) : el( 'div', { style: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px' } },
                            (filteredParts || []).map(function(item){
                                var blocks = parse( (item && item.content && item.content.raw) || '' );
                                return el( wp.components.Card, { key: item.id, isClickable: true, onClick: function(){
                                        props.setAttributes({ __sflTemplatePartSlug: item.slug, __sflTemplatePartTheme: (item.theme || '') });
                                        // Auto-insert upon choose
                                        var templatePartBlock = wp.blocks.createBlock( 'core/template-part', { slug: item.slug, theme: (item.theme || undefined) } );
                                        wp.data.dispatch('core/block-editor').replaceInnerBlocks( props.clientId, [ templatePartBlock ], false );
                                        setOpen(false);
                                    } },
                                    el( wp.components.CardBody, { style: { width: '100%' } },
                                        el('div', { style: { fontWeight: 600, marginBottom: '8px' } }, (item && item.title && item.title.rendered) || item.slug ),
                                        BlockPreview ? el( BlockPreview, { blocks: blocks, viewportWidth: 1400 } ) : el('div', { style: { padding: '12px', border: '1px solid #ddd' } }, __('Preview not available', 'stepfox-looks'))
                                    )
                                );
                            })
                        )
                    )
                ),
                el( BlockEdit, props )
            );
        };
    }, 'withTemplatePartInjector' );

    addFilter(
        'editor.BlockEdit',
        'stepfox/post-template-allow-template-part/injector',
        withTemplatePartInjector
    );

    // Toolbar button on Post Template block
    var withTemplatePartToolbar = createHigherOrderComponent( function( BlockEdit ) {
        return function( props ) {
            if ( props.name !== 'core/post-template' ) {
                return wp.element.createElement( BlockEdit, props );
            }

            var el = wp.element.createElement;
            var Fragment = wp.element.Fragment;
            var BlockControls = wp.blockEditor.BlockControls;
            var ToolbarGroup = wp.components.ToolbarGroup;
            var ToolbarButton = wp.components.ToolbarButton;

            var doInject = function(slug, theme){
                if (!slug) { return; }
                var templatePartBlock = wp.blocks.createBlock( 'core/template-part', {
                    slug: slug,
                    theme: theme || undefined
                } );
                wp.data.dispatch('core/block-editor').replaceInnerBlocks( props.clientId, [ templatePartBlock ], false );
            };

            var openState = useState(false);
            var open = openState[0];
            var setOpen = openState[1];
            var templateParts = useSelect(function(select){
                try {
                    return select('core').getEntityRecords('postType', 'wp_template_part', { per_page: -1 });
                } catch(e) { return []; }
            }, []);
            var filteredParts = (templateParts || []).filter(function(item){
                var slug = (item && item.slug) || '';
                return /-card$/.test(slug);
            });
            var onClick = function(){
                // Always open chooser; selection will auto-insert
                setOpen(true);
            };

            return el( Fragment, {},
                el( BlockControls, {},
                    el( ToolbarGroup, {},
                        el( ToolbarButton, { 
                            icon: 'insert',
                            label: __('Choose Template', 'stepfox-looks'),
                            onClick: onClick,
                            tooltip: __('Choose Template for Post Template', 'stepfox-looks')
                        })
                    )
                ),
                open && el( wp.components.Modal, { className: 'sfl-template-modal', title: __('Select Template Part', 'stepfox-looks'), onRequestClose: function(){ setOpen(false); } },
                    !templateParts ? el( wp.components.Spinner, {} ) : el( 'div', { style: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px' } },
                        (filteredParts || []).map(function(item){
                            var blocks = parse( (item && item.content && item.content.raw) || '' );
                            return el( wp.components.Card, { key: item.id, isClickable: true, onClick: function(){
                                    props.setAttributes({ __sflTemplatePartSlug: item.slug, __sflTemplatePartTheme: (item.theme || '') });
                                    setOpen(false);
                                    doInject(item.slug, item.theme || '');
                                } },
                                el( wp.components.CardBody, { style: { width: '100%' } },
                                    el('div', { style: { fontWeight: 600, marginBottom: '8px' } }, (item && item.title && item.title.rendered) || item.slug ),
                                    BlockPreview ? el( BlockPreview, { blocks: blocks, viewportWidth: 1400 } ) : el('div', { style: { padding: '12px', border: '1px solid #ddd' } }, __('Preview not available', 'stepfox-looks'))
                                )
                            );
                        })
                    )
                ),
                el( BlockEdit, props )
            );
        };
    }, 'withTemplatePartToolbar' );

    addFilter(
        'editor.BlockEdit',
        'stepfox/post-template-allow-template-part/toolbar',
        withTemplatePartToolbar
    );

})(window.wp);


