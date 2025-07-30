(function( wp ) {
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var addFilter = wp.hooks.addFilter;
    var InspectorControls = wp.blockEditor ? wp.blockEditor.InspectorControls : wp.editor.InspectorControls;
    var ToggleControl = wp.components.ToggleControl;

    // Extend the block's attributes and add a provided context for "shareThisPost"
    function addShareAttribute( settings, name ) {
        if ( name !== 'core/social-link' ) {
            return settings;
        }
        settings.attributes = Object.assign( settings.attributes, {
            shareThisPost: {
                type: 'boolean',
                default: false
            }
        });
        return settings;
    }
    addFilter( 'blocks.registerBlockType', 'myplugin/add-share-attribute', addShareAttribute );

    // Add a toggle control in the block inspector.
    var withShareToggleControl = createHigherOrderComponent( function( BlockEdit ) {
        return function( props ) {

            if ( props.name !== 'core/social-link'  ) {
                return wp.element.createElement( BlockEdit, props );
            }
            
            var shareThisPost = props.attributes.shareThisPost;
            return [
                wp.element.createElement(
                    InspectorControls,
                    { key: 'inspector' },
                    wp.element.createElement( 'div', {style:{padding:'20px'}},

                    wp.element.createElement( ToggleControl, {
                        __nextHasNoMarginBottom: true,
                        label: "Share This Post",
                        help: shareThisPost ? "Dynamic share links enabled." : "Default links.",
                        checked: shareThisPost,
                        onChange: function( value ) {
                            props.setAttributes( { shareThisPost: value } );
                        }
                    } )
                    ),
                ),
                wp.element.createElement( BlockEdit, props ),
            ];
        };
    }, 'withShareToggleControl' );
    addFilter( 'editor.BlockEdit', 'myplugin/with-share-toggle-control', withShareToggleControl );

})( window.wp );
