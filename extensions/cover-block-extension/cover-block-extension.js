(function( wp ) {
    // Retrieve required functions.
    var addFilter = wp.hooks.addFilter;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var InspectorControls = wp.blockEditor ? wp.blockEditor.InspectorControls : wp.editor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var ToggleControl = wp.components.ToggleControl;
    var Fragment = wp.element.Fragment;
    var el = wp.element.createElement;

    // 1. Extend the Cover block attributes by adding a new boolean attribute "linkToPost".
    addFilter(
        'blocks.registerBlockType',
        'mytheme/extend-cover-block',
        function( settings, name ) {
            if ( name !== 'core/cover' ) {
                return settings;
            }
            // Adding linkToPost attribute to cover block
            settings.attributes.linkToPost = {
                type: 'boolean',
                default: false
            };
            return settings;
        },
        5  // Higher priority than responsive system (20)
    );

    // 2. Add an Inspector control for the toggle.
    var addCoverLinkInspector = createHigherOrderComponent( function( BlockEdit ) {
        return function( props ) {
            if ( props.name !== 'core/cover' ) {
                return el( BlockEdit, props );
            }
            return el(
                Fragment,
                null,
                el( BlockEdit, props ),
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: 'Cover Link Settings', initialOpen: true },
                        el( ToggleControl, {
                            __nextHasNoMarginBottom: true,
                            label: 'Link to Post',
                            help: props.attributes.linkToPost ? 'Cover image will link to the post.' : 'Cover image will not be linked.',
                            checked: props.attributes.linkToPost,
                            onChange: function( value ) {
                                props.setAttributes( { linkToPost: value } );
                            }
                        })
                    )
                )
            );
        };
    }, 'addCoverLinkInspector' );
    addFilter( 'editor.BlockEdit', 'mytheme/extend-cover-block', addCoverLinkInspector );

    // 3. Optionally add a data attribute to the saved markup (useful for debugging or custom styling).
    addFilter(
        'blocks.getSaveContent.extraProps',
        'mytheme/extend-cover-block',
        function( extraProps, blockType, attributes ) {
            if ( blockType.name !== 'core/cover' ) {
                return extraProps;
            }
            if ( attributes.linkToPost ) {
                extraProps['data-link-to-post'] = attributes.linkToPost;
            }
            return extraProps;
        },
        10,
        3
    );
})( window.wp );
