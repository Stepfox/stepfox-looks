<?php
/**
 * Post Template Fallback
 * Prevents query blocks from resetting when template parts reference unavailable fields
 */

/**
 * Enqueue post template fallback assets
 * Only loads in block editor context
 */
function stepfox_enqueue_post_template_fallback_assets() {
    // Only load in block editor
    if (!is_admin()) {
        return;
    }

    $script_path = STEPFOX_LOOKS_PATH . 'extensions/post-template-fallback/post-template-fallback.js';

    if (file_exists($script_path)) {
            wp_enqueue_script(
            'stepfox-post-template-fallback',
            STEPFOX_LOOKS_URL . 'extensions/post-template-fallback/post-template-fallback.js',
            array('wp-blocks', 'wp-editor', 'wp-api'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
}
add_action('enqueue_block_editor_assets', 'stepfox_enqueue_post_template_fallback_assets');

// Prevent template part validation failures from resetting query blocks
function stepfox_prevent_template_validation_reset($block_content, $block, $instance) {
    // Handle post-terms blocks
    if (isset($block['blockName']) && $block['blockName'] === 'core/post-terms') {
        global $wp_query;
        $current_post_type = get_post_type();
        
        // Get post type from query context if available
        if (isset($instance->context['query']['postType'])) {
            $current_post_type = $instance->context['query']['postType'];
        }
        
        $current_post_type = $current_post_type ?: 'post';
        
        // For category terms on non-post types, return empty
        if (isset($block['attrs']['term']) && $block['attrs']['term'] === 'category' && $current_post_type !== 'post') {
            return '';
        }
        
        // For any taxonomy, check if it's registered for this post type
        if (isset($block['attrs']['term'])) {
            $term = $block['attrs']['term'];
            $taxonomies = get_object_taxonomies($current_post_type);
            
            if (!in_array($term, $taxonomies)) {
                return '';
            }
        }
    }
    
    return $block_content;
}
add_filter('render_block', 'stepfox_prevent_template_validation_reset', 5, 3);

// Handle post-author-name blocks for post types that don't support authors
function stepfox_handle_author_blocks($block_content, $block, $instance) {
    if (!isset($block['blockName']) || $block['blockName'] !== 'core/post-author-name') {
        return $block_content;
    }
    
    $current_post_type = get_post_type();
    
    // Get post type from query context if available
    if (isset($instance->context['query']['postType'])) {
        $current_post_type = $instance->context['query']['postType'];
    }
    
    $current_post_type = $current_post_type ?: 'post';
    
    // For non-post types, hide author blocks to prevent validation issues
    if ($current_post_type !== 'post') {
        return '';
    }
    
    return $block_content;
}
add_filter('render_block', 'stepfox_handle_author_blocks', 5, 3);

// Handle cover blocks that can cause validation failures with custom post types
function stepfox_handle_cover_blocks($block_content, $block, $instance) {
    if (!isset($block['blockName']) || $block['blockName'] !== 'core/cover') {
        return $block_content;
    }
    
    $current_post_type = get_post_type();
    
    // Get post type from query context if available
    if (isset($instance->context['query']['postType'])) {
        $current_post_type = $instance->context['query']['postType'];
    }
    
    $current_post_type = $current_post_type ?: 'post';
    
    // For non-post types, neutralize problematic cover attributes
    if ($current_post_type !== 'post') {
        // Check for problematic attributes
        if (isset($block['attrs']['useFeaturedImage']) && $block['attrs']['useFeaturedImage']) {
            // Return a modified version without featured image dependency
            $block_content = str_replace('data-has-background-image="true"', '', $block_content);
            $block_content = str_replace('has-background-image', '', $block_content);
        }
        
        if (isset($block['attrs']['linkToPost']) && $block['attrs']['linkToPost']) {
            // Remove link functionality that could cause validation issues
            $block_content = str_replace('data-link-to-post="true"', '', $block_content);
        }
    }
    
    return $block_content;
}
add_filter('render_block', 'stepfox_handle_cover_blocks', 5, 3);

// Ensure all custom post types have basic support to prevent validation failures
function stepfox_ensure_post_type_compatibility() {
    $custom_post_types = get_post_types(array('public' => true, '_builtin' => false));
    
    foreach ($custom_post_types as $post_type) {
        // Add author support to prevent author block failures
        if (!post_type_supports($post_type, 'author')) {
            add_post_type_support($post_type, 'author');
        }
        
        // Add excerpt support
        if (!post_type_supports($post_type, 'excerpt')) {
            add_post_type_support($post_type, 'excerpt');
        }
        
        // Add thumbnail/featured image support to prevent cover block issues
        if (!post_type_supports($post_type, 'thumbnail')) {
            add_post_type_support($post_type, 'thumbnail');
        }
        
        // Add title support (usually default but ensure it's there)
        if (!post_type_supports($post_type, 'title')) {
            add_post_type_support($post_type, 'title');
        }
        
        // Add editor support
        if (!post_type_supports($post_type, 'editor')) {
            add_post_type_support($post_type, 'editor');
        }
        
        // Register category taxonomy for all custom post types
        $taxonomies = get_object_taxonomies($post_type);
        if (!in_array('category', $taxonomies)) {
            register_taxonomy_for_object_type('category', $post_type);
        }
        
        // Register post_tag taxonomy for all custom post types
        if (!in_array('post_tag', $taxonomies)) {
            register_taxonomy_for_object_type('post_tag', $post_type);
        }
    }
}
add_action('init', 'stepfox_ensure_post_type_compatibility', 15);

// Aggressive prevention of block validation errors
function stepfox_prevent_block_validation_errors($parsed_block, $source_block, $parent_block) {
    // If this is a post-terms block with category, replace it with empty content for non-post types
    if (isset($parsed_block['blockName']) && $parsed_block['blockName'] === 'core/post-terms') {
        if (isset($parsed_block['attrs']['term']) && $parsed_block['attrs']['term'] === 'category') {
            // Check if we're in a query context
            if (isset($_GET['post_type']) && isset($_GET['_wpnonce']) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'stepfox_fallback_nonce')) {
                $post_type = sanitize_key($_GET['post_type']);
                if ($post_type !== 'post' && post_type_exists($post_type)) {
                    $parsed_block['innerHTML'] = '<!-- Category block hidden for ' . esc_html($post_type) . ' -->';
                }
            }
        }
    }
    
    // If this is a post-author-name block, replace it for non-post types
    if (isset($parsed_block['blockName']) && $parsed_block['blockName'] === 'core/post-author-name') {
        if (isset($_GET['post_type']) && isset($_GET['_wpnonce']) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'stepfox_fallback_nonce')) {
            $post_type = sanitize_key($_GET['post_type']);
            if ($post_type !== 'post' && post_type_exists($post_type)) {
                $parsed_block['innerHTML'] = '<!-- Author block hidden for ' . esc_html($post_type) . ' -->';
            }
        }
    }
    
    // If this is a cover block with problematic attributes, neutralize them
    if (isset($parsed_block['blockName']) && $parsed_block['blockName'] === 'core/cover') {
        if (isset($_GET['post_type']) && isset($_GET['_wpnonce']) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'stepfox_fallback_nonce')) {
            $post_type = sanitize_key($_GET['post_type']);
            if ($post_type !== 'post' && post_type_exists($post_type)) {
                // Remove problematic attributes that can cause validation failures
                if (isset($parsed_block['attrs']['useFeaturedImage'])) {
                    $parsed_block['attrs']['useFeaturedImage'] = false;
                }
                
                if (isset($parsed_block['attrs']['linkToPost'])) {
                    $parsed_block['attrs']['linkToPost'] = false;
                }
            }
        }
    }
    
    return $parsed_block;
}
add_filter('render_block_data', 'stepfox_prevent_block_validation_errors', 1, 3);

