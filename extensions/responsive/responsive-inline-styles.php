<?php
/**
 * Responsive Inline Styles generation
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

function stepfox_inline_styles_for_blocks($block) {
    if (!is_array($block) || !isset($block['blockName'])) {
        return '';
    }

    if (!isset($block['attrs']) || !is_array($block['attrs'])) {
        $block['attrs'] = [];
    }

    $hasResponsiveAttrs = false;
    if (isset($block['attrs']['responsiveStyles'])) {
        $responsiveStyles = $block['attrs']['responsiveStyles'];
        foreach ($responsiveStyles as $property => $devices) {
            if (is_array($devices)) {
                foreach ($devices as $device => $value) {
                    if (is_array($value)) {
                        if (!empty(array_filter($value))) {
                            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    } else {
                        if (!empty($value)) {
                            $hasResponsiveAttrs = true;
                            break 2;
                        }
                    }
                }
            }
        }
    }

    if ($hasResponsiveAttrs && isset($block['attrs']) && empty($block['attrs']['customId'])) {
        $blockHash = md5(serialize($block['attrs']) . $block['blockName'] . serialize($block['innerHTML'] ?? ''));
        $block['attrs']['customId'] = substr($blockHash, 0, 8);
    }

    if ( isset($block['attrs']) && ( ! empty( $block['attrs']['customId'] ) || ! empty( $block['attrs']['image_block_id'] ) ) ) {
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['desktop'] ) ) {
            $block['attrs']['width'] = $block['attrs']['responsiveStyles']['width']['desktop'];
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['right'] ) ) {
            $block['attrs']['style']['spacing']['border']['right'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['right'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['left'] ) ) {
            $block['attrs']['style']['spacing']['border']['left'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['left'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom'] ) ) {
            $block['attrs']['style']['spacing']['border']['bottom'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['top'] ) ) {
            $block['attrs']['style']['spacing']['border']['top'] = $block['attrs']['responsiveStyles']['borderWidth']['desktop']['top'];
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['tablet'] ) ) {
            $block['attrs']['padding_tablet'] = $block['attrs']['responsiveStyles']['padding']['tablet'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['tablet'] ) ) {
            $block['attrs']['margin_tablet'] = $block['attrs']['responsiveStyles']['margin']['tablet'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile'] ) ) {
            $block['attrs']['padding_mobile'] = $block['attrs']['responsiveStyles']['padding']['mobile'];
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile'] ) ) {
            $block['attrs']['margin_mobile'] = $block['attrs']['responsiveStyles']['margin']['mobile'];
        }

        if ( strpos( $block['blockName'], 'acf/' ) !== false ) {
            $block['attrs']['customId'] = str_replace( 'block_', '', $block['attrs']['customId'] );
        }
        if ( ! empty( $block['attrs']['image_block_id'] ) ) {
            $block['attrs']['customId'] = $block['attrs']['image_block_id'];
        }
        $cleanCustomId = ! empty( $block['attrs']['customId'] ) ? str_replace( 'anchor_', '', $block['attrs']['customId'] ) : '';
        $anchorId = ! empty( $block['attrs']['anchor'] ) ? $block['attrs']['anchor'] : '';
        $finalId = ! empty($anchorId) ? $anchorId : $cleanCustomId;
        $baseSelector = '#block_' . $finalId;

        $inlineStyles = $baseSelector . '{';
        if ( ! empty( $block['attrs']['style']['color']['background'] ) ) {
            $bg = stepfox_sanitize_css_color($block['attrs']['style']['color']['background']);
            if ($bg !== '') { $inlineStyles .= 'background-color:' . $bg . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['background']['backgroundImage'] ) ) {
            $bgurl = isset($block['attrs']['style']['background']['backgroundImage']['url']) ? $block['attrs']['style']['background']['backgroundImage']['url'] : '';
            $bgurl = stepfox_sanitize_css_url_value($bgurl);
            if ($bgurl !== '') { $inlineStyles .= 'background:' . $bgurl . ';background-size: 100%;'; }
        }
        if ( ! empty( $block['attrs']['theme_colors'] ) ) {
            foreach ( $block['attrs']['theme_colors'] as $theme_color => $value ) {
                if ( $theme_color == 'gradient_override' ) {
                    $grad = stepfox_sanitize_css_background_value($value);
                    if ($grad !== '') { $inlineStyles .= '--wp--preset--gradient--flag: ' . $grad . ';'; }
                } else {
                    $col = stepfox_sanitize_css_color($value);
                    if ($col !== '') { $inlineStyles .= '--wp--preset--color--' . sanitize_key($theme_color) . ':' . $col . ';'; }
                }
            }
        }
        if ( ! empty( $block['attrs']['start_from'] ) ) {
            $val = sanitize_text_field($block['attrs']['start_from']);
            if ($val !== '') { $inlineStyles .= '--start-from:' . $val . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['color']['gradient'] ) ) {
            $bg = stepfox_sanitize_css_background_value($block['attrs']['style']['color']['gradient']);
            if ($bg !== '') { $inlineStyles .= 'background:' . $bg . ';'; }
        }
        if ( ! empty( $block['attrs']['backgroundColor'] ) ) {
            $inlineStyles .= 'background-color:var(--wp--preset--color--' . $block['attrs']['backgroundColor'] . ');';
        }
        if ( ! empty( $block['attrs']['style']['color']['text'] ) ) {
            $col = stepfox_sanitize_css_color($block['attrs']['style']['color']['text']);
            if ($col !== '') { $inlineStyles .= 'color:' . $col . ';'; }
        }
        if ( ! empty( $block['attrs']['textColor'] ) ) {
            $inlineStyles .= 'color:var(--wp--preset--color--' . $block['attrs']['textColor'] . ');';
        }
        if ( ! empty( $block['attrs']['style']['shadow'] ) ) {
            $shadow = stepfox_sanitize_css_box_shadow($block['attrs']['style']['shadow']);
            if ($shadow !== '') { $inlineStyles .= 'box-shadow:' . $shadow . ';'; }
        }
        if ( ! empty( $block['attrs']['animation'] ) ) {
            $anim = sanitize_text_field($block['attrs']['animation']);
            if ($anim !== '') { $inlineStyles .= 'animation:' . $anim . ';'; }
        }
        if ( ! empty( $block['attrs']['animation_delay'] ) ) {
            $d = stepfox_sanitize_css_length($block['attrs']['animation_delay'] . 's');
            if ($d !== '') { $inlineStyles .= 'animation-delay:' . $d . ';'; }
        }
        if ( ! empty( $block['attrs']['animation_duration'] ) ) {
            $d = stepfox_sanitize_css_length($block['attrs']['animation_duration'] . 's');
            if ($d !== '') { $inlineStyles .= 'animation-duration:' . $d . ';'; }
        }

        if ( ! empty( $block['attrs']['style']['typography']['fontSize'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['style']['typography']['fontSize']);
            if ($v !== '') { $inlineStyles .= 'font-size:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['typography']['textDecoration'] ) ) {
            $inlineStyles .= 'text-decoration:' . $block['attrs']['style']['typography']['textDecoration'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['typography']['letterSpacing'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['style']['typography']['letterSpacing']);
            if ($v !== '') { $inlineStyles .= 'letter-spacing:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['typography']['lineHeight'] ) ) {
            $v = stepfox_sanitize_css_line_height($block['attrs']['style']['typography']['lineHeight']);
            if ($v !== '') { $inlineStyles .= 'line-height:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['typography']['fontWeight'] ) ) {
            $v = sanitize_text_field($block['attrs']['style']['typography']['fontWeight']);
            if ($v !== '') { $inlineStyles .= 'font-weight:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['typography']['fontStyle'] ) ) {
            $v = sanitize_text_field($block['attrs']['style']['typography']['fontStyle']);
            if ($v !== '') { $inlineStyles .= 'font-style:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['typography']['textTransform'] ) ) {
            $v = stepfox_sanitize_css_keyword($block['attrs']['style']['typography']['textTransform'], array('none','capitalize','uppercase','lowercase','full-width','full-size-kana','inherit','initial','revert','unset'));
            if ($v !== '') { $inlineStyles .= 'text-transform:' . $v . ';'; }
        }

        if ( ! empty( $block['attrs']['style']['border']['width'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['style']['border']['width']);
            if ($v !== '') { $inlineStyles .= 'border-width:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['border']['style'] ) ) {
            $v = stepfox_sanitize_css_keyword($block['attrs']['style']['border']['style'], array('none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit','initial','revert','unset'));
            if ($v !== '') { $inlineStyles .= 'border-style:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['border']['radius'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['style']['border']['radius']);
            if ($v !== '') { $inlineStyles .= 'border-radius:' . $v . ';'; }
            $inlineStyles .= 'overflow:hidden;';
        }
        if ( ! empty( $block['attrs']['style']['border']['color'] ) ) {
            $v = stepfox_sanitize_css_color($block['attrs']['style']['border']['color']);
            if ($v !== '') { $inlineStyles .= 'border-color:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['borderColor'] ) ) {
            $inlineStyles .= 'border-color:' . $block['attrs']['style']['borderColor'] . ';';
        }
        if ( ! empty( $block['attrs']['style']['border'] ) ) {
            foreach ( $block['attrs']['style']['border'] as $border_side_key => $border_side_value ) {
                if ( ! empty( $border_side_value["width"] ) ) {
                    $v = stepfox_sanitize_css_length(stepfox_decode_css_var($border_side_value['width']));
                    if ($v !== '') { $inlineStyles .= 'border-' . sanitize_key($border_side_key) . '-width:' . $v . ';'; }
                    if(!empty($border_side_value['color'])) {
                        $c = stepfox_sanitize_css_color(stepfox_decode_css_var($border_side_value['color']));
                        if ($c !== '') { $inlineStyles .= 'border-' . sanitize_key($border_side_key) . '-color:' . $c . ';'; }
                    }
                    $inlineStyles .= 'border-' . $border_side_key . '-style:solid;';
                    if(!empty($border_side_value['radius'])) {
                        $r = stepfox_sanitize_css_length(stepfox_decode_css_var($border_side_value['radius']));
                        if ($r !== '') { $inlineStyles .= 'border-' . sanitize_key($border_side_key) . '-radius:' . $r . ';'; }
                    }
                }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['top'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['responsiveStyles']['borderWidth']['desktop']['top']);
            if ($v !== '') { $inlineStyles .= 'border-top-width:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['responsiveStyles']['borderWidth']['desktop']['bottom']);
            if ($v !== '') { $inlineStyles .= 'border-bottom-width:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['left'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['responsiveStyles']['borderWidth']['desktop']['left']);
            if ($v !== '') { $inlineStyles .= 'border-left-width:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop']['right'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['responsiveStyles']['borderWidth']['desktop']['right']);
            if ($v !== '') { $inlineStyles .= 'border-right-width:' . $v . ';'; }
        }

        if ( ! empty( $block['attrs']['image_block_id'] ) ) {
            if ( ! empty( $block['attrs']['width'] ) ) {
                $v = stepfox_sanitize_css_length($block['attrs']['width'] . 'px');
                if ($v !== '') { $inlineStyles .= 'width:' . $v . ';'; }
                $block['attrs']['width'] = '';
            }
            if ( ! empty( $block['attrs']['height'] ) ) {
                $v = stepfox_sanitize_css_length($block['attrs']['height'] . 'px');
                if ($v !== '') { $inlineStyles .= 'height:' . $v . ';'; }
                $block['attrs']['height'] = '';
            }
        }
        if ( ! empty( $block['attrs']['layout']['contentSize'] ) && $block['blockName'] != 'core/group' ) {
            $v = stepfox_sanitize_css_length($block['attrs']['layout']['contentSize']);
            if ($v !== '') { $inlineStyles .= 'max-width:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['layout']['contentSize'] ) && $block['blockName'] == 'core/group' ) {
            $v = stepfox_sanitize_css_length($block['attrs']['layout']['contentSize']);
            if ($v !== '') { $inlineStyles .= 'flex-basis:' . $v . '; max-width:100%;'; }
        }
        if ( ! empty( $block['attrs']['width'] ) && $block['blockName'] != 'core/column' ) {
            $v = stepfox_sanitize_css_length($block['attrs']['width']);
            if ($v !== '') { $inlineStyles .= 'width:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['width'] ) && $block['blockName'] === 'core/column' ) {
            $v = stepfox_sanitize_css_length($block['attrs']['width']);
            if ($v !== '') { $inlineStyles .= 'flex-basis:' . $v . ';'; }
        }

        if ( ! empty( $block['attrs']['layout']['type'] ) && $block['attrs']['layout']['type'] == 'flex' ) {
            $disp = stepfox_sanitize_css_keyword($block['attrs']['layout']['type'], array('flex','block','inline-block','grid','inline','inline-flex','inline-grid'));
            if ($disp !== '') { $inlineStyles .= 'display:' . $disp . ';'; }
            if ( ! empty( $block['attrs']['layout']['flexWrap'] ) ) {
                $v = stepfox_sanitize_css_keyword($block['attrs']['layout']['flexWrap'], array('nowrap','wrap','wrap-reverse','inherit','initial','revert','unset'));
                if ($v !== '') { $inlineStyles .= 'flex-wrap:' . $v . ';'; }
            } else {
                $inlineStyles .= 'flex-wrap:wrap;';
            }
            if ( ! empty( $block['attrs']['layout']['verticalAlignment'] ) ) {
                $verticalAlignment = 'center';
                if ( $block['attrs']['layout']['verticalAlignment'] == 'bottom' ) {
                    $verticalAlignment = 'flex-end';
                } elseif ( $block['attrs']['layout']['verticalAlignment'] == 'top' ) {
                    $verticalAlignment = 'flex-start';
                }
                $inlineStyles .= 'align-items:' . $verticalAlignment . ';';
            } else {
                $inlineStyles .= 'align-items:center;';
            }
            if ( ! empty( $block['attrs']['layout']['justifyContent'] ) ) {
                if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                    $inlineStyles .= 'justify-content:flex-start;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                    $inlineStyles .= 'justify-content:center;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                    $inlineStyles .= 'justify-content:flex-end;';
                }
                if ( $block['attrs']['layout']['justifyContent'] == 'space-between' ) {
                    $inlineStyles .= 'justify-content:space-between;';
                }
            }
            if ( ! empty( $block['attrs']['layout']['orientation'] ) ) {
                if ( $block['attrs']['layout']['orientation'] == 'vertical' ) {
                    $inlineStyles .= 'flex-direction:column;';
                    if ( ! empty( $block['attrs']['layout']['justifyContent'] ) ) {
                        if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                            $inlineStyles .= 'align-items:flex-start;';
                        }
                        if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                            $inlineStyles .= 'align-items:center;';
                        }
                        if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                            $inlineStyles .= 'align-items:flex-end;';
                        }
                    }
                } else {
                    $inlineStyles .= 'flex-direction:row;';
                    if ( $block['attrs']['layout']['justifyContent'] == 'left' ) {
                        $inlineStyles .= 'justify-content:flex-start;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'center' ) {
                        $inlineStyles .= 'justify-content:center;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'right' ) {
                        $inlineStyles .= 'justify-content:flex-end;';
                    }
                    if ( $block['attrs']['layout']['justifyContent'] == 'space-between' ) {
                        $inlineStyles .= 'justify-content:space-between;';
                    }
                }
            }
        }
        if ( strpos( $block['blockName'], 'core/column' ) !== false ) {
            if ( ! empty( $block['attrs']['align'] ) ) {
                $inlineStyles .= 'align-self:' . $block['attrs']['align'] . ';';
            }
        }

        if ( ! empty( $block['attrs']['layout']['type'] ) && $block['attrs']['layout']['type'] == 'grid' ) {
            $inlineStyles .= 'display:grid;';
            if ( ! empty( $block['attrs']['layout']['columnCount'] ) ) {
                $columnCount = absint( $block['attrs']['layout']['columnCount'] );
                $inlineStyles .= 'grid-template-columns:repeat(' . $columnCount . ', minmax(0, 1fr));';
            }
            if ( ! empty( $block['attrs']['layout']['minimumColumnWidth'] ) ) {
                $minWidth = $block['attrs']['layout']['minimumColumnWidth'];
                $inlineStyles .= 'grid-template-columns:repeat(auto-fit, minmax(' . $minWidth . ', 1fr));';
            }
        }

        if ( ! empty( $block['attrs']['minHeight'] ) ) {
            if ( empty( $block['attrs']['minHeightUnit'] ) ) {
                $block['attrs']['minHeightUnit'] = 'px';
            }
            $v = stepfox_sanitize_css_length($block['attrs']['minHeight'] . $block['attrs']['minHeightUnit']);
            if ($v !== '') { $inlineStyles .= 'min-height:' . $v . ' !important;'; }
        }
        if ( ! empty( $block['attrs']['style']['dimensions']['minHeight'] ) ) {
            $v = stepfox_sanitize_css_length($block['attrs']['style']['dimensions']['minHeight']);
            if ($v !== '') { $inlineStyles .= 'min-height:' . $v . ' !important;'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['blockGap'] ) ) {
            $blockGap = $block['attrs']['style']['spacing']['blockGap'];
            if ( is_array( $blockGap ) ) {
                $blockGap = implode(' ', $blockGap);
            }
            $gap = stepfox_sanitize_css_length($blockGap);
            if ($gap !== '') { $inlineStyles .= 'gap:' . $gap . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['top'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['padding']['top']));
            if ($v !== '') { $inlineStyles .= 'padding-top:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['right'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['padding']['right']));
            if ($v !== '') { $inlineStyles .= 'padding-right:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['bottom'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['padding']['bottom']));
            if ($v !== '') { $inlineStyles .= 'padding-bottom:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['padding']['left'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['padding']['left']));
            if ($v !== '') { $inlineStyles .= 'padding-left:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['top'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['margin']['top']));
            if ($v !== '') { $inlineStyles .= 'margin-top:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['right'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['margin']['right']));
            if ($v !== '') { $inlineStyles .= 'margin-right:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['bottom'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['margin']['bottom']));
            if ($v !== '') { $inlineStyles .= 'margin-bottom:' . $v . ';'; }
        }
        if ( ! empty( $block['attrs']['style']['spacing']['margin']['left'] ) ) {
            $v = stepfox_sanitize_css_length(stepfox_decode_css_var($block['attrs']['style']['spacing']['margin']['left']));
            if ($v !== '') { $inlineStyles .= 'margin-left:' . $v . ';'; }
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['desktop'] ) ) { $inlineStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['desktop'] ) ) { $inlineStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['desktop'] ) ) { $inlineStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['desktop'] ) ) { $inlineStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['desktop'] ) ) { $inlineStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['desktop'] ) ) { $inlineStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['desktop'] ) ) { $inlineStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['desktop'] ) ) { $inlineStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['desktop'] ) ) { $inlineStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['desktop'] ) ) { $inlineStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['desktop'] . ';'; }

        if ( ! empty( $block['attrs']['responsiveStyles']['color']['desktop'] ) ) { $inlineStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['desktop'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['desktop'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['desktop'], 'gradient') !== false) {
                $inlineStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['desktop'] . ' !important;';
            } else {
                $inlineStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['desktop'] . ' !important;';
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['desktop'] ) ) {
            $bg_image = $block['attrs']['responsiveStyles']['background_image']['desktop'];
            if (strpos($bg_image, 'url(') !== 0) { $bg_image = 'url(' . $bg_image . ')'; }
            $inlineStyles .= 'background-image:' . $bg_image . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['desktop'] ) ) { $inlineStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['desktop'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['desktop'] ) ) { $inlineStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['desktop'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['desktop'] ) ) { $inlineStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['desktop'] . ' !important;'; }

        if ( ! empty( $block['attrs']['responsiveStyles']['width']['desktop'] ) ) {
            $width_value = $block['attrs']['responsiveStyles']['width']['desktop'];
            $inlineStyles .= 'width:' . $width_value . ';';
            $inlineStyles .= 'flex-basis:' . $width_value . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['desktop'] ) ) { $inlineStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['desktop'] ) ) { $inlineStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['desktop'] ) ) { $inlineStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['desktop'] ) ) { $inlineStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['desktop'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['desktop'] ) ) { $inlineStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['desktop'] ) ) { $inlineStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['desktop'] ) ) { $inlineStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['float']['desktop'] ) ) { $inlineStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clear']['desktop'] ) ) { $inlineStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['desktop'] ) ) { $inlineStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['desktop'] ) ) { $inlineStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) || ! empty( $block['attrs']['animation'] ) ) {
            $animation = ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) ? $block['attrs']['responsiveStyles']['animation']['desktop'] : $block['attrs']['animation'];
            $inlineStyles .= 'animation-name:' . $animation . ';';
            $inlineStyles .= 'animation-fill-mode:both;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['desktop'] ) || ! empty( $block['attrs']['animation_duration'] ) ) {
            $duration = ! empty( $block['attrs']['responsiveStyles']['animation_duration']['desktop'] ) ? $block['attrs']['responsiveStyles']['animation_duration']['desktop'] : $block['attrs']['animation_duration'];
            $inlineStyles .= 'animation-duration:' . $duration . 's;';
        } elseif ( ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) || ! empty( $block['attrs']['animation'] ) ) {
            $inlineStyles .= 'animation-duration:1s;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['desktop'] ) || ! empty( $block['attrs']['animation_delay'] ) ) {
            $delay = ! empty( $block['attrs']['responsiveStyles']['animation_delay']['desktop'] ) ? $block['attrs']['responsiveStyles']['animation_delay']['desktop'] : $block['attrs']['animation_delay'];
            $inlineStyles .= 'animation-delay:' . $delay . 's;';
        } elseif ( ! empty( $block['attrs']['responsiveStyles']['animation']['desktop'] ) || ! empty( $block['attrs']['animation'] ) ) {
            $inlineStyles .= 'animation-delay:0s;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['desktop'] ) ) { $inlineStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['desktop'] ) ) { $inlineStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['desktop'] ) ) { $inlineStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['desktop'] ) ) { $inlineStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['desktop'] ) ) { $inlineStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['desktop'] ) ) { $inlineStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['desktop'] ) ) {
            $position = $block['attrs']['responsiveStyles']['position']['desktop'];
            if ( is_string( $position ) ) {
                $inlineStyles .= 'position:' . $position . ';';
            } elseif ( is_array( $position ) ) {
                if ( ! empty( $position['top'] ) ) { $inlineStyles .= 'top:' . $position['top'] . ';'; }
                if ( ! empty( $position['left'] ) ) { $inlineStyles .= 'left:' . $position['left'] . ';'; }
                if ( ! empty( $position['right'] ) ) { $inlineStyles .= 'right:' . $position['right'] . ';'; }
                if ( ! empty( $position['bottom'] ) ) { $inlineStyles .= 'bottom:' . $position['bottom'] . ';'; }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['desktop'] ) ) { $inlineStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['desktop'] ) ) { $inlineStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['desktop'] ) ) { $inlineStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['desktop'] ) ) {
            $wrap_value_d = $block['attrs']['responsiveStyles']['flexWrap']['desktop'];
            $inlineStyles .= 'flex-wrap:' . $wrap_value_d . ' !important;';
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['desktop'] ) ) { $inlineStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['desktop'] ) ) { $inlineStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['desktop'] ) ) { $inlineStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['desktop'] ) ) { $inlineStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['desktop'] ) ) { $inlineStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['desktop'] ) ) { $inlineStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['desktop'] ) ) {
            $cols = absint($block['attrs']['responsiveStyles']['grid_template_columns']['desktop']);
            if ($cols > 0) { $inlineStyles .= 'grid-template-columns:repeat(' . $cols . ', 1fr);'; }
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['borderStyle']['desktop'] ) ) {
            $borderStyle = $block['attrs']['responsiveStyles']['borderStyle']['desktop'];
            if (is_array($borderStyle)) {
                $allowed = array('none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit','initial','revert','unset');
                if (!empty($borderStyle['top'])) { $v = stepfox_sanitize_css_keyword($borderStyle['top'], $allowed); if ($v !== '') { $inlineStyles .= 'border-top-style:' . $v . ';'; } }
                if (!empty($borderStyle['right'])) { $v = stepfox_sanitize_css_keyword($borderStyle['right'], $allowed); if ($v !== '') { $inlineStyles .= 'border-right-style:' . $v . ';'; } }
                if (!empty($borderStyle['bottom'])) { $v = stepfox_sanitize_css_keyword($borderStyle['bottom'], $allowed); if ($v !== '') { $inlineStyles .= 'border-bottom-style:' . $v . ';'; } }
                if (!empty($borderStyle['left'])) { $v = stepfox_sanitize_css_keyword($borderStyle['left'], $allowed); if ($v !== '') { $inlineStyles .= 'border-left-style:' . $v . ';'; } }
            } else {
                $v = stepfox_sanitize_css_keyword($borderStyle, array('none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit','initial','revert','unset'));
                if ($v !== '') { $inlineStyles .= 'border-style:' . $v . ';'; }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderColor']['desktop'] ) ) {
            $borderColor = $block['attrs']['responsiveStyles']['borderColor']['desktop'];
            if (is_array($borderColor)) {
                if (!empty($borderColor['top'])) { $c = stepfox_sanitize_css_color($borderColor['top']); if ($c !== '') { $inlineStyles .= 'border-top-color:' . $c . ';'; } }
                if (!empty($borderColor['right'])) { $c = stepfox_sanitize_css_color($borderColor['right']); if ($c !== '') { $inlineStyles .= 'border-right-color:' . $c . ';'; } }
                if (!empty($borderColor['bottom'])) { $c = stepfox_sanitize_css_color($borderColor['bottom']); if ($c !== '') { $inlineStyles .= 'border-bottom-color:' . $c . ';'; } }
                if (!empty($borderColor['left'])) { $c = stepfox_sanitize_css_color($borderColor['left']); if ($c !== '') { $inlineStyles .= 'border-left-color:' . $c . ';'; } }
            } else {
                $c = stepfox_sanitize_css_color($borderColor);
                if ($c !== '') { $inlineStyles .= 'border-color:' . $c . ';'; }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['desktop'] ) ) {
            $borderWidth = $block['attrs']['responsiveStyles']['borderWidth']['desktop'];
            if (is_array($borderWidth)) {
                if (!empty($borderWidth['top'])) { $v = stepfox_sanitize_css_length($borderWidth['top']); if ($v !== '') { $inlineStyles .= 'border-top-width:' . $v . ';'; } }
                if (!empty($borderWidth['right'])) { $v = stepfox_sanitize_css_length($borderWidth['right']); if ($v !== '') { $inlineStyles .= 'border-right-width:' . $v . ';'; } }
                if (!empty($borderWidth['bottom'])) { $v = stepfox_sanitize_css_length($borderWidth['bottom']); if ($v !== '') { $inlineStyles .= 'border-bottom-width:' . $v . ';'; } }
                if (!empty($borderWidth['left'])) { $v = stepfox_sanitize_css_length($borderWidth['left']); if ($v !== '') { $inlineStyles .= 'border-left-width:' . $v . ';'; } }
            } else {
                $v = stepfox_sanitize_css_length($borderWidth);
                if ($v !== '') { $inlineStyles .= 'border-width:' . $v . ';'; }
            }
        }

        if ( ! empty( $block['attrs']['responsiveStyles']['opacity']['desktop'] ) ) { $inlineStyles .= 'opacity:' . sanitize_text_field($block['attrs']['responsiveStyles']['opacity']['desktop']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['transform']['desktop'] ) ) { $inlineStyles .= 'transform:' . sanitize_text_field($block['attrs']['responsiveStyles']['transform']['desktop']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['transition']['desktop'] ) ) { $inlineStyles .= 'transition:' . sanitize_text_field($block['attrs']['responsiveStyles']['transition']['desktop']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['desktop'] ) ) { $v = stepfox_sanitize_css_box_shadow($block['attrs']['responsiveStyles']['box_shadow']['desktop']); if ($v !== '') { $inlineStyles .= 'box-shadow:' . $v . ';'; } }
        if ( ! empty( $block['attrs']['responsiveStyles']['filter']['desktop'] ) ) { $inlineStyles .= 'filter:' . sanitize_text_field($block['attrs']['responsiveStyles']['filter']['desktop']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clip_path']['desktop'] ) ) { $inlineStyles .= 'clip-path:' . sanitize_text_field($block['attrs']['responsiveStyles']['clip_path']['desktop']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['backdrop_filter']['desktop'] ) ) { $inlineStyles .= 'backdrop-filter:' . sanitize_text_field($block['attrs']['responsiveStyles']['backdrop_filter']['desktop']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['cursor']['desktop'] ) ) { $inlineStyles .= 'cursor:' . $block['attrs']['responsiveStyles']['cursor']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['pointer_events']['desktop'] ) ) { $inlineStyles .= 'pointer-events:' . $block['attrs']['responsiveStyles']['pointer_events']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['user_select']['desktop'] ) ) { $inlineStyles .= 'user-select:' . $block['attrs']['responsiveStyles']['user_select']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['gap']['desktop'] ) ) {
            $gap_val = $block['attrs']['responsiveStyles']['gap']['desktop'];
            if ( is_array( $gap_val ) ) {
                $gap_row = isset( $gap_val['row'] ) ? stepfox_decode_css_var( $gap_val['row'] ) : '';
                $gap_col = isset( $gap_val['column'] ) ? stepfox_decode_css_var( $gap_val['column'] ) : '';
                $gap_css = trim( $gap_row . ' ' . $gap_col );
            } else {
                $gap_css = stepfox_decode_css_var( $gap_val );
            }
            if ( $gap_css !== '' ) { $inlineStyles .= 'gap:' . $gap_css . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_fit']['desktop'] ) ) { $inlineStyles .= 'object-fit:' . $block['attrs']['responsiveStyles']['object_fit']['desktop'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_position']['desktop'] ) ) { $inlineStyles .= 'object-position:' . $block['attrs']['responsiveStyles']['object_position']['desktop'] . ';'; }

        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['top'] ) ) { $inlineStyles .= 'padding-top:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['desktop']['top']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['right'] ) ) { $inlineStyles .= 'padding-right:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['desktop']['right']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['bottom'] ) ) { $inlineStyles .= 'padding-bottom:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['desktop']['bottom']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['desktop']['left'] ) ) { $inlineStyles .= 'padding-left:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['desktop']['left']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['top'] ) ) { $inlineStyles .= 'margin-top:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['desktop']['top']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['right'] ) ) { $inlineStyles .= 'margin-right:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['desktop']['right']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['bottom'] ) ) { $inlineStyles .= 'margin-bottom:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['desktop']['bottom']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['desktop']['left'] ) ) { $inlineStyles .= 'margin-left:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['desktop']['left']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topLeft'] ) ) { $inlineStyles .= 'border-top-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topLeft'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topRight'] ) ) { $inlineStyles .= 'border-top-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['topRight'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomLeft'] ) ) { $inlineStyles .= 'border-bottom-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomLeft'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomRight'] ) ) { $inlineStyles .= 'border-bottom-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['desktop']['bottomRight'] . ';'; }
        $inlineStyles .= '}';

        $tabletStyles = '';
        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['tablet'] ) ) { $tabletStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['tablet'] ) ) { $tabletStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['tablet'] ) ) { $tabletStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['tablet'] ) ) { $tabletStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['tablet'] ) ) { $tabletStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['tablet'] ) ) { $tabletStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['tablet'] ) ) { $tabletStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['tablet'] ) ) { $tabletStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['tablet'] ) ) { $tabletStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['tablet'] ) ) { $tabletStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['color']['tablet'] ) ) { $tabletStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['tablet'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['tablet'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['tablet'], 'gradient') !== false) { $tabletStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['tablet'] . ' !important;'; }
            else { $tabletStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['tablet'] . ' !important;'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['tablet'] ) ) { $bg_image = $block['attrs']['responsiveStyles']['background_image']['tablet']; if (strpos($bg_image, 'url(') !== 0) { $bg_image = 'url(' . $bg_image . ')'; } $tabletStyles .= 'background-image:' . $bg_image . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['tablet'] ) ) { $tabletStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['tablet'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['tablet'] ) ) { $tabletStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['tablet'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['tablet'] ) ) { $tabletStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['tablet'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['tablet'] ) ) { $width_value = $block['attrs']['responsiveStyles']['width']['tablet']; $tabletStyles .= 'width:' . $width_value . ';'; $tabletStyles .= 'flex-basis:' . $width_value . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['tablet'] ) ) { $tabletStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['tablet'] ) ) { $tabletStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['tablet'] ) ) { $tabletStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['tablet'] ) ) { $tabletStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['tablet'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['tablet'] ) ) { $tabletStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['tablet'] ) ) { $tabletStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['tablet'] ) ) { $tabletStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['float']['tablet'] ) ) { $tabletStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clear']['tablet'] ) ) { $tabletStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['tablet'] ) ) { $tabletStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['tablet'] ) ) { $tabletStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clip_path']['tablet'] ) ) { $tabletStyles .= 'clip-path:' . $block['attrs']['responsiveStyles']['clip_path']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['tablet'] ) ) { $v = stepfox_sanitize_css_box_shadow($block['attrs']['responsiveStyles']['box_shadow']['tablet']); if ($v !== '') { $tabletStyles .= 'box-shadow:' . $v . ';'; } }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation']['tablet'] ) ) { $tabletStyles .= 'animation-name:' . $block['attrs']['responsiveStyles']['animation']['tablet'] . ';animation-fill-mode:both;animation-duration:1s;animation-delay:0s;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['tablet'] ) ) { $tabletStyles .= 'animation-duration:' . $block['attrs']['responsiveStyles']['animation_duration']['tablet'] . 's;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['tablet'] ) ) { $tabletStyles .= 'animation-delay:' . $block['attrs']['responsiveStyles']['animation_delay']['tablet'] . 's;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['tablet'] ) ) { $tabletStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['tablet'] ) ) { $tabletStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['tablet'] ) ) { $tabletStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['tablet'] ) ) { $tabletStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['tablet'] ) ) { $tabletStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['tablet'] ) ) { $tabletStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['tablet'] ) ) {
            $position = $block['attrs']['responsiveStyles']['position']['tablet'];
            if ( is_string( $position ) ) { $tabletStyles .= 'position:' . $position . ';'; }
            elseif ( is_array( $position ) ) {
                if ( ! empty( $position['top'] ) ) { $tabletStyles .= 'top:' . $position['top'] . ';'; }
                if ( ! empty( $position['left'] ) ) { $tabletStyles .= 'left:' . $position['left'] . ';'; }
                if ( ! empty( $position['right'] ) ) { $tabletStyles .= 'right:' . $position['right'] . ';'; }
                if ( ! empty( $position['bottom'] ) ) { $tabletStyles .= 'bottom:' . $position['bottom'] . ';'; }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['tablet'] ) ) { $tabletStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['tablet'] ) ) { $tabletStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['tablet'] ) ) { $tabletStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['tablet'] ) ) { $wrap_value = $block['attrs']['responsiveStyles']['flexWrap']['tablet']; if ( isset($block['blockName']) && $block['blockName'] === 'core/columns' ) { $tabletStyles .= 'flex-wrap:' . $wrap_value . ' !important;'; } else { $tabletStyles .= 'flex-wrap:' . $wrap_value . ';'; } }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['tablet'] ) ) { $tabletStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['tablet'] ) ) { $tabletStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['tablet'] ) ) { $tabletStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['tablet'] ) ) { $tabletStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['tablet'] ) ) { $tabletStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['tablet'] ) ) { $tabletStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['tablet'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['tablet'] ) ) { $tabletStyles .= 'grid-template-columns:repeat(' . $block['attrs']['responsiveStyles']['grid_template_columns']['tablet'] . ', 1fr);'; }
        if (!empty($tabletStyles)) { $inlineStyles .= '@media screen and (max-width: 1024px){ ' . $baseSelector . '{' . $tabletStyles . '} }'; }

        $mobileStyles = '';
        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['mobile'] ) ) { $mobileStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['mobile'] ) ) { $mobileStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['mobile'] ) ) { $mobileStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['mobile'] ) ) { $mobileStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['mobile'] ) ) { $mobileStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['mobile'] ) ) { $mobileStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['mobile'] ) ) { $mobileStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['mobile'] ) ) { $mobileStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['mobile'] ) ) { $mobileStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['mobile'] ) ) { $mobileStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['color']['mobile'] ) ) { $mobileStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['mobile'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['mobile'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['mobile'], 'gradient') !== false) { $mobileStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['mobile'] . ' !important;'; }
            else { $mobileStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['mobile'] . ' !important;'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['mobile'] ) ) { $bg_image = $block['attrs']['responsiveStyles']['background_image']['mobile']; if (strpos($bg_image, 'url(') !== 0) { $bg_image = 'url(' . $bg_image . ')'; } $mobileStyles .= 'background-image:' . $bg_image . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['mobile'] ) ) { $mobileStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['mobile'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['mobile'] ) ) { $mobileStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['mobile'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['mobile'] ) ) { $mobileStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['mobile'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['mobile'] ) ) { $width_value = $block['attrs']['responsiveStyles']['width']['mobile']; $mobileStyles .= 'width:' . $width_value . ';'; $mobileStyles .= 'flex-basis:' . $width_value . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['mobile'] ) ) { $mobileStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['mobile'] ) ) { $mobileStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['mobile'] ) ) { $mobileStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['mobile'] ) ) { $mobileStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['mobile'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['mobile'] ) ) { $mobileStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['mobile'] ) ) { $mobileStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['mobile'] ) ) { $mobileStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['float']['mobile'] ) ) { $mobileStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clear']['mobile'] ) ) { $mobileStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['mobile'] ) ) { $mobileStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['mobile'] ) ) { $mobileStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation']['mobile'] ) ) { $mobileStyles .= 'animation-name:' . $block['attrs']['responsiveStyles']['animation']['mobile'] . ';animation-fill-mode:both;animation-duration:1s;animation-delay:0s;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['mobile'] ) ) { $mobileStyles .= 'animation-duration:' . $block['attrs']['responsiveStyles']['animation_duration']['mobile'] . 's;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['mobile'] ) ) { $mobileStyles .= 'animation-delay:' . $block['attrs']['responsiveStyles']['animation_delay']['mobile'] . 's;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['mobile'] ) ) { $mobileStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['mobile'] ) ) { $mobileStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['mobile'] ) ) { $mobileStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['mobile'] ) ) { $mobileStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['mobile'] ) ) { $mobileStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['mobile'] ) ) { $mobileStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['mobile'] ) ) {
            $position = $block['attrs']['responsiveStyles']['position']['mobile'];
            if ( is_string( $position ) ) { $mobileStyles .= 'position:' . $position . ';'; }
            elseif ( is_array( $position ) ) {
                if ( ! empty( $position['top'] ) ) { $mobileStyles .= 'top:' . $position['top'] . ';'; }
                if ( ! empty( $position['left'] ) ) { $mobileStyles .= 'left:' . $position['left'] . ';'; }
                if ( ! empty( $position['right'] ) ) { $mobileStyles .= 'right:' . $position['right'] . ';'; }
                if ( ! empty( $position['bottom'] ) ) { $mobileStyles .= 'bottom:' . $position['bottom'] . ';'; }
            }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['mobile'] ) ) { $mobileStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['mobile'] ) ) { $mobileStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['mobile'] ) ) { $mobileStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['mobile'] ) ) { $wrap_value_m = $block['attrs']['responsiveStyles']['flexWrap']['mobile']; if ( isset($block['blockName']) && $block['blockName'] === 'core/columns' ) { $mobileStyles .= 'flex-wrap:' . $wrap_value_m . ' !important;'; } else { $mobileStyles .= 'flex-wrap:' . $wrap_value_m . ';'; } }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['mobile'] ) ) { $mobileStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['mobile'] ) ) { $mobileStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['mobile'] ) ) { $mobileStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['mobile'] ) ) { $mobileStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['mobile'] ) ) { $mobileStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['mobile'] ) ) { $mobileStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['mobile'] ) ) { $mobileStyles .= 'grid-template-columns:repeat(' . $block['attrs']['responsiveStyles']['grid_template_columns']['mobile'] . ', 1fr);'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderStyle']['mobile'] ) ) {
            $borderStyle = $block['attrs']['responsiveStyles']['borderStyle']['mobile'];
            if (is_array($borderStyle)) {
                if (!empty($borderStyle['top'])) $mobileStyles .= 'border-top-style:' . $borderStyle['top'] . ';';
                if (!empty($borderStyle['right'])) $mobileStyles .= 'border-right-style:' . $borderStyle['right'] . ';';
                if (!empty($borderStyle['bottom'])) $mobileStyles .= 'border-bottom-style:' . $borderStyle['bottom'] . ';';
                if (!empty($borderStyle['left'])) $mobileStyles .= 'border-left-style:' . $borderStyle['left'] . ';';
            } else { $mobileStyles .= 'border-style:' . $borderStyle . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderColor']['mobile'] ) ) {
            $borderColor = $block['attrs']['responsiveStyles']['borderColor']['mobile'];
            if (is_array($borderColor)) {
                if (!empty($borderColor['top'])) $mobileStyles .= 'border-top-color:' . $borderColor['top'] . ';';
                if (!empty($borderColor['right'])) $mobileStyles .= 'border-right-color:' . $borderColor['right'] . ';';
                if (!empty($borderColor['bottom'])) $mobileStyles .= 'border-bottom-color:' . $borderColor['bottom'] . ';';
                if (!empty($borderColor['left'])) $mobileStyles .= 'border-left-color:' . $borderColor['left'] . ';';
            } else { $mobileStyles .= 'border-color:' . $borderColor . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderWidth']['mobile'] ) ) {
            $borderWidth = $block['attrs']['responsiveStyles']['borderWidth']['mobile'];
            if (is_array($borderWidth)) {
                if (!empty($borderWidth['top'])) $mobileStyles .= 'border-top-width:' . $borderWidth['top'] . ';';
                if (!empty($borderWidth['right'])) $mobileStyles .= 'border-right-width:' . $borderWidth['right'] . ';';
                if (!empty($borderWidth['bottom'])) $mobileStyles .= 'border-bottom-width:' . $borderWidth['bottom'] . ';';
                if (!empty($borderWidth['left'])) $mobileStyles .= 'border-left-width:' . $borderWidth['left'] . ';';
            } else { $mobileStyles .= 'border-width:' . $borderWidth . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['opacity']['mobile'] ) ) { $mobileStyles .= 'opacity:' . $block['attrs']['responsiveStyles']['opacity']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['transform']['mobile'] ) ) { $mobileStyles .= 'transform:' . $block['attrs']['responsiveStyles']['transform']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['transition']['mobile'] ) ) { $mobileStyles .= 'transition:' . $block['attrs']['responsiveStyles']['transition']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['mobile'] ) ) { $v = stepfox_sanitize_css_box_shadow($block['attrs']['responsiveStyles']['box_shadow']['mobile']); if ($v !== '') { $mobileStyles .= 'box-shadow:' . $v . ';'; } }
        if ( ! empty( $block['attrs']['responsiveStyles']['filter']['mobile'] ) ) { $mobileStyles .= 'filter:' . $block['attrs']['responsiveStyles']['filter']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clip_path']['mobile'] ) ) { $mobileStyles .= 'clip-path:' . $block['attrs']['responsiveStyles']['clip_path']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['backdrop_filter']['mobile'] ) ) { $mobileStyles .= 'backdrop-filter:' . $block['attrs']['responsiveStyles']['backdrop_filter']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['cursor']['mobile'] ) ) { $mobileStyles .= 'cursor:' . $block['attrs']['responsiveStyles']['cursor']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['user_select']['mobile'] ) ) { $mobileStyles .= 'user-select:' . $block['attrs']['responsiveStyles']['user_select']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['gap']['mobile'] ) ) {
            $gap_val = $block['attrs']['responsiveStyles']['gap']['mobile'];
            if ( is_array( $gap_val ) ) { $gap_row = isset( $gap_val['row'] ) ? stepfox_decode_css_var( $gap_val['row'] ) : ''; $gap_col = isset( $gap_val['column'] ) ? stepfox_decode_css_var( $gap_val['column'] ) : ''; $gap_css = trim( $gap_row . ' ' . $gap_col ); }
            else { $gap_css = stepfox_decode_css_var( $gap_val ); }
            if ( $gap_css !== '' ) { $mobileStyles .= 'gap:' . $gap_css . ';'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_fit']['mobile'] ) ) { $mobileStyles .= 'object-fit:' . $block['attrs']['responsiveStyles']['object_fit']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['object_position']['mobile'] ) ) { $mobileStyles .= 'object-position:' . $block['attrs']['responsiveStyles']['object_position']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['pointer_events']['mobile'] ) ) { $mobileStyles .= 'pointer-events:' . $block['attrs']['responsiveStyles']['pointer_events']['mobile'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['top'] ) ) { $mobileStyles .= 'padding-top:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['mobile']['top']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['right'] ) ) { $mobileStyles .= 'padding-right:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['mobile']['right']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['bottom'] ) ) { $mobileStyles .= 'padding-bottom:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['mobile']['bottom']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['padding']['mobile']['left'] ) ) { $mobileStyles .= 'padding-left:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['padding']['mobile']['left']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['top'] ) ) { $mobileStyles .= 'margin-top:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['mobile']['top']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['right'] ) ) { $mobileStyles .= 'margin-right:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['mobile']['right']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['bottom'] ) ) { $mobileStyles .= 'margin-bottom:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['mobile']['bottom']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['margin']['mobile']['left'] ) ) { $mobileStyles .= 'margin-left:' . stepfox_decode_css_var($block['attrs']['responsiveStyles']['margin']['mobile']['left']) . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topLeft'] ) ) { $mobileStyles .= 'border-top-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topLeft'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topRight'] ) ) { $mobileStyles .= 'border-top-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['topRight'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomLeft'] ) ) { $mobileStyles .= 'border-bottom-left-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomLeft'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomRight'] ) ) { $mobileStyles .= 'border-bottom-right-radius:' . $block['attrs']['responsiveStyles']['borderRadius']['mobile']['bottomRight'] . ';'; }
        if (!empty($mobileStyles)) { $inlineStyles .= '@media screen and (max-width: 768px){ ' . $baseSelector . '{' . $mobileStyles . '} }'; }

        $hoverStyles = '';
        if ( ! empty( $block['attrs']['responsiveStyles']['font_size']['hover'] ) ) { $hoverStyles .= 'font-size:' . $block['attrs']['responsiveStyles']['font_size']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['line_height']['hover'] ) ) { $hoverStyles .= 'line-height:' . $block['attrs']['responsiveStyles']['line_height']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['letter_spacing']['hover'] ) ) { $hoverStyles .= 'letter-spacing:' . $block['attrs']['responsiveStyles']['letter_spacing']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['word_spacing']['hover'] ) ) { $hoverStyles .= 'word-spacing:' . $block['attrs']['responsiveStyles']['word_spacing']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['textAlign']['hover'] ) ) { $hoverStyles .= 'text-align:' . $block['attrs']['responsiveStyles']['textAlign']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_weight']['hover'] ) ) { $hoverStyles .= 'font-weight:' . $block['attrs']['responsiveStyles']['font_weight']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['font_style']['hover'] ) ) { $hoverStyles .= 'font-style:' . $block['attrs']['responsiveStyles']['font_style']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_transform']['hover'] ) ) { $hoverStyles .= 'text-transform:' . $block['attrs']['responsiveStyles']['text_transform']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_decoration']['hover'] ) ) { $hoverStyles .= 'text-decoration:' . $block['attrs']['responsiveStyles']['text_decoration']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['text_shadow']['hover'] ) ) { $hoverStyles .= 'text-shadow:' . $block['attrs']['responsiveStyles']['text_shadow']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['color']['hover'] ) ) { $hoverStyles .= 'color:' . $block['attrs']['responsiveStyles']['color']['hover'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_color']['hover'] ) ) {
            if (strpos($block['attrs']['responsiveStyles']['background_color']['hover'], 'gradient') !== false) { $hoverStyles .= 'background:' . $block['attrs']['responsiveStyles']['background_color']['hover'] . ' !important;'; }
            else { $hoverStyles .= 'background-color:' . $block['attrs']['responsiveStyles']['background_color']['hover'] . ' !important;'; }
        }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_image']['hover'] ) ) { $bg_image = $block['attrs']['responsiveStyles']['background_image']['hover']; if (strpos($bg_image, 'url(') !== 0) { $bg_image = 'url(' . $bg_image . ')'; } $hoverStyles .= 'background-image:' . $bg_image . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_size']['hover'] ) ) { $hoverStyles .= 'background-size:' . $block['attrs']['responsiveStyles']['background_size']['hover'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_position']['hover'] ) ) { $hoverStyles .= 'background-position:' . $block['attrs']['responsiveStyles']['background_position']['hover'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['background_repeat']['hover'] ) ) { $hoverStyles .= 'background-repeat:' . $block['attrs']['responsiveStyles']['background_repeat']['hover'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['width']['hover'] ) ) { $width_value = $block['attrs']['responsiveStyles']['width']['hover']; $hoverStyles .= 'width:' . $width_value . ';'; $hoverStyles .= 'flex-basis:' . $width_value . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['height']['hover'] ) ) { $hoverStyles .= 'height:' . $block['attrs']['responsiveStyles']['height']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_width']['hover'] ) ) { $hoverStyles .= 'min-width:' . $block['attrs']['responsiveStyles']['min_width']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_width']['hover'] ) ) { $hoverStyles .= 'max-width:' . $block['attrs']['responsiveStyles']['max_width']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['min_height']['hover'] ) ) { $hoverStyles .= 'min-height:' . $block['attrs']['responsiveStyles']['min_height']['hover'] . ' !important;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['max_height']['hover'] ) ) { $hoverStyles .= 'max-height:' . $block['attrs']['responsiveStyles']['max_height']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_sizing']['hover'] ) ) { $hoverStyles .= 'box-sizing:' . $block['attrs']['responsiveStyles']['box_sizing']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['visibility']['hover'] ) ) { $hoverStyles .= 'visibility:' . $block['attrs']['responsiveStyles']['visibility']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['float']['hover'] ) ) { $hoverStyles .= 'float:' . $block['attrs']['responsiveStyles']['float']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clear']['hover'] ) ) { $hoverStyles .= 'clear:' . $block['attrs']['responsiveStyles']['clear']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['overflow']['hover'] ) ) { $hoverStyles .= 'overflow:' . $block['attrs']['responsiveStyles']['overflow']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['zoom']['hover'] ) ) { $hoverStyles .= 'zoom:' . $block['attrs']['responsiveStyles']['zoom']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['clip_path']['hover'] ) ) { $hoverStyles .= 'clip-path:' . $block['attrs']['responsiveStyles']['clip_path']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['box_shadow']['hover'] ) ) { $v = stepfox_sanitize_css_box_shadow($block['attrs']['responsiveStyles']['box_shadow']['hover']); if ($v !== '') { $hoverStyles .= 'box-shadow:' . $v . ';'; } }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation']['hover'] ) ) { $hoverStyles .= 'animation-name:' . $block['attrs']['responsiveStyles']['animation']['hover'] . ';animation-fill-mode:both;animation-duration:1s;animation-delay:0s;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_duration']['hover'] ) ) { $hoverStyles .= 'animation-duration:' . $block['attrs']['responsiveStyles']['animation_duration']['hover'] . 's;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['animation_delay']['hover'] ) ) { $hoverStyles .= 'animation-delay:' . $block['attrs']['responsiveStyles']['animation_delay']['hover'] . 's;'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['order']['hover'] ) ) { $hoverStyles .= 'order:' . $block['attrs']['responsiveStyles']['order']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['z_index']['hover'] ) ) { $hoverStyles .= 'z-index:' . $block['attrs']['responsiveStyles']['z_index']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['top']['hover'] ) ) { $hoverStyles .= 'top:' . $block['attrs']['responsiveStyles']['top']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['right']['hover'] ) ) { $hoverStyles .= 'right:' . $block['attrs']['responsiveStyles']['right']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['bottom']['hover'] ) ) { $hoverStyles .= 'bottom:' . $block['attrs']['responsiveStyles']['bottom']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['left']['hover'] ) ) { $hoverStyles .= 'left:' . $block['attrs']['responsiveStyles']['left']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['position']['hover'] ) ) { $hoverStyles .= 'position:' . $block['attrs']['responsiveStyles']['position']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['display']['hover'] ) ) { $hoverStyles .= 'display:' . $block['attrs']['responsiveStyles']['display']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_direction']['hover'] ) ) { $hoverStyles .= 'flex-direction:' . $block['attrs']['responsiveStyles']['flex_direction']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify']['hover'] ) ) { $hoverStyles .= 'justify-content:' . $block['attrs']['responsiveStyles']['justify']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flexWrap']['hover'] ) ) { $hoverStyles .= 'flex-wrap:' . $block['attrs']['responsiveStyles']['flexWrap']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_grow']['hover'] ) ) { $hoverStyles .= 'flex-grow:' . $block['attrs']['responsiveStyles']['flex_grow']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['flex_shrink']['hover'] ) ) { $hoverStyles .= 'flex-shrink:' . $block['attrs']['responsiveStyles']['flex_shrink']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_items']['hover'] ) ) { $hoverStyles .= 'align-items:' . $block['attrs']['responsiveStyles']['align_items']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_self']['hover'] ) ) { $hoverStyles .= 'align-self:' . $block['attrs']['responsiveStyles']['align_self']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['justify_self']['hover'] ) ) { $hoverStyles .= 'justify-self:' . $block['attrs']['responsiveStyles']['justify_self']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['align_content']['hover'] ) ) { $hoverStyles .= 'align-content:' . $block['attrs']['responsiveStyles']['align_content']['hover'] . ';'; }
        if ( ! empty( $block['attrs']['responsiveStyles']['grid_template_columns']['hover'] ) ) { $hoverStyles .= 'grid-template-columns:repeat(' . $block['attrs']['responsiveStyles']['grid_template_columns']['hover'] . ', 1fr);'; }
        if (!empty($hoverStyles)) { $inlineStyles .= $baseSelector . ':hover{' . $hoverStyles . '}'; }

        if ( get_option('stepfox_looks_allow_raw_css', false) && ! empty( $block['attrs']['custom_css'] ) ) {
            $raw_css = (string) $block['attrs']['custom_css'];
            $raw_css = trim($raw_css);
            if ($raw_css !== '') {
                if (strpos($raw_css, 'this_block') !== false) {
                    $inlineStyles .= stepfox_process_custom_css($raw_css, $baseSelector);
                } else {
                    if (substr($raw_css, -1) !== ';') { $raw_css .= ';'; }
                    $inlineStyles .= $baseSelector . '{' . $raw_css . '}';
                }
            }
        }

        return $inlineStyles;
    }

    return $block_content ?? '';
}


