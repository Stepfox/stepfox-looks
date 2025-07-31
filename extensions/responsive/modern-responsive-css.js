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
        
        // Helper function to get responsive attribute value safely
        const getResponsiveAttr = (property, device) => {
            const responsiveStyles = props.attributes?.responsiveStyles;
            if (!responsiveStyles || !responsiveStyles[property]) {
                return '';
            }
            return responsiveStyles[property][device] || '';
        };
        
        // Helper function to get general attribute (for animations)
        const getAttr = (name) => props.attributes?.[name] || '';
        
        // Helper function to get complex responsive attribute value safely (for nested objects like padding, margin)
        const getComplexResponsiveAttr = (property, device) => {
            const responsiveStyles = props.attributes?.responsiveStyles;
            if (!responsiveStyles || !responsiveStyles[property]) {
                return null;
            }
            return responsiveStyles[property][device] || null;
        };
        
        // Generate CSS for each device - CLEAN VERSION using new object structure
        const desktopCSS = `
            ${blockSelector}, ${fallbackSelector} {
                ${getResponsiveAttr('font_size', 'desktop') ? `font-size: ${getResponsiveAttr('font_size', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('line_height', 'desktop') ? `line-height: ${getResponsiveAttr('line_height', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('letter_spacing', 'desktop') ? `letter-spacing: ${getResponsiveAttr('letter_spacing', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('word_spacing', 'desktop') ? `word-spacing: ${getResponsiveAttr('word_spacing', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('font_weight', 'desktop') ? `font-weight: ${getResponsiveAttr('font_weight', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('font_style', 'desktop') ? `font-style: ${getResponsiveAttr('font_style', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('text_transform', 'desktop') ? `text-transform: ${getResponsiveAttr('text_transform', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('text_decoration', 'desktop') ? `text-decoration: ${getResponsiveAttr('text_decoration', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('text_shadow', 'desktop') ? `text-shadow: ${getResponsiveAttr('text_shadow', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('textAlign', 'desktop') ? `text-align: ${getResponsiveAttr('textAlign', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('width', 'desktop') ? `width: ${getResponsiveAttr('width', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('height', 'desktop') ? `height: ${getResponsiveAttr('height', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('min_width', 'desktop') ? `min-width: ${getResponsiveAttr('min_width', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('max_width', 'desktop') ? `max-width: ${getResponsiveAttr('max_width', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('min_height', 'desktop') ? `min-height: ${getResponsiveAttr('min_height', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('max_height', 'desktop') ? `max-height: ${getResponsiveAttr('max_height', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('box_sizing', 'desktop') ? `box-sizing: ${getResponsiveAttr('box_sizing', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('position', 'desktop') ? `position: ${getResponsiveAttr('position', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('top', 'desktop') ? `top: ${getResponsiveAttr('top', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('right', 'desktop') ? `right: ${getResponsiveAttr('right', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('bottom', 'desktop') ? `bottom: ${getResponsiveAttr('bottom', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('left', 'desktop') ? `left: ${getResponsiveAttr('left', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('display', 'desktop') ? `display: ${getResponsiveAttr('display', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('visibility', 'desktop') ? `visibility: ${getResponsiveAttr('visibility', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('float', 'desktop') ? `float: ${getResponsiveAttr('float', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('clear', 'desktop') ? `clear: ${getResponsiveAttr('clear', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('order', 'desktop') ? `order: ${getResponsiveAttr('order', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('z_index', 'desktop') ? `z-index: ${getResponsiveAttr('z_index', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('overflow', 'desktop') ? `overflow: ${getResponsiveAttr('overflow', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('zoom', 'desktop') ? `zoom: ${getResponsiveAttr('zoom', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('animation', 'desktop') || getAttr('animation') ? `animation-name: ${getResponsiveAttr('animation', 'desktop') || getAttr('animation')} !important;` : ''}
                ${getResponsiveAttr('animation_duration', 'desktop') || getAttr('animation_duration') ? `animation-duration: ${getResponsiveAttr('animation_duration', 'desktop') || getAttr('animation_duration') || '1'}s !important;` : ''}
                ${getResponsiveAttr('animation_delay', 'desktop') || getAttr('animation_delay') ? `animation-delay: ${getResponsiveAttr('animation_delay', 'desktop') || getAttr('animation_delay') || '0'}s !important;` : ''}
                ${getResponsiveAttr('animation', 'desktop') || getAttr('animation') ? `animation-fill-mode: both !important;` : ''}
                ${getResponsiveAttr('flex_direction', 'desktop') ? `flex-direction: ${getResponsiveAttr('flex_direction', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('justify', 'desktop') ? `justify-content: ${getResponsiveAttr('justify', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('flexWrap', 'desktop') ? `flex-wrap: ${getResponsiveAttr('flexWrap', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('flex_grow', 'desktop') ? `flex-grow: ${getResponsiveAttr('flex_grow', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('flex_shrink', 'desktop') ? `flex-shrink: ${getResponsiveAttr('flex_shrink', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('flex_basis', 'desktop') ? `flex-basis: ${getResponsiveAttr('flex_basis', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('align_items', 'desktop') ? `align-items: ${getResponsiveAttr('align_items', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('align_self', 'desktop') ? `align-self: ${getResponsiveAttr('align_self', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('align_content', 'desktop') ? `align-content: ${getResponsiveAttr('align_content', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('grid_template_columns', 'desktop') ? `grid-template-columns: repeat(${getResponsiveAttr('grid_template_columns', 'desktop')}, 1fr) !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'desktop')?.top ? `border-top-width: ${getResponsiveAttr('borderWidth', 'desktop').top} !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'desktop')?.right ? `border-right-width: ${getResponsiveAttr('borderWidth', 'desktop').right} !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'desktop')?.bottom ? `border-bottom-width: ${getResponsiveAttr('borderWidth', 'desktop').bottom} !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'desktop')?.left ? `border-left-width: ${getResponsiveAttr('borderWidth', 'desktop').left} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'desktop')?.top ? `border-top-style: ${getResponsiveAttr('borderStyle', 'desktop').top} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'desktop')?.right ? `border-right-style: ${getResponsiveAttr('borderStyle', 'desktop').right} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'desktop')?.bottom ? `border-bottom-style: ${getResponsiveAttr('borderStyle', 'desktop').bottom} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'desktop')?.left ? `border-left-style: ${getResponsiveAttr('borderStyle', 'desktop').left} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'desktop')?.top ? `border-top-color: ${getResponsiveAttr('borderColor', 'desktop').top} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'desktop')?.right ? `border-right-color: ${getResponsiveAttr('borderColor', 'desktop').right} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'desktop')?.bottom ? `border-bottom-color: ${getResponsiveAttr('borderColor', 'desktop').bottom} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'desktop')?.left ? `border-left-color: ${getResponsiveAttr('borderColor', 'desktop').left} !important;` : ''}
                ${getResponsiveAttr('box_shadow', 'desktop') ? `box-shadow: ${getResponsiveAttr('box_shadow', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('filter', 'desktop') ? `filter: ${getResponsiveAttr('filter', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('opacity', 'desktop') ? `opacity: ${getResponsiveAttr('opacity', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('transform', 'desktop') ? `transform: ${getResponsiveAttr('transform', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('transition', 'desktop') ? `transition: ${getResponsiveAttr('transition', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('cursor', 'desktop') ? `cursor: ${getResponsiveAttr('cursor', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('user_select', 'desktop') ? `user-select: ${getResponsiveAttr('user_select', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('pointer_events', 'desktop') ? `pointer-events: ${getResponsiveAttr('pointer_events', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('color', 'desktop') ? `color: ${getResponsiveAttr('color', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('background_color', 'desktop') ? (getResponsiveAttr('background_color', 'desktop').includes('gradient') ? `background: ${getResponsiveAttr('background_color', 'desktop')} !important;` : `background-color: ${getResponsiveAttr('background_color', 'desktop')} !important;`) : ''}
                ${getResponsiveAttr('background_image', 'desktop') ? `background-image: ${getResponsiveAttr('background_image', 'desktop').startsWith('url(') ? getResponsiveAttr('background_image', 'desktop') : `url(${getResponsiveAttr('background_image', 'desktop')})`} !important;` : ''}
                ${getResponsiveAttr('background_size', 'desktop') ? `background-size: ${getResponsiveAttr('background_size', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('background_position', 'desktop') ? `background-position: ${getResponsiveAttr('background_position', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('background_repeat', 'desktop') ? `background-repeat: ${getResponsiveAttr('background_repeat', 'desktop')} !important;` : ''}
                ${getResponsiveAttr('padding', 'desktop')?.top ? `padding-top: ${getResponsiveAttr('padding', 'desktop').top} !important;` : ''}
                ${getResponsiveAttr('padding', 'desktop')?.right ? `padding-right: ${getResponsiveAttr('padding', 'desktop').right} !important;` : ''}
                ${getResponsiveAttr('padding', 'desktop')?.bottom ? `padding-bottom: ${getResponsiveAttr('padding', 'desktop').bottom} !important;` : ''}
                ${getResponsiveAttr('padding', 'desktop')?.left ? `padding-left: ${getResponsiveAttr('padding', 'desktop').left} !important;` : ''}
                ${getResponsiveAttr('margin', 'desktop')?.top ? `margin-top: ${getResponsiveAttr('margin', 'desktop').top} !important;` : ''}
                ${getResponsiveAttr('margin', 'desktop')?.right ? `margin-right: ${getResponsiveAttr('margin', 'desktop').right} !important;` : ''}
                ${getResponsiveAttr('margin', 'desktop')?.bottom ? `margin-bottom: ${getResponsiveAttr('margin', 'desktop').bottom} !important;` : ''}
                ${getResponsiveAttr('margin', 'desktop')?.left ? `margin-left: ${getResponsiveAttr('margin', 'desktop').left} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'desktop')?.topLeft ? `border-top-left-radius: ${getResponsiveAttr('borderRadius', 'desktop').topLeft} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'desktop')?.topRight ? `border-top-right-radius: ${getResponsiveAttr('borderRadius', 'desktop').topRight} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'desktop')?.bottomLeft ? `border-bottom-left-radius: ${getResponsiveAttr('borderRadius', 'desktop').bottomLeft} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'desktop')?.bottomRight ? `border-bottom-right-radius: ${getResponsiveAttr('borderRadius', 'desktop').bottomRight} !important;` : ''}
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
                                ${getAttr('tablet_borderWidth')?.top ? `border-top-width: ${getAttr('tablet_borderWidth').top} !important;` : ''}
            ${getAttr('tablet_borderWidth')?.right ? `border-right-width: ${getAttr('tablet_borderWidth').right} !important;` : ''}
            ${getAttr('tablet_borderWidth')?.bottom ? `border-bottom-width: ${getAttr('tablet_borderWidth').bottom} !important;` : ''}
            ${getAttr('tablet_borderWidth')?.left ? `border-left-width: ${getAttr('tablet_borderWidth').left} !important;` : ''}
            ${getAttr('tablet_borderStyle')?.top ? `border-top-style: ${getAttr('tablet_borderStyle').top} !important;` : ''}
            ${getAttr('tablet_borderStyle')?.right ? `border-right-style: ${getAttr('tablet_borderStyle').right} !important;` : ''}
            ${getAttr('tablet_borderStyle')?.bottom ? `border-bottom-style: ${getAttr('tablet_borderStyle').bottom} !important;` : ''}
            ${getAttr('tablet_borderStyle')?.left ? `border-left-style: ${getAttr('tablet_borderStyle').left} !important;` : ''}
            ${getAttr('tablet_borderColor')?.top ? `border-top-color: ${getAttr('tablet_borderColor').top} !important;` : ''}
            ${getAttr('tablet_borderColor')?.right ? `border-right-color: ${getAttr('tablet_borderColor').right} !important;` : ''}
            ${getAttr('tablet_borderColor')?.bottom ? `border-bottom-color: ${getAttr('tablet_borderColor').bottom} !important;` : ''}
            ${getAttr('tablet_borderColor')?.left ? `border-left-color: ${getAttr('tablet_borderColor').left} !important;` : ''}
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
                                ${getAttr('mobile_borderWidth')?.top ? `border-top-width: ${getAttr('mobile_borderWidth').top} !important;` : ''}
            ${getAttr('mobile_borderWidth')?.right ? `border-right-width: ${getAttr('mobile_borderWidth').right} !important;` : ''}
            ${getAttr('mobile_borderWidth')?.bottom ? `border-bottom-width: ${getAttr('mobile_borderWidth').bottom} !important;` : ''}
            ${getAttr('mobile_borderWidth')?.left ? `border-left-width: ${getAttr('mobile_borderWidth').left} !important;` : ''}
            ${getAttr('mobile_borderStyle')?.top ? `border-top-style: ${getAttr('mobile_borderStyle').top} !important;` : ''}
            ${getAttr('mobile_borderStyle')?.right ? `border-right-style: ${getAttr('mobile_borderStyle').right} !important;` : ''}
            ${getAttr('mobile_borderStyle')?.bottom ? `border-bottom-style: ${getAttr('mobile_borderStyle').bottom} !important;` : ''}
            ${getAttr('mobile_borderStyle')?.left ? `border-left-style: ${getAttr('mobile_borderStyle').left} !important;` : ''}
            ${getAttr('mobile_borderColor')?.top ? `border-top-color: ${getAttr('mobile_borderColor').top} !important;` : ''}
            ${getAttr('mobile_borderColor')?.right ? `border-right-color: ${getAttr('mobile_borderColor').right} !important;` : ''}
            ${getAttr('mobile_borderColor')?.bottom ? `border-bottom-color: ${getAttr('mobile_borderColor').bottom} !important;` : ''}
            ${getAttr('mobile_borderColor')?.left ? `border-left-color: ${getAttr('mobile_borderColor').left} !important;` : ''}
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
                ${getResponsiveAttr('font_size', 'hover') ? `font-size: ${getResponsiveAttr('font_size', 'hover')} !important;` : ''}
                ${getResponsiveAttr('line_height', 'hover') ? `line-height: ${getResponsiveAttr('line_height', 'hover')} !important;` : ''}
                ${getResponsiveAttr('letter_spacing', 'hover') ? `letter-spacing: ${getResponsiveAttr('letter_spacing', 'hover')} !important;` : ''}
                ${getResponsiveAttr('width', 'hover') ? `width: ${getResponsiveAttr('width', 'hover')} !important;` : ''}
                ${getResponsiveAttr('height', 'hover') ? `height: ${getResponsiveAttr('height', 'hover')} !important;` : ''}
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
                ${getComplexResponsiveAttr('borderWidth', 'hover')?.top ? `border-top-width: ${getComplexResponsiveAttr('borderWidth', 'hover').top} !important;` : ''}
                ${getComplexResponsiveAttr('borderWidth', 'hover')?.right ? `border-right-width: ${getComplexResponsiveAttr('borderWidth', 'hover').right} !important;` : ''}
                ${getComplexResponsiveAttr('borderWidth', 'hover')?.bottom ? `border-bottom-width: ${getComplexResponsiveAttr('borderWidth', 'hover').bottom} !important;` : ''}
                ${getComplexResponsiveAttr('borderWidth', 'hover')?.left ? `border-left-width: ${getComplexResponsiveAttr('borderWidth', 'hover').left} !important;` : ''}
                ${getAttr('hover_borderStyle')?.top ? `border-top-style: ${getAttr('hover_borderStyle').top} !important;` : ''}
                ${getAttr('hover_borderStyle')?.right ? `border-right-style: ${getAttr('hover_borderStyle').right} !important;` : ''}
                ${getAttr('hover_borderStyle')?.bottom ? `border-bottom-style: ${getAttr('hover_borderStyle').bottom} !important;` : ''}
                ${getAttr('hover_borderStyle')?.left ? `border-left-style: ${getAttr('hover_borderStyle').left} !important;` : ''}
                ${getAttr('hover_borderColor')?.top ? `border-top-color: ${getAttr('hover_borderColor').top} !important;` : ''}
                ${getAttr('hover_borderColor')?.right ? `border-right-color: ${getAttr('hover_borderColor').right} !important;` : ''}
                ${getAttr('hover_borderColor')?.bottom ? `border-bottom-color: ${getAttr('hover_borderColor').bottom} !important;` : ''}
                ${getAttr('hover_borderColor')?.left ? `border-left-color: ${getAttr('hover_borderColor').left} !important;` : ''}
                ${getAttr('color_hover') ? `color: ${getAttr('color_hover')} !important;` : ''}
                ${getAttr('background_color_hover') ? (getAttr('background_color_hover').includes('gradient') ? `background: ${getAttr('background_color_hover')} !important;` : `background-color: ${getAttr('background_color_hover')} !important;`) : ''}
                ${getAttr('background_image_hover') ? `background-image: ${getAttr('background_image_hover').startsWith('url(') ? getAttr('background_image_hover') : `url(${getAttr('background_image_hover')})`} !important;` : ''}
                ${getAttr('background_size_hover') ? `background-size: ${getAttr('background_size_hover')} !important;` : ''}
                ${getAttr('background_position_hover') ? `background-position: ${getAttr('background_position_hover')} !important;` : ''}
                ${getAttr('background_repeat_hover') ? `background-repeat: ${getAttr('background_repeat_hover')} !important;` : ''}
                ${getComplexResponsiveAttr('padding', 'hover')?.top ? `padding-top: ${getComplexResponsiveAttr('padding', 'hover').top} !important;` : ''}
                ${getComplexResponsiveAttr('padding', 'hover')?.right ? `padding-right: ${getComplexResponsiveAttr('padding', 'hover').right} !important;` : ''}
                ${getComplexResponsiveAttr('padding', 'hover')?.bottom ? `padding-bottom: ${getComplexResponsiveAttr('padding', 'hover').bottom} !important;` : ''}
                ${getComplexResponsiveAttr('padding', 'hover')?.left ? `padding-left: ${getComplexResponsiveAttr('padding', 'hover').left} !important;` : ''}
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

        // Add custom CSS support
        const customCSS = (() => {
            const customCss = getAttr('custom_css');
            if (!customCss) return '';
            
            // Replace this_block with the actual block selector
            let processedCSS = customCss.replace(/this_block/g, `${blockSelector}, ${fallbackSelector}`);
            
            // Add !important to CSS declarations for better editor specificity
            processedCSS = processedCSS.replace(/([^!])(;|\s*})/g, '$1 !important$2');
            processedCSS = processedCSS.replace(/ !important !important/g, ' !important');
            
            return processedCSS;
        })();

        const finalCSS = `<style>${desktopCSS}${tabletCSS}${mobileCSS}${hoverCSS}${customCSS}</style>`;
        return finalCSS;
    };

    // Export for use in other modules
    window.ModernResponsiveCSS = {
        generateModernResponsiveCSS
    };
    
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);