// Gracefully handle missing taxonomy terms in post-terms blocks
function stepfox_safe_post_terms_display($terms, $post_id, $taxonomy) {
    // If no terms found and we're in a template part, don't throw errors
    if (empty($terms) && is_wp_error($terms)) {
        return array(); // Return empty array instead of WP_Error
    }
    
    return $terms;
}
add_filter('get_the_terms', 'stepfox_safe_post_terms_display', 10, 3);

function stepfox_debug_query_block_changes($query_vars) {
    return $query_vars;
}
// Note: no debug echoing or logging to avoid noisy output in production
add_filter('query_block_get_query_vars', 'stepfox_debug_query_block_changes');

// Ensure template parts are more resilient to post type changes
function stepfox_template_part_compatibility($template_part) {
    // Add data attributes to help JavaScript identify compatible blocks
    if (strpos($template_part, 'wp:post-terms') !== false) {
        // Add compatibility markers for taxonomy-dependent blocks
        $template_part = str_replace(
            'wp:post-terms',
            'wp:post-terms data-requires-taxonomy="true"',
            $template_part
        );
    }
    
    if (strpos($template_part, 'wp:post-author-name') !== false) {
        // Add compatibility markers for author-dependent blocks
        $template_part = str_replace(
            'wp:post-author-name',
            'wp:post-author-name data-requires-author="true"',
            $template_part
        );
    }
    
    return $template_part;
}
add_filter('render_block_core/template-part', 'stepfox_template_part_compatibility');

