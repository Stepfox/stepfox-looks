<?php
/**
 * Metafield Block
 * Displays custom fields and metadata with proper security measures
 * 
 * @package stepfox
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include render function with security check
$render_file = STEPFOX_LOOKS_PATH . 'blocks/metafield-block/metafield_block_html.php';
if (file_exists($render_file)) {
    require_once $render_file;
}


/**
 * Query for Gutenberg blocks with proper sanitization
 * 
 * @param array $attributes Block attributes
 * @return WP_Query|null Query object or null if invalid
 */
function stepfox_query_for_gutenberg($attributes)
{
    // Validate and sanitize attributes
    if (!is_array($attributes) || empty($attributes['source'])) {
        return null;
    }
    
    if (sanitize_text_field($attributes['source']) === 'posts') {
        $number = isset($attributes['post_count']) ? absint($attributes['post_count']) : 5;
        $number = min($number, 50); // Limit to prevent abuse
        
        $args = array('posts_per_page' => $number);

        // Sanitize taxonomy and term
        if (!empty($attributes['term']) && !empty($attributes['taxonomy'])) {
            $taxonomy = sanitize_text_field($attributes['taxonomy']);
            $term = sanitize_text_field($attributes['term']);
            
            if (taxonomy_exists($taxonomy)) {
                $args['tax_query'] = array(array(
                    'taxonomy' => $taxonomy, 
                    'field' => 'slug', 
                    'terms' => array($term)
                ));
            }
        }

        // Sanitize post type
        $post_type = isset($attributes['post_type']) ? sanitize_text_field($attributes['post_type']) : 'post';
        if (post_type_exists($post_type)) {
            $args['post_type'] = $post_type;
        }
        
        $args['offset'] = isset($attributes['offset_posts']) ? absint($attributes['offset_posts']) : 0;
        $args['order'] = isset($attributes['order']) && in_array($attributes['order'], array('ASC', 'DESC')) ? $attributes['order'] : 'DESC';
        $args['orderby'] = isset($attributes['order_by']) ? sanitize_text_field($attributes['order_by']) : 'date';
        if ($attributes['display_pagination'] == true) {
            global $paged;
            if (get_query_var('paged')) {
                $paged = get_query_var('paged');
            } elseif (get_query_var('page')) {
                $paged = get_query_var('page');
            } else {
                $paged = 1;
            }

            $args['paged'] = $paged;

            $paged_offset = (($paged - 1) * $number) + $args['offset'];
            $args['offset'] = $paged_offset;
        }

        $stepfox_posts = new WP_Query($args);

    } elseif ($attributes['source'] == 'manual_selection' || $attributes['source'] == 'top_lists') {
        $manual_selection = $attributes['manual_selection'];

        if ($attributes['source'] == 'top_lists') {


            foreach (timed_toplist_filter()[1] as $key => $value) {

                if ($attributes['top_list'] == $value) {
                    $manual_selection_list = timed_toplist_filter()[0][$key];
                }

            }


        }

        if ($attributes['source'] == 'manual_selection') {
            foreach ($manual_selection as $item) {
                $manual_selection_list[] = $item['toplistitem'];
            }
        }
        $args = array('post__in' => $manual_selection_list, 'post_type' => 'any', 'orderby' => 'post__in', 'posts_per_page' => -1);
        $args['post_type'] = $attributes['post_type'];
        $stepfox_posts = new WP_Query($args);

    } elseif ($attributes['source'] == 'current_archive') {
        global $wp_query;

        global $paged;
        if (get_query_var('paged')) {
            $paged = get_query_var('paged');
        } elseif (get_query_var('page')) {
            $paged = get_query_var('page');
        } else {
            $paged = 1;
        }
        $paged_offset = (($paged - 1) * $attributes['post_count']) + $attributes['offset_posts'];

        $wp_query->set('posts_per_page', $attributes['post_count']);
        $wp_query->set('offset', $paged_offset);

        $stepfox_posts = new WP_Query($wp_query->query_vars);

    } elseif ($attributes['source'] == 'popular_posts') {
        $popular_post = $attributes['popular_posts'];

        $number = $attributes['post_count'];
        $args = array(
            'posts_per_page' => $number,
            'meta_key' => 'stepfox_post_views_count',
        );

        if ($attributes['taxonomy'] != 'all' && !empty($attributes['term'])) {
            $term = get_term($attributes['term']);
            $taxonomies = get_object_taxonomies($attributes['post_type']);
            if (in_array($term->taxonomy, $taxonomies)) {

    
                $args['tax_query'] = array(array('taxonomy' => $term->taxonomy, 'field' => 'id', 'terms' => array($attributes['term'])));
            }
        }
        $args['post_type'] = $attributes['post_type'];
        $args['offset'] = $attributes['offset_posts'];
        $args['order'] = $attributes['order'];
        $args['orderby'] = 'meta_value_num';


        if ($popular_post == 'week') {
            $week = date('W');
            $args['w'] = $week;
        } elseif ($popular_post == 'year') {
            $year = date('Y');
            $args['year'] = $year;
        } elseif ($popular_post == 'month') {
            $month = date('m');
            $args['monthnum'] = $month;
        }


        $stepfox_posts = new WP_Query($args);
    } elseif ($attributes['source'] == 'related_posts') {

    }


    return $stepfox_posts;
}


function query_object_for_gutenberg_query()
{

    $args = array(//'public' => true,
    );

    $output = 'objects'; // names or objects, note names is the default
    $template_parts = get_post_types($args, $output)['wp_template_part'];


    $args = array(
        'public' => true,
    );

    $output = 'objects'; // names or objects, note names is the default


    $types = get_post_types($args, $output);
    $types['wp_template_part'] = $template_parts;
    
    $fields = [];

    foreach ($types as $post_type) {
        if ($post_type->name != 'attachment') {
            $post_types[] = array('label' => $post_type->label,
                'value' => $post_type->name,);
        }

        // Add default fields that are always available for any post type
        $fields[$post_type->name][] = ["value"=> "counter", "label"=>"📊 counter (built-in)"];
        $fields[$post_type->name][] = ["value"=> "post_title", "label"=>"📝 post_title (built-in)"];
        $fields[$post_type->name][] = ["value"=> "post_content", "label"=>"📄 post_content (built-in)"];
        $fields[$post_type->name][] = ["value"=> "post_excerpt", "label"=>"📋 post_excerpt (built-in)"];
        $fields[$post_type->name][] = ["value"=> "featured_image", "label"=>"🖼️ featured_image (built-in)"];
        $fields[$post_type->name][] = ["value"=> "month", "label"=>"📅 month (built-in)"];
        $fields[$post_type->name][] = ["value"=> "permalink", "label"=>"🔗 permalink (built-in)"];

        // Get registered meta fields for this specific post type
        $registered_meta = get_registered_meta_keys('post', $post_type->name);
        foreach($registered_meta as $meta_key => $meta_config) {
            // Only add if it's meant to be shown in REST/editor and not an internal field
            if ((!empty($meta_config['show_in_rest']) || !empty($meta_config['public'])) && 
                substr($meta_key, 0, 1) !== '_' && substr($meta_key, 0, 6) !== 'field_') {
                $fields[$post_type->name][] = ['value' => $meta_key, 'label' => '⚙️ ' . $meta_key . ' (registered)'];
            }
        }

        // Get ACF fields if ACF is active and fields exist for this post type
        if (function_exists('acf_get_field_groups')) {
            $field_groups = acf_get_field_groups(array(
                'post_type' => $post_type->name
            ));
            
            foreach ($field_groups as $field_group) {
                $acf_fields = acf_get_fields($field_group['key']);
                if ($acf_fields) {
                    foreach ($acf_fields as $acf_field) {
                        // Get field type icon
                        $field_icon = '🔧'; // default
                        switch($acf_field['type']) {
                            case 'text': $field_icon = '📝'; break;
                            case 'textarea': $field_icon = '📄'; break;
                            case 'number': $field_icon = '🔢'; break;
                            case 'email': $field_icon = '📧'; break;
                            case 'url': $field_icon = '🔗'; break;
                            case 'image': $field_icon = '🖼️'; break;
                            case 'date_picker': $field_icon = '📅'; break;
                            case 'select': $field_icon = '📋'; break;
                            case 'checkbox': $field_icon = '☑️'; break;
                            case 'radio': $field_icon = '🔘'; break;
                            case 'true_false': $field_icon = '✅'; break;
                        }
                        
                        $fields[$post_type->name][] = [
                            'value' => $acf_field['name'], 
                            'label' => $field_icon . ' ' . $acf_field['label'] . ' (ACF)'
                        ];
                    }
                }
            }
        }

        // Get other meta fields that exist in database but filter out WordPress internal ones
        global $wpdb;
        $result = $wpdb->get_results($wpdb->prepare(
            "SELECT DISTINCT meta_key FROM {$wpdb->posts},{$wpdb->postmeta} 
             WHERE post_type = %s AND {$wpdb->posts}.ID = {$wpdb->postmeta}.post_id 
             AND meta_key NOT LIKE '\_%' 
             AND meta_key NOT LIKE 'field_%'
             ORDER BY meta_key", $post_type->name
        ), ARRAY_A);

        // Track existing fields to avoid duplicates
        $existing_fields = array_column($fields[$post_type->name], 'value');
        
        // Add database meta fields that aren't already included
        foreach($result as $key => $value){
            if (!in_array($value['meta_key'], $existing_fields)) {
                $fields[$post_type->name][] = ['value' => $value['meta_key'], 'label' => '🔧 ' . $value['meta_key'] . ' (custom)'];
            }
        }
        
        // Sort fields: built-in first, then registered, then ACF, then custom
        usort($fields[$post_type->name], function($a, $b) {
            $order = ['built-in' => 1, 'registered' => 2, 'ACF' => 3, 'custom' => 4];
            $a_type = (!empty($a['label']) && preg_match('/\((.*?)\)/', $a['label'], $matches_a)) ? $matches_a[1] : 'custom';
            $b_type = (!empty($b['label']) && preg_match('/\((.*?)\)/', $b['label'], $matches_b)) ? $matches_b[1] : 'custom';
            
            $a_priority = $order[$a_type] ?? 5;
            $b_priority = $order[$b_type] ?? 5;
            
            if ($a_priority === $b_priority) {
                return strcmp($a['label'], $b['label']);
            }
            return $a_priority - $b_priority;
        });
        $taxonomy_objects = get_object_taxonomies($post_type->name, 'objects');
        $taxonomies[$post_type->name][] = array('label' => 'Select Taxonomy', 'value' => '');
        foreach ($taxonomy_objects as $taxonomy_object) {

            $taxonomies[$post_type->name][] = array('label' => $taxonomy_object->label,
                'value' => $taxonomy_object->name,);

            $terms = get_terms($taxonomy_object->name, array('hide_empty' => true,));
            $all_terms[$taxonomy_object->name][] = array('label' => 'Select Term', 'value' => '');
            foreach ($terms as $term) {
                if ($term->count > 1) {
                    $all_terms[$taxonomy_object->name][] = array('label' => $term->name . '->' . $term->count,
                        'value' => $term->slug,);
                }
            }
        }
        if($post_type->name != 'game') {
            $all_posts[$post_type->name] = get_posts(
                array(
                    'post_type' => $post_type->name,
                    'posts_per_page' => -1,
                    'post_status' => 'publish',
                )
            );
        }
        foreach ($all_posts[$post_type->name] as $manual_post) {
            $manual_selection[$post_type->name][] = array('label' => $manual_post->post_title,
                'value' => $manual_post->ID,);
        }
    }


    $return = array(
        'terms' => $all_terms,
        'taxonomies' => $taxonomies,
        'post_types' => $post_types,
        'manual_selection' => $manual_selection,
        'metafields' => $fields,
        'ajax_url' => admin_url('admin-ajax.php'),
    );

    return $return;


}


function stepfox_looks_count_views()
{
    $postID = get_the_ID();
    if (is_single()) {
        $count_key = 'stepfox_post_views_count';
        $count = get_post_meta($postID, $count_key, true);

        if ($count == '') {
            $count = 0;
            delete_post_meta($postID, $count_key);
            add_post_meta($postID, $count_key, '0');
        } else {
            $count++;
            update_post_meta($postID, $count_key, $count);
        }
    }
}

add_action("wp_head", "stepfox_looks_count_views");



//register the block
add_action("init", "stepfox_register_metafield_block");


function stepfox_register_metafield_block() {

        wp_register_script("metafield-block-gutenberg",
            STEPFOX_LOOKS_URL . "blocks/metafield-block/metafield_block_gutenberg_fields.js",
            array("wp-blocks", "wp-editor", "wp-api", "jquery"), STEPFOX_LOOKS_VERSION, true
        );
        // the query object
        $query_controls_object = query_object_for_gutenberg_query();
        $query_controls_object["name"] = "";

        wp_localize_script(	"metafield-block-gutenberg",	"metafield_block",	$query_controls_object);

        // Register frontend script
        wp_register_script("metafield-block-script", STEPFOX_LOOKS_URL . "blocks/metafield-block/metafield_block_js.js", array(), STEPFOX_LOOKS_VERSION, true);
        // Register block styles
        wp_register_style("metafield-block-style", STEPFOX_LOOKS_URL . "blocks/metafield-block/metafield_block_css.css", array(), STEPFOX_LOOKS_VERSION);

        // Define block attributes using PHP array (more reliable than JSON decode)
        $default_select_post = '';
        if (isset($query_controls_object["manual_selection"]["post"][0]["value"])) {
            $default_select_post = $query_controls_object["manual_selection"]["post"][0]["value"];
        }
        
        $attributes_reg = array(
            'style' => array(
                'type' => 'object',
                'default' => array(
                    'elements' => array('link' => ''),
                    'border' => array('radius' => '', 'style' => '', 'width' => ''),
                    'color' => array(),
                    'spacing' => array('blockGap' => '', 'margin' => array('top' => ''), 'padding' => array('top' => ''))
                )
            ),
            'post_type' => array(
                'type' => 'string', 
                'default' => 'post'
            ),
            'select_a_post_options' => array(
                'type' => 'array', 
                'default' => array()
            ),
            'select_a_post' => array(
                'type' => 'string', 
                'default' => $default_select_post
            ),
            'custom_css' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'align' => array(
                'type' => 'string', 
                'default' => 'wide'
            ),
            'backgroundColor' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'gradient' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'linkColor' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'textColor' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'fontSize' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'fontFamily' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'fontWeight' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'fontStyle' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'textTransform' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'letterSpacing' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'meta_field' => array(
                'type' => 'string', 
                'default' => 'post_title'
            ),
            'borderColor' => array(
                'type' => 'string', 
                'default' => ''
            ),
            'element_type' => array(
                'type' => 'string', 
                'default' => 'p'
            ),
            'layout' => array(
                'type' => 'object', 
                'default' => array()
            ),
            'customId' => array(
                'type' => 'string', 
                'default' => 'stepfox-not-set-id'
            )
        );




         register_block_type(
            "stepfox/metafield-block", array(

                "render_callback" => "stepfox_render_metafield_block",
                "category" => "stepfox",
                "attributes" => $attributes_reg,
                "style" => "metafield-block-style",//ova e backend i frontend za blockot
                "script" => "metafield-block-script", //i back i front
                "editor_script" => "metafield-block-gutenberg",
                "editor_style" => "metafield-block-style",

            )
        );





}