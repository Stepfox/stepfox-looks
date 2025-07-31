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
                ${getResponsiveAttr('width', 'desktop') ? `flex-basis: ${getResponsiveAttr('width', 'desktop')} !important;` : ''}
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
                    ${getResponsiveAttr('font_size', 'tablet') ? `font-size: ${getResponsiveAttr('font_size', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('line_height', 'tablet') ? `line-height: ${getResponsiveAttr('line_height', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('letter_spacing', 'tablet') ? `letter-spacing: ${getResponsiveAttr('letter_spacing', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('word_spacing', 'tablet') ? `word-spacing: ${getResponsiveAttr('word_spacing', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('font_weight', 'tablet') ? `font-weight: ${getResponsiveAttr('font_weight', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('font_style', 'tablet') ? `font-style: ${getResponsiveAttr('font_style', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('text_transform', 'tablet') ? `text-transform: ${getResponsiveAttr('text_transform', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('text_decoration', 'tablet') ? `text-decoration: ${getResponsiveAttr('text_decoration', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('text_shadow', 'tablet') ? `text-shadow: ${getResponsiveAttr('text_shadow', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('textAlign', 'tablet') ? `text-align: ${getResponsiveAttr('textAlign', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('width', 'tablet') ? `width: ${getResponsiveAttr('width', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('width', 'tablet') ? `flex-basis: ${getResponsiveAttr('width', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('height', 'tablet') ? `height: ${getResponsiveAttr('height', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('min_width', 'tablet') ? `min-width: ${getResponsiveAttr('min_width', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('max_width', 'tablet') ? `max-width: ${getResponsiveAttr('max_width', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('min_height', 'tablet') ? `min-height: ${getResponsiveAttr('min_height', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('max_height', 'tablet') ? `max-height: ${getResponsiveAttr('max_height', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('box_sizing', 'tablet') ? `box-sizing: ${getResponsiveAttr('box_sizing', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('position', 'tablet') ? `position: ${getResponsiveAttr('position', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('top', 'tablet') ? `top: ${getResponsiveAttr('top', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('right', 'tablet') ? `right: ${getResponsiveAttr('right', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('bottom', 'tablet') ? `bottom: ${getResponsiveAttr('bottom', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('left', 'tablet') ? `left: ${getResponsiveAttr('left', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('display', 'tablet') ? `display: ${getResponsiveAttr('display', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('visibility', 'tablet') ? `visibility: ${getResponsiveAttr('visibility', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('float', 'tablet') ? `float: ${getResponsiveAttr('float', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('clear', 'tablet') ? `clear: ${getResponsiveAttr('clear', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('order', 'tablet') ? `order: ${getResponsiveAttr('order', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('z_index', 'tablet') ? `z-index: ${getResponsiveAttr('z_index', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('overflow', 'tablet') ? `overflow: ${getResponsiveAttr('overflow', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('zoom', 'tablet') ? `zoom: ${getResponsiveAttr('zoom', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('animation', 'tablet') ? `animation-name: ${getResponsiveAttr('animation', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('animation_duration', 'tablet') ? `animation-duration: ${getResponsiveAttr('animation_duration', 'tablet') || '1'}s !important;` : ''}
                    ${getResponsiveAttr('animation_delay', 'tablet') ? `animation-delay: ${getResponsiveAttr('animation_delay', 'tablet') || '0'}s !important;` : ''}
                    ${getResponsiveAttr('animation', 'tablet') ? `animation-fill-mode: both !important;` : ''}
                    ${getResponsiveAttr('flex_direction', 'tablet') ? `flex-direction: ${getResponsiveAttr('flex_direction', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('justify', 'tablet') ? `justify-content: ${getResponsiveAttr('justify', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('flexWrap', 'tablet') ? `flex-wrap: ${getResponsiveAttr('flexWrap', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('flex_grow', 'tablet') ? `flex-grow: ${getResponsiveAttr('flex_grow', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('flex_shrink', 'tablet') ? `flex-shrink: ${getResponsiveAttr('flex_shrink', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('align_items', 'tablet') ? `align-items: ${getResponsiveAttr('align_items', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('align_self', 'tablet') ? `align-self: ${getResponsiveAttr('align_self', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('align_content', 'tablet') ? `align-content: ${getResponsiveAttr('align_content', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('grid_template_columns', 'tablet') ? `grid-template-columns: repeat(${getResponsiveAttr('grid_template_columns', 'tablet')}, 1fr) !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'tablet')?.top ? `border-top-width: ${getResponsiveAttr('borderWidth', 'tablet').top} !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'tablet')?.right ? `border-right-width: ${getResponsiveAttr('borderWidth', 'tablet').right} !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'tablet')?.bottom ? `border-bottom-width: ${getResponsiveAttr('borderWidth', 'tablet').bottom} !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'tablet')?.left ? `border-left-width: ${getResponsiveAttr('borderWidth', 'tablet').left} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'tablet')?.top ? `border-top-style: ${getResponsiveAttr('borderStyle', 'tablet').top} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'tablet')?.right ? `border-right-style: ${getResponsiveAttr('borderStyle', 'tablet').right} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'tablet')?.bottom ? `border-bottom-style: ${getResponsiveAttr('borderStyle', 'tablet').bottom} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'tablet')?.left ? `border-left-style: ${getResponsiveAttr('borderStyle', 'tablet').left} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'tablet')?.top ? `border-top-color: ${getResponsiveAttr('borderColor', 'tablet').top} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'tablet')?.right ? `border-right-color: ${getResponsiveAttr('borderColor', 'tablet').right} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'tablet')?.bottom ? `border-bottom-color: ${getResponsiveAttr('borderColor', 'tablet').bottom} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'tablet')?.left ? `border-left-color: ${getResponsiveAttr('borderColor', 'tablet').left} !important;` : ''}
                    ${getResponsiveAttr('box_shadow', 'tablet') ? `box-shadow: ${getResponsiveAttr('box_shadow', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('filter', 'tablet') ? `filter: ${getResponsiveAttr('filter', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('opacity', 'tablet') ? `opacity: ${getResponsiveAttr('opacity', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('transform', 'tablet') ? `transform: ${getResponsiveAttr('transform', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('transition', 'tablet') ? `transition: ${getResponsiveAttr('transition', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('cursor', 'tablet') ? `cursor: ${getResponsiveAttr('cursor', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('user_select', 'tablet') ? `user-select: ${getResponsiveAttr('user_select', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('pointer_events', 'tablet') ? `pointer-events: ${getResponsiveAttr('pointer_events', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('color', 'tablet') ? `color: ${getResponsiveAttr('color', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('background_color', 'tablet') ? (getResponsiveAttr('background_color', 'tablet').includes('gradient') ? `background: ${getResponsiveAttr('background_color', 'tablet')} !important;` : `background-color: ${getResponsiveAttr('background_color', 'tablet')} !important;`) : ''}
                    ${getResponsiveAttr('background_image', 'tablet') ? `background-image: ${getResponsiveAttr('background_image', 'tablet').startsWith('url(') ? getResponsiveAttr('background_image', 'tablet') : `url(${getResponsiveAttr('background_image', 'tablet')})`} !important;` : ''}
                    ${getResponsiveAttr('background_size', 'tablet') ? `background-size: ${getResponsiveAttr('background_size', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('background_position', 'tablet') ? `background-position: ${getResponsiveAttr('background_position', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('background_repeat', 'tablet') ? `background-repeat: ${getResponsiveAttr('background_repeat', 'tablet')} !important;` : ''}
                    ${getResponsiveAttr('padding', 'tablet')?.top ? `padding-top: ${getResponsiveAttr('padding', 'tablet').top} !important;` : ''}
                    ${getResponsiveAttr('padding', 'tablet')?.right ? `padding-right: ${getResponsiveAttr('padding', 'tablet').right} !important;` : ''}
                    ${getResponsiveAttr('padding', 'tablet')?.bottom ? `padding-bottom: ${getResponsiveAttr('padding', 'tablet').bottom} !important;` : ''}
                    ${getResponsiveAttr('padding', 'tablet')?.left ? `padding-left: ${getResponsiveAttr('padding', 'tablet').left} !important;` : ''}
                    ${getResponsiveAttr('margin', 'tablet')?.top ? `margin-top: ${getResponsiveAttr('margin', 'tablet').top} !important;` : ''}
                    ${getResponsiveAttr('margin', 'tablet')?.right ? `margin-right: ${getResponsiveAttr('margin', 'tablet').right} !important;` : ''}
                    ${getResponsiveAttr('margin', 'tablet')?.bottom ? `margin-bottom: ${getResponsiveAttr('margin', 'tablet').bottom} !important;` : ''}
                    ${getResponsiveAttr('margin', 'tablet')?.left ? `margin-left: ${getResponsiveAttr('margin', 'tablet').left} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'tablet')?.topLeft ? `border-top-left-radius: ${getResponsiveAttr('borderRadius', 'tablet').topLeft} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'tablet')?.topRight ? `border-top-right-radius: ${getResponsiveAttr('borderRadius', 'tablet').topRight} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'tablet')?.bottomLeft ? `border-bottom-left-radius: ${getResponsiveAttr('borderRadius', 'tablet').bottomLeft} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'tablet')?.bottomRight ? `border-bottom-right-radius: ${getResponsiveAttr('borderRadius', 'tablet').bottomRight} !important;` : ''}
                }
            }
        `;

        const mobileCSS = `
            @media (max-width: 768px) {
                ${blockSelector}, ${fallbackSelector} {
                    ${getResponsiveAttr('font_size', 'mobile') ? `font-size: ${getResponsiveAttr('font_size', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('line_height', 'mobile') ? `line-height: ${getResponsiveAttr('line_height', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('letter_spacing', 'mobile') ? `letter-spacing: ${getResponsiveAttr('letter_spacing', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('word_spacing', 'mobile') ? `word-spacing: ${getResponsiveAttr('word_spacing', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('font_weight', 'mobile') ? `font-weight: ${getResponsiveAttr('font_weight', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('font_style', 'mobile') ? `font-style: ${getResponsiveAttr('font_style', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('text_transform', 'mobile') ? `text-transform: ${getResponsiveAttr('text_transform', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('text_decoration', 'mobile') ? `text-decoration: ${getResponsiveAttr('text_decoration', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('text_shadow', 'mobile') ? `text-shadow: ${getResponsiveAttr('text_shadow', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('textAlign', 'mobile') ? `text-align: ${getResponsiveAttr('textAlign', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('width', 'mobile') ? `width: ${getResponsiveAttr('width', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('width', 'mobile') ? `flex-basis: ${getResponsiveAttr('width', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('height', 'mobile') ? `height: ${getResponsiveAttr('height', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('min_width', 'mobile') ? `min-width: ${getResponsiveAttr('min_width', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('max_width', 'mobile') ? `max-width: ${getResponsiveAttr('max_width', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('min_height', 'mobile') ? `min-height: ${getResponsiveAttr('min_height', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('max_height', 'mobile') ? `max-height: ${getResponsiveAttr('max_height', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('box_sizing', 'mobile') ? `box-sizing: ${getResponsiveAttr('box_sizing', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('position', 'mobile') ? `position: ${getResponsiveAttr('position', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('top', 'mobile') ? `top: ${getResponsiveAttr('top', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('right', 'mobile') ? `right: ${getResponsiveAttr('right', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('bottom', 'mobile') ? `bottom: ${getResponsiveAttr('bottom', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('left', 'mobile') ? `left: ${getResponsiveAttr('left', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('display', 'mobile') ? `display: ${getResponsiveAttr('display', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('visibility', 'mobile') ? `visibility: ${getResponsiveAttr('visibility', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('float', 'mobile') ? `float: ${getResponsiveAttr('float', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('clear', 'mobile') ? `clear: ${getResponsiveAttr('clear', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('order', 'mobile') ? `order: ${getResponsiveAttr('order', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('z_index', 'mobile') ? `z-index: ${getResponsiveAttr('z_index', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('overflow', 'mobile') ? `overflow: ${getResponsiveAttr('overflow', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('zoom', 'mobile') ? `zoom: ${getResponsiveAttr('zoom', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('animation', 'mobile') ? `animation-name: ${getResponsiveAttr('animation', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('animation_duration', 'mobile') ? `animation-duration: ${getResponsiveAttr('animation_duration', 'mobile') || '1'}s !important;` : ''}
                    ${getResponsiveAttr('animation_delay', 'mobile') ? `animation-delay: ${getResponsiveAttr('animation_delay', 'mobile') || '0'}s !important;` : ''}
                    ${getResponsiveAttr('animation', 'mobile') ? `animation-fill-mode: both !important;` : ''}
                    ${getResponsiveAttr('flex_direction', 'mobile') ? `flex-direction: ${getResponsiveAttr('flex_direction', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('justify', 'mobile') ? `justify-content: ${getResponsiveAttr('justify', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('flexWrap', 'mobile') ? `flex-wrap: ${getResponsiveAttr('flexWrap', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('flex_grow', 'mobile') ? `flex-grow: ${getResponsiveAttr('flex_grow', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('flex_shrink', 'mobile') ? `flex-shrink: ${getResponsiveAttr('flex_shrink', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('align_items', 'mobile') ? `align-items: ${getResponsiveAttr('align_items', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('align_self', 'mobile') ? `align-self: ${getResponsiveAttr('align_self', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('align_content', 'mobile') ? `align-content: ${getResponsiveAttr('align_content', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('grid_template_columns', 'mobile') ? `grid-template-columns: repeat(${getResponsiveAttr('grid_template_columns', 'mobile')}, 1fr) !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'mobile')?.top ? `border-top-width: ${getResponsiveAttr('borderWidth', 'mobile').top} !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'mobile')?.right ? `border-right-width: ${getResponsiveAttr('borderWidth', 'mobile').right} !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'mobile')?.bottom ? `border-bottom-width: ${getResponsiveAttr('borderWidth', 'mobile').bottom} !important;` : ''}
                    ${getResponsiveAttr('borderWidth', 'mobile')?.left ? `border-left-width: ${getResponsiveAttr('borderWidth', 'mobile').left} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'mobile')?.top ? `border-top-style: ${getResponsiveAttr('borderStyle', 'mobile').top} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'mobile')?.right ? `border-right-style: ${getResponsiveAttr('borderStyle', 'mobile').right} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'mobile')?.bottom ? `border-bottom-style: ${getResponsiveAttr('borderStyle', 'mobile').bottom} !important;` : ''}
                    ${getResponsiveAttr('borderStyle', 'mobile')?.left ? `border-left-style: ${getResponsiveAttr('borderStyle', 'mobile').left} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'mobile')?.top ? `border-top-color: ${getResponsiveAttr('borderColor', 'mobile').top} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'mobile')?.right ? `border-right-color: ${getResponsiveAttr('borderColor', 'mobile').right} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'mobile')?.bottom ? `border-bottom-color: ${getResponsiveAttr('borderColor', 'mobile').bottom} !important;` : ''}
                    ${getResponsiveAttr('borderColor', 'mobile')?.left ? `border-left-color: ${getResponsiveAttr('borderColor', 'mobile').left} !important;` : ''}
                    ${getResponsiveAttr('box_shadow', 'mobile') ? `box-shadow: ${getResponsiveAttr('box_shadow', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('filter', 'mobile') ? `filter: ${getResponsiveAttr('filter', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('opacity', 'mobile') ? `opacity: ${getResponsiveAttr('opacity', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('transform', 'mobile') ? `transform: ${getResponsiveAttr('transform', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('transition', 'mobile') ? `transition: ${getResponsiveAttr('transition', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('cursor', 'mobile') ? `cursor: ${getResponsiveAttr('cursor', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('user_select', 'mobile') ? `user-select: ${getResponsiveAttr('user_select', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('pointer_events', 'mobile') ? `pointer-events: ${getResponsiveAttr('pointer_events', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('color', 'mobile') ? `color: ${getResponsiveAttr('color', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('background_color', 'mobile') ? (getResponsiveAttr('background_color', 'mobile').includes('gradient') ? `background: ${getResponsiveAttr('background_color', 'mobile')} !important;` : `background-color: ${getResponsiveAttr('background_color', 'mobile')} !important;`) : ''}
                    ${getResponsiveAttr('background_image', 'mobile') ? `background-image: ${getResponsiveAttr('background_image', 'mobile').startsWith('url(') ? getResponsiveAttr('background_image', 'mobile') : `url(${getResponsiveAttr('background_image', 'mobile')})`} !important;` : ''}
                    ${getResponsiveAttr('background_size', 'mobile') ? `background-size: ${getResponsiveAttr('background_size', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('background_position', 'mobile') ? `background-position: ${getResponsiveAttr('background_position', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('background_repeat', 'mobile') ? `background-repeat: ${getResponsiveAttr('background_repeat', 'mobile')} !important;` : ''}
                    ${getResponsiveAttr('padding', 'mobile')?.top ? `padding-top: ${getResponsiveAttr('padding', 'mobile').top} !important;` : ''}
                    ${getResponsiveAttr('padding', 'mobile')?.right ? `padding-right: ${getResponsiveAttr('padding', 'mobile').right} !important;` : ''}
                    ${getResponsiveAttr('padding', 'mobile')?.bottom ? `padding-bottom: ${getResponsiveAttr('padding', 'mobile').bottom} !important;` : ''}
                    ${getResponsiveAttr('padding', 'mobile')?.left ? `padding-left: ${getResponsiveAttr('padding', 'mobile').left} !important;` : ''}
                    ${getResponsiveAttr('margin', 'mobile')?.top ? `margin-top: ${getResponsiveAttr('margin', 'mobile').top} !important;` : ''}
                    ${getResponsiveAttr('margin', 'mobile')?.right ? `margin-right: ${getResponsiveAttr('margin', 'mobile').right} !important;` : ''}
                    ${getResponsiveAttr('margin', 'mobile')?.bottom ? `margin-bottom: ${getResponsiveAttr('margin', 'mobile').bottom} !important;` : ''}
                    ${getResponsiveAttr('margin', 'mobile')?.left ? `margin-left: ${getResponsiveAttr('margin', 'mobile').left} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'mobile')?.topLeft ? `border-top-left-radius: ${getResponsiveAttr('borderRadius', 'mobile').topLeft} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'mobile')?.topRight ? `border-top-right-radius: ${getResponsiveAttr('borderRadius', 'mobile').topRight} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'mobile')?.bottomLeft ? `border-bottom-left-radius: ${getResponsiveAttr('borderRadius', 'mobile').bottomLeft} !important;` : ''}
                    ${getResponsiveAttr('borderRadius', 'mobile')?.bottomRight ? `border-bottom-right-radius: ${getResponsiveAttr('borderRadius', 'mobile').bottomRight} !important;` : ''}
                }
            }
        `;

        const hoverCSS = `
            ${blockSelector}:hover, ${fallbackSelector}:hover {
                ${getResponsiveAttr('font_size', 'hover') ? `font-size: ${getResponsiveAttr('font_size', 'hover')} !important;` : ''}
                ${getResponsiveAttr('line_height', 'hover') ? `line-height: ${getResponsiveAttr('line_height', 'hover')} !important;` : ''}
                ${getResponsiveAttr('letter_spacing', 'hover') ? `letter-spacing: ${getResponsiveAttr('letter_spacing', 'hover')} !important;` : ''}
                ${getResponsiveAttr('word_spacing', 'hover') ? `word-spacing: ${getResponsiveAttr('word_spacing', 'hover')} !important;` : ''}
                ${getResponsiveAttr('font_weight', 'hover') ? `font-weight: ${getResponsiveAttr('font_weight', 'hover')} !important;` : ''}
                ${getResponsiveAttr('font_style', 'hover') ? `font-style: ${getResponsiveAttr('font_style', 'hover')} !important;` : ''}
                ${getResponsiveAttr('text_transform', 'hover') ? `text-transform: ${getResponsiveAttr('text_transform', 'hover')} !important;` : ''}
                ${getResponsiveAttr('text_decoration', 'hover') ? `text-decoration: ${getResponsiveAttr('text_decoration', 'hover')} !important;` : ''}
                ${getResponsiveAttr('text_shadow', 'hover') ? `text-shadow: ${getResponsiveAttr('text_shadow', 'hover')} !important;` : ''}
                ${getResponsiveAttr('textAlign', 'hover') ? `text-align: ${getResponsiveAttr('textAlign', 'hover')} !important;` : ''}
                ${getResponsiveAttr('width', 'hover') ? `width: ${getResponsiveAttr('width', 'hover')} !important;` : ''}
                ${getResponsiveAttr('width', 'hover') ? `flex-basis: ${getResponsiveAttr('width', 'hover')} !important;` : ''}
                ${getResponsiveAttr('height', 'hover') ? `height: ${getResponsiveAttr('height', 'hover')} !important;` : ''}
                ${getResponsiveAttr('min_width', 'hover') ? `min-width: ${getResponsiveAttr('min_width', 'hover')} !important;` : ''}
                ${getResponsiveAttr('max_width', 'hover') ? `max-width: ${getResponsiveAttr('max_width', 'hover')} !important;` : ''}
                ${getResponsiveAttr('min_height', 'hover') ? `min-height: ${getResponsiveAttr('min_height', 'hover')} !important;` : ''}
                ${getResponsiveAttr('max_height', 'hover') ? `max-height: ${getResponsiveAttr('max_height', 'hover')} !important;` : ''}
                ${getResponsiveAttr('box_sizing', 'hover') ? `box-sizing: ${getResponsiveAttr('box_sizing', 'hover')} !important;` : ''}
                ${getResponsiveAttr('position', 'hover') ? `position: ${getResponsiveAttr('position', 'hover')} !important;` : ''}
                ${getResponsiveAttr('top', 'hover') ? `top: ${getResponsiveAttr('top', 'hover')} !important;` : ''}
                ${getResponsiveAttr('right', 'hover') ? `right: ${getResponsiveAttr('right', 'hover')} !important;` : ''}
                ${getResponsiveAttr('bottom', 'hover') ? `bottom: ${getResponsiveAttr('bottom', 'hover')} !important;` : ''}
                ${getResponsiveAttr('left', 'hover') ? `left: ${getResponsiveAttr('left', 'hover')} !important;` : ''}
                ${getResponsiveAttr('display', 'hover') ? `display: ${getResponsiveAttr('display', 'hover')} !important;` : ''}
                ${getResponsiveAttr('visibility', 'hover') ? `visibility: ${getResponsiveAttr('visibility', 'hover')} !important;` : ''}
                ${getResponsiveAttr('float', 'hover') ? `float: ${getResponsiveAttr('float', 'hover')} !important;` : ''}
                ${getResponsiveAttr('clear', 'hover') ? `clear: ${getResponsiveAttr('clear', 'hover')} !important;` : ''}
                ${getResponsiveAttr('order', 'hover') ? `order: ${getResponsiveAttr('order', 'hover')} !important;` : ''}
                ${getResponsiveAttr('z_index', 'hover') ? `z-index: ${getResponsiveAttr('z_index', 'hover')} !important;` : ''}
                ${getResponsiveAttr('overflow', 'hover') ? `overflow: ${getResponsiveAttr('overflow', 'hover')} !important;` : ''}
                ${getResponsiveAttr('zoom', 'hover') ? `zoom: ${getResponsiveAttr('zoom', 'hover')} !important;` : ''}
                ${getResponsiveAttr('animation', 'hover')? `animation-name: ${getResponsiveAttr('animation', 'hover')} !important;` : ''}
                ${getResponsiveAttr('animation_duration', 'hover') ? `animation-duration: ${getResponsiveAttr('animation_duration', 'hover') || '1'}s !important;` : ''}
                ${getResponsiveAttr('animation_delay', 'hover') ? `animation-delay: ${getResponsiveAttr('animation_delay', 'hover') || '0'}s !important;` : ''}
                ${getResponsiveAttr('animation', 'hover') ? `animation-fill-mode: both !important;` : ''}
                ${getResponsiveAttr('flex_direction', 'hover') ? `flex-direction: ${getResponsiveAttr('flex_direction', 'hover')} !important;` : ''}
                ${getResponsiveAttr('justify', 'hover') ? `justify-content: ${getResponsiveAttr('justify', 'hover')} !important;` : ''}
                ${getResponsiveAttr('flexWrap', 'hover') ? `flex-wrap: ${getResponsiveAttr('flexWrap', 'hover')} !important;` : ''}
                ${getResponsiveAttr('flex_grow', 'hover') ? `flex-grow: ${getResponsiveAttr('flex_grow', 'hover')} !important;` : ''}
                ${getResponsiveAttr('flex_shrink', 'hover') ? `flex-shrink: ${getResponsiveAttr('flex_shrink', 'hover')} !important;` : ''}
                ${getResponsiveAttr('align_items', 'hover') ? `align-items: ${getResponsiveAttr('align_items', 'hover')} !important;` : ''}
                ${getResponsiveAttr('align_self', 'hover') ? `align-self: ${getResponsiveAttr('align_self', 'hover')} !important;` : ''}
                ${getResponsiveAttr('align_content', 'hover') ? `align-content: ${getResponsiveAttr('align_content', 'hover')} !important;` : ''}
                ${getResponsiveAttr('grid_template_columns', 'hover') ? `grid-template-columns: repeat(${getResponsiveAttr('grid_template_columns', 'hover')}, 1fr) !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'hover')?.top ? `border-top-width: ${getResponsiveAttr('borderWidth', 'hover').top} !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'hover')?.right ? `border-right-width: ${getResponsiveAttr('borderWidth', 'hover').right} !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'hover')?.bottom ? `border-bottom-width: ${getResponsiveAttr('borderWidth', 'hover').bottom} !important;` : ''}
                ${getResponsiveAttr('borderWidth', 'hover')?.left ? `border-left-width: ${getResponsiveAttr('borderWidth', 'hover').left} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'hover')?.top ? `border-top-style: ${getResponsiveAttr('borderStyle', 'hover').top} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'hover')?.right ? `border-right-style: ${getResponsiveAttr('borderStyle', 'hover').right} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'hover')?.bottom ? `border-bottom-style: ${getResponsiveAttr('borderStyle', 'hover').bottom} !important;` : ''}
                ${getResponsiveAttr('borderStyle', 'hover')?.left ? `border-left-style: ${getResponsiveAttr('borderStyle', 'hover').left} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'hover')?.top ? `border-top-color: ${getResponsiveAttr('borderColor', 'hover').top} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'hover')?.right ? `border-right-color: ${getResponsiveAttr('borderColor', 'hover').right} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'hover')?.bottom ? `border-bottom-color: ${getResponsiveAttr('borderColor', 'hover').bottom} !important;` : ''}
                ${getResponsiveAttr('borderColor', 'hover')?.left ? `border-left-color: ${getResponsiveAttr('borderColor', 'hover').left} !important;` : ''}
                ${getResponsiveAttr('box_shadow', 'hover') ? `box-shadow: ${getResponsiveAttr('box_shadow', 'hover')} !important;` : ''}
                ${getResponsiveAttr('filter', 'hover') ? `filter: ${getResponsiveAttr('filter', 'hover')} !important;` : ''}
                ${getResponsiveAttr('opacity', 'hover') ? `opacity: ${getResponsiveAttr('opacity', 'hover')} !important;` : ''}
                ${getResponsiveAttr('transform', 'hover') ? `transform: ${getResponsiveAttr('transform', 'hover')} !important;` : ''}
                ${getResponsiveAttr('transition', 'hover') ? `transition: ${getResponsiveAttr('transition', 'hover')} !important;` : ''}
                ${getResponsiveAttr('cursor', 'hover') ? `cursor: ${getResponsiveAttr('cursor', 'hover')} !important;` : ''}
                ${getResponsiveAttr('user_select', 'hover') ? `user-select: ${getResponsiveAttr('user_select', 'hover')} !important;` : ''}
                ${getResponsiveAttr('pointer_events', 'hover') ? `pointer-events: ${getResponsiveAttr('pointer_events', 'hover')} !important;` : ''}
                ${getResponsiveAttr('color', 'hover') ? `color: ${getResponsiveAttr('color', 'hover')} !important;` : ''}
                ${getResponsiveAttr('background_color', 'hover') ? (getResponsiveAttr('background_color', 'hover').includes('gradient') ? `background: ${getResponsiveAttr('background_color', 'hover')} !important;` : `background-color: ${getResponsiveAttr('background_color', 'hover')} !important;`) : ''}
                ${getResponsiveAttr('background_image', 'hover') ? `background-image: ${getResponsiveAttr('background_image', 'hover').startsWith('url(') ? getResponsiveAttr('background_image', 'hover') : `url(${getResponsiveAttr('background_image', 'hover')})`} !important;` : ''}
                ${getResponsiveAttr('background_size', 'hover') ? `background-size: ${getResponsiveAttr('background_size', 'hover')} !important;` : ''}
                ${getResponsiveAttr('background_position', 'hover') ? `background-position: ${getResponsiveAttr('background_position', 'hover')} !important;` : ''}
                ${getResponsiveAttr('background_repeat', 'hover') ? `background-repeat: ${getResponsiveAttr('background_repeat', 'hover')} !important;` : ''}
                ${getResponsiveAttr('padding', 'hover')?.top ? `padding-top: ${getResponsiveAttr('padding', 'hover').top} !important;` : ''}
                ${getResponsiveAttr('padding', 'hover')?.right ? `padding-right: ${getResponsiveAttr('padding', 'hover').right} !important;` : ''}
                ${getResponsiveAttr('padding', 'hover')?.bottom ? `padding-bottom: ${getResponsiveAttr('padding', 'hover').bottom} !important;` : ''}
                ${getResponsiveAttr('padding', 'hover')?.left ? `padding-left: ${getResponsiveAttr('padding', 'hover').left} !important;` : ''}
                ${getResponsiveAttr('margin', 'hover')?.top ? `margin-top: ${getResponsiveAttr('margin', 'hover').top} !important;` : ''}
                ${getResponsiveAttr('margin', 'hover')?.right ? `margin-right: ${getResponsiveAttr('margin', 'hover').right} !important;` : ''}
                ${getResponsiveAttr('margin', 'hover')?.bottom ? `margin-bottom: ${getResponsiveAttr('margin', 'hover').bottom} !important;` : ''}
                ${getResponsiveAttr('margin', 'hover')?.left ? `margin-left: ${getResponsiveAttr('margin', 'hover').left} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'hover')?.topLeft ? `border-top-left-radius: ${getResponsiveAttr('borderRadius', 'hover').topLeft} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'hover')?.topRight ? `border-top-right-radius: ${getResponsiveAttr('borderRadius', 'hover').topRight} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'hover')?.bottomLeft ? `border-bottom-left-radius: ${getResponsiveAttr('borderRadius', 'hover').bottomLeft} !important;` : ''}
                ${getResponsiveAttr('borderRadius', 'hover')?.bottomRight ? `border-bottom-right-radius: ${getResponsiveAttr('borderRadius', 'hover').bottomRight} !important;` : ''}
            }
        `;

        // Add custom CSS support
        const customCSS = (() => {
            const customCss = getAttr('custom_css');
            if (!customCss) return '';
            
            // Replace this_block with the actual block selector
            return customCss.replace(/this_block/g, `${blockSelector}, ${fallbackSelector}`);
        })();

        const finalCSS = `<style>${desktopCSS}${tabletCSS}${mobileCSS}${hoverCSS}${customCSS}</style>`;
        return finalCSS;
    };

    // Export for use in other modules
    window.ModernResponsiveCSS = {
        generateModernResponsiveCSS
    };
    
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.jQuery);