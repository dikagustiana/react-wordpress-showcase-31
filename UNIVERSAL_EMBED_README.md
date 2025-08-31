# Universal Embed System

A headless CMS solution for dynamically embedding content from WordPress without code changes.

## 🚀 Features

- **Dynamic Content Embedding**: Upload files or paste links in WordPress, content appears automatically
- **Multiple Data Sources**: Support for Media Library, OneDrive, Google Sheets, JSON APIs
- **Flexible Display Options**: iframe embedding, Excel table rendering, interactive JSON tables
- **Zero Code Changes**: Content updates don't require developer intervention
- **Performance Optimized**: Built-in caching and lazy loading
- **Security First**: Domain validation and safe iframe embedding
- **Responsive Design**: Works on all device sizes
- **Accessibility**: ARIA labels and keyboard navigation support

## 📋 Components Overview

### UniversalEmbed Component
Main component that handles different embed types:
- **iframe**: Responsive iframe embedding with domain validation
- **sheetjs**: Excel file parsing and table rendering with SheetJS
- **json_table**: JSON data display with search, pagination, and CSV export

### Settings Page
Admin interface for:
- Manual page revalidation
- Configuration guidance  
- WordPress setup instructions

### Utilities
- `getPageConfig()`: Fetch WordPress custom fields via REST API
- `validateIframeUrl()`: Security validation for iframe sources
- `revalidatePage()`: Cache invalidation and content refresh

## 🔧 WordPress Configuration

### Custom Fields Setup

Add these fields to your WordPress pages (using ACF or custom fields):

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `data_source_type` | select | media, onedrive, gsheet, api_json | Data source type |
| `data_source_url` | text | - | URL to your data source |
| `embed_type` | select | iframe, sheetjs, json_table | How to display the content |
| `excel_sheet` | text | Sheet1 | Excel sheet name (for sheetjs) |
| `excel_range` | text | A1:F100 | Cell range (optional) |
| `table_page_size` | number | 10 | Rows per page (for tables) |

### ACF Configuration

```php
// Add to your theme's functions.php
if( function_exists('acf_add_local_field_group') ):
    acf_add_local_field_group(array(
        'key' => 'group_universal_embed',
        'title' => 'Universal Embed Configuration',
        'fields' => array(
            // ... see wordpress-setup/custom-fields.php for full configuration
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
        'show_in_rest' => 1,
    ));
endif;
```

## 🎯 Usage Examples

### Excel File from Media Library

1. Upload `.xlsx` file to WordPress Media Library
2. Copy the file URL
3. Configure page fields:
   ```
   data_source_type: media
   data_source_url: https://yoursite.com/wp-content/uploads/2024/data.xlsx
   embed_type: sheetjs
   excel_sheet: Sheet1
   excel_range: A1:F100
   table_page_size: 10
   ```

### Google Sheets Embedding

1. Publish your Google Sheet to web
2. Copy the embed URL
3. Configure page fields:
   ```
   data_source_type: gsheet
   data_source_url: https://docs.google.com/spreadsheets/d/.../embed
   embed_type: iframe
   ```

### OneDrive File Viewer

1. Get OneDrive share/embed link
2. Configure page fields:
   ```
   data_source_type: onedrive
   data_source_url: https://onedrive.live.com/embed?...
   embed_type: iframe
   ```

### JSON API Data

1. Set up JSON API endpoint
2. Configure page fields:
   ```
   data_source_type: api_json
   data_source_url: https://api.example.com/data
   embed_type: json_table
   table_page_size: 15
   ```

## 🔐 Security Features

- **Domain Whitelist**: Only allowed domains can be embedded via iframe
- **URL Validation**: All URLs are validated before processing
- **CORS Handling**: Proper CORS headers for API requests
- **Input Sanitization**: All user inputs are sanitized
- **Error Boundaries**: Graceful error handling and user feedback

## 🚀 Performance

- **React Query Caching**: 60-second cache for WordPress data
- **Lazy Loading**: Images and content load on demand
- **Optimized Rendering**: Virtual scrolling for large datasets
- **Compressed Assets**: Gzip compression for all static assets

## 🛠 Development

### Adding New Embed Types

1. Update the `embedType` union type in `UniversalEmbed.tsx`
2. Add new case in the component's switch statement
3. Update WordPress field options
4. Add corresponding tests

### Custom Data Sources

1. Extend `data_source_type` options
2. Add validation logic in `validateIframeUrl()`
3. Update fetch logic in `UniversalEmbed` component
4. Document the new source type

## 📊 Analytics & Monitoring

The system includes built-in analytics for:
- Embed load times
- Error rates by content type
- User interaction patterns
- Performance metrics

## 🔄 Cache Management

### Automatic Invalidation
- WordPress webhooks trigger cache updates
- 60-second TTL for all cached content
- Manual refresh via Settings page

### Manual Refresh
Use the Settings page to manually refresh specific pages:
1. Enter page slug
2. Provide revalidation secret
3. Click "Refresh Now"

## 🐛 Troubleshooting

### Common Issues

**Content not loading:**
- Check WordPress REST API accessibility
- Verify custom fields are set to `show_in_rest`
- Confirm URL accessibility and CORS settings

**Iframe not displaying:**
- Verify domain is in allowed list
- Check if source allows iframe embedding
- Inspect console for security errors

**Excel files not parsing:**
- Confirm file format is `.xlsx`
- Check if file is publicly accessible
- Verify sheet name and range syntax

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request with detailed description

---

For more details, check the individual component files and the WordPress setup guide in `wordpress-setup/custom-fields.php`.