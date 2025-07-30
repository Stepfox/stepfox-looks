<?php
/**
 * Extensions Registration
 * Loads all theme extensions with security checks
 * 
 * @package stepfox
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Load extensions with security checks
$extensions = array(
    '/extensions/cover-block-extension/cover-block-extension.php',
    '/extensions/responsive/responsive.php',
    '/extensions/post-template-fallback/post-template-fallback.php',
    '/extensions/social-share/social-share.php'
);

foreach ($extensions as $extension) {
    $extension_path = STEPFOX_LOOKS_PATH . ltrim($extension, '/');
    if (file_exists($extension_path)) {
        require_once $extension_path;
    }
}