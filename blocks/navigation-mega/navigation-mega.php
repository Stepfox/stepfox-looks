<?php
/**
 * Block: Stepfox Navigation Mega
 * A submenu-like panel that accepts any blocks and renders 100vw centered below the nav.
 */

if (!defined('ABSPATH')) { exit; }

function stepfox_register_navigation_mega_block() {
    // Editor script
    $handle = 'stepfox-navigation-mega-block';
    $script_rel = 'blocks/navigation-mega/navigation-mega.js';
    $script_path = STEPFOX_LOOKS_PATH . $script_rel;
    if (file_exists($script_path)) {
        wp_register_script(
            $handle,
            STEPFOX_LOOKS_URL . $script_rel,
            array('wp-blocks','wp-element','wp-editor','wp-components','wp-block-editor'),
            STEPFOX_LOOKS_VERSION . '-' . filemtime($script_path),
            true
        );
    }

    // Frontend/editor runtime for centering
    $frontend_rel = 'blocks/navigation-mega/navigation-mega-frontend.js';
    $frontend_path = STEPFOX_LOOKS_PATH . $frontend_rel;
    if (file_exists($frontend_path)) {
        wp_enqueue_script(
            'stepfox-navigation-mega-frontend-centering',
            STEPFOX_LOOKS_URL . $frontend_rel,
            array(),
            STEPFOX_LOOKS_VERSION . '-' . filemtime($frontend_path),
            true
        );
    }

    // Styles
    $style_handle = 'stepfox-navigation-mega-block-style';
    $css = '.wp-block-stepfox-navigation-mega-item{position:relative}
    .wp-block-stepfox-navigation-mega{display:none;position:absolute;top:100%;width:100vw;max-width:100vw;z-index:9999;box-sizing:border-box}
    .wp-block-stepfox-navigation-mega-item:hover>.wp-block-stepfox-navigation-mega,
    .wp-block-stepfox-navigation-mega-item:focus-within>.wp-block-stepfox-navigation-mega,
    .wp-block-stepfox-navigation-mega-item.is-selected>.wp-block-stepfox-navigation-mega{display:block}
    .wp-block-navigation{position:relative;overflow:visible}
    .wp-block-navigation__container{overflow:visible}
    ';
    wp_register_style($style_handle, false);
    wp_add_inline_style($style_handle, $css);

    register_block_type('stepfox/navigation-mega', array(
        'api_version' => 2,
        'title'       => __('Navigation Mega','stepfox-looks'),
        'description' => __('Full-width mega menu panel that accepts any blocks.','stepfox-looks'),
        'category'    => 'design',
        'parent'      => array('core/navigation','core/navigation-link','core/navigation-submenu'),
        'icon'        => 'menu',
        'editor_script' => $handle,
        'style'         => $style_handle,
        'supports'      => array(
            'color' => array(
                'text' => true,
                'background' => true,
                'gradients' => true,
            ),
            'spacing' => array(
                'padding' => true,
                'margin' => true,
            ),
        ),
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Menu'),
            'url' => array('type' => 'string', 'default' => ''),
            'opensInNewTab' => array('type' => 'boolean', 'default' => false),
            'rel' => array('type' => 'string', 'default' => ''),
            'autoOpen' => array('type' => 'boolean', 'default' => false),

        ),
        'render_callback' => function($attrs, $content, $block){
            $label = isset($attrs['label']) ? $attrs['label'] : 'Menu';
            $url = isset($attrs['url']) ? $attrs['url'] : '';
            $newTab = !empty($attrs['opensInNewTab']);
            $rel = isset($attrs['rel']) ? $attrs['rel'] : '';
            $target = $newTab ? ' target="_blank"' : '';
            if ($newTab && strpos($rel, 'noopener') === false) {
                $rel = trim($rel . ' noopener');
            }
            $relAttr = $rel ? ' rel="' . esc_attr($rel) . '"' : '';
            $hrefAttr = $url ? ' href="' . esc_url($url) . '"' : ' href="#"';
            

            
            // Generate block ID for responsive extension compatibility - put it on the link element
            $client_id = '';
            if (isset($block) && is_object($block)) {
                // Try various ways to get the client ID
                if (isset($block->context['clientId'])) {
                    $client_id = $block->context['clientId'];
                } elseif (isset($block->parsed_block['clientId'])) {
                    $client_id = $block->parsed_block['clientId'];
                } elseif (method_exists($block, 'get_attribute') && $block->get_attribute('clientId')) {
                    $client_id = $block->get_attribute('clientId');
                }
            }
            
            // Fallback to generating our own ID if we can't get the WordPress one
            if (empty($client_id)) {
                $client_id = wp_generate_uuid4();
            }
            
            $block_id = 'block-' . $client_id;
            
            // Put the block ID on the link element (this is what responsive extension targets)
            $link = '<a id="' . esc_attr($block_id) . '" class="wp-block-navigation-item__content"' . $hrefAttr . $target . $relAttr . '>' . esc_html($label) . '</a>';
            
            // Compose wrapper attributes for the panel (background, spacing, etc.)
            $panel_attrs = get_block_wrapper_attributes(array(
                'class' => 'wp-block-stepfox-navigation-mega',
            ));
            $panel = '<div ' . $panel_attrs . '>' . $content . '</div>';
            
            return '<li class="wp-block-stepfox-navigation-mega-item wp-block-navigation-item">' . $link . $panel . '</li>';
        }
    ));
}
add_action('init', 'stepfox_register_navigation_mega_block');