// Final catch-all: Suppress any WordPress errors that could cause block resets
// Removed error suppression to avoid development functions in production

// Emergency fallback: If query block gets reset, try to restore it
function stepfox_emergency_query_restoration() {
    ?>
    <script>
    (function() {
        var coverBlocksFixed = {};
        
        // Monitor query block changes and fix cover blocks
        if (window.wp && window.wp.data) {
            var unsubscribe = window.wp.data.subscribe(function() {
                var blocks = window.wp.data.select('core/block-editor').getBlocks();
                
                // Recursive function to check all blocks including nested ones
                function checkBlocks(blockList) {
                    blockList.forEach(function(block) {
                        // Only handle cover blocks in query context
                        if (block.name === 'core/cover' && !coverBlocksFixed[block.clientId]) {
                            // Get current query context from parent blocks
                            var parentBlocks = window.wp.data.select('core/block-editor').getBlockParents(block.clientId);
                            var queryBlock = null;
                            
                            parentBlocks.forEach(function(parentId) {
                                var parent = window.wp.data.select('core/block-editor').getBlock(parentId);
                                if (parent && parent.name === 'core/query') {
                                    queryBlock = parent;
                                }
                            });
                            
                            if (queryBlock && queryBlock.attributes.query && queryBlock.attributes.query.postType !== 'post') {
                                
                                var newAttributes = {};
                                var needsUpdate = false;
                                
                                if (block.attributes.useFeaturedImage) {
                                    newAttributes.useFeaturedImage = false;
                                    needsUpdate = true;
                                }
                                
                                if (block.attributes.linkToPost) {
                                    newAttributes.linkToPost = false;
                                    needsUpdate = true;
                                }
                                
                                if (needsUpdate) {
                                    window.wp.data.dispatch('core/block-editor').updateBlockAttributes(block.clientId, newAttributes);
                                    coverBlocksFixed[block.clientId] = true;
                                }
                            }
                        }
                        
                        // Recursively check inner blocks
                        if (block.innerBlocks && block.innerBlocks.length > 0) {
                            checkBlocks(block.innerBlocks);
                        }
                    });
                }
                
                checkBlocks(blocks);
            });
        }
    })();
    </script>
    <?php
}
add_action('admin_footer', 'stepfox_emergency_query_restoration');
?>