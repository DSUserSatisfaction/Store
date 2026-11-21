# North & Pine static storefront

A responsive, static ecommerce demonstration using HTML, CSS, and vanilla JavaScript. It has no build process and is compatible with local preview and GitHub Pages.

## Preview

Open `index.html` directly, or start a small local static server from this folder:

```text
python -m http.server 8000
```

Then visit `http://localhost:8000/`. Python is only used for preview; the website itself has no backend.

## Publish with GitHub Pages

1. Create a GitHub repository and upload this folder.
2. Open **Settings > Pages**.
3. Select the repository branch and `/ (root)` folder.
4. Wait for GitHub to publish the site.

When the repository is published below `/repository-name/`, relative links such as `./shop.html` and `./images/pic01.jpg` continue to work.

## Customize the store

- Store name, announcement, shipping, contact, social links, theme, and feature flags: edit `config.js`.
- Products: edit the objects in `products.js`.
- Light/dark colors: edit CSS variables in `css/style.css`.
- Layout and typography: edit `css/style.css`, `css/components.css`, and `css/responsive.css`.
- Homepage copy and sections: edit `index.html`.

## Products

Add an object to the `window.PRODUCTS` array in `products.js`. Remove an object to remove a product. Useful fields include `name`, `price`, `compareAtPrice`, `description`, `category`, `rating`, `reviewCount`, `stockStatus`, `stockQuantity`, `featured`, `bestseller`, `newArrival`, `onSale`, `images`, `tags`, `variants`, and `specifications`.

Relative image paths should begin with `./images/`. Missing images automatically fall back to a template image. Missing ratings or variants are handled without breaking the card or detail modal.

## Backend limitations

Checkout is clearly labeled as a demonstration. It does not collect payment cards, process orders, send confirmation emails, store personal form data, or sync inventory. Real checkout requires a payment provider such as Stripe or PayPal and a backend or commerce platform. Newsletter submission is also frontend-only.
