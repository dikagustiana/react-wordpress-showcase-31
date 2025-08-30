# Financial Reporting Portal

## Overview
Professional React + Vite website for financial reporting and compliance, designed for WordPress integration.

## Build Instructions
```bash
npm install
npm run build
```

## WordPress Integration
1. Copy dist/ folder to your WordPress installation
2. Enqueue the built assets in your theme's functions.php:
```php
function enqueue_react_assets() {
    wp_enqueue_script('react-app', get_template_directory_uri() . '/dist/assets/index.js', array(), '1.0.0', true);
    wp_enqueue_style('react-app', get_template_directory_uri() . '/dist/assets/index.css', array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'enqueue_react_assets');
```

3. Add shortcode support:
```php
function react_mount_shortcode($atts) {
    $id = isset($atts['id']) ? $atts['id'] : 'root';
    return '<div id="' . esc_attr($id) . '"></div>';
}
add_shortcode('react_mount', 'react_mount_shortcode');
```

## FSLI Detail Page Slugs

### Current Assets
- /accounting/fsli/cash-and-cash-equivalents
- /accounting/fsli/restricted-cash
- /accounting/fsli/trade-receivables-net
- /accounting/fsli/third-parties
- /accounting/fsli/related-parties
- /accounting/fsli/other-receivables-net
- /accounting/fsli/due-from-government
- /accounting/fsli/inventories-net
- /accounting/fsli/corporate-dividend-taxes-receivable-current
- /accounting/fsli/advances-prepayments-current
- /accounting/fsli/other-current-assets
- /accounting/fsli/other-non-current-assets

### Non-Current Assets
- /accounting/fsli/restricted-cash-non-current
- /accounting/fsli/trade-receivables-net-non-current
- /accounting/fsli/fixed-assets-net
- /accounting/fsli/investment-properties
- /accounting/fsli/deferred-tax-assets
- /accounting/fsli/long-term-investments
- /accounting/fsli/advances-prepayments-non-current
- /accounting/fsli/corporate-dividend-taxes-receivable-non-current
- /accounting/fsli/other-non-current-receivables
- /accounting/fsli/oil-gas-properties-net
- /accounting/fsli/right-of-use-assets-net
- /accounting/fsli/other-non-current-assets-final

## Main Pages
- / (Home)
- /accounting
- /accounting/fsli
- /accounting/consolidated-reporting
- /accounting/statutory-reporting
- /green-transition
- /english-ielts
- /books-academia

## Features
- Professional financial reporting interface
- Searchable FSLI table with real data
- Responsive design (desktop-focused)
- Clean URL structure
- WordPress-ready build output
- SEO optimized
- Professional corporate design

## Technical Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

## Design System
- Corporate blue theme (#1e40af)
- Professional typography
- Consistent spacing and shadows
- Semantic color tokens
- Clean table styling with hover effects