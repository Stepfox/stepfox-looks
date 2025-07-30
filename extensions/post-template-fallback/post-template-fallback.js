(function( wp ) {
    var __ = wp.i18n.__;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var addFilter = wp.hooks.addFilter;

    var withDefaultContext = createHigherOrderComponent(function( BlockEdit ) {
        return function( props ) {
            // Only target the core/post-template block.
            if ( props.name === 'core/post-template' ) {
                // Check if the block is missing the Query context.
                if ( ! props.context || ! props.context.query || ( typeof props.context.query === 'object' && Object.keys( props.context.query ).length === 0 ) ) {
                    // Supply a default query context.
                    // Adjust these default parameters as needed.
                    props.context = {
                        query: {
                            perPage: 1,
                            postType: 'post',
                            order: 'desc',
                            orderBy: 'date'
                        }
                    };
                }
            }
            return wp.element.createElement( BlockEdit, props );
        };
    }, 'withDefaultContext' );

    // Fix for post-terms blocks when post type changes
    var withTaxonomyValidation = createHigherOrderComponent(function( BlockEdit ) {
        return function( props ) {
            // Target post-terms blocks within query/post-template context
            if ( props.name === 'core/post-terms' ) {
                var postType = 'post';
                
                // Try to get post type from various contexts
                if (props.context && props.context.query && props.context.query.postType) {
                    postType = props.context.query.postType;
                } else if (props.context && props.context.postType) {
                    postType = props.context.postType;
                }
                
                var termAttribute = props.attributes.term;
                
                // If term is 'category' and post type isn't 'post', always hide for non-post types
                if ( termAttribute === 'category' && postType !== 'post' ) {
                    return wp.element.createElement('div', {
                        style: { display: 'none', visibility: 'hidden', height: '0px', overflow: 'hidden' }
                    });
                }
                
                // For any other taxonomy, check if it exists for this post type
                if (termAttribute && postType !== 'post') {
                    try {
                        var postTypeObject = wp.data.select('core').getPostType(postType);
                        if (postTypeObject && postTypeObject.taxonomies && !postTypeObject.taxonomies.includes(termAttribute)) {
                            return wp.element.createElement('div', {
                                style: { display: 'none', visibility: 'hidden', height: '0px', overflow: 'hidden' }
                            });
                        }
                    } catch (e) {
                        return wp.element.createElement('div', {
                            style: { display: 'none', visibility: 'hidden', height: '0px', overflow: 'hidden' }
                        });
                    }
                }
            }
            
            // Target post-author-name blocks for custom post types that might not have authors
            if ( props.name === 'core/post-author-name' ) {
                var postType = 'post';
                
                // Try to get post type from various contexts
                if (props.context && props.context.query && props.context.query.postType) {
                    postType = props.context.query.postType;
                } else if (props.context && props.context.postType) {
                    postType = props.context.postType;
                }
                
                // For non-post types, hide author blocks to prevent issues
                if (postType !== 'post') {
                    return wp.element.createElement('div', {
                        style: { display: 'none', visibility: 'hidden', height: '0px', overflow: 'hidden' }
                    });
                }
            }

            // Target cover blocks that might cause validation issues with custom post types
            if ( props.name === 'core/cover' ) {
                var postType = 'post';
                
                // Try to get post type from various contexts
                if (props.context && props.context.query && props.context.query.postType) {
                    postType = props.context.query.postType;
                } else if (props.context && props.context.postType) {
                    postType = props.context.postType;
                }
                
                // For non-post types, neutralize problematic cover block attributes
                if (postType !== 'post' && props.attributes) {
                    var safeAttributes = Object.assign({}, props.attributes);
                    var originalSetAttributes = props.setAttributes;
                    
                    // Remove problematic attributes that can cause validation failures
                    if (safeAttributes.useFeaturedImage) {
                        safeAttributes.useFeaturedImage = false;
                    }
                    
                    if (safeAttributes.linkToPost) {
                        safeAttributes.linkToPost = false;
                    }
                    
                    // Override setAttributes to prevent these attributes from being set
                    props.setAttributes = function(newAttributes) {
                        if (newAttributes.useFeaturedImage && postType !== 'post') {
                            newAttributes.useFeaturedImage = false;
                        }
                        if (newAttributes.linkToPost && postType !== 'post') {
                            newAttributes.linkToPost = false;
                        }
                        originalSetAttributes(newAttributes);
                    };
                    
                    // Create new props with safe attributes
                    var newProps = Object.assign({}, props, {
                        attributes: safeAttributes
                    });
                    
                    return wp.element.createElement( BlockEdit, newProps );
                }
            }

            return wp.element.createElement( BlockEdit, props );
        };
    }, 'withTaxonomyValidation' );

    // Prevent query block reset on template part validation failures - REMOVED FOR PERFORMANCE
    // The withQueryProtection was causing sluggish clicks, so we're removing it
    // var withQueryProtection = createHigherOrderComponent(function( BlockEdit ) {
    //     return function( props ) {
    //         if ( props.name === 'core/query' ) {
    //             // Store the original query attributes to prevent unwanted resets
    //             var originalOnChange = props.setAttributes;
    //             var lastValidQuery = props.attributes.query;
    //             var lastChangeTime = Date.now();
    //             
    //             props.setAttributes = function(newAttributes) {
    //                 var currentTime = Date.now();
    //                 var timeSinceLastChange = currentTime - lastChangeTime;
    //                 
    //                 // Only prevent resets if they happen too quickly (likely automatic)
    //                 // Allow user-initiated changes (typically take longer than 50ms)
    //                 if (newAttributes.query && 
    //                     (!newAttributes.query.postType || newAttributes.query.postType === 'post') &&
    //                     lastValidQuery && lastValidQuery.postType && lastValidQuery.postType !== 'post' &&
    //                     timeSinceLastChange < 50) { // Only block very rapid/automatic changes
    //                     
    //                     // Preventing rapid query reset, likely automatic
    //                     newAttributes.query = lastValidQuery;
    //                 }
    //                 
    //                 // If this is a valid query change, update our backup
    //                 if (newAttributes.query && newAttributes.query.postType) {
    //                     lastValidQuery = Object.assign({}, newAttributes.query);
    //                 }
    //                 
    //                 lastChangeTime = currentTime;
    //                 originalOnChange(newAttributes);
    //             };
    //         }
    //         
    //         return wp.element.createElement( BlockEdit, props );
    //     };
    // }, 'withQueryProtection' );

    // Aggressive block validation override
    var withBlockValidationOverride = createHigherOrderComponent(function( BlockEdit ) {
        return function( props ) {
            // Override any validation that might cause resets
            if (props.name === 'core/post-template' || props.name === 'core/template-part') {
                // Suppress any validation errors that could cause parent resets
                try {
                    return wp.element.createElement( BlockEdit, props );
                } catch (error) {
                    return wp.element.createElement('div', {}, 'Template loading...');
                }
            }
            
            return wp.element.createElement( BlockEdit, props );
        };
    }, 'withBlockValidationOverride' );

    // Apply filters
    addFilter( 'editor.BlockEdit', 'my-namespace/with-default-context', withDefaultContext );
    addFilter( 'editor.BlockEdit', 'my-namespace/with-taxonomy-validation', withTaxonomyValidation, 5 );
    // addFilter( 'editor.BlockEdit', 'my-namespace/with-query-protection', withQueryProtection, 5 ); // REMOVED
    addFilter( 'editor.BlockEdit', 'my-namespace/with-block-validation-override', withBlockValidationOverride, 1 );
})( window.wp );