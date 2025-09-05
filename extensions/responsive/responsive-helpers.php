<?php
/**
 * Responsive Helpers and Sanitizers
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

/**
 * Check if cache is enabled in admin settings
 * @return bool
 */
function stepfox_is_cache_enabled() {
    return get_option('stepfox_looks_cache_enabled', false);
}

function stepfox_search($array, $key)
{
    $results = array();

    if ( is_array( $array ) ) {
        if ( isset( $array[$key] ) ) {
            $results[] = $array;
        }
        foreach ( $array as $subarray ) {
            $results = array_merge( $results, stepfox_search( $subarray, $key ) );
        }
    }

    return $results;
}

/**
 * Process custom CSS/JS with smart this_block replacement
 * @param string $custom_css
 * @param string $block_selector
 * @return string
 */
function stepfox_process_custom_css($custom_css, $block_selector) {
    if (empty($custom_css) || !is_string($custom_css)) {
        return '';
    }
    if (strpos($custom_css, 'this_block') === false) {
        return $custom_css;
    }
    return str_replace('this_block', $block_selector, $custom_css);
}

/**
 * Sanitize custom CSS declarations and return a safe declarations string.
 * See original docs in legacy file.
 */
function stepfox_sanitize_custom_css_declarations($custom_css) {
    if (!is_string($custom_css) || $custom_css === '') {
        return '';
    }

    $css = preg_replace('#/\*.*?\*/#s', '', $custom_css);
    $css = trim($css);

    if (preg_match('/[{}@]/', $css)) {
        return '';
    }

    $css = preg_replace('/;{2,}/', ';', $css);

    $safe_declarations = array();
    $parts = array_filter(array_map('trim', explode(';', $css)));

    foreach ($parts as $part) {
        $pair = array_map('trim', explode(':', $part, 2));
        if (count($pair) !== 2) {
            continue;
        }
        list($property, $value) = $pair;

        $property = strtolower($property);

        $is_css_var = (bool) preg_match('/^--[a-z0-9\-]+$/', $property);
        $is_allowed_property = $is_css_var || (bool) preg_match(
            '/^(background|background-color|background-image|background-position|background-repeat|background-size|'
            . 'border|border-(top|right|bottom|left)(-color|-width|-style)?|border-radius|box-shadow|box-sizing|color|'
            . 'display|flex|flex-(basis|direction|wrap|grow|shrink)|align-(items|self|content)|justify-content|float|clear|gap|'
            . 'grid-(template-columns|template-rows|auto-columns|auto-rows|auto-flow|column-gap|row-gap)|height|max-height|min-height|'
            . 'letter-spacing|line-height|margin|margin-(top|right|bottom|left)|opacity|overflow|padding|padding-(top|right|bottom|left)|'
            . 'position|left|right|top|bottom|text-(align|decoration|shadow|transform)|transform|transition|visibility|white-space|'
            . 'word-spacing|z-index|font-(size|style|weight)|animation|animation-(name|duration|delay|timing-function|iteration-count|direction|fill-mode|play-state))$/',
            $property
        );

        if (!$is_allowed_property) {
            continue;
        }

        $value_lc = strtolower($value);
        if (
            strpos($value_lc, 'javascript:') !== false ||
            strpos($value_lc, 'expression') !== false ||
            preg_match('/url\s*\(/i', $value_lc)
        ) {
            continue;
        }

        $value = preg_replace('/[{}]/', '', $value);
        $value = preg_replace('/[^#%(),.\/:;?@\[\]_\-\s\+\*!\'"0-9A-Za-z]/u', '', $value);

        if (strlen($value) > 300) {
            $value = substr($value, 0, 300);
        }

        if ($value === '') {
            continue;
        }

        $safe_declarations[] = $property . ':' . $value;
    }

    return empty($safe_declarations) ? '' : implode(';', $safe_declarations) . ';';
}

function stepfox_get_template_parts_as_content($block) {
    if (!is_array($block) || !isset($block['blockName'])) {
        return '';
    }
    $template_parts_content = '';
    if ( $block['blockName'] == 'core/template-part' && isset($block['attrs']) ) {
        $theme = isset($block['attrs']['theme']) ? $block['attrs']['theme'] : '';
        $slug = isset($block['attrs']['slug']) ? $block['attrs']['slug'] : '';
        $template_part = get_block_template( $theme . '//' . $slug, 'wp_template_part' );
        if ( $template_part && isset($template_part->content) ) {
            $template_part_content = $template_part->content;
            $template_blocks = parse_blocks( $template_part_content );
            $all_template_blocks = stepfox_search( $template_blocks, 'blockName' );
            $template_parts_content .= $template_part_content;
            foreach ( $all_template_blocks as $template_block ) {
                if ( $template_block['blockName'] == 'core/template-part' && isset($template_block['attrs']) ) {
                    $theme = isset($template_block['attrs']['theme']) ? $template_block['attrs']['theme'] : '';
                    $slug = isset($template_block['attrs']['slug']) ? $template_block['attrs']['slug'] : '';
                    $template_part_1 = get_block_template( $theme . '//' . $slug, 'wp_template_part' );
                    if ( $template_part_1 && isset($template_part_1->content) ) {
                        $template_part_content_1 = $template_part_1->content;
                        $template_parts_content .= $template_part_content_1;
                    }
                }
            }
        }
    }
    return $template_parts_content;
}

function stepfox_decode_css_var( $input ) {
    if ( empty($input) || !is_string($input) ) {
        return $input;
    }
    if ( strpos( $input, 'var:' ) === 0 ) {
        $trimmed = substr( $input, 4 );
        $variable_part = str_replace( '|', '--', $trimmed );
        return 'var(--wp--' . $variable_part . ')';
    }
    return $input;
}

if (!function_exists('stepfox_is_css_var')) {
function stepfox_is_css_var($value) {
    return is_string($value) && preg_match('/^var\(--[a-zA-Z0-9_-]+\)$/', $value);
}
}

if (!function_exists('stepfox_sanitize_css_color')) {
function stepfox_sanitize_css_color($value) {
    if (!is_string($value) || $value === '') return '';
    $value = trim($value);
    if (stepfox_is_css_var($value)) return $value;
    $hex = sanitize_hex_color($value);
    if ($hex) return $hex;
    if (preg_match('/^(rgb|rgba|hsl|hsla)\(\s*[-0-9.,\s%\/]+\)$/i', $value)) return $value;
    return '';
}
}

if (!function_exists('stepfox_sanitize_css_length')) {
function stepfox_sanitize_css_length($value) {
    if (!is_string($value) && !is_numeric($value)) return '';
    $value = trim((string)$value);
    if (stepfox_is_css_var($value)) return $value;
    if (preg_match('/^(?:\d+(?:\.\d+)?)(px|em|rem|vh|vw|%)$/', $value)) return $value;
    return '';
}
}

if (!function_exists('stepfox_sanitize_css_line_height')) {
function stepfox_sanitize_css_line_height($value) {
    if (!is_string($value) && !is_numeric($value)) return '';
    $value = trim((string)$value);
    if (stepfox_is_css_var($value)) return $value;
    if (preg_match('/^(?:\d+(?:\.\d+)?)(px|em|rem|%)$/', $value)) return $value;
    if (preg_match('/^\d+(?:\.\d+)?$/', $value)) return $value; // unitless
    return '';
}
}

if (!function_exists('stepfox_sanitize_css_url_value')) {
function stepfox_sanitize_css_url_value($url) {
    $url = esc_url_raw($url);
    if (!$url) return '';
    return "url('" . $url . "')";
}
}

if (!function_exists('stepfox_sanitize_css_keyword')) {
function stepfox_sanitize_css_keyword($value, $allowed) {
    if (!is_string($value)) return '';
    $value = strtolower(trim($value));
    return in_array($value, $allowed, true) ? $value : '';
}
}

if (!function_exists('stepfox_sanitize_css_background_value')) {
function stepfox_sanitize_css_background_value($value) {
    if (!is_string($value) || $value === '') return '';
    $value = trim($value);
    if (stepfox_is_css_var($value)) return $value;
    if (preg_match('/^(?:linear-gradient|radial-gradient)\([^\n\r\)]+\)$/i', $value)) return $value;
    return '';
}
}

if (!function_exists('stepfox_sanitize_css_box_shadow')) {
function stepfox_sanitize_css_box_shadow($value) {
    if (!is_string($value) || $value === '') return '';
    $value = trim($value);
    if (stepfox_is_css_var($value)) return $value;
    // Support multiple comma-separated shadows, while preserving commas inside color functions like rgba()
    $parts = preg_split('/,(?![^()]*\))/', $value);
    $sanitized_parts = array();
    foreach ($parts as $part) {
        $shadow = trim($part);
        if ($shadow === '') { continue; }
        if (preg_match('/^[a-zA-Z\s]*?(inset\s+)?[0-9.\s-]+(?:px|em|rem|%)?(\s+[0-9.\s-]+(?:px|em|rem|%)?){0,3}(\s+(?:rgb|rgba|hsl|hsla)\([0-9.,%\s\/]+\)|\s+#[0-9a-fA-F]{3,8}|\s+var\(--[\w-]+\))?$/', $shadow)) {
            $sanitized_parts[] = $shadow;
        } else {
            // If any part is invalid, skip it to avoid breaking the whole declaration
            continue;
        }
    }
    if (!empty($sanitized_parts)) {
        return implode(', ', $sanitized_parts);
    }
    return '';
}
}


