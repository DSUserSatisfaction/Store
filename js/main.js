(() => {
  "use strict";
  const config = window.STORE_CONFIG || {};
  function escapeHtml(value){return String(value||"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));}
  const header = document.querySelector("#site-header");
  if (header) header.innerHTML = `
    <div class="container nav-wrap">
      <a class="brand" href="./index.html" aria-label="${escapeHtml(config.storeName)} home">${escapeHtml(config.storeName).replace(" "," &nbsp;")}</a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        <a href="./index.html">Home</a><a href="./shop.html">Shop</a><a href="./shop.html#categories">Categories</a><a href="./about.html">About</a><a href="./contact.html">Contact</a>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn" type="button" data-open-search aria-label="Search"><span aria-hidden="true">⌕</span></button>
        <a class="icon-btn header-wishlist" href="./wishlist.html" aria-label="Wishlist"><span aria-hidden="true">♡</span><span class="count-badge wishlist-count">0</span></a>
        <button class="icon-btn" type="button" data-cart-open aria-label="Open cart"><span aria-hidden="true">Bag</span><span class="count-badge cart-count">0</span></button>
        <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle theme">◐</button>
        <button class="icon-btn menu-btn" type="button" data-mobile-menu aria-label="Open menu">≡</button>
      </div>
    </div>`;
  const footer=document.querySelector("#site-footer");
  if(footer)footer.innerHTML=`<footer class="site-footer"><div class="container"><div class="footer-grid">
    <div><a class="brand" href="./index.html">${escapeHtml(config.storeName)}</a><p style="color:#bbbfb4;margin-top:.75rem">${escapeHtml(config.tagline)}</p></div>
    <div><h3>Explore</h3><a href="./shop.html">Shop all</a><a href="./shop.html#categories">Categories</a><a href="./about.html">Our story</a></div>
    <div><h3>Customer care</h3><a href="./shipping.html">Shipping</a><a href="./returns.html">Returns</a><a href="./faq.html">FAQ</a><a href="./contact.html">Contact</a></div>
    <div><h3>Information</h3><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="mailto:${escapeHtml(config.contact?.email)}">${escapeHtml(config.contact?.email)}</a></div>
  </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${escapeHtml(config.storeName)}</span><span>Demo store · VISA · Mastercard · PayPal</span></div></div></footer>`;
  const announcement=document.querySelector("#announcement");
  if(announcement&&config.announcementBar?.enabled){announcement.innerHTML=`<div>${escapeHtml(config.announcementBar.text)}</div><button type="button" aria-label="Dismiss announcement">×</button>`;announcement.addEventListener("click",event=>{if(event.target.closest("button"))announcement.remove();});}
  else if(announcement)announcement.remove();

  const shared=document.querySelector("#shared-overlays");
  if(shared)shared.innerHTML=`
    <div class="overlay" data-overlay></div>
    <aside class="drawer" id="cart-drawer" aria-label="Shopping cart" aria-hidden="true"><div class="drawer-head"><h2 style="font-size:1.35rem;margin:0">Your bag</h2><button class="icon-btn" type="button" data-cart-close aria-label="Close cart">×</button></div><div class="drawer-body cart-items"></div><div class="drawer-foot"><p class="shipping-message"></p><div class="shipping-progress"><div></div></div><div style="display:flex;justify-content:space-between"><span>Subtotal</span><strong class="cart-subtotal"></strong></div><div style="display:flex;justify-content:space-between;color:var(--color-muted);font-size:.82rem"><span>Shipping estimate</span><span class="cart-shipping"></span></div><div style="display:flex;justify-content:space-between;margin:.65rem 0"><span>Total</span><strong class="cart-total"></strong></div><a class="btn btn-primary" href="./checkout.html" style="width:100%">Continue to checkout</a></div></aside>
    <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search products"><div class="search-head"><div class="search-row"><input id="search-input" type="search" placeholder="Search the collection" aria-label="Search products"><button class="icon-btn" id="close-search" type="button" aria-label="Close search">×</button></div><div class="search-results" id="search-results"><div class="empty-state">Start typing to search the collection.</div></div></div></div>
    <div class="modal" id="product-modal" role="dialog" aria-modal="true" aria-label="Product details"><div class="modal-card"><button class="icon-btn modal-close" type="button" data-modal-close aria-label="Close product details">×</button><div id="product-modal-body"></div></div></div>
    <nav class="drawer" id="mobile-nav" aria-label="Mobile navigation" aria-hidden="true"><div class="drawer-head"><span class="brand">${escapeHtml(config.storeName)}</span><button class="icon-btn" type="button" data-mobile-close aria-label="Close menu">×</button></div><div class="drawer-body" style="display:grid;align-content:start;gap:.4rem"><a class="btn btn-secondary" href="./index.html">Home</a><a class="btn btn-secondary" href="./shop.html">Shop</a><a class="btn btn-secondary" href="./shop.html#categories">Categories</a><a class="btn btn-secondary" href="./wishlist.html">Wishlist</a><a class="btn btn-secondary" href="./about.html">About</a><a class="btn btn-secondary" href="./contact.html">Contact</a></div></nav>
    <div class="toast-stack" aria-live="polite"></div>
    <aside class="cookie-banner" id="cookie-banner" aria-label="Cookie preferences"><strong>Cookie preferences</strong><p style="font-size:.82rem">This demo does not use analytics or tracking. Your preference can be stored locally on this device.</p><div class="cookie-actions"><button class="btn btn-primary" type="button" data-cookie="accept">Accept</button><button class="btn btn-secondary" type="button" data-cookie="reject">Reject optional</button></div></aside>`;

  document.addEventListener("click",event=>{
    if(event.target.closest("[data-cart-open]")){const drawer=document.querySelector("#cart-drawer");drawer?.classList.add("open");drawer?.setAttribute("aria-hidden","false");document.querySelector(".overlay")?.classList.add("open");document.body.classList.add("locked");}
    if(event.target.closest("[data-cart-close]")||event.target.closest("[data-overlay]")){document.querySelectorAll(".drawer.open").forEach(el=>el.classList.remove("open"));document.querySelector(".overlay")?.classList.remove("open");document.body.classList.remove("locked");}
    if(event.target.closest("[data-modal-close]")){document.querySelector("#product-modal")?.classList.remove("open");document.querySelector(".overlay")?.classList.remove("open");document.body.classList.remove("locked");}
    if(event.target.closest("[data-mobile-menu]")){const nav=document.querySelector("#mobile-nav");nav?.classList.add("open");nav?.setAttribute("aria-hidden","false");document.querySelector(".overlay")?.classList.add("open");document.body.classList.add("locked");}
    if(event.target.closest("[data-mobile-close]")){document.querySelector("#mobile-nav")?.classList.remove("open");document.querySelector(".overlay")?.classList.remove("open");document.body.classList.remove("locked");}
    const cookieChoice=event.target.closest("[data-cookie]");
    if(cookieChoice){localStorage.setItem("north-pine-cookie-choice",cookieChoice.dataset.cookie);document.querySelector("#cookie-banner")?.classList.add("hide");}
  });

  if(localStorage.getItem("north-pine-cookie-choice"))document.querySelector("#cookie-banner")?.classList.add("hide");

  window.addEventListener("scroll",()=>document.querySelector(".back-top")?.classList.toggle("visible",scrollY>600),{passive:true});
})();
