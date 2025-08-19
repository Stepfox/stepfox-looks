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

        /** @var string|null Absolute path to the last selected source directory */
        private static $last_source_dir = null;

        /**
         * Bootstrap hooks
         */
        public static function init() {
            add_filter('pre_set_site_transient_update_plugins', [__CLASS__, 'check_for_update']);
            add_filter('site_transient_update_plugins', [__CLASS__, 'check_for_update']);
            add_filter('plugins_api', [__CLASS__, 'plugins_api'], 10, 3);
            add_filter('upgrader_source_selection', [__CLASS__, 'fix_github_zip_folder'], 10, 4);
            // Accept default arg count; WP passes only the $options array here
            add_filter('upgrader_package_options', [__CLASS__, 'ensure_clear_destination']);
            add_filter('upgrader_install_package_result', [__CLASS__, 'log_install_result'], 10, 2);
            add_action('upgrader_pre_install', [__CLASS__, 'log_pre_install'], 10, 2);
            add_action('upgrader_post_install', [__CLASS__, 'log_post_install'], 10, 3);

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
            // Be conservative: only attempt to fix when this package appears to be our plugin
            $source_basename = basename($source);
            $plugin_dir_name = 'stepfox-looks';

            self::debug_log('fix_github_zip_folder: source=' . $source . ' basename=' . $source_basename);

            $source_has_plugin_main = file_exists(trailingslashit($source) . 'stepfox-looks.php');
            $source_has_nested_plugin = is_dir(trailingslashit($source) . $plugin_dir_name) && file_exists(trailingslashit($source) . $plugin_dir_name . '/stepfox-looks.php');

            // If the plugin is nested one level deeper, point the upgrader to that directory
            if ($source_has_nested_plugin) {
                self::debug_log('fix_github_zip_folder: returning nested path ' . trailingslashit($source) . $plugin_dir_name);
                $fixed = trailingslashit($source) . $plugin_dir_name;
                self::$last_source_dir = $fixed;
                return $fixed;
            }

            // If the plugin appears at the root of the extracted folder but the folder name doesn't match, rename it
            if ($source_has_plugin_main && $source_basename !== $plugin_dir_name) {
                $new_source = trailingslashit(dirname($source)) . $plugin_dir_name;
                if (is_dir($new_source)) {
                    self::rrmdir($new_source);
                }
                if (!@rename($source, $new_source)) {
                    self::debug_log('fix_github_zip_folder: rename failed; attempting copy to ' . $new_source);
                    // If rename fails (e.g. cross-filesystem), copy contents
                    @mkdir($new_source, 0755, true);
                    self::rcopy($source, $new_source);
                    self::rrmdir($source);
                }
                $final = is_dir($new_source) ? $new_source : $source;
                self::debug_log('fix_github_zip_folder: using new source ' . $final);
                self::$last_source_dir = $final;
                return $final; // fallback
            }

            // Fallback: if the folder name includes the repo name (e.g., -main/-master), rename it
            if (strpos($source_basename, self::REPO_NAME) !== false && $source_basename !== $plugin_dir_name) {
                $new_source = trailingslashit(dirname($source)) . $plugin_dir_name;
                if (is_dir($new_source)) {
                    self::rrmdir($new_source);
                }
                if (!@rename($source, $new_source)) {
                    self::debug_log('fix_github_zip_folder: fallback rename failed; attempting copy to ' . $new_source);
                    @mkdir($new_source, 0755, true);
                    self::rcopy($source, $new_source);
                    self::rrmdir($source);
                }
                $final = is_dir($new_source) ? $new_source : $source;
                self::debug_log('fix_github_zip_folder: using fallback new source ' . $final);
                self::$last_source_dir = $final;
                return $final; // fallback
            }

            self::debug_log('fix_github_zip_folder: returning original source ' . $source);
            self::$last_source_dir = $source;
            return $source;
        }

        /**
         * Recursively delete a directory (best-effort, suppresses errors)
         */
        private static function rrmdir($dir) {
            if (!is_dir($dir)) {
                return;
            }
            $items = scandir($dir);
            if ($items === false) { return; }
            foreach ($items as $item) {
                if ($item === '.' || $item === '..') { continue; }
                $path = $dir . DIRECTORY_SEPARATOR . $item;
                if (is_dir($path)) {
                    self::rrmdir($path);
                } else {
                    @unlink($path);
                }
            }
            @rmdir($dir);
        }

        /**
         * Recursively copy a directory (best-effort)
         */
        private static function rcopy($src, $dst) {
            if (is_file($src)) {
                @copy($src, $dst);
                return;
            }
            if (!is_dir($src)) { return; }
            if (!is_dir($dst)) { @mkdir($dst, 0755, true); }
            $items = scandir($src);
            if ($items === false) { return; }
            foreach ($items as $item) {
                if ($item === '.' || $item === '..') { continue; }
                $from = $src . DIRECTORY_SEPARATOR . $item;
                $to   = $dst . DIRECTORY_SEPARATOR . $item;
                if (is_dir($from)) {
                    self::rcopy($from, $to);
                } else {
                    @copy($from, $to);
                }
            }
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
            // Use codeload direct ZIP for reliability
            return 'https://codeload.github.com/' . self::REPO_OWNER . '/' . self::REPO_NAME . '/zip/refs/heads/' . self::BRANCH;
        }

        // Optional: basic debug logging during upgrade to help diagnose folder issues
        public static function debug_log($message) {
            // Log regardless of WP_DEBUG to aid troubleshooting during updates
            error_log('[Stepfox Looks Updater] ' . (is_string($message) ? $message : wp_json_encode($message)));
        }

        /**
         * Log install result and important hooks to help diagnose failures
         */
        public static function log_install_result($result, $hook_extra) {
            if (is_wp_error($result)) {
                self::debug_log('install_package_result: WP_Error ' . $result->get_error_code() . ' - ' . $result->get_error_message());
                if ($result->get_error_code() === 'incompatible_archive_no_plugins' && self::$last_source_dir && is_dir(self::$last_source_dir)) {
                    // Attempt manual install: copy source dir into plugins directory
                    $destination = trailingslashit(WP_PLUGIN_DIR) . 'stepfox-looks';
                    self::debug_log('manual_install: attempting copy from ' . self::$last_source_dir . ' to ' . $destination);
                    if (is_dir($destination)) { self::rrmdir($destination); }
                    @mkdir($destination, 0755, true);
                    self::rcopy(self::$last_source_dir, $destination);
                    if (file_exists($destination . '/stepfox-looks.php')) {
                        self::debug_log('manual_install: success');
                        return [
                            'source' => self::$last_source_dir,
                            'destination' => $destination,
                            'destination_name' => 'stepfox-looks',
                            'feedback' => 'manual-install',
                        ];
                    }
                    self::debug_log('manual_install: failed - plugin main not found after copy');
                }
            } else {
                self::debug_log('install_package_result: ' . wp_json_encode($result));
            }
            return $result;
        }
        public static function log_pre_install($bool, $hook_extra) {
            self::debug_log('pre_install: ' . wp_json_encode($hook_extra));
            return $bool;
        }
        public static function log_post_install($bool, $hook_extra, $result) {
            self::debug_log('post_install: ' . (is_wp_error($result) ? ('WP_Error ' . $result->get_error_code() . ' - ' . $result->get_error_message()) : wp_json_encode($result)));
            return $bool;
        }

        /**
         * Ensure WP clears the destination when updating this plugin to avoid stale folders.
         *
         * @param array $options
         * @param string $package
         * @return array
         */
        public static function ensure_clear_destination($options) {
            if (!is_array($options)) {
                return $options;
            }

            // Only adjust for our plugin update attempts if possible
            $hook_extra = isset($options['hook_extra']) && is_array($options['hook_extra']) ? $options['hook_extra'] : [];
            $is_our_plugin = false;
            if (isset($hook_extra['plugin'])) {
                $our_basename = plugin_basename(trailingslashit(dirname(dirname(__FILE__))) . 'stepfox-looks.php');
                $is_our_plugin = ($hook_extra['plugin'] === $our_basename);
            }

            if ($is_our_plugin) {
                $options['clear_destination'] = true;
                $options['abort_if_destination_exists'] = false;
                // Force the final destination to be the plugins dir with our folder name
                if (!defined('WP_PLUGIN_DIR')) {
                    // Should be defined, but guard just in case
                    $plugins_dir = trailingslashit(WP_CONTENT_DIR) . 'plugins';
                } else {
                    $plugins_dir = WP_PLUGIN_DIR;
                }
                $options['destination']      = $plugins_dir;
                $options['destination_name'] = 'stepfox-looks';
                self::debug_log('ensure_clear_destination options=' . wp_json_encode($options));
            }

            return $options;
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


