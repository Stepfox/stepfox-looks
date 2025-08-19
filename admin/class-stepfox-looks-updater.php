<?php
/**
 * Lightweight GitHub updater for Stepfox Looks
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('Stepfox_Looks_Updater')) {
    class Stepfox_Looks_Updater {
        /** @var string */
        private const REPO_OWNER = 'Stepfox';
        /** @var string */
        private const REPO_NAME  = 'stepfox-looks';
        /** @var string */
        private const BRANCH     = 'main';

        /**
         * Bootstrap hooks
         */
        public static function init() {
            add_filter('pre_set_site_transient_update_plugins', [__CLASS__, 'check_for_update']);
            add_filter('site_transient_update_plugins', [__CLASS__, 'check_for_update']);
            add_filter('plugins_api', [__CLASS__, 'plugins_api'], 10, 3);
            add_filter('upgrader_source_selection', [__CLASS__, 'fix_github_zip_folder'], 10, 4);

            // Bust cache when user clicks "Check again" or visits Plugins screen with force-check
            add_action('load-update-core.php', [__CLASS__, 'maybe_bust_cache']);
            add_action('load-plugins.php', [__CLASS__, 'maybe_bust_cache']);
        }

        /**
         * Check GitHub for a newer version and inject into the update transient
         *
         * @param object $transient
         * @return object
         */
        public static function check_for_update($transient) {
            if (empty($transient) || !is_object($transient)) {
                return $transient;
            }

            $plugin_file   = trailingslashit(dirname(dirname(__FILE__))) . 'stepfox-looks.php';
            $plugin_basename = plugin_basename($plugin_file);
            $current_version = defined('STEPFOX_LOOKS_VERSION') ? STEPFOX_LOOKS_VERSION : self::read_local_version($plugin_file);

            $remote_version = self::get_remote_version();
            if (!$remote_version) {
                return $transient;
            }

            if (version_compare($remote_version, $current_version, '>')) {
                $update              = new stdClass();
                $update->slug        = 'stepfox-looks';
                $update->plugin      = $plugin_basename;
                $update->new_version = $remote_version;
                $update->url         = 'https://github.com/' . self::REPO_OWNER . '/' . self::REPO_NAME;
                $update->package     = self::get_download_zip_url();

                $transient->response[$plugin_basename] = $update;
            }

            return $transient;
        }

        /**
         * Provide details for the plugins API modal.
         *
         * @param mixed  $result
         * @param string $action
         * @param object $args
         * @return mixed
         */
        public static function plugins_api($result, $action, $args) {
            if ($action !== 'plugin_information' || empty($args) || empty($args->slug) || $args->slug !== 'stepfox-looks') {
                return $result;
            }

            $remote_version = self::get_remote_version();
            $sections       = self::get_remote_sections();

            $info = new stdClass();
            $info->name          = 'Stepfox Looks';
            $info->slug          = 'stepfox-looks';
            $info->version       = $remote_version ?: (defined('STEPFOX_LOOKS_VERSION') ? STEPFOX_LOOKS_VERSION : '1.0.0');
            $info->requires      = '6.0';
            $info->tested        = '6.7';
            $info->requires_php  = '7.4';
            $info->author        = '<a href="https://stepfoxthemes.com">Stepfox</a>';
            $info->homepage      = 'https://github.com/' . self::REPO_OWNER . '/' . self::REPO_NAME;
            $info->download_link = self::get_download_zip_url();
            $info->sections      = $sections;

            return $info;
        }

        /**
         * When installing from a GitHub ZIP, the directory is usually suffixed with -main/-master.
         * Rename it to the existing plugin directory so WP replaces the plugin instead of installing a sibling.
         */
        public static function fix_github_zip_folder($source, $remote_source, $upgrader, $hook_extra) {
            if (empty($hook_extra['plugin'])) {
                return $source;
            }

            $our_basename = plugin_basename(trailingslashit(dirname(dirname(__FILE__))) . 'stepfox-looks.php');
            if ($hook_extra['plugin'] !== $our_basename) {
                return $source;
            }

            $source_basename = basename($source);
            // Only act if the source dir contains our repo name but not the exact plugin folder name
            if (strpos($source_basename, self::REPO_NAME) !== false && $source_basename !== 'stepfox-looks') {
                $new_source = trailingslashit(dirname($source)) . 'stepfox-looks';
                // Suppress errors; WP will handle failures
                @rename($source, $new_source);
                return $new_source;
            }

            return $source;
        }

        /**
         * Fetch remote plugin version by reading the plugin header from GitHub main branch.
         *
         * @return string|null
         */
        private static function get_remote_version() {
            $cache_key = 'stepfox_looks_remote_version';
            $cached    = get_site_transient($cache_key);
            if (!self::is_force_check() && is_string($cached) && $cached !== '') {
                return $cached;
            }

            $candidates = [
                // Common: plugin file at repo root
                'https://raw.githubusercontent.com/' . self::REPO_OWNER . '/' . self::REPO_NAME . '/' . self::BRANCH . '/stepfox-looks.php',
                // Fallback: plugin directory nested within repo root
                'https://raw.githubusercontent.com/' . self::REPO_OWNER . '/' . self::REPO_NAME . '/' . self::BRANCH . '/stepfox-looks/stepfox-looks.php',
            ];

            $body = null;
            foreach ($candidates as $raw_url) {
                $response = wp_remote_get($raw_url, [
                'timeout'    => 10,
                'user-agent' => 'WordPress/' . get_bloginfo('version') . '; ' . home_url('/'),
                ]);
                if (is_wp_error($response)) {
                    continue;
                }
                if (wp_remote_retrieve_response_code($response) !== 200) {
                    continue;
                }
                $tmp = wp_remote_retrieve_body($response);
                if (is_string($tmp) && $tmp !== '') {
                    $body = $tmp;
                    break;
                }
            }

            if (!is_string($body) || $body === '') {
                return null;
            }

            // Try to extract the Version header first
            if (preg_match('/^\s*\*\s*Version:\s*([^\r\n]+)/mi', $body, $m)) {
                $version = trim($m[1]);
            } elseif (preg_match("/define\s*\(\s*'STEPFOX_LOOKS_VERSION'\s*,\s*'([^']+)'\s*\)/", $body, $m)) {
                $version = trim($m[1]);
            } else {
                $version = null;
            }

            if ($version) {
                // Cache briefly; force-checks bypass cache
                set_site_transient($cache_key, $version, 5 * MINUTE_IN_SECONDS);
            }

            return $version;
        }

        /**
         * Read local plugin header version as a fallback
         */
        private static function read_local_version($plugin_file) {
            $data = get_file_data($plugin_file, ['Version' => 'Version']);
            if (!empty($data['Version'])) {
                return $data['Version'];
            }
            return '0.0.0';
        }

        /**
         * Minimal sections for the plugin modal pulled from readme if available
         *
         * @return array
         */
        private static function get_remote_sections() {
            $sections = [
                'description' => 'Comprehensive block editor enhancements and responsive controls for Stepfox themes.',
            ];

            $readme_raw = 'https://raw.githubusercontent.com/' . self::REPO_OWNER . '/' . self::REPO_NAME . '/' . self::BRANCH . '/readme.txt';
            $response = wp_remote_get($readme_raw, [
                'timeout'    => 10,
                'user-agent' => 'WordPress/' . get_bloginfo('version') . '; ' . home_url('/'),
            ]);

            if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
                $body = (string) wp_remote_retrieve_body($response);
                if ($body) {
                    // Very light parsing: use entire readme as description if found
                    $sections['description'] = wp_kses_post(wpautop($body));
                }
            }

            return $sections;
        }

        /**
         * Get the download URL for the GitHub branch ZIP
         */
        private static function get_download_zip_url() {
            return 'https://github.com/' . self::REPO_OWNER . '/' . self::REPO_NAME . '/archive/refs/heads/' . self::BRANCH . '.zip';
        }

        /**
         * If a force-check is requested, clear our cached remote version.
         */
        public static function maybe_bust_cache() {
            if (self::is_force_check()) {
                delete_site_transient('stepfox_looks_remote_version');
            }
        }

        /**
         * Detect when user forced an update check.
         */
        private static function is_force_check() {
            return (is_admin() && isset($_GET['force-check'])) || (defined('WP_CLI') && WP_CLI);
        }
    }
}


