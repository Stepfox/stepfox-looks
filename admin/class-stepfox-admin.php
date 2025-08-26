<?php
/**
 * Admin functionality for Stepfox Looks plugin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class Stepfox_Looks_Admin {

    /**
     * Initialize admin functionality
     */
    public static function init() {
        add_action('admin_menu', [__CLASS__, 'add_admin_menu']);
        add_action('admin_init', [__CLASS__, 'register_settings']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets']);
        add_action('wp_ajax_stepfox_clear_cache', [__CLASS__, 'handle_clear_cache']);
        add_action('wp_ajax_stepfox_clear_single_cache', [__CLASS__, 'handle_clear_single_cache']);
        add_action('wp_ajax_stepfox_remove_demo', [__CLASS__, 'handle_remove_demo']);
    }

    /**
     * Add admin menu
     */
    public static function add_admin_menu() {
        add_options_page(
            __('Stepfox Looks Settings', 'stepfox-looks'),
            __('Stepfox Looks', 'stepfox-looks'),
            'manage_options',
            'stepfox-looks-settings',
            [__CLASS__, 'admin_page']
        );
    }

    /**
     * Register plugin settings
     */
    public static function register_settings() {
        register_setting(
            'stepfox_looks_settings',
            'stepfox_looks_cache_enabled',
            [
                'type' => 'boolean',
                'default' => false,
                'sanitize_callback' => 'rest_sanitize_boolean'
            ]
        );

        register_setting(
            'stepfox_looks_settings',
            'stepfox_looks_allow_raw_css',
            [
                'type' => 'boolean',
                'default' => true,
                'sanitize_callback' => 'rest_sanitize_boolean'
            ]
        );

        register_setting(
            'stepfox_looks_settings',
            'stepfox_looks_allow_frontend_js',
            [
                'type' => 'boolean',
                'default' => true,
                'sanitize_callback' => 'rest_sanitize_boolean'
            ]
        );

        add_settings_section(
            'stepfox_looks_cache_section',
            __('Cache Settings', 'stepfox-looks'),
            [__CLASS__, 'cache_section_callback'],
            'stepfox_looks_settings'
        );

        add_settings_field(
            'stepfox_looks_cache_enabled',
            __('Enable Cache', 'stepfox-looks'),
            [__CLASS__, 'cache_enabled_callback'],
            'stepfox_looks_settings',
            'stepfox_looks_cache_section'
        );

        add_settings_field(
            'stepfox_looks_allow_raw_css',
            __('Allow raw Custom CSS on frontend', 'stepfox-looks'),
            [__CLASS__, 'allow_raw_css_callback'],
            'stepfox_looks_settings',
            'stepfox_looks_cache_section'
        );

        add_settings_field(
            'stepfox_looks_allow_frontend_js',
            __('Allow Custom JS on frontend', 'stepfox-looks'),
            [__CLASS__, 'allow_frontend_js_callback'],
            'stepfox_looks_settings',
            'stepfox_looks_cache_section'
        );
    }

    /**
     * Cache section callback
     */
    public static function cache_section_callback() {
        echo '<p>' . esc_html__('Configure caching settings for improved performance.', 'stepfox-looks') . '</p>';
    }

    /**
     * Cache enabled field callback
     */
    public static function cache_enabled_callback() {
        $cache_enabled = get_option('stepfox_looks_cache_enabled', false);
        ?>
        <label class="stepfox-toggle">
            <input type="checkbox" name="stepfox_looks_cache_enabled" value="1" <?php checked($cache_enabled, true); ?> />
            <span class="stepfox-slider"></span>
        </label>
        <p class="description">
            <?php echo esc_html__('Enable caching for responsive styles to improve page load performance.', 'stepfox-looks'); ?>
        </p>
        <?php
    }

    public static function allow_raw_css_callback() {
        $enabled = get_option('stepfox_looks_allow_raw_css', false);
        ?>
        <label class="stepfox-toggle">
            <input type="checkbox" name="stepfox_looks_allow_raw_css" value="1" <?php checked($enabled, true); ?> />
            <span class="stepfox-slider"></span>
        </label>
        <p class="description">
            <?php echo esc_html__('Allow raw Custom CSS from blocks on the frontend (scoped per block). Recommended OFF for submission.', 'stepfox-looks'); ?>
        </p>
        <?php
    }

    public static function allow_frontend_js_callback() {
        $enabled = get_option('stepfox_looks_allow_frontend_js', false);
        ?>
        <label class="stepfox-toggle">
            <input type="checkbox" name="stepfox_looks_allow_frontend_js" value="1" <?php checked($enabled, true); ?> />
            <span class="stepfox-slider"></span>
        </label>
        <p class="description">
            <?php echo esc_html__('Allow Custom JS from blocks on the frontend. Strongly discouraged for ThemeForest.', 'stepfox-looks'); ?>
        </p>
        <?php
    }

    /**
     * Admin page content
     */
    public static function admin_page() {
        if (isset($_GET['settings-updated'])) {
            add_settings_error(
                'stepfox_looks_messages',
                'stepfox_looks_message',
                __('Settings saved successfully!', 'stepfox-looks'),
                'updated'
            );
        }

        settings_errors('stepfox_looks_messages');
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <div class="stepfox-admin-content">
                <div class="stepfox-main-settings">
                    <form action="options.php" method="post">
                        <?php
                        settings_fields('stepfox_looks_settings');
                        do_settings_sections('stepfox_looks_settings');
                        ?>
                        
                        <div class="stepfox-cache-actions">
                            <h3><?php echo esc_html__('Cache Management', 'stepfox-looks'); ?></h3>
                            <p><?php echo esc_html__('Clear cached styles to force regeneration on next page load.', 'stepfox-looks'); ?></p>
                            
                            <button type="button" id="stepfox-clear-cache" class="button button-secondary">
                                <?php echo esc_html__('Clear All Cache', 'stepfox-looks'); ?>
                            </button>
                            
                            <div id="stepfox-cache-status" style="display: none;">
                                <p class="stepfox-success"><?php echo esc_html__('Cache cleared successfully!', 'stepfox-looks'); ?></p>
                            </div>
                            
                            <!-- Current Cache List -->
                            <div class="stepfox-current-cache">
                                <h4><?php echo esc_html__('Current Cache Entries', 'stepfox-looks'); ?></h4>
                                <?php self::display_current_cache(); ?>
                            </div>
                            <hr />
                            <h3><?php echo esc_html__('Demo Content', 'stepfox-looks'); ?></h3>
                            <p><?php echo esc_html__('Remove demo content imported via the demo importer. Only content flagged as demo will be deleted.', 'stepfox-looks'); ?></p>
                            <button type="button" id="stepfox-remove-demo" class="button button-secondary" style="background:#c72b2b;color:#fff;border-color:#c72b2b;">
                                <?php echo esc_html__('Remove Demo Content', 'stepfox-looks'); ?>
                            </button>
                        </div>

                        <?php submit_button(); ?>
                    </form>
                </div>
                
                <div class="stepfox-sidebar">
                    <div class="stepfox-info-box">
                        <h3><?php echo esc_html__('About Cache', 'stepfox-looks'); ?></h3>
                        <p><?php echo esc_html__('Caching stores generated CSS styles to improve page load times. When enabled, styles are cached for 1 hour.', 'stepfox-looks'); ?></p>
                        <ul>
                            <li><?php echo esc_html__('Frontend cache: 1 hour', 'stepfox-looks'); ?></li>
                            <li><?php echo esc_html__('Editor cache: 30 minutes', 'stepfox-looks'); ?></li>
                        </ul>
                    </div>
                    
                    <div class="stepfox-info-box">
                        <h3><?php echo esc_html__('Plugin Information', 'stepfox-looks'); ?></h3>
                        <p><strong><?php echo esc_html__('Version:', 'stepfox-looks'); ?></strong> <?php echo esc_html( STEPFOX_LOOKS_VERSION ); ?></p>
                        <p><strong><?php echo esc_html__('Author:', 'stepfox-looks'); ?></strong> <?php echo esc_html('Stepfox'); ?></p>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Enqueue admin assets
     */
    public static function enqueue_admin_assets($hook) {
        if ($hook !== 'settings_page_stepfox-looks-settings') {
            return;
        }

        wp_enqueue_script(
            'stepfox-admin-js',
            STEPFOX_LOOKS_URL . 'admin/js/admin.js',
            ['jquery'],
            STEPFOX_LOOKS_VERSION,
            true
        );

        wp_localize_script('stepfox-admin-js', 'stepfoxAdmin', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('stepfox_clear_cache_nonce'),
            'single_nonce' => wp_create_nonce('stepfox_clear_single_cache_nonce'),
            'remove_demo_nonce' => wp_create_nonce('stepfox_remove_demo_nonce'),
            'messages' => [
                'clearing' => __('Clearing cache...', 'stepfox-looks'),
                'cleared' => __('Cache cleared successfully!', 'stepfox-looks'),
                'error' => __('Error clearing cache. Please try again.', 'stepfox-looks'),
                'single_clearing' => __('Clearing...', 'stepfox-looks'),
                'single_cleared' => __('Cache entry cleared!', 'stepfox-looks'),
                'removing_demo' => __('Removing demo content...', 'stepfox-looks'),
                'removed_demo' => __('Demo content removed.', 'stepfox-looks')
            ]
        ]);

        wp_enqueue_style(
            'stepfox-admin-css',
            STEPFOX_LOOKS_URL . 'admin/css/admin.css',
            [],
            STEPFOX_LOOKS_VERSION
        );
    }

    /**
     * Handle demo removal AJAX
     */
    public static function handle_remove_demo() {
        check_ajax_referer('stepfox_remove_demo_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'stepfox-looks'));
        }

        // Prefer precise removal via meta tag set during import
        $slug = get_option('stepfox_demo_last_slug', 'demo');
        $deleted = 0;

        // Delete posts flagged with the demo meta
        $post_types = get_post_types(['public' => true], 'names');
        $post_types[] = 'wp_navigation';
        $post_types[] = 'wp_block';
        $post_types = array_unique($post_types);

        foreach ($post_types as $pt) {
            $q = new WP_Query([
                'post_type'      => $pt,
                'post_status'    => 'any',
                'meta_key'       => '_stepfox_demo',
                'meta_value'     => $slug,
                'posts_per_page' => 500,
                'fields'         => 'ids',
            ]);
            if ($q->have_posts()) {
                foreach ($q->posts as $pid) {
                    if (current_user_can('delete_post', $pid)) {
                        wp_delete_post($pid, true);
                        $deleted++;
                    }
                }
            }
        }

        // Delete terms flagged with the demo meta
        if (function_exists('get_terms')) {
            $taxes = get_taxonomies([], 'names');
            foreach ($taxes as $tax) {
                $terms = get_terms([ 'taxonomy' => $tax, 'hide_empty' => false ]);
                if (is_wp_error($terms)) continue;
                foreach ($terms as $term) {
                    $flag = function_exists('get_term_meta') ? get_term_meta($term->term_id, '_stepfox_demo', true) : '';
                    if ($flag === $slug) {
                        wp_delete_term($term->term_id, $tax);
                    }
                }
            }
        }

        // Clean marker
        delete_option('stepfox_demo_last_import');
        delete_option('stepfox_demo_last_slug');

        wp_send_json_success(['message' => sprintf(__('Removed %d demo items.', 'stepfox-looks'), $deleted)]);
    }

    /**
     * Handle clear cache AJAX request
     */
    public static function handle_clear_cache() {
        check_ajax_referer('stepfox_clear_cache_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'stepfox-looks'));
        }

        // Clear all stepfox-related transients
        self::clear_all_cache();

        wp_send_json_success([
            'message' => __('Cache cleared successfully!', 'stepfox-looks')
        ]);
    }

    /**
     * Clear all plugin cache
     */
    public static function clear_all_cache() {
        global $wpdb;

        // Delete all transients that start with 'stepfox_styles_'
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
                '_transient_stepfox_styles_%',
                '_transient_timeout_stepfox_styles_%'
            )
        );

        // Delete editor cache transients
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
                '_transient_stepfox_editor_styles_%',
                '_transient_timeout_stepfox_editor_styles_%'
            )
        );

        // Clear object cache if available
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }

    /**
     * Check if cache is enabled
     */
    public static function is_cache_enabled() {
        return get_option('stepfox_looks_cache_enabled', false);
    }

    /**
     * Get current cache entries from database
     */
    public static function get_current_cache_entries() {
        global $wpdb;

        // Get all stepfox cache transients
        $cache_entries = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT option_name, option_value FROM {$wpdb->options} 
                WHERE option_name LIKE %s OR option_name LIKE %s 
                ORDER BY option_name",
                '_transient_stepfox_styles_%',
                '_transient_stepfox_editor_styles_%'
            )
        );

        $processed_entries = [];
        
        foreach ($cache_entries as $entry) {
            // Skip timeout entries
            if (strpos($entry->option_name, '_transient_timeout_') !== false) {
                continue;
            }

            $cache_key = str_replace('_transient_', '', $entry->option_name);
            $cache_data = maybe_unserialize($entry->option_value);
            
            // Get the timeout for this cache entry
            $timeout_option = '_transient_timeout_' . $cache_key;
            $timeout = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s",
                    $timeout_option
                )
            );

            $type = strpos($cache_key, 'stepfox_editor_styles_') !== false ? 'Editor' : 'Frontend';
            
            $processed_entries[] = [
                'key' => $cache_key,
                'type' => $type,
                'size' => self::format_bytes(strlen(serialize($cache_data))),
                'created' => isset($cache_data['generated_at']) ? $cache_data['generated_at'] : null,
                'expires' => $timeout ? $timeout : null,
                'css_length' => isset($cache_data['css']) ? strlen($cache_data['css']) : 0,
                'js_length' => isset($cache_data['js']) ? strlen($cache_data['js']) : 0
            ];
        }

        return $processed_entries;
    }

    /**
     * Display current cache entries
     */
    public static function display_current_cache() {
        $cache_entries = self::get_current_cache_entries();
        
        if (empty($cache_entries)) {
            echo '<p class="stepfox-no-cache">' . __('No cache entries found.', 'stepfox-looks') . '</p>';
            return;
        }

        echo '<div class="stepfox-cache-table-wrapper">';
        echo '<table class="stepfox-cache-table">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>' . esc_html__('Type', 'stepfox-looks') . '</th>';
        echo '<th>' . esc_html__('Created', 'stepfox-looks') . '</th>';
        echo '<th>' . esc_html__('Expires', 'stepfox-looks') . '</th>';
        echo '<th>' . esc_html__('Size', 'stepfox-looks') . '</th>';
        echo '<th>' . esc_html__('CSS/JS', 'stepfox-looks') . '</th>';
        echo '<th>' . esc_html__('Action', 'stepfox-looks') . '</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        foreach ($cache_entries as $entry) {
            echo '<tr>';
            echo '<td><span class="stepfox-cache-type stepfox-type-' . esc_attr( strtolower($entry['type']) ) . '">' . esc_html( $entry['type'] ) . '</span></td>';
            
            // Created time
            if ($entry['created']) {
                $created_time = date_i18n('M j, Y H:i', $entry['created']);
                echo '<td>' . esc_html( $created_time ) . '</td>';
            } else {
                echo '<td>—</td>';
            }
            
            // Expires time
            if ($entry['expires']) {
                $expires_time = date_i18n('M j, Y H:i', $entry['expires']);
                $is_expired = $entry['expires'] < time();
                $status_class = $is_expired ? 'expired' : 'active';
                echo '<td class="stepfox-expires-' . esc_attr( $status_class ) . '">' . esc_html( $expires_time );
                if ($is_expired) {
                    echo ' <small>(' . esc_html__('Expired', 'stepfox-looks') . ')</small>';
                }
                echo '</td>';
            } else {
                echo '<td>—</td>';
            }
            
            echo '<td>' . esc_html( $entry['size'] ) . '</td>';
            echo '<td>';
            echo '<small>';
            if ($entry['css_length'] > 0) {
                echo 'CSS: ' . esc_html( self::format_bytes($entry['css_length']) );
            }
            if ($entry['js_length'] > 0) {
                if ($entry['css_length'] > 0) echo '<br>';
                echo 'JS: ' . esc_html( self::format_bytes($entry['js_length']) );
            }
            if ($entry['css_length'] == 0 && $entry['js_length'] == 0) {
                echo '—';
            }
            echo '</small>';
            echo '</td>';
            
            echo '<td>';
            echo '<button type="button" class="button button-small stepfox-clear-single" data-cache-key="' . esc_attr($entry['key']) . '">';
            echo esc_html__('Clear', 'stepfox-looks');
            echo '</button>';
            echo '</td>';
            
            echo '</tr>';
        }

        echo '</tbody>';
        echo '</table>';
        echo '</div>';

        echo '<p class="stepfox-cache-summary">';
        printf(
            esc_html__('Total: %d cache entries', 'stepfox-looks'),
            count($cache_entries)
        );
        echo '</p>';
    }

    /**
     * Handle clear single cache AJAX request
     */
    public static function handle_clear_single_cache() {
        check_ajax_referer('stepfox_clear_single_cache_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'stepfox-looks'));
        }

        $cache_key = sanitize_text_field($_POST['cache_key']);
        
        if (empty($cache_key)) {
            wp_send_json_error([
                'message' => __('Invalid cache key', 'stepfox-looks')
            ]);
        }

        // Delete the specific cache entry
        delete_transient($cache_key);

        wp_send_json_success([
            'message' => __('Cache entry cleared successfully!', 'stepfox-looks')
        ]);
    }

    /**
     * Format bytes to human readable format
     */
    private static function format_bytes($size, $precision = 2) {
        if ($size == 0) return '0 B';
        
        $base = log($size, 1024);
        $suffixes = ['B', 'KB', 'MB', 'GB'];
        
        return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
    }
}

// Initialize admin functionality
if (is_admin()) {
    Stepfox_Looks_Admin::init();
}