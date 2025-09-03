<?php
/**
 * Social Share Extension
 * Extends social link blocks with share functionality
 * 
 * @package stepfox
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue social share extension assets
 * Only loads in block editor context
 */
function stepfox_enqueue_social_share_assets() {
    // Only load in block editor
    if (!is_admin()) {
        return;
    }

    $script_path = STEPFOX_LOOKS_PATH . 'extensions/social-share/social-share.js';
    if (file_exists($script_path)) {
        wp_enqueue_script(
            'stepfox-social-share',
            STEPFOX_LOOKS_URL . 'extensions/social-share/social-share.js',
            array('wp-blocks', 'wp-block-editor', 'wp-api'),
            STEPFOX_LOOKS_VERSION,
            true
        );
    }
}
add_action('enqueue_block_editor_assets', 'stepfox_enqueue_social_share_assets');

/**
 * Extend social link blocks with custom attributes
 * 
 * @param array $args Block registration arguments
 * @param string $name Block name
 * @return array Modified arguments
 */
function stepfox_extend_social_link_defaults($args, $name) {
    if ('core/social-link' === $name) {
        // Ensure the shareThisPost attribute is defined
        if (!isset($args['attributes']['shareThisPost'])) {
            $args['attributes']['shareThisPost'] = array(
                'type'    => 'boolean',
                'default' => false,
            );
        }
    }
    return $args;
}
add_filter('register_block_type_args', 'stepfox_extend_social_link_defaults', 10, 2);
/**
 * Extend social links share functionality
 * 
 * @param string $block_content Block HTML content
 * @param array $block Block data
 * @return string Modified block content
 */
function stepfox_extend_social_links_share($block_content, $block) {
    // Safety check: ensure block is properly structured
    if (!is_array($block) || !isset($block['blockName']) || !isset($block['attrs']) || !is_array($block['attrs'])) {
        return $block_content;
    }
    
    // Process only if this is a core/social-link block.
    if ( 'core/social-link' === $block['blockName'] ) {
        // Check if shareThisPost is enabled on this block.
        if ( ! empty( $block['attrs']['shareThisPost'] ) && true === $block['attrs']['shareThisPost'] ) {
            // Get current post URL and title.
            $post_url   = urlencode( get_permalink() );
            $post_title = urlencode( get_the_title() );

            // Define share URLs for each service.
            $share_urls = array(
                'facebook'   => 'https://www.facebook.com/sharer/sharer.php?u=' . $post_url,
                'linkedin'   => 'https://www.linkedin.com/shareArticle?mini=true&url=' . $post_url . '&title=' . $post_title,
                'mastodon'   => 'https://mastodon.social/share?text=' . $post_title . '%20' . $post_url,
                'pinterest'  => 'https://pinterest.com/pin/create/button/?url=' . $post_url . '&description=' . $post_title,
                'pocket'     => 'https://getpocket.com/save?url=' . $post_url . '&title=' . $post_title,
                'reddit'     => 'https://www.reddit.com/submit?url=' . $post_url . '&title=' . $post_title,
                'telegram'   => 'https://t.me/share/url?url=' . $post_url . '&text=' . $post_title,
                'tumblr'     => 'https://www.tumblr.com/share/link?url=' . $post_url . '&name=' . $post_title,
                'twitter'    => 'https://twitter.com/intent/tweet?url=' . $post_url . '&text=' . $post_title,
                'vk'         => 'http://vk.com/share.php?url=' . $post_url . '&title=' . $post_title,
                'whatsapp'   => 'https://api.whatsapp.com/send?text=' . $post_title . '%20' . $post_url,
                'mail'       => 'mailto:?subject=' . $post_title . '&body=' . $post_url,
            );

            // Get the service defined in the block.
            $service = ! empty( $block['attrs']['service'] ) ? strtolower( $block['attrs']['service'] ) : '';
            // Update the block's URL attribute if a valid service exists.
            if ( isset( $share_urls[ $service ] ) ) {
                $block['attrs']['url'] = $share_urls[ $service ];
            } else {
                $block['attrs']['url'] = '#';
            }

            // Get the declared service from the block's attributes.
            $service = ! empty( $block['attrs']['service'] ) ? strtolower( $block['attrs']['service'] ) : '';
            $new_href = isset( $share_urls[ $service ] ) ? $share_urls[ $service ] : '#';

            // Use regex to replace the href attribute inside the <a> tag in the rendered content.
            // This regex keeps all existing attributes (including inline styles or classes).
            $block_content = preg_replace_callback(
                '/<a([^>]+)href="[^"]+"([^>]*)>/i',
                function( $matches ) use ( $new_href ) {
                    // Rebuild the anchor tag with the updated URL.
                    return '<a target="_blank" onclick="window.open(this.href,\'shareWindow\',\'width=640,height=480,resizable,scrollbars,toolbar,menubar\');return false;" ' . $matches[1] . 'href="' . esc_url( $new_href ) . '"' . $matches[2] . '>';
                },
                $block_content
            );
        }
    }
    return $block_content;
}
add_filter('render_block', 'stepfox_extend_social_links_share', 10, 2);