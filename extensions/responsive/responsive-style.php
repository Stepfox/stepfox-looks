<?php
/**
 * Responsive Style Loader (modular)
 * Loads split modules for helpers, attributes, DOM, styles, cache, and editor.
 * @package stepfox-looks
 */

// Prevent direct access
if (!defined('ABSPATH')) { exit; }

$base = trailingslashit( dirname(__FILE__) );

// Load helpers first (shared utilities and sanitizers)
require_once $base . 'responsive-helpers.php';

// Attributes registration
require_once $base . 'responsive-attrs.php';

// DOM wrapping / ID injection
require_once $base . 'responsive-dom.php';

// Inline generation modules
require_once $base . 'responsive-inline-styles.php';
require_once $base . 'responsive-inline-scripts.php';

// Cache, output hooks
require_once $base . 'responsive-cache.php';

// Editor CSS generation
require_once $base . 'responsive-editor.php';

 
