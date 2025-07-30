(function (wp) {
    const {
        createElement,
        Fragment,
        useEffect,
        useMemo
    } = wp.element;
    const {addFilter} = wp.hooks;
    const {withSelect} = wp.data;
    const {registerBlockType} = wp.blocks;


    /**
     * 4. Register the child block that consumes the context.
     */
    registerBlockType('myplugin/query-loop-load-more', {
        title: 'Load More',
        category: 'widgets',
        parent: ['core/query'], // Must be placed inside a core/query block.
        icon: 'arrow-down-alt2',
        supports: {
            spacing: {
                margin: true,
                padding: true,
                blockGap: true,
                __experimentalDefaultControls: {
                    margin: true,
                    padding: true,
                    blockGap: true
                }
            },
            align: ['left', 'right', 'full', 'wide', 'center'],
            color: {
                background: true,
                gradients: true,
                link: true,
                text: true
            },
            typography: {
                fontSize: true,
                lineHeight: true,
                __experimentalFontFamily: true,
                __experimentalFontWeight: true,
                __experimentalFontStyle: true,
                __experimentalTextTransform: true,
                __experimentalLetterSpacing: true,
                __experimentalTextDecoration: true
            },
            __experimentalBorder: {
                color: true,
                radius: true,
                style: true,
                width: true
            },
            __experimentalLayout: {
                allowSwitching: true,
                allowInheriting: true,
                default: {
                    type: 'flex'
                }
            }
        },
        edit: function (props) {
            // You can access the innerBlocksString via props.context.innerBlocksString if needed.
            return createElement(
                'div',
                {
                    className: props.className,
                    onClick: function () {
                        // For testing, you might log the context:
                        // console.log('innerBlocksString:', props.context.innerBlocksString);
                    }
                },
                'Load More'
            );
        },
        save: function () {
            return createElement(
                'button',
                {
                    type: 'button',
                    className: 'query-loop-load-more-button'
                },
                'Load More'
            );
        }
    });
})(window.wp);

(function (wp) {
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var addFilter = wp.hooks.addFilter;
    var createElement = wp.element.createElement;

    var withCustomPostsPerPageControl = createHigherOrderComponent(
        function (BlockEdit) {
            return function (props) {
                var name = props.name;
                var attributes = props.attributes;
                var setAttributes = props.setAttributes;

                // Only target the core/query block.
                if (name !== 'core/query') {
                    return createElement(BlockEdit, props);
                }

                // Grab the query attribute.
                var query = attributes.query || {};
                // Check if this block uses the inherited (main) query.
                var isInheritQuery = (typeof query.inherit !== 'undefined' && query.inherit);

                if (!isInheritQuery) {
                    return createElement(BlockEdit, props);
                }

                // Use the customPostsPerPage value.
                var currentValue = attributes.customPostsPerPage || '';
                return createElement(
                    'div',
                    null,
                    createElement(BlockEdit, props),
                    createElement(
                        InspectorControls,
                        null,
                        createElement(
                            PanelBody,
                            {title: 'Main Query Settings', initialOpen: true},
                            createElement(TextControl, {
                                __next40pxDefaultSize: true,
                                __nextHasNoMarginBottom: true,
                                label: 'Posts Per Page',
                                type: 'number',
                                value: currentValue.toString(),
                                onChange: function (value) {
                                    setAttributes({
                                        customPostsPerPage: value,
                                    });
                                }
                            })
                        )
                    )
                );
            };
        },
        'withCustomPostsPerPageControl'
    );

    addFilter('editor.BlockEdit', 'my-plugin/with-custom-posts-per-page-control', withCustomPostsPerPageControl);
})(window.wp);

(function (wp) {
    var addFilter = wp.hooks.addFilter;
    var assign = wp.assign || Object.assign; // Use Object.assign if wp.assign isn't available.

    /**
     * Extend the settings for the core/query block to add a custom attribute.
     *
     * @param {Object} settings Block settings.
     * @param {string} name     Block name.
     * @return {Object} Modified block settings.
     */
    function addCustomPostsPerPageAttribute(settings, name) {
        if (name !== 'core/query') {
            return settings;
        }

        // Extend existing attributes with our custom attribute.
        settings.attributes = assign({}, settings.attributes, {
            customPostsPerPage: { type: "string", default: "" }
        });
        return settings;
    }

    addFilter(
        'blocks.registerBlockType',
        'my-plugin/add-custom-posts-per-page',
        addCustomPostsPerPageAttribute
    );
})(window.wp);

(function (wp, element) {
    var el = element.createElement;
    var ServerSideRender = wp.serverSideRender;
    wp.hooks.addFilter(
        'editor.BlockListBlock',
        'my-plugin/override-block-list-block',
        function (BlockListBlock) {
            return function (props) {
                if (props && props.name === 'core/query'  ) {
if(!props.attributes.query.inherit){props.attributes.customPostsPerPage = props.attributes.query.perPage; }
if(props.attributes.customPostsPerPage == ''){props.attributes.customPostsPerPage = wp.data.select( 'core' ).getEntityRecord( 'root', 'site' ).posts_per_page;}
                    // Build your completely custom preview markup.
                    var customPreview = el(
                        'div',
                        {className: 'custom-preview-content'},

                        wp.element.createElement('div', {

                                style: {'display': 'none'},
                            dangerouslySetInnerHTML: {
                                __html: '<style>' +
                                    '.my-dynamic-override #block-'+props.clientId+' li{display:none;} ' +
                                    '.my-dynamic-override[postnumber="'+props.attributes.customPostsPerPage+'"] #block-'+props.clientId+'  li:nth-child(-n + '+props.attributes.customPostsPerPage+'){display:list-item !important;}' +
                                    '</style>'

                            }
                        })
                    );

                    // Optionally, you can include other dynamic information here.
                    return el(
                        'div',
                        { postnumber : props.attributes.customPostsPerPage,
                            className: 'my-dynamic-override'},
                        customPreview,
                        el(BlockListBlock, props)
                    );
                }
                return el(BlockListBlock, props);
            };
        }
    );

})(window.wp, window.wp.element);


