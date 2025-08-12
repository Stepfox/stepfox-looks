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
    $css = '.wp-block-stepfox-navigation-mega-item{}
    /* Ensure nav items used for mega are not forced relative */
    .wp-block-stepfox-navigation-mega-item.wp-block-navigation-item{position:static!important}
    /* Default (non-fullwidth): keep in-flow; collapsed size and fade in */
    .wp-block-stepfox-navigation-mega{position:static;width:0;height:0;max-width:none;z-index:9999;box-sizing:border-box;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .2s ease}
    /* Fullwidth mode */
    .wp-block-stepfox-navigation-mega.is-fullwidth{position:absolute;top:100%;width:100vw;max-width:100vw;height:auto}
    /* Editor-only: prevent position:relative on inner block list within mega panel */
    .wp-block-stepfox-navigation-mega .block-editor-block-list__layout{position:static!important}
    /* Open states */
    .wp-block-stepfox-navigation-mega-item:hover>.wp-block-stepfox-navigation-mega,
    .wp-block-stepfox-navigation-mega-item:focus-within>.wp-block-stepfox-navigation-mega,
    .wp-block-stepfox-navigation-mega-item.is-selected>.wp-block-stepfox-navigation-mega,
    .wp-block-stepfox-navigation-mega-item.is-open>.wp-block-stepfox-navigation-mega{opacity:1;visibility:visible;pointer-events:auto;width:auto;height:auto}
    /* In fullwidth, also toggle display so it does not occupy flow */
    .wp-block-stepfox-navigation-mega.is-fullwidth{display:none}
    .wp-block-stepfox-navigation-mega-item:hover>.wp-block-stepfox-navigation-mega.is-fullwidth,
    .wp-block-stepfox-navigation-mega-item:focus-within>.wp-block-stepfox-navigation-mega.is-fullwidth,
    .wp-block-stepfox-navigation-mega-item.is-selected>.wp-block-stepfox-navigation-mega.is-fullwidth,
    .wp-block-stepfox-navigation-mega-item.is-open>.wp-block-stepfox-navigation-mega.is-fullwidth{display:block}
    .wp-block-navigation{overflow:visible}
    .wp-block-navigation__container{overflow:visible}
    ';
    wp_register_style($style_handle, false);
    wp_add_inline_style($style_handle, $css);

    $common_settings = array(
        'api_version' => 2,
        'title'       => __('Navigation Mega','stepfox-looks'),
        'description' => __('Full-width mega menu panel that accepts any blocks.','stepfox-looks'),
        'category'    => 'design',
        // parent populated for main block below to enable insertion inside core/navigation
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
            'anchor' => true,
        ),
        // Expose a context flag to descendants inside the mega panel so nested
        // Navigation Mega blocks can detect they are inside another panel
        'provides_context' => array(
            'stepfox/inMega' => 'isMegaContext',
        ),
        'uses_context' => array('stepfox/inMega'),
        'attributes' => array(
            'label' => array('type' => 'string', 'default' => 'Menu'),
            'url' => array('type' => 'string', 'default' => ''),
            'opensInNewTab' => array('type' => 'boolean', 'default' => false),
            'rel' => array('type' => 'string', 'default' => ''),
            // Use the global responsive customId when available for a stable id
            'customId' => array('type' => 'string', 'default' => ''),
            'fullWidth' => array('type' => 'boolean', 'default' => true),
            'autoOpen' => array('type' => 'boolean', 'default' => false),
            // Hidden attribute used only to pass context down to the panel's inner blocks
            'isMegaContext' => array('type' => 'boolean', 'default' => true),
            // Set by the editor to indicate this block is inside a core/navigation tree
            'insideNavigation' => array('type' => 'boolean', 'default' => false),

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
            

            
            // Build a stable id: prefer anchor, then customId, then fallback
            $raw_id = '';
            if (!empty($attrs['anchor'])) {
                $raw_id = $attrs['anchor'];
            } elseif (!empty($attrs['customId'])) {
                $raw_id = $attrs['customId'];
            }
            if (empty($raw_id)) {
                // Last resort fallback to a portion of a generated uuid (non-stable across refresh)
                $raw_id = substr(wp_generate_uuid4(), 0, 8);
            }
            // Normalize and prefix for consistency with responsive system
            $raw_id = str_replace('anchor_', '', $raw_id);
            $link_id = 'block_' . sanitize_title_with_dashes($raw_id);
            
            // Put the ID on the link element (responsive extension or custom anchor)
            // If fullWidth is OFF, ensure the id lives ONLY on the link element (name), not the panel wrapper
            $link = '<a id="' . esc_attr($link_id) . '" class="wp-block-navigation-item__content"' . $hrefAttr . $target . $relAttr . '>' . esc_html($label) . '</a>';
            
            // Compose wrapper attributes for the panel (background, spacing, etc.)
            // If fullWidth is OFF, we do NOT want the anchor/id on the panel wrapper.
            // Keep any id (anchor) on the name/link element instead.
            $panel_attrs = get_block_wrapper_attributes(array(
                'class' => 'wp-block-stepfox-navigation-mega' . ( !empty($attrs['fullWidth']) ? ' is-fullwidth' : '' ),
            ));
            // Always remove any id attribute injected by WP (anchor support) from the panel wrapper
            $panel_attrs = preg_replace('/\sid="[^"]*"/i', '', $panel_attrs);
            $panel = '<div ' . $panel_attrs . '>' . $content . '</div>';

            // If this block is rendered inside another mega panel, avoid outputting
            // a <li> that would be invalid inside the panel's <div>. Render a <div>
            // with the same classes so styling and JS behaviors still apply.
            $is_nested_inside_mega = !empty($block->context['stepfox/inMega']);
            $is_inside_navigation = !empty($attrs['insideNavigation']);
            $item_tag = ($is_nested_inside_mega || !$is_inside_navigation) ? 'div' : 'li';

            return '<' . $item_tag . ' class="wp-block-stepfox-navigation-mega-item wp-block-navigation-item">' . $link . $panel . '</' . $item_tag . '>';
        }
    );

    // Main block: allowed inside core/navigation trees
    register_block_type('stepfox/navigation-mega', array_merge($common_settings, array(
        'parent' => array('core/navigation','core/navigation-link','core/navigation-submenu','stepfox/navigation-mega'),
    )));

    // Standalone variant: usable anywhere
    register_block_type('stepfox/navigation-mega-standalone', $common_settings);
}
add_action('init', 'stepfox_register_navigation_mega_block');


