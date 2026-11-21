(() => {
  "use strict";
  const config = window.STORE_CONFIG || {};
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const currency = value => new Intl.NumberFormat(config.locale || "nl-NL", {style:"currency",currency:config.currency || "EUR"}).format(Number(value)||0);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
  const imageFallback = "./images/pic03.jpg";
  const readStorage = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
  const writeStorage = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };

  let cart = readStorage("north-pine-cart", []);
  let wishlist = readStorage("north-pine-wishlist", []);
  let recentlyViewed = readStorage("north-pine-recent", []);
  let activeVariants = {};

  function toast(message, type="success") {
    let stack = $(".toast-stack");
    if (!stack) return;
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.setAttribute("role","status");
    item.textContent = message;
    stack.append(item);
    setTimeout(() => item.remove(), 3200);
  }

  function getProduct(id) { return products.find(product => product.id === id); }
  function isWishlisted(id) { return wishlist.includes(id); }
  function productImage(product) { return product?.images?.[0] || product?.thumbnail || imageFallback; }
  function productCard(product) {
    if (!product) return "";
    const second = product.images?.[1] ? `<img class="secondary" src="${escapeHtml(product.images[1])}" alt="" loading="lazy">` : "";
    const compare = product.compareAtPrice && config.storeSettings?.showComparePrice ? `<span class="old-price">${currency(product.compareAtPrice)}</span>` : "";
    const discount = product.compareAtPrice ? `<span class="product-badge sale-badge">-${Math.round((1-product.price/product.compareAtPrice)*100)}%</span>` : "";
    const badges = `${product.newArrival ? '<span class="product-badge">New</span>' : ""}${product.bestseller ? '<span class="product-badge">Bestseller</span>' : ""}`;
    const rating = product.rating && config.storeSettings?.showRatings ? `<div class="rating-line" aria-label="${product.rating} out of 5 stars">${"★".repeat(Math.round(product.rating))}${"☆".repeat(5-Math.round(product.rating))} <span>(${product.reviewCount || 0})</span></div>` : "";
    return `<article class="product-card" data-product-id="${escapeHtml(product.id)}">
      <div class="product-media">
        <div class="badge-row">${discount}${badges}</div>
        <button class="icon-btn wishlist-btn ${isWishlisted(product.id)?"active":""}" data-wishlist="${escapeHtml(product.id)}" aria-label="${isWishlisted(product.id)?"Remove":"Add"} ${escapeHtml(product.name)} ${isWishlisted(product.id)?"from":"to"} wishlist">♡</button>
        <img class="primary" src="${escapeHtml(productImage(product))}" alt="${escapeHtml(product.name)}" loading="lazy">${second}
      </div>
      <div class="product-meta"><button class="product-name" data-view="${escapeHtml(product.id)}">${escapeHtml(product.name)}</button><div class="product-price">${compare}${currency(product.price)}</div></div>
      ${rating}
      ${product.stockStatus === "low-stock" ? '<div class="rating-line">Low stock</div>' : ""}
      <button class="btn btn-secondary quick-add" data-quick-add="${escapeHtml(product.id)}">Quick add</button>
    </article>`;
  }

  function mountGrid(selector, list) {
    const grid = $(selector);
    if (grid) grid.innerHTML = list.length ? list.map(productCard).join("") : '<div class="empty-state">No products match these preferences.</div>';
  }

  function updateCounts() {
    $$(".cart-count").forEach(el => el.textContent = cart.reduce((sum,item) => sum+item.quantity,0));
    $$(".wishlist-count").forEach(el => el.textContent = wishlist.length);
  }

  function openDrawer(selector) {
    $(selector)?.classList.add("open");
    $(".overlay")?.classList.add("open");
    document.body.classList.add("locked");
  }
  function closeDrawers() {
    $$(".drawer.open").forEach(el => el.classList.remove("open"));
    $(".overlay")?.classList.remove("open");
    document.body.classList.remove("locked");
  }

  function cartKey(productId, variants) { return `${productId}|${JSON.stringify(variants || {})}`; }
  function addToCart(productId, quantity=1, variants={}, allowWithoutVariants=false) {
    const product = getProduct(productId);
    if (!product) { toast("This product is unavailable.","error"); return; }
    if (!allowWithoutVariants && product.variants?.length) {
      const missing = product.variants.find(variant => !variants[variant.name]);
      if (missing) { toast(`Choose ${missing.name} before adding to cart.`,"error"); openProduct(productId); return; }
    }
    const key = cartKey(productId, variants);
    const existing = cart.find(item => item.key === key);
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.stockQuantity || 99);
    else cart.push({key,productId,quantity:Math.max(1,Math.min(quantity,product.stockQuantity || 99)),variants:{...variants}});
    writeStorage("north-pine-cart",cart);
    updateCounts(); renderCart(); toast(`${product.name} added to cart`);
  }

  function renderCart() {
    const body = $(".cart-items");
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = '<div class="empty-state"><h3>Your bag is empty</h3><p>Explore considered essentials for the everyday.</p><a class="btn btn-primary" href="./shop.html">Shop the collection</a></div>';
    } else {
      body.innerHTML = cart.map(item => {
        const product = getProduct(item.productId);
        if (!product) return "";
        const variantText = Object.entries(item.variants).map(([name,value]) => `${name}: ${value}`).join(" · ");
        return `<div class="cart-item">
          <img src="${escapeHtml(productImage(product))}" alt="${escapeHtml(product.name)}">
          <div><h3>${escapeHtml(product.name)}</h3>${variantText ? `<small>${escapeHtml(variantText)}</small>` : ""}<div class="qty-control" style="margin-top:.55rem"><button data-cart-minus="${escapeHtml(item.key)}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-cart-plus="${escapeHtml(item.key)}" aria-label="Increase quantity">+</button></div></div>
          <div><strong>${currency(product.price*item.quantity)}</strong><button class="icon-btn" data-cart-remove="${escapeHtml(item.key)}" aria-label="Remove ${escapeHtml(product.name)}">×</button></div>
        </div>`;
      }).join("");
    }
    const subtotal = cart.reduce((sum,item) => sum + (getProduct(item.productId)?.price || 0)*item.quantity,0);
    const threshold = config.shipping?.freeShippingThreshold || 75;
    const remaining = Math.max(0, threshold-subtotal);
    const shipping = subtotal > 0 ? (subtotal >= threshold ? 0 : (config.shipping?.defaultShippingCost || 5.95)) : 0;
    $(".cart-subtotal") && ($(".cart-subtotal").textContent = currency(subtotal));
    $(".cart-shipping") && ($(".cart-shipping").textContent = shipping === 0 ? "Free" : currency(shipping));
    $(".cart-total") && ($(".cart-total").textContent = currency(subtotal+shipping));
    $(".shipping-message") && ($(".shipping-message").textContent = remaining ? `${currency(remaining)} away from free shipping` : "You qualify for free shipping");
    $(".shipping-progress div")?.style.setProperty("width",`${Math.min(100,subtotal/threshold*100)}%`);
  }

  function changeCartQuantity(key, delta) {
    const item = cart.find(entry => entry.key === key);
    if (!item) return;
    const product = getProduct(item.productId);
    item.quantity += delta;
    if (item.quantity < 1) cart = cart.filter(entry => entry.key !== key);
    else item.quantity = Math.min(item.quantity, product?.stockQuantity || 99);
    writeStorage("north-pine-cart",cart); updateCounts(); renderCart();
  }

  function toggleWishlist(id) {
    const product = getProduct(id);
    if (!product) return;
    if (wishlist.includes(id)) wishlist = wishlist.filter(value => value !== id);
    else wishlist.push(id);
    writeStorage("north-pine-wishlist",wishlist); updateCounts();
    $$(`[data-wishlist="${CSS.escape(id)}"]`).forEach(button => { button.classList.toggle("active",wishlist.includes(id)); button.setAttribute("aria-label",`${wishlist.includes(id)?"Remove":"Add"} ${product.name} ${wishlist.includes(id)?"from":"to"} wishlist`); });
    toast(wishlist.includes(id) ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`);
  }

  function openProduct(id) {
    const product = getProduct(id);
    if (!product) return;
    recentlyViewed = [id,...recentlyViewed.filter(value => value !== id)].slice(0,6);
    writeStorage("north-pine-recent",recentlyViewed);
    activeVariants = {};
    const modal = $("#product-modal");
    if (!modal) return;
    const images = product.images?.length ? product.images : [imageFallback];
    const variants = (product.variants || []).map(variant => `<div class="variant-group" data-variant="${escapeHtml(variant.name)}"><strong>${escapeHtml(variant.name)}</strong><div class="variant-options">${variant.options.map(option => `<button type="button" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}</div></div>`).join("");
    const specs = (product.specifications || []).map(spec => `<div><strong>${escapeHtml(spec.label)}:</strong> ${escapeHtml(spec.value)}</div>`).join("");
    $("#product-modal-body").innerHTML = `<div class="product-detail"><div class="detail-gallery"><div class="detail-main"><img id="detail-main-image" src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name)}"></div><div class="thumbs">${images.map((image,index) => `<button type="button" class="${index===0?"active":""}" data-detail-image="${escapeHtml(image)}" aria-label="View image ${index+1}"><img src="${escapeHtml(image)}" alt=""></button>`).join("")}</div></div><div class="detail-info"><span class="eyebrow">${escapeHtml(product.category || "Collection")}</span><h2>${escapeHtml(product.name)}</h2><div class="rating-line">${product.rating ? `${"★".repeat(Math.round(product.rating))}${"☆".repeat(5-Math.round(product.rating))} (${product.reviewCount || 0} sample ratings)` : "No rating yet"}</div><div class="product-price">${product.compareAtPrice ? `<span class="old-price">${currency(product.compareAtPrice)}</span>` : ""}${currency(product.price)}</div><p>${escapeHtml(product.description || "Description coming soon.")}</p>${variants}<div class="detail-actions"><div class="qty-control"><button type="button" id="detail-minus" aria-label="Decrease quantity">−</button><span id="detail-qty">1</span><button type="button" id="detail-plus" aria-label="Increase quantity">+</button></div><button type="button" class="btn btn-primary" id="detail-add" data-product-id="${escapeHtml(id)}">Add to cart</button><button type="button" class="icon-btn wishlist-btn ${isWishlisted(id)?"active":""}" data-wishlist="${escapeHtml(id)}" aria-label="Wishlist">♡</button></div><div class="detail-specs">${specs}<p><strong>Shipping:</strong> ${escapeHtml(product.shippingInformation || "See shipping information.")}</p><p><strong>Returns:</strong> ${escapeHtml(product.returnInformation || "See returns information.")}</p></div></div></div>`;
    modal.classList.add("open"); $(".overlay").classList.add("open"); document.body.classList.add("locked");
  }

  function closeModal() {
    $("#product-modal")?.classList.remove("open");
    if (!$(".drawer.open")) $(".overlay")?.classList.remove("open");
    document.body.classList.remove("locked");
  }

  function initCatalog() {
    const grid = $("#catalog-grid");
    if (!grid) return;
    const categoryParam = new URLSearchParams(location.search).get("category");
    let state = {search:"",category:categoryParam || "",minPrice:0,maxPrice:Math.ceil(Math.max(...products.map(product=>product.price),1)),rating:0,sale:false,new:false,bestseller:false,sort:"featured"};
    const maxInput = $("#max-price");
    const minInput = $("#min-price");
    if (maxInput) maxInput.max = state.maxPrice;
    if (maxInput) maxInput.value = state.maxPrice;
    if (minInput) minInput.value = 0;
    const cats = [...new Set(products.map(product => product.category).filter(Boolean))];
    const catWrap = $("#category-filters");
    if (catWrap) catWrap.innerHTML = cats.map(category => `<label><input type="checkbox" value="${escapeHtml(category)}" ${category===state.category?"checked":""}> ${escapeHtml(category)}</label>`).join("");

    function apply() {
      let list = products.filter(product => {
        const haystack = [product.name,product.description,product.category,...(product.tags||[])].join(" ").toLowerCase();
        return (!state.search || haystack.includes(state.search.toLowerCase())) &&
          (!state.category || product.category === state.category) &&
          product.price >= state.minPrice && product.price <= state.maxPrice &&
          (product.rating || 0) >= state.rating &&
          (!state.sale || product.onSale) && (!state.new || product.newArrival) && (!state.bestseller || product.bestseller);
      });
      const sorts = {
        "featured":(a,b)=>Number(b.featured)-Number(a.featured),
        "recommended":(a,b)=>(b.rating||0)-(a.rating||0)+(b.reviewCount||0)-(a.reviewCount||0),
        "price-low":(a,b)=>a.price-b.price,"price-high":(a,b)=>b.price-a.price,
        "rating":(a,b)=>(b.rating||0)-(a.rating||0),"reviewed":(a,b)=>(b.reviewCount||0)-(a.reviewCount||0),
        "az":(a,b)=>a.name.localeCompare(b.name),"za":(a,b)=>b.name.localeCompare(a.name),
        "newest":(a,b)=>Number(b.newArrival)-Number(a.newArrival)
      };
      list.sort(sorts[state.sort] || sorts.featured);
      grid.innerHTML = list.map(productCard).join("") || '<div class="empty-state"><h3>No products found</h3><p>Try clearing a filter or searching another term.</p><button class="btn btn-secondary" id="reset-empty">Reset catalog</button></div>';
      $("#product-count").textContent = `${list.length} ${list.length===1?"product":"products"}`;
      $("#active-filter-count").textContent = [state.search,state.category,state.rating,state.sale,state.new,state.bestseller,state.minPrice>0,state.maxPrice<Math.ceil(Math.max(...products.map(p=>p.price)))].filter(Boolean).length;
    }
    apply();
    let debounce;
    $("#catalog-search")?.addEventListener("input",event => { clearTimeout(debounce); debounce=setTimeout(()=>{state.search=event.target.value.trim();apply();},180); });
    $("#category-filters")?.addEventListener("change",()=>{ const checked=$$("#category-filters input:checked").map(input=>input.value); state.category=checked.length===1?checked[0]:""; apply(); });
    $("#price-range")?.addEventListener("input",event=>{state.maxPrice=Number(event.target.value);if(maxInput)maxInput.value=state.maxPrice;apply();});
    minInput?.addEventListener("change",()=>{state.minPrice=Math.max(0,Number(minInput.value)||0);apply();});
    maxInput?.addEventListener("change",()=>{state.maxPrice=Math.max(state.minPrice,Number(maxInput.value)||0);apply();});
    $("#rating-filter")?.addEventListener("change",event=>{state.rating=Number(event.target.value);apply();});
    $("#sale-filter")?.addEventListener("change",event=>{state.sale=event.target.checked;apply();});
    $("#new-filter")?.addEventListener("change",event=>{state.new=event.target.checked;apply();});
    $("#bestseller-filter")?.addEventListener("change",event=>{state.bestseller=event.target.checked;apply();});
    $("#sort-select")?.addEventListener("change",event=>{state.sort=event.target.value;apply();});
    $("#clear-filters")?.addEventListener("click",resetCatalog);
    function resetCatalog(){location.href="./shop.html";}
  }

  function initSearch() {
    const overlay = $("#search-overlay");
    const input = $("#search-input");
    function openSearch() { overlay?.classList.add("open"); setTimeout(()=>input?.focus(),50); }
    function closeSearch() { overlay?.classList.remove("open"); }
    $$("[data-open-search]").forEach(button=>button.addEventListener("click",openSearch));
    $("#close-search")?.addEventListener("click",closeSearch);
    let debounce;
    input?.addEventListener("input",()=>{clearTimeout(debounce);debounce=setTimeout(()=>renderSearch(input.value),150);});
    input?.addEventListener("keydown",event=>{
      if(event.key==="Escape")closeSearch();
      if(event.key==="Enter"){const matches=searchProducts(input.value);if(matches[0])openProduct(matches[0].id);}
    });
    document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeSearch();closeModal();closeDrawers();}});
    function searchProducts(term) {
      const needle=term.trim().toLowerCase();
      if(!needle)return [];
      return products.filter(product=>[product.name,product.description,product.category,...(product.tags||[])].join(" ").toLowerCase().includes(needle));
    }
    function renderSearch(term) {
      const results=searchProducts(term); const wrap=$("#search-results");
      if(!wrap)return;
      if(!term.trim()) {wrap.innerHTML='<div class="empty-state">Start typing to search the collection.</div>';return;}
      wrap.innerHTML=results.length?results.slice(0,9).map(product=>`<button class="search-result" data-view="${escapeHtml(product.id)}"><img src="${escapeHtml(productImage(product))}" alt=""><span><strong>${escapeHtml(product.name)}</strong><span>${currency(product.price)}</span></span></button>`).join(""):'<div class="empty-state">No matches found. Try another name or category.</div>';
    }
  }

  function initTheme() {
    const saved=localStorage.getItem("north-pine-theme");
    const mode=saved||config.theme?.defaultMode||"system";
    applyTheme(mode);
    function applyTheme(value) {
      const actual=value==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):value;
      document.documentElement.dataset.theme=actual;
      localStorage.setItem("north-pine-theme",value);
      $$("[data-theme-toggle]").forEach(button=>button.setAttribute("aria-label",`Theme: ${value}. Switch theme`));
    }
    $$("[data-theme-toggle]").forEach(button=>button.addEventListener("click",()=>{const current=localStorage.getItem("north-pine-theme")||"system";const next=current==="light"?"dark":current==="dark"?"system":"light";applyTheme(next);toast(`Theme set to ${next}`);}));
  }

  function initWishlist() {
    const grid=$("#wishlist-grid");
    if(!grid)return;
    const list=products.filter(product=>wishlist.includes(product.id));
    grid.innerHTML=list.length?list.map(productCard).join(""):'<div class="empty-state" style="grid-column:1/-1"><h3>No saved items</h3><p>Use the heart on a product to keep it here.</p><a class="btn btn-primary" href="./shop.html">Explore the collection</a></div>';
  }

  function initCheckout() {
    const form=$("#checkout-form");
    if(!form)return;
    const subtotal=cart.reduce((sum,item)=>sum+(getProduct(item.productId)?.price||0)*item.quantity,0);
    const threshold=config.shipping?.freeShippingThreshold||75;
    const shipping=subtotal>=threshold||subtotal===0?0:(config.shipping?.defaultShippingCost||5.95);
    const summary=$("#checkout-summary");
    if(summary){
      summary.innerHTML=cart.length?`<h2>Order summary</h2>${cart.map(item=>{const product=getProduct(item.productId);if(!product)return "";return `<div class="summary-item"><img src="${escapeHtml(productImage(product))}" alt=""><div><strong>${escapeHtml(product.name)}</strong><br><small>Qty ${item.quantity}</small></div><strong>${currency(product.price*item.quantity)}</strong></div>`;}).join("")}<div class="summary-line"><span>Subtotal</span><strong>${currency(subtotal)}</strong></div><div class="summary-line"><span>Shipping</span><strong>${shipping?currency(shipping):"Free"}</strong></div><div class="summary-line"><span>Total</span><strong>${currency(subtotal+shipping)}</strong></div>`:'<h2>Order summary</h2><div class="empty-state">Your cart is empty.</div><a class="btn btn-secondary" href="./shop.html">Shop the collection</a>';
    }
    form.addEventListener("submit",event=>{
      event.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return;}
      if(!cart.length){toast("Add an item before starting the demo checkout.","error");return;}
      $("#checkout-confirmation").hidden=false;
      $("#checkout-confirmation").textContent="Demo complete. No payment was taken, no order was sent, and no personal details were stored. Real checkout requires a payment provider and backend or commerce integration.";
      form.reset();
    });
  }

  document.addEventListener("click",event=>{
    const wishlistButton=event.target.closest("[data-wishlist]");
    if(wishlistButton){event.preventDefault();toggleWishlist(wishlistButton.dataset.wishlist);return;}
    const viewButton=event.target.closest("[data-view]");
    if(viewButton){event.preventDefault();openProduct(viewButton.dataset.view);return;}
    const quick=event.target.closest("[data-quick-add]");
    if(quick){const product=getProduct(quick.dataset.quickAdd);if(product?.variants?.length){openProduct(product.id);}else{addToCart(product.id,1,{},true);}return;}
    const cartPlus=event.target.closest("[data-cart-plus]");
    if(cartPlus){changeCartQuantity(cartPlus.dataset.cartPlus,1);return;}
    const cartMinus=event.target.closest("[data-cart-minus]");
    if(cartMinus){changeCartQuantity(cartMinus.dataset.cartMinus,-1);return;}
    const cartRemove=event.target.closest("[data-cart-remove]");
    if(cartRemove){cart=cart.filter(item=>item.key!==cartRemove.dataset.cartRemove);writeStorage("north-pine-cart",cart);updateCounts();renderCart();toast("Item removed");return;}
    const option=event.target.closest("[data-option]");
    if(option){const group=option.closest("[data-variant]");const name=group.dataset.variant;activeVariants[name]=option.dataset.option;$$("button",group).forEach(button=>button.classList.toggle("active",button===option));return;}
    const detailImage=event.target.closest("[data-detail-image]");
    if(detailImage){    $("#detail-main-image").src=detailImage.dataset.detailImage;$$(".thumbs button").forEach(button=>button.classList.toggle("active",button===detailImage));return;}
    if(event.target.closest("#detail-plus")){$("#detail-qty").textContent=String(Math.min(99,Number($("#detail-qty").textContent)+1));return;}
    if(event.target.closest("#detail-minus")){$("#detail-qty").textContent=String(Math.max(1,Number($("#detail-qty").textContent)-1));return;}
    if(event.target.closest("#detail-add")){
      const button=event.target.closest("#detail-add");
      const id=button.dataset.productId;
      const quantity=Number($("#detail-qty")?.textContent || 1);
      addToCart(id,quantity,activeVariants,false);
      return;
    }
  });

  document.addEventListener("submit",event=>{
    if(event.target.matches("[data-newsletter]")){
      event.preventDefault();
      const input=event.target.querySelector("input[type=email]");
      if(!input.checkValidity()){input.reportValidity();return;}
      event.target.innerHTML=`<p role="status"><strong>Thank you.</strong> This demo confirms signup locally but does not store or send your address.</p>`;
    }
  });

  window.NorthPineStore = {currency,productCard,addToCart,openProduct,renderCart,toggleWishlist,toast};
  window.addEventListener("DOMContentLoaded",()=>{mountGrid("#featured-grid",products.filter(p=>p.featured).slice(0,4));mountGrid("#bestseller-grid",products.filter(p=>p.bestseller).slice(0,4));initCatalog();initWishlist();initSearch();initTheme();initCheckout();updateCounts();renderCart();});
})();
