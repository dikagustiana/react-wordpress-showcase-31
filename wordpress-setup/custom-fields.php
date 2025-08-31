<?php
/**
 * WordPress Custom Fields Registration for Universal Embed
 * Add this code to your theme's functions.php file
 */

// Register ACF fields for Universal Embed
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
    'key' => 'group_universal_embed',
    'title' => 'Universal Embed Configuration',
    'fields' => array(
        array(
            'key' => 'field_data_source_type',
            'label' => 'Data Source Type',
            'name' => 'data_source_type',
            'type' => 'select',
            'choices' => array(
                'media' => 'Media Library',
                'onedrive' => 'OneDrive',
                'gsheet' => 'Google Sheets',
                'api_json' => 'JSON API',
            ),
            'default_value' => 'media',
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 1,
            'return_format' => 'value',
            'show_in_rest' => 1,
        ),
        array(
            'key' => 'field_data_source_url',
            'label' => 'Data Source URL',
            'name' => 'data_source_url',
            'type' => 'url',
            'instructions' => 'Enter the URL to your data source (file, API endpoint, or embed URL)',
            'required' => 0,
            'show_in_rest' => 1,
        ),
        array(
            'key' => 'field_embed_type',
            'label' => 'Embed Type',
            'name' => 'embed_type',
            'type' => 'select',
            'choices' => array(
                'iframe' => 'Iframe Embed',
                'sheetjs' => 'Excel Table (SheetJS)',
                'json_table' => 'JSON Data Table',
            ),
            'default_value' => 'iframe',
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 1,
            'return_format' => 'value',
            'show_in_rest' => 1,
        ),
        array(
            'key' => 'field_excel_sheet',
            'label' => 'Excel Sheet Name',
            'name' => 'excel_sheet',
            'type' => 'text',
            'instructions' => 'Name of the Excel sheet to display (default: Sheet1)',
            'default_value' => 'Sheet1',
            'placeholder' => 'Sheet1',
            'conditional_logic' => array(
                array(
                    array(
                        'field' => 'field_embed_type',
                        'operator' => '==',
                        'value' => 'sheetjs',
                    ),
                ),
            ),
            'show_in_rest' => 1,
        ),
        array(
            'key' => 'field_excel_range',
            'label' => 'Excel Range',
            'name' => 'excel_range',
            'type' => 'text',
            'instructions' => 'Cell range to display (e.g., A1:F100). Leave empty for entire sheet.',
            'placeholder' => 'A1:F100',
            'conditional_logic' => array(
                array(
                    array(
                        'field' => 'field_embed_type',
                        'operator' => '==',
                        'value' => 'sheetjs',
                    ),
                ),
            ),
            'show_in_rest' => 1,
        ),
        array(
            'key' => 'field_table_page_size',
            'label' => 'Table Page Size',
            'name' => 'table_page_size',
            'type' => 'number',
            'instructions' => 'Number of rows to display per page',
            'default_value' => 10,
            'min' => 5,
            'max' => 100,
            'step' => 5,
            'conditional_logic' => array(
                array(
                    array(
                        'field' => 'field_embed_type',
                        'operator' => '==',
                        'value' => 'json_table',
                    ),
                ),
                array(
                    array(
                        'field' => 'field_embed_type',
                        'operator' => '==',
                        'value' => 'sheetjs',
                    ),
                ),
            ),
            'show_in_rest' => 1,
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'page',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => true,
    'description' => '',
    'show_in_rest' => 1,
));

endif;

/**
 * Alternative: Manual Custom Fields Registration (if not using ACF)
 * Uncomment the code below if you prefer to use WordPress native custom fields
 */

