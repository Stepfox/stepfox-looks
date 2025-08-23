/**
 * Modern Responsive Sync
 * Centralizes mapping between core style/layout and responsiveStyles
 */

(function() {
	if (!window.wp || !window.wp.element) return;

	// Utilities shared by main and utils
	const resolvePresetVar = (value) => {
		if (!value || typeof value !== 'string') return value;
		if (value.startsWith('var(--wp--preset--')) return value;
		const match = value.match(/^var:preset\|([^|]+)\|([^|]+)$/);
		if (match) return `var(--wp--preset--${match[1]}--${match[2]})`;
		return value;
	};

	const isGradientValue = (value) => {
		if (!value) return false;
		const v = typeof value === 'string' ? value : '';
		return v.includes('gradient(') || /^var:preset\|gradient\|/.test(v) || /^var\(--wp--preset--gradient--/.test(v);
	};

	const normalizeBgImage = (value) => {
		if (!value) return '';
		if (typeof value === 'object') return value.url ? `url(${value.url})` : '';
		if (typeof value === 'string') return value.startsWith('url(') ? value : `url(${value})`;
		return '';
	};

	const normalizeBgPosition = (value) => {
		if (!value) return '';
		if (typeof value === 'object') {
			const x = value.x || value.left || value.horizontal || '0%';
			const y = value.y || value.top || value.vertical || '0%';
			return `${x} ${y}`;
		}
		return value;
	};

	// Map style object -> responsive patch (desktop)
	const mapStyleToResponsivePatch = (style) => {
		if (!style || typeof style !== 'object') return {};
		const patch = {};
		const ensure = (obj, key) => (obj[key] = obj[key] || { desktop: '', tablet: '', mobile: '', hover: '' });
		const ensureObj = (obj, key) => (obj[key] = obj[key] || { desktop: { top: '', right: '', bottom: '', left: '' }, tablet: { top: '', right: '', bottom: '', left: '' }, mobile: { top: '', right: '', bottom: '', left: '' }, hover: { top: '', right: '', bottom: '', left: '' } });
		const ensureRadius = (obj, key) => (obj[key] = obj[key] || { desktop: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' }, tablet: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' }, mobile: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' }, hover: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' } });

		if (style.typography) {
			if (style.typography.fontSize !== undefined) { ensure(patch, 'font_size'); patch.font_size.desktop = style.typography.fontSize || ''; }
			if (style.typography.lineHeight !== undefined) { ensure(patch, 'line_height'); patch.line_height.desktop = style.typography.lineHeight || ''; }
			if (style.typography.letterSpacing !== undefined) { ensure(patch, 'letter_spacing'); patch.letter_spacing.desktop = style.typography.letterSpacing || ''; }
			if (style.typography.fontWeight !== undefined) { ensure(patch, 'font_weight'); patch.font_weight.desktop = style.typography.fontWeight || ''; }
			if (style.typography.fontStyle !== undefined) { ensure(patch, 'font_style'); patch.font_style.desktop = style.typography.fontStyle || ''; }
			if (style.typography.textTransform !== undefined) { ensure(patch, 'text_transform'); patch.text_transform.desktop = style.typography.textTransform || ''; }
			if (style.typography.textDecoration !== undefined) { ensure(patch, 'text_decoration'); patch.text_decoration.desktop = style.typography.textDecoration || ''; }
		}

		if (style.color) {
			if (style.color.text !== undefined) { ensure(patch, 'color'); patch.color.desktop = resolvePresetVar(style.color.text) || ''; }
			if (style.color.link !== undefined) { ensure(patch, 'link_color'); patch.link_color = patch.link_color || { desktop: '', tablet: '', mobile: '', hover: '' }; patch.link_color.desktop = resolvePresetVar(style.color.link) || ''; }
			if (style.color.background !== undefined || style.color.gradient !== undefined) { ensure(patch, 'background_color'); patch.background_color.desktop = resolvePresetVar(style.color.background || style.color.gradient) || ''; }
		}

		if (style.background) {
			if (style.background.backgroundImage !== undefined) { ensure(patch, 'background_image'); patch.background_image.desktop = normalizeBgImage(style.background.backgroundImage) || ''; }
			if (style.background.backgroundSize !== undefined) { ensure(patch, 'background_size'); patch.background_size.desktop = style.background.backgroundSize || ''; }
			if (style.background.backgroundPosition !== undefined) { ensure(patch, 'background_position'); patch.background_position.desktop = normalizeBgPosition(style.background.backgroundPosition) || ''; }
			if (style.background.backgroundRepeat !== undefined) { ensure(patch, 'background_repeat'); patch.background_repeat.desktop = style.background.backgroundRepeat || ''; }
		}

		if (style.spacing) {
			if (style.spacing.padding) { ensureObj(patch, 'padding'); patch.padding.desktop = { ...(patch.padding.desktop || {}), ...style.spacing.padding }; }
			if (style.spacing.margin) { ensureObj(patch, 'margin'); patch.margin.desktop = { ...(patch.margin.desktop || {}), ...style.spacing.margin }; }
			if (style.spacing.blockGap !== undefined) { ensure(patch, 'gap'); patch.gap = patch.gap || { desktop: '', tablet: '', mobile: '', hover: '' }; patch.gap.desktop = style.spacing.blockGap || ''; }
		}

		if (style.border) {
			if (style.border.radius !== undefined) {
				ensureRadius(patch, 'borderRadius');
				const r = style.border.radius;
				patch.borderRadius.desktop = (typeof r === 'object') ? {
					topLeft: r.topLeft || '', topRight: r.topRight || '', bottomLeft: r.bottomLeft || '', bottomRight: r.bottomRight || ''
				} : { topLeft: r || '', topRight: r || '', bottomLeft: r || '', bottomRight: r || '' };
			}
			const sides = ['top','right','bottom','left'];
			if (style.border.width !== undefined || (style.border.top && style.border.top.width !== undefined)) {
				ensureObj(patch, 'borderWidth');
				if (style.border.width !== undefined) {
					patch.borderWidth.desktop = { top: style.border.width || '', right: style.border.width || '', bottom: style.border.width || '', left: style.border.width || '' };
				}
				sides.forEach(s => { const side = style.border[s]; if (side && side.width !== undefined) patch.borderWidth.desktop[s] = side.width || ''; });
			}
			if (style.border.style !== undefined || (style.border.top && style.border.top.style !== undefined)) {
				ensureObj(patch, 'borderStyle');
				if (style.border.style !== undefined) {
					patch.borderStyle.desktop = { top: style.border.style || '', right: style.border.style || '', bottom: style.border.style || '', left: style.border.style || '' };
				}
				sides.forEach(s => { const side = style.border[s]; if (side && side.style !== undefined) patch.borderStyle.desktop[s] = side.style || ''; });
			}
			if (style.border.color !== undefined || (style.border.top && style.border.top.color !== undefined)) {
				ensureObj(patch, 'borderColor');
				if (style.border.color !== undefined) {
					const c = resolvePresetVar(style.border.color || '');
					patch.borderColor.desktop = { top: c, right: c, bottom: c, left: c };
				}
				sides.forEach(s => { const side = style.border[s]; if (side && side.color !== undefined) patch.borderColor.desktop[s] = resolvePresetVar(side.color) || ''; });
			}
		}

		if (style.dimensions) {
			if (style.dimensions.minHeight !== undefined) { ensure(patch, 'min_height'); patch.min_height.desktop = style.dimensions.minHeight || ''; }
			if (style.dimensions.aspectRatio !== undefined) { ensure(patch, 'aspect_ratio'); patch.aspect_ratio = patch.aspect_ratio || { desktop: '', tablet: '', mobile: '', hover: '' }; patch.aspect_ratio.desktop = style.dimensions.aspectRatio || ''; }
		}

		if (style.position) {
			if (style.position.sticky) { ensure(patch, 'position'); patch.position = patch.position || { desktop: '', tablet: '', mobile: '', hover: '' }; patch.position.desktop = 'sticky'; }
			if (style.position.top !== undefined) { ensure(patch, 'top'); patch.top = patch.top || { desktop: '', tablet: '', mobile: '', hover: '' }; patch.top.desktop = style.position.top || ''; }
		}

		return patch;
	};

	// Map Group block layout -> responsive patch
	const mapLayoutToResponsivePatch = (layout) => {
		if (!layout || typeof layout !== 'object') return {};
		const patch = {};
		const ensure = (obj, key) => (obj[key] = obj[key] || { desktop: '', tablet: '', mobile: '', hover: '' });
		const type = layout.type || '';
		if (type === 'flex') {
			ensure(patch, 'display'); patch.display.desktop = 'flex';
			const orientation = layout.orientation || 'horizontal';
			ensure(patch, 'flex_direction'); patch.flex_direction.desktop = orientation === 'vertical' ? 'column' : 'row';
			if (layout.flexWrap !== undefined) { ensure(patch, 'flexWrap'); patch.flexWrap.desktop = (layout.flexWrap === true || layout.flexWrap === 'wrap') ? 'wrap' : (layout.flexWrap === 'nowrap' ? 'nowrap' : 'wrap'); }
			if (layout.justifyContent !== undefined) { const m = { left: 'flex-start', right: 'flex-end', center: 'center', 'space-between': 'space-between', 'space-around': 'space-around', 'space-evenly': 'space-evenly', start: 'flex-start', end: 'flex-end' }; ensure(patch, 'justify'); patch.justify.desktop = m[layout.justifyContent] || layout.justifyContent || ''; }
			if (layout.alignItems !== undefined) { const m = { top: 'flex-start', bottom: 'flex-end', center: 'center', stretch: 'stretch', start: 'flex-start', end: 'flex-end' }; ensure(patch, 'align_items'); patch.align_items.desktop = m[layout.alignItems] || layout.alignItems || ''; }
		} else if (type === 'grid') {
			ensure(patch, 'display'); patch.display.desktop = 'grid';
			const columns = layout.columns || layout.columnCount || layout.gridTemplateColumns || '';
			if (columns) { ensure(patch, 'grid_template_columns'); const num = typeof columns === 'string' ? parseInt(columns, 10) : columns; if (!isNaN(num)) patch.grid_template_columns.desktop = String(num); }
		} else {
			// Default Group: treat as stacked (column)
			ensure(patch, 'flex_direction');
			patch.flex_direction.desktop = 'column';
		}
		if (layout.contentSize) { ensure(patch, 'max_width'); patch.max_width.desktop = layout.contentSize; }
		if (layout.wideSize && !patch.max_width?.desktop) { ensure(patch, 'max_width'); patch.max_width.desktop = layout.wideSize; }
		return patch;
	};

	window.ModernResponsiveSync = {
		resolvePresetVar,
		isGradientValue,
		normalizeBgImage,
		normalizeBgPosition,
		mapStyleToResponsivePatch,
		mapLayoutToResponsivePatch,
	};

	// ----------------------------
	// Two-way syncing HOC
	// ----------------------------
	const { createElement: el, useEffect, useRef, Fragment } = window.wp.element;

	// Deep merge helper
	const deepMerge = (target, src) => {
		Object.keys(src || {}).forEach(key => {
			if (src[key] && typeof src[key] === 'object' && !Array.isArray(src[key])) {
				if (!target[key] || typeof target[key] !== 'object') target[key] = {};
				deepMerge(target[key], src[key]);
			} else {
				target[key] = src[key];
			}
		});
		return target;
	};

	// Map responsiveStyles (desktop) -> core style object
	const mapResponsiveToStyleBulk = (responsiveStyles) => {
		if (!responsiveStyles || typeof responsiveStyles !== 'object') return {};
		const style = {};
		const get = (k) => responsiveStyles[k]?.desktop;
		const has = (v) => v !== undefined && v !== '' && v !== null;

		// Typography
		const typography = {};
		if (has(get('font_size'))) typography.fontSize = get('font_size');
		if (has(get('line_height'))) typography.lineHeight = get('line_height');
		if (has(get('letter_spacing'))) typography.letterSpacing = get('letter_spacing');
		if (has(get('font_weight'))) typography.fontWeight = get('font_weight');
		if (has(get('font_style'))) typography.fontStyle = get('font_style');
		if (has(get('text_transform'))) typography.textTransform = get('text_transform');
		if (has(get('text_decoration'))) typography.textDecoration = get('text_decoration');
		if (Object.keys(typography).length) style.typography = typography;

		// Color
		const color = {};
		if (has(get('color'))) color.text = resolvePresetVar(get('color'));
		if (has(get('link_color'))) color.link = resolvePresetVar(get('link_color'));
		if (has(get('background_color'))) {
			if (isGradientValue(get('background_color'))) color.gradient = resolvePresetVar(get('background_color'));
			else color.background = resolvePresetVar(get('background_color'));
		}
		if (Object.keys(color).length) style.color = color;

		// Background
		const background = {};
		if (has(get('background_image'))) background.backgroundImage = normalizeBgImage(get('background_image'));
		if (has(get('background_size'))) background.backgroundSize = get('background_size');
		if (has(get('background_position'))) background.backgroundPosition = get('background_position');
		if (has(get('background_repeat'))) background.backgroundRepeat = get('background_repeat');
		if (Object.keys(background).length) style.background = background;

		// Spacing
		const spacing = {};
		if (get('padding') && typeof get('padding') === 'object') spacing.padding = { ...get('padding') };
		if (get('margin') && typeof get('margin') === 'object') spacing.margin = { ...get('margin') };
		if (has(get('gap'))) spacing.blockGap = get('gap');
		if (Object.keys(spacing).length) style.spacing = spacing;

		// Border
		const border = {};
		const bw = get('borderWidth');
		const bs = get('borderStyle');
		const bc = get('borderColor');
		const br = get('borderRadius');
		if (br && typeof br === 'object') border.radius = { ...br };
		if (bw && typeof bw === 'object') {
			const sides = ['top','right','bottom','left'];
			const vals = sides.map(s => bw[s]);
			if (vals.every(v => v === vals[0] && has(v))) border.width = vals[0];
			else sides.forEach(s => { if (has(bw[s])) { border[s] = border[s] || {}; border[s].width = bw[s]; } });
		}
		if (bs && typeof bs === 'object') {
			const sides = ['top','right','bottom','left'];
			const vals = sides.map(s => bs[s]);
			if (vals.every(v => v === vals[0] && has(v))) border.style = vals[0];
			else sides.forEach(s => { if (has(bs[s])) { border[s] = border[s] || {}; border[s].style = bs[s]; } });
		}
		if (bc && typeof bc === 'object') {
			const sides = ['top','right','bottom','left'];
			const vals = sides.map(s => bc[s]);
			if (vals.every(v => v === vals[0] && has(v))) border.color = resolvePresetVar(vals[0]);
			else sides.forEach(s => { if (has(bc[s])) { border[s] = border[s] || {}; border[s].color = resolvePresetVar(bc[s]); } });
		}
		if (Object.keys(border).length) style.border = border;

		// Shadow
		if (has(get('box_shadow'))) style.shadow = get('box_shadow');

		// Dimensions
		const dimensions = {};
		if (has(get('min_height'))) dimensions.minHeight = get('min_height');
		if (has(get('aspect_ratio'))) dimensions.aspectRatio = get('aspect_ratio');
		if (Object.keys(dimensions).length) style.dimensions = dimensions;

		// Position
		const position = {};
		if (has(get('position')) && get('position') === 'sticky') position.sticky = true;
		if (has(get('top'))) position.top = get('top');
		if (Object.keys(position).length) style.position = position;

		return style;
	};

	const withSync = window.wp.compose.createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			const isSyncing = useRef(false);

			// style -> responsive
			useEffect(() => {
				if (isSyncing.current) return;
				const style = props.attributes?.style;
				if (!style) return;
				const patch = mapStyleToResponsivePatch(style);
				if (!patch || !Object.keys(patch).length) return;
				const current = JSON.parse(JSON.stringify(props.attributes?.responsiveStyles || {}));
				let changed = false;
				Object.keys(patch).forEach(key => {
					const val = patch[key];
					if (!current[key]) current[key] = { desktop: '', tablet: '', mobile: '', hover: '' };
					if (typeof val.desktop === 'object') {
						const before = JSON.stringify(current[key].desktop || {});
						current[key].desktop = { ...(current[key].desktop || {}), ...val.desktop };
						const after = JSON.stringify(current[key].desktop || {});
						if (before !== after) changed = true;
					} else if (current[key].desktop !== val.desktop) {
						current[key].desktop = val.desktop;
						changed = true;
					}
				});
				if (!changed) return;
				isSyncing.current = true;
				props.setAttributes({ responsiveStyles: current });
				setTimeout(() => { isSyncing.current = false; }, 0);
			}, [props.attributes?.style]);

			// group layout -> responsive
			useEffect(() => {
				if (isSyncing.current) return;
				if (props.name !== 'core/group') return;
				const layout = props.attributes?.layout;
				if (!layout) return;
				const patch = mapLayoutToResponsivePatch(layout);
				if (!patch || !Object.keys(patch).length) return;
				const current = JSON.parse(JSON.stringify(props.attributes?.responsiveStyles || {}));
				let changed = false;
				Object.keys(patch).forEach(key => {
					const val = patch[key];
					if (!current[key]) current[key] = { desktop: '', tablet: '', mobile: '', hover: '' };
					const before = JSON.stringify(current[key].desktop || {});
					if (typeof val.desktop === 'object') current[key].desktop = { ...(current[key].desktop || {}), ...val.desktop };
					else current[key].desktop = val.desktop;
					const after = JSON.stringify(current[key].desktop || {});
					if (before !== after) changed = true;
				});
				if (!changed) return;
				isSyncing.current = true;
				props.setAttributes({ responsiveStyles: current });
				setTimeout(() => { isSyncing.current = false; }, 0);
			}, [props.attributes?.layout]);

			// responsive (desktop) -> style
			useEffect(() => {
				if (isSyncing.current) return;
				const rs = props.attributes?.responsiveStyles;
				if (!rs) return;
				const delta = mapResponsiveToStyleBulk(rs);
				if (!Object.keys(delta).length) return;
				const currentStyle = JSON.parse(JSON.stringify(props.attributes?.style || {}));
				const before = JSON.stringify(currentStyle);
				const merged = deepMerge(currentStyle, delta);
				const after = JSON.stringify(merged);
				if (before === after) return;
				isSyncing.current = true;
				props.setAttributes({ style: merged });
				setTimeout(() => { isSyncing.current = false; }, 0);
			}, [props.attributes?.responsiveStyles]);

			return el(Fragment, {}, el(BlockEdit, props));
		};
	}, 'withModernResponsiveSync');

	window.wp.hooks.addFilter('editor.BlockEdit', 'modern-responsive/sync', withSync);
})();


