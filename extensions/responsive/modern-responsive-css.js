/**
 * Modern Responsive CSS Generator
 * Generates CSS for responsive attributes
 */

(function (blocks, editor, element, components, $) {
    
    // Generate CSS for modern responsive attributes
    const generateModernResponsiveCSS = (props) => {
        // Use customId if available, otherwise fall back to clientId
        const blockId = props.attributes?.customId || props.clientId.substring(0, 6);
        const blockSelector = `#block_${blockId}`;
        const fallbackSelector = `#block-${props.clientId}`;
        
        // Helper function to get attribute value safely
        const getAttr = (name) => props.attributes?.[name] || '';
        
        // Generate CSS for each device - CLEAN VERSION (no duplicates)
        const desktopCSS = `
            ${blockSelector}, ${fallbackSelector} {
                ${getAttr('font_size_desktop') ? `font-size: ${getAttr('font_size_desktop')} !important;` : ''}
                ${getAttr('line_height_desktop') ? `line-height: ${getAttr('line_height_desktop')} !important;` : ''}
                ${getAttr('letter_spacing_desktop') ? `letter-spacing: ${getAttr('letter_spacing_desktop')} !important;` : ''}
                ${getAttr('word_spacing_desktop') ? `word-spacing: ${getAttr('word_spacing_desktop')} !important;` : ''}
                ${getAttr('font_weight_desktop') ? `font-weight: ${getAttr('font_weight_desktop')} !important;` : ''}
                ${getAttr('font_style_desktop') ? `font-style: ${getAttr('font_style_desktop')} !important;` : ''}
                ${getAttr('text_transform_desktop') ? `text-transform: ${getAttr('text_transform_desktop')} !important;` : ''}
                ${getAttr('text_decoration_desktop') ? `text-decoration: ${getAttr('text_decoration_desktop')} !important;` : ''}
                ${getAttr('text_shadow_desktop') ? `text-shadow: ${getAttr('text_shadow_desktop')} !important;` : ''}
                ${getAttr('textAlign_desktop') ? `text-align: ${getAttr('textAlign_desktop')} !important;` : ''}
                ${getAttr('width_desktop') ? `width: ${getAttr('width_desktop')} !important;` : ''}
                ${getAttr('height_desktop') ? `height: ${getAttr('height_desktop')} !important;` : ''}
                ${getAttr('min_width_desktop') ? `min-width: ${getAttr('min_width_desktop')} !important;` : ''}
                ${getAttr('max_width_desktop') ? `max-width: ${getAttr('max_width_desktop')} !important;` : ''}
                ${getAttr('min_height_desktop') ? `min-height: ${getAttr('min_height_desktop')} !important;` : ''}
                ${getAttr('max_height_desktop') ? `max-height: ${getAttr('max_height_desktop')} !important;` : ''}
                ${getAttr('box_sizing_desktop') ? `box-sizing: ${getAttr('box_sizing_desktop')} !important;` : ''}
                ${getAttr('desktop_position') ? `position: ${getAttr('desktop_position')} !important;` : ''}
                ${getAttr('top_desktop') ? `top: ${getAttr('top_desktop')} !important;` : ''}
                ${getAttr('right_desktop') ? `right: ${getAttr('right_desktop')} !important;` : ''}
                ${getAttr('bottom_desktop') ? `bottom: ${getAttr('bottom_desktop')} !important;` : ''}
                ${getAttr('left_desktop') ? `left: ${getAttr('left_desktop')} !important;` : ''}
                ${getAttr('desktop_display') ? `display: ${getAttr('desktop_display')} !important;` : ''}
                ${getAttr('visibility_desktop') ? `visibility: ${getAttr('visibility_desktop')} !important;` : ''}
                ${getAttr('float_desktop') ? `float: ${getAttr('float_desktop')} !important;` : ''}
                ${getAttr('clear_desktop') ? `clear: ${getAttr('clear_desktop')} !important;` : ''}
                ${getAttr('order_desktop') ? `order: ${getAttr('order_desktop')} !important;` : ''}
                ${getAttr('z_index_desktop') ? `z-index: ${getAttr('z_index_desktop')} !important;` : ''}
                ${getAttr('overflow_desktop') ? `overflow: ${getAttr('overflow_desktop')} !important;` : ''}
                ${getAttr('zoom_desktop') ? `zoom: ${getAttr('zoom_desktop')} !important;` : ''}
                ${getAttr('animation_desktop') || getAttr('animation') ? `animation-name: ${getAttr('animation_desktop') || getAttr('animation')} !important;` : ''}
                ${getAttr('animation_duration_desktop') || getAttr('animation_duration') ? `animation-duration: ${getAttr('animation_duration_desktop') || getAttr('animation_duration') || '1'}s !important;` : ''}
                ${getAttr('animation_delay_desktop') || getAttr('animation_delay') ? `animation-delay: ${getAttr('animation_delay_desktop') || getAttr('animation_delay') || '0'}s !important;` : ''}
                ${getAttr('animation_desktop') || getAttr('animation') ? `animation-fill-mode: both !important;` : ''}
                ${getAttr('desktop_flex_direction') ? `flex-direction: ${getAttr('desktop_flex_direction')} !important;` : ''}
                ${getAttr('desktop_justify') ? `justify-content: ${getAttr('desktop_justify')} !important;` : ''}
                ${getAttr('desktop_flexWrap') ? `flex-wrap: ${getAttr('desktop_flexWrap')} !important;` : ''}
                ${getAttr('desktop_flex_grow') ? `flex-grow: ${getAttr('desktop_flex_grow')} !important;` : ''}
                ${getAttr('flex_shrink_desktop') ? `flex-shrink: ${getAttr('flex_shrink_desktop')} !important;` : ''}
                ${getAttr('flex_basis_desktop') ? `flex-basis: ${getAttr('flex_basis_desktop')} !important;` : ''}
                ${getAttr('align_items_desktop') ? `align-items: ${getAttr('align_items_desktop')} !important;` : ''}
                ${getAttr('align_self_desktop') ? `align-self: ${getAttr('align_self_desktop')} !important;` : ''}
                ${getAttr('align_content_desktop') ? `align-content: ${getAttr('align_content_desktop')} !important;` : ''}
                ${getAttr('grid_template_columns_desktop') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_desktop')}, 1fr) !important;` : ''}
                ${getAttr('desktop_borderStyle') ? `border-style: ${getAttr('desktop_borderStyle')} !important;` : ''}
                ${getAttr('desktop_borderColor') ? `border-color: ${getAttr('desktop_borderColor')} !important;` : ''}
                ${getAttr('borderWidth_desktop') ? `border-width: ${getAttr('borderWidth_desktop')} !important;` : ''}
                ${getAttr('box_shadow_desktop') ? `box-shadow: ${getAttr('box_shadow_desktop')} !important;` : ''}
                ${getAttr('filter_desktop') ? `filter: ${getAttr('filter_desktop')} !important;` : ''}
                ${getAttr('opacity_desktop') ? `opacity: ${getAttr('opacity_desktop')} !important;` : ''}
                ${getAttr('transform_desktop') ? `transform: ${getAttr('transform_desktop')} !important;` : ''}
                ${getAttr('transition_desktop') ? `transition: ${getAttr('transition_desktop')} !important;` : ''}
                ${getAttr('cursor_desktop') ? `cursor: ${getAttr('cursor_desktop')} !important;` : ''}
                ${getAttr('user_select_desktop') ? `user-select: ${getAttr('user_select_desktop')} !important;` : ''}
                ${getAttr('pointer_events_desktop') ? `pointer-events: ${getAttr('pointer_events_desktop')} !important;` : ''}
                ${getAttr('color_desktop') ? `color: ${getAttr('color_desktop')} !important;` : ''}
                ${getAttr('background_color_desktop') ? (getAttr('background_color_desktop').includes('gradient') ? `background: ${getAttr('background_color_desktop')} !important;` : `background-color: ${getAttr('background_color_desktop')} !important;`) : ''}
                ${getAttr('background_image_desktop') ? `background-image: ${getAttr('background_image_desktop').startsWith('url(') ? getAttr('background_image_desktop') : `url(${getAttr('background_image_desktop')})`} !important;` : ''}
                ${getAttr('background_size_desktop') ? `background-size: ${getAttr('background_size_desktop')} !important;` : ''}
                ${getAttr('background_position_desktop') ? `background-position: ${getAttr('background_position_desktop')} !important;` : ''}
                ${getAttr('background_repeat_desktop') ? `background-repeat: ${getAttr('background_repeat_desktop')} !important;` : ''}
                ${getAttr('desktop_padding')?.top ? `padding-top: ${getAttr('desktop_padding').top} !important;` : ''}
                ${getAttr('desktop_padding')?.right ? `padding-right: ${getAttr('desktop_padding').right} !important;` : ''}
                ${getAttr('desktop_padding')?.bottom ? `padding-bottom: ${getAttr('desktop_padding').bottom} !important;` : ''}
                ${getAttr('desktop_padding')?.left ? `padding-left: ${getAttr('desktop_padding').left} !important;` : ''}
                ${getAttr('desktop_margin')?.top ? `margin-top: ${getAttr('desktop_margin').top} !important;` : ''}
                ${getAttr('desktop_margin')?.right ? `margin-right: ${getAttr('desktop_margin').right} !important;` : ''}
                ${getAttr('desktop_margin')?.bottom ? `margin-bottom: ${getAttr('desktop_margin').bottom} !important;` : ''}
                ${getAttr('desktop_margin')?.left ? `margin-left: ${getAttr('desktop_margin').left} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('desktop_borderRadius').topLeft} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('desktop_borderRadius').topRight} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('desktop_borderRadius').bottomLeft} !important;` : ''}
                ${getAttr('desktop_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('desktop_borderRadius').bottomRight} !important;` : ''}
            }
        `;

        const tabletCSS = `
            @media (max-width: 1024px) {
                ${blockSelector}, ${fallbackSelector} {
                    ${getAttr('font_size_tablet') ? `font-size: ${getAttr('font_size_tablet')} !important;` : ''}
                    ${getAttr('line_height_tablet') ? `line-height: ${getAttr('line_height_tablet')} !important;` : ''}
                    ${getAttr('letter_spacing_tablet') ? `letter-spacing: ${getAttr('letter_spacing_tablet')} !important;` : ''}
                    ${getAttr('width_tablet') ? `width: ${getAttr('width_tablet')} !important;` : ''}
                    ${getAttr('height_tablet') ? `height: ${getAttr('height_tablet')} !important;` : ''}
                    ${getAttr('order_tablet') ? `order: ${getAttr('order_tablet')} !important;` : ''}
                    ${getAttr('z_index_tablet') ? `z-index: ${getAttr('z_index_tablet')} !important;` : ''}
                    ${getAttr('tablet_position') ? `position: ${getAttr('tablet_position')} !important;` : ''}
                    ${getAttr('top_tablet') ? `top: ${getAttr('top_tablet')} !important;` : ''}
                    ${getAttr('right_tablet') ? `right: ${getAttr('right_tablet')} !important;` : ''}
                    ${getAttr('bottom_tablet') ? `bottom: ${getAttr('bottom_tablet')} !important;` : ''}
                    ${getAttr('left_tablet') ? `left: ${getAttr('left_tablet')} !important;` : ''}
                    ${getAttr('tablet_display') ? `display: ${getAttr('tablet_display')} !important;` : ''}
                    ${getAttr('opacity_tablet') ? `opacity: ${getAttr('opacity_tablet')} !important;` : ''}
                    ${getAttr('overflow_tablet') ? `overflow: ${getAttr('overflow_tablet')} !important;` : ''}
                    ${getAttr('zoom_tablet') ? `zoom: ${getAttr('zoom_tablet')} !important;` : ''}
                    ${getAttr('animation_tablet') ? `animation-name: ${getAttr('animation_tablet')} !important;` : ''}
                    ${getAttr('animation_duration_tablet') ? `animation-duration: ${getAttr('animation_duration_tablet')}s !important;` : ''}
                    ${getAttr('animation_delay_tablet') ? `animation-delay: ${getAttr('animation_delay_tablet')}s !important;` : ''}
                    ${getAttr('animation_tablet') ? `animation-fill-mode: both !important;` : ''}
                    ${getAttr('tablet_flex_direction') ? `flex-direction: ${getAttr('tablet_flex_direction')} !important;` : ''}
                    ${getAttr('tablet_justify') ? `justify-content: ${getAttr('tablet_justify')} !important;` : ''}
                    ${getAttr('tablet_flexWrap') ? `flex-wrap: ${getAttr('tablet_flexWrap')} !important;` : ''}
                    ${getAttr('tablet_flex_grow') ? `flex-grow: ${getAttr('tablet_flex_grow')} !important;` : ''}
                    ${getAttr('textAlign_tablet') ? `text-align: ${getAttr('textAlign_tablet')} !important;` : ''}
                    ${getAttr('transform_tablet') ? `transform: ${getAttr('transform_tablet')} !important;` : ''}
                    ${getAttr('transition_tablet') ? `transition: ${getAttr('transition_tablet')} !important;` : ''}
                    ${getAttr('tablet_borderStyle') ? `border-style: ${getAttr('tablet_borderStyle')} !important;` : ''}
                    ${getAttr('tablet_borderColor') ? `border-color: ${getAttr('tablet_borderColor')} !important;` : ''}
                    ${getAttr('borderWidth_tablet') ? `border-width: ${getAttr('borderWidth_tablet')} !important;` : ''}
                    ${getAttr('word_spacing_tablet') ? `word-spacing: ${getAttr('word_spacing_tablet')} !important;` : ''}
                    ${getAttr('font_weight_tablet') ? `font-weight: ${getAttr('font_weight_tablet')} !important;` : ''}
                    ${getAttr('font_style_tablet') ? `font-style: ${getAttr('font_style_tablet')} !important;` : ''}
                    ${getAttr('text_transform_tablet') ? `text-transform: ${getAttr('text_transform_tablet')} !important;` : ''}
                    ${getAttr('text_decoration_tablet') ? `text-decoration: ${getAttr('text_decoration_tablet')} !important;` : ''}
                    ${getAttr('text_shadow_tablet') ? `text-shadow: ${getAttr('text_shadow_tablet')} !important;` : ''}
                    ${getAttr('min_width_tablet') ? `min-width: ${getAttr('min_width_tablet')} !important;` : ''}
                    ${getAttr('max_width_tablet') ? `max-width: ${getAttr('max_width_tablet')} !important;` : ''}
                    ${getAttr('min_height_tablet') ? `min-height: ${getAttr('min_height_tablet')} !important;` : ''}
                    ${getAttr('max_height_tablet') ? `max-height: ${getAttr('max_height_tablet')} !important;` : ''}
                    ${getAttr('box_sizing_tablet') ? `box-sizing: ${getAttr('box_sizing_tablet')} !important;` : ''}
                    ${getAttr('visibility_tablet') ? `visibility: ${getAttr('visibility_tablet')} !important;` : ''}
                    ${getAttr('float_tablet') ? `float: ${getAttr('float_tablet')} !important;` : ''}
                    ${getAttr('clear_tablet') ? `clear: ${getAttr('clear_tablet')} !important;` : ''}
                    ${getAttr('flex_shrink_tablet') ? `flex-shrink: ${getAttr('flex_shrink_tablet')} !important;` : ''}
                    ${getAttr('flex_basis_tablet') ? `flex-basis: ${getAttr('flex_basis_tablet')} !important;` : ''}
                    ${getAttr('align_items_tablet') ? `align-items: ${getAttr('align_items_tablet')} !important;` : ''}
                    ${getAttr('align_self_tablet') ? `align-self: ${getAttr('align_self_tablet')} !important;` : ''}
                    ${getAttr('align_content_tablet') ? `align-content: ${getAttr('align_content_tablet')} !important;` : ''}
                ${getAttr('grid_template_columns_tablet') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_tablet')}, 1fr) !important;` : ''}
                    ${getAttr('box_shadow_tablet') ? `box-shadow: ${getAttr('box_shadow_tablet')} !important;` : ''}
                    ${getAttr('filter_tablet') ? `filter: ${getAttr('filter_tablet')} !important;` : ''}
                    ${getAttr('cursor_tablet') ? `cursor: ${getAttr('cursor_tablet')} !important;` : ''}
                    ${getAttr('user_select_tablet') ? `user-select: ${getAttr('user_select_tablet')} !important;` : ''}
                    ${getAttr('pointer_events_tablet') ? `pointer-events: ${getAttr('pointer_events_tablet')} !important;` : ''}
                    ${getAttr('color_tablet') ? `color: ${getAttr('color_tablet')} !important;` : ''}
                    ${getAttr('background_color_tablet') ? (getAttr('background_color_tablet').includes('gradient') ? `background: ${getAttr('background_color_tablet')} !important;` : `background-color: ${getAttr('background_color_tablet')} !important;`) : ''}
                    ${getAttr('background_image_tablet') ? `background-image: ${getAttr('background_image_tablet').startsWith('url(') ? getAttr('background_image_tablet') : `url(${getAttr('background_image_tablet')})`} !important;` : ''}
                    ${getAttr('background_size_tablet') ? `background-size: ${getAttr('background_size_tablet')} !important;` : ''}
                    ${getAttr('background_position_tablet') ? `background-position: ${getAttr('background_position_tablet')} !important;` : ''}
                    ${getAttr('background_repeat_tablet') ? `background-repeat: ${getAttr('background_repeat_tablet')} !important;` : ''}
                    ${getAttr('tablet_padding')?.top ? `padding-top: ${getAttr('tablet_padding').top} !important;` : ''}
                    ${getAttr('tablet_padding')?.right ? `padding-right: ${getAttr('tablet_padding').right} !important;` : ''}
                    ${getAttr('tablet_padding')?.bottom ? `padding-bottom: ${getAttr('tablet_padding').bottom} !important;` : ''}
                    ${getAttr('tablet_padding')?.left ? `padding-left: ${getAttr('tablet_padding').left} !important;` : ''}
                    ${getAttr('tablet_margin')?.top ? `margin-top: ${getAttr('tablet_margin').top} !important;` : ''}
                    ${getAttr('tablet_margin')?.right ? `margin-right: ${getAttr('tablet_margin').right} !important;` : ''}
                    ${getAttr('tablet_margin')?.bottom ? `margin-bottom: ${getAttr('tablet_margin').bottom} !important;` : ''}
                    ${getAttr('tablet_margin')?.left ? `margin-left: ${getAttr('tablet_margin').left} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('tablet_borderRadius').topLeft} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('tablet_borderRadius').topRight} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('tablet_borderRadius').bottomLeft} !important;` : ''}
                    ${getAttr('tablet_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('tablet_borderRadius').bottomRight} !important;` : ''}
                }
            }
        `;

        const mobileCSS = `
            @media (max-width: 768px) {
                ${blockSelector}, ${fallbackSelector} {
                    ${getAttr('font_size_mobile') ? `font-size: ${getAttr('font_size_mobile')} !important;` : ''}
                    ${getAttr('line_height_mobile') ? `line-height: ${getAttr('line_height_mobile')} !important;` : ''}
                    ${getAttr('letter_spacing_mobile') ? `letter-spacing: ${getAttr('letter_spacing_mobile')} !important;` : ''}
                    ${getAttr('width_mobile') ? `width: ${getAttr('width_mobile')} !important;` : ''}
                    ${getAttr('height_mobile') ? `height: ${getAttr('height_mobile')} !important;` : ''}
                    ${getAttr('order_mobile') ? `order: ${getAttr('order_mobile')} !important;` : ''}
                    ${getAttr('z_index_mobile') ? `z-index: ${getAttr('z_index_mobile')} !important;` : ''}
                    ${getAttr('mobile_position') ? `position: ${getAttr('mobile_position')} !important;` : ''}
                    ${getAttr('top_mobile') ? `top: ${getAttr('top_mobile')} !important;` : ''}
                    ${getAttr('right_mobile') ? `right: ${getAttr('right_mobile')} !important;` : ''}
                    ${getAttr('bottom_mobile') ? `bottom: ${getAttr('bottom_mobile')} !important;` : ''}
                    ${getAttr('left_mobile') ? `left: ${getAttr('left_mobile')} !important;` : ''}
                    ${getAttr('mobile_display') ? `display: ${getAttr('mobile_display')} !important;` : ''}
                    ${getAttr('opacity_mobile') ? `opacity: ${getAttr('opacity_mobile')} !important;` : ''}
                    ${getAttr('overflow_mobile') ? `overflow: ${getAttr('overflow_mobile')} !important;` : ''}
                    ${getAttr('zoom_mobile') ? `zoom: ${getAttr('zoom_mobile')} !important;` : ''}
                    ${getAttr('animation_mobile') ? `animation-name: ${getAttr('animation_mobile')} !important;` : ''}
                    ${getAttr('animation_duration_mobile') ? `animation-duration: ${getAttr('animation_duration_mobile')}s !important;` : ''}
                    ${getAttr('animation_delay_mobile') ? `animation-delay: ${getAttr('animation_delay_mobile')}s !important;` : ''}
                    ${getAttr('animation_mobile') ? `animation-fill-mode: both !important;` : ''}
                    ${getAttr('mobile_flex_direction') ? `flex-direction: ${getAttr('mobile_flex_direction')} !important;` : ''}
                    ${getAttr('mobile_justify') ? `justify-content: ${getAttr('mobile_justify')} !important;` : ''}
                    ${getAttr('mobile_flexWrap') ? `flex-wrap: ${getAttr('mobile_flexWrap')} !important;` : ''}
                    ${getAttr('mobile_flex_grow') ? `flex-grow: ${getAttr('mobile_flex_grow')} !important;` : ''}
                    ${getAttr('grid_template_columns_mobile') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_mobile')}, 1fr) !important;` : ''}
                    ${getAttr('textAlign_mobile') ? `text-align: ${getAttr('textAlign_mobile')} !important;` : ''}
                    ${getAttr('transform_mobile') ? `transform: ${getAttr('transform_mobile')} !important;` : ''}
                    ${getAttr('transition_mobile') ? `transition: ${getAttr('transition_mobile')} !important;` : ''}
                    ${getAttr('mobile_borderStyle') ? `border-style: ${getAttr('mobile_borderStyle')} !important;` : ''}
                    ${getAttr('mobile_borderColor') ? `border-color: ${getAttr('mobile_borderColor')} !important;` : ''}
                    ${getAttr('borderWidth_mobile') ? `border-width: ${getAttr('borderWidth_mobile')} !important;` : ''}
                    ${getAttr('color_mobile') ? `color: ${getAttr('color_mobile')} !important;` : ''}
                    ${getAttr('background_color_mobile') ? (getAttr('background_color_mobile').includes('gradient') ? `background: ${getAttr('background_color_mobile')} !important;` : `background-color: ${getAttr('background_color_mobile')} !important;`) : ''}
                    ${getAttr('background_image_mobile') ? `background-image: ${getAttr('background_image_mobile').startsWith('url(') ? getAttr('background_image_mobile') : `url(${getAttr('background_image_mobile')})`} !important;` : ''}
                    ${getAttr('background_size_mobile') ? `background-size: ${getAttr('background_size_mobile')} !important;` : ''}
                    ${getAttr('background_position_mobile') ? `background-position: ${getAttr('background_position_mobile')} !important;` : ''}
                    ${getAttr('background_repeat_mobile') ? `background-repeat: ${getAttr('background_repeat_mobile')} !important;` : ''}
                    ${getAttr('mobile_padding')?.top ? `padding-top: ${getAttr('mobile_padding').top} !important;` : ''}
                    ${getAttr('mobile_padding')?.right ? `padding-right: ${getAttr('mobile_padding').right} !important;` : ''}
                    ${getAttr('mobile_padding')?.bottom ? `padding-bottom: ${getAttr('mobile_padding').bottom} !important;` : ''}
                    ${getAttr('mobile_padding')?.left ? `padding-left: ${getAttr('mobile_padding').left} !important;` : ''}
                    ${getAttr('mobile_margin')?.top ? `margin-top: ${getAttr('mobile_margin').top} !important;` : ''}
                    ${getAttr('mobile_margin')?.right ? `margin-right: ${getAttr('mobile_margin').right} !important;` : ''}
                    ${getAttr('mobile_margin')?.bottom ? `margin-bottom: ${getAttr('mobile_margin').bottom} !important;` : ''}
                    ${getAttr('mobile_margin')?.left ? `margin-left: ${getAttr('mobile_margin').left} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('mobile_borderRadius').topLeft} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('mobile_borderRadius').topRight} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('mobile_borderRadius').bottomLeft} !important;` : ''}
                    ${getAttr('mobile_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('mobile_borderRadius').bottomRight} !important;` : ''}
                }
            }
        `;

        const hoverCSS = `
            ${blockSelector}:hover, ${fallbackSelector}:hover {
                ${getAttr('font_size_hover') ? `font-size: ${getAttr('font_size_hover')} !important;` : ''}
                ${getAttr('line_height_hover') ? `line-height: ${getAttr('line_height_hover')} !important;` : ''}
                ${getAttr('letter_spacing_hover') ? `letter-spacing: ${getAttr('letter_spacing_hover')} !important;` : ''}
                ${getAttr('width_hover') ? `width: ${getAttr('width_hover')} !important;` : ''}
                ${getAttr('height_hover') ? `height: ${getAttr('height_hover')} !important;` : ''}
                ${getAttr('order_hover') ? `order: ${getAttr('order_hover')} !important;` : ''}
                ${getAttr('z_index_hover') ? `z-index: ${getAttr('z_index_hover')} !important;` : ''}
                ${getAttr('hover_position') ? `position: ${getAttr('hover_position')} !important;` : ''}
                ${getAttr('top_hover') ? `top: ${getAttr('top_hover')} !important;` : ''}
                ${getAttr('right_hover') ? `right: ${getAttr('right_hover')} !important;` : ''}
                ${getAttr('bottom_hover') ? `bottom: ${getAttr('bottom_hover')} !important;` : ''}
                ${getAttr('left_hover') ? `left: ${getAttr('left_hover')} !important;` : ''}
                ${getAttr('hover_display') ? `display: ${getAttr('hover_display')} !important;` : ''}
                ${getAttr('opacity_hover') ? `opacity: ${getAttr('opacity_hover')} !important;` : ''}
                ${getAttr('overflow_hover') ? `overflow: ${getAttr('overflow_hover')} !important;` : ''}
                ${getAttr('zoom_hover') ? `zoom: ${getAttr('zoom_hover')} !important;` : ''}
                ${getAttr('animation_hover') ? `animation-name: ${getAttr('animation_hover')} !important;` : ''}
                ${getAttr('animation_duration_hover') ? `animation-duration: ${getAttr('animation_duration_hover')}s !important;` : ''}
                ${getAttr('animation_delay_hover') ? `animation-delay: ${getAttr('animation_delay_hover')}s !important;` : ''}
                ${getAttr('animation_hover') ? `animation-fill-mode: both !important;` : ''}
                ${getAttr('hover_flex_direction') ? `flex-direction: ${getAttr('hover_flex_direction')} !important;` : ''}
                ${getAttr('hover_justify') ? `justify-content: ${getAttr('hover_justify')} !important;` : ''}
                ${getAttr('hover_flexWrap') ? `flex-wrap: ${getAttr('hover_flexWrap')} !important;` : ''}
                ${getAttr('hover_flex_grow') ? `flex-grow: ${getAttr('hover_flex_grow')} !important;` : ''}
                ${getAttr('grid_template_columns_hover') ? `grid-template-columns: repeat(${getAttr('grid_template_columns_hover')}, 1fr) !important;` : ''}
                ${getAttr('textAlign_hover') ? `text-align: ${getAttr('textAlign_hover')} !important;` : ''}
                ${getAttr('transform_hover') ? `transform: ${getAttr('transform_hover')} !important;` : ''}
                ${getAttr('transition_hover') ? `transition: ${getAttr('transition_hover')} !important;` : ''}
                ${getAttr('hover_borderStyle') ? `border-style: ${getAttr('hover_borderStyle')} !important;` : ''}
                ${getAttr('color_hover') ? `color: ${getAttr('color_hover')} !important;` : ''}
                ${getAttr('background_color_hover') ? (getAttr('background_color_hover').includes('gradient') ? `background: ${getAttr('background_color_hover')} !important;` : `background-color: ${getAttr('background_color_hover')} !important;`) : ''}
                ${getAttr('background_image_hover') ? `background-image: ${getAttr('background_image_hover').startsWith('url(') ? getAttr('background_image_hover') : `url(${getAttr('background_image_hover')})`} !important;` : ''}
                ${getAttr('background_size_hover') ? `background-size: ${getAttr('background_size_hover')} !important;` : ''}
                ${getAttr('background_position_hover') ? `background-position: ${getAttr('background_position_hover')} !important;` : ''}
                ${getAttr('background_repeat_hover') ? `background-repeat: ${getAttr('background_repeat_hover')} !important;` : ''}
                ${getAttr('hover_borderColor') ? `border-color: ${getAttr('hover_borderColor')} !important;` : ''}
                ${getAttr('borderWidth_hover') ? `border-width: ${getAttr('borderWidth_hover')} !important;` : ''}
                ${getAttr('hover_padding')?.top ? `padding-top: ${getAttr('hover_padding').top} !important;` : ''}
                ${getAttr('hover_padding')?.right ? `padding-right: ${getAttr('hover_padding').right} !important;` : ''}
                ${getAttr('hover_padding')?.bottom ? `padding-bottom: ${getAttr('hover_padding').bottom} !important;` : ''}
                ${getAttr('hover_padding')?.left ? `padding-left: ${getAttr('hover_padding').left} !important;` : ''}
                ${getAttr('hover_margin')?.top ? `margin-top: ${getAttr('hover_margin').top} !important;` : ''}
                ${getAttr('hover_margin')?.right ? `margin-right: ${getAttr('hover_margin').right} !important;` : ''}
                ${getAttr('hover_margin')?.bottom ? `margin-bottom: ${getAttr('hover_margin').bottom} !important;` : ''}
                ${getAttr('hover_margin')?.left ? `margin-left: ${getAttr('hover_margin').left} !important;` : ''}
                ${getAttr('hover_borderRadius')?.topLeft ? `border-top-left-radius: ${getAttr('hover_borderRadius').topLeft} !important;` : ''}
                ${getAttr('hover_borderRadius')?.topRight ? `border-top-right-radius: ${getAttr('hover_borderRadius').topRight} !important;` : ''}
                ${getAttr('hover_borderRadius')?.bottomLeft ? `border-bottom-left-radius: ${getAttr('hover_borderRadius').bottomLeft} !important;` : ''}
                ${getAttr('hover_borderRadius')?.bottomRight ? `border-bottom-right-radius: ${getAttr('hover_borderRadius').bottomRight} !important;` : ''}
            }
        `;

        const finalCSS = `<style>${desktopCSS}${tabletCSS}${mobileCSS}${hoverCSS}</style>`;
        return finalCSS;
    };

    // Export for use in other modules
    window.ModernResponsiveCSS = {
        generateModernResponsiveCSS
    };
    
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);