/*
// Register custom fields in REST API
function add_universal_embed_fields_to_rest() {
    register_rest_field('page', 'data_source_type', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'data_source_type', true);
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'data_source_type', $value);
        },
        'schema' => array(
            'description' => 'Data source type',
            'type' => 'string',
            'enum' => array('media', 'onedrive', 'gsheet', 'api_json'),
        ),
    ));

    register_rest_field('page', 'data_source_url', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'data_source_url', true);
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'data_source_url', $value);
        },
        'schema' => array(
            'description' => 'Data source URL',
            'type' => 'string',
            'format' => 'uri',
        ),
    ));

    register_rest_field('page', 'embed_type', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'embed_type', true);
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'embed_type', $value);
        },
        'schema' => array(
            'description' => 'Embed type',
            'type' => 'string',
            'enum' => array('iframe', 'sheetjs', 'json_table'),
        ),
    ));

    register_rest_field('page', 'excel_sheet', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'excel_sheet', true) ?: 'Sheet1';
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'excel_sheet', $value);
        },
        'schema' => array(
            'description' => 'Excel sheet name',
            'type' => 'string',
        ),
    ));

    register_rest_field('page', 'excel_range', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'excel_range', true);
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'excel_range', $value);
        },
        'schema' => array(
            'description' => 'Excel range',
            'type' => 'string',
        ),
    ));

    register_rest_field('page', 'table_page_size', array(
        'get_callback' => function($post) {
            return intval(get_post_meta($post['id'], 'table_page_size', true)) ?: 10;
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'table_page_size', intval($value));
        },
        'schema' => array(
            'description' => 'Table page size',
            'type' => 'integer',
            'minimum' => 5,
            'maximum' => 100,
        ),
    ));
}
add_action('rest_api_init', 'add_universal_embed_fields_to_rest');

// Add meta boxes for manual field editing
function add_universal_embed_meta_boxes() {
    add_meta_box(
        'universal_embed_config',
        'Universal Embed Configuration',
        'universal_embed_meta_box_callback',
        'page',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'add_universal_embed_meta_boxes');

function universal_embed_meta_box_callback($post) {
    wp_nonce_field('save_universal_embed_fields', 'universal_embed_nonce');
    
    $data_source_type = get_post_meta($post->ID, 'data_source_type', true) ?: 'media';
    $data_source_url = get_post_meta($post->ID, 'data_source_url', true);
    $embed_type = get_post_meta($post->ID, 'embed_type', true) ?: 'iframe';
    $excel_sheet = get_post_meta($post->ID, 'excel_sheet', true) ?: 'Sheet1';
    $excel_range = get_post_meta($post->ID, 'excel_range', true);
    $table_page_size = get_post_meta($post->ID, 'table_page_size', true) ?: 10;
    
    echo '<table class="form-table">';
    
    echo '<tr><th><label for="data_source_type">Data Source Type</label></th><td>';
    echo '<select name="data_source_type" id="data_source_type">';
    echo '<option value="media"' . selected($data_source_type, 'media', false) . '>Media Library</option>';
    echo '<option value="onedrive"' . selected($data_source_type, 'onedrive', false) . '>OneDrive</option>';
    echo '<option value="gsheet"' . selected($data_source_type, 'gsheet', false) . '>Google Sheets</option>';
    echo '<option value="api_json"' . selected($data_source_type, 'api_json', false) . '>JSON API</option>';
    echo '</select></td></tr>';
    
    echo '<tr><th><label for="data_source_url">Data Source URL</label></th><td>';
    echo '<input type="url" name="data_source_url" id="data_source_url" value="' . esc_attr($data_source_url) . '" style="width: 100%;" />';
    echo '</td></tr>';
    
    echo '<tr><th><label for="embed_type">Embed Type</label></th><td>';
    echo '<select name="embed_type" id="embed_type">';
    echo '<option value="iframe"' . selected($embed_type, 'iframe', false) . '>Iframe Embed</option>';
    echo '<option value="sheetjs"' . selected($embed_type, 'sheetjs', false) . '>Excel Table (SheetJS)</option>';
    echo '<option value="json_table"' . selected($embed_type, 'json_table', false) . '>JSON Data Table</option>';
    echo '</select></td></tr>';
    
    echo '<tr><th><label for="excel_sheet">Excel Sheet Name</label></th><td>';
    echo '<input type="text" name="excel_sheet" id="excel_sheet" value="' . esc_attr($excel_sheet) . '" />';
    echo '</td></tr>';
    
    echo '<tr><th><label for="excel_range">Excel Range</label></th><td>';
    echo '<input type="text" name="excel_range" id="excel_range" value="' . esc_attr($excel_range) . '" placeholder="A1:F100" />';
    echo '</td></tr>';
    
    echo '<tr><th><label for="table_page_size">Table Page Size</label></th><td>';
    echo '<input type="number" name="table_page_size" id="table_page_size" value="' . esc_attr($table_page_size) . '" min="5" max="100" step="5" />';
    echo '</td></tr>';
    
    echo '</table>';
}

function save_universal_embed_fields($post_id) {
    if (!isset($_POST['universal_embed_nonce']) || !wp_verify_nonce($_POST['universal_embed_nonce'], 'save_universal_embed_fields')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = array('data_source_type', 'data_source_url', 'embed_type', 'excel_sheet', 'excel_range', 'table_page_size');
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post', 'save_universal_embed_fields');
*/

?>