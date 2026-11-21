# Handoff

## Architecture
Static HTML/CSS/vanilla JavaScript storefront. Shared components are rendered by `js/main.js`; product data and store settings are centralized in `config.js` and `products.js`.

## Important files
- `index.html` - Homepage
- `shop.html` - Catalog
- `checkout.html` - Frontend demo checkout
- `config.js` - Store-wide editable settings
- `products.js` - Product database
- `css/style.css` - Design tokens and base styles
- `css/components.css` - Shared components
- `css/responsive.css` - Responsive rules
- `js/main.js` - Shared initialization and UI
- `js/store.js` - Product, cart, wishlist, search, filtering, and modal logic

## Preview
Open `index.html` directly or serve the folder with any local static server.

## Next task
Perform browser-level validation of the shared scripts. Open `index.html`, check the browser console, then test search, filtering, sorting, product variants, cart persistence, wishlist persistence, theme switching, and demo checkout.
