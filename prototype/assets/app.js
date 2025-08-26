document.addEventListener('DOMContentLoaded', () => {
    const app = {
        state: {
            products: [],
            categories: [],
            cart: [], // { id, name, price, image, quantity }
            currentPage: 'home',
            currentProductId: null,
            currentCategoryId: null,
        },
        elements: {
            header: document.getElementById('app-header'),
            main: document.getElementById('app-main'),
            nav: document.getElementById('app-nav'),
        },
        init() {
            this.fetchData().then(() => {
                this.renderNav();
                this.router();
                window.addEventListener('hashchange', this.router.bind(this));
            });
            this.attachEventListeners();
        },
        async fetchData() {
            try {
                const response = await fetch('assets/dummy-data.json');
                const data = await response.json();
                this.state.products = data.products;
                this.state.categories = data.categories;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                this.elements.main.innerHTML = '<p>Error loading content.</p>';
            }
        },
        router() {
            const hash = window.location.hash.slice(1).split('/');
            const page = hash[0] || 'home';
            const id = hash[1];

            this.state.currentPage = page;
            if (page === 'product') {
                this.state.currentProductId = id;
                this.renderProductDetailScreen();
            } else if (page === 'category') {
                this.state.currentCategoryId = id;
                this.renderProductListScreen();
            } else if (page === 'cart') {
                this.renderCartScreen();
            } else {
                this.renderHomeScreen();
            }
            this.updateNavActiveState();
        },
        attachEventListeners() {
            // Event delegation for dynamically added elements
            this.elements.main.addEventListener('click', (e) => {
                if (e.target.closest('.product-card')) {
                    const id = e.target.closest('.product-card').dataset.id;
                    window.location.hash = `#/product/${id}`;
                } else if (e.target.closest('.category-card')) {
                    const id = e.target.closest('.category-card').dataset.id;
                    window.location.hash = `#/category/${id}`;
                } else if (e.target.closest('.add-to-cart-btn')) {
                    const id = e.target.closest('.add-to-cart-btn').dataset.id;
                    this.addToCart(id);
                } else if (e.target.closest('.cart-item-remove')) {
                    const id = e.target.closest('.cart-item-remove').dataset.id;
                    this.removeFromCart(id);
                } else if (e.target.closest('.qty-change')) {
                    const id = e.target.dataset.id;
                    const change = parseInt(e.target.dataset.change, 10);
                    this.updateQuantity(id, change);
                }
            });

            this.elements.nav.addEventListener('click', (e) => {
                const navItem = e.target.closest('.nav-item');
                if (navItem) {
                    window.location.hash = `#/${navItem.dataset.page}`;
                }
            });

            this.elements.header.addEventListener('click', (e) => {
                if (e.target.closest('.back-btn')) {
                    window.history.back();
                }
            });
        },
        renderHeader(title, showBackButton = false) {
            this.elements.header.innerHTML = `
                ${showBackButton ? '<button class="back-btn">&#x2190;</button>' : '<div></div>'}
                <h1>${title}</h1>
                <div></div>
            `;
        },
        renderNav() {
            const cartCount = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.elements.nav.innerHTML = `
                <div class="nav-item" data-page="home">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                    Home
                </div>
                <div class="nav-item" data-page="category/all">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                    Shop
                </div>
                <div class="nav-item" data-page="cart">
                     <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
                    Cart
                    ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
                </div>
            `;
            this.updateNavActiveState();
        },
        updateNavActiveState() {
            this.elements.nav.querySelectorAll('.nav-item').forEach(item => {
                const page = item.dataset.page;
                if (page === this.state.currentPage || (page === 'category/all' && this.state.currentPage === 'category')) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        },
        renderProductGrid(products) {
            return `
                <div class="product-grid">
                    ${products.map(p => `
                        <div class="product-card" data-id="${p.id}">
                            <img src="${p.image}" alt="${p.name}">
                            <div class="product-card-info">
                                <h3 class="product-card-name">${p.name}</h3>
                                <p class="product-card-price">$${p.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },
        renderHomeScreen() {
            this.renderHeader('Store');
            const featuredProducts = this.state.products.slice(0, 4);
            this.elements.main.innerHTML = `
                <input type="text" class="search-bar" placeholder="Search products...">
                <div class="hero-banner">Summer Sale</div>
                <h2 class="section-title">Categories</h2>
                <div class="categories-grid">
                    ${this.state.categories.map(c => `<div class="category-card" data-id="${c.id}">${c.name}</div>`).join('')}
                </div>
                <h2 class="section-title">Featured</h2>
                ${this.renderProductGrid(featuredProducts)}
            `;
        },
        renderProductListScreen() {
            const categoryId = this.state.currentCategoryId;
            const category = this.state.categories.find(c => c.id === categoryId);
            const title = category ? category.name : 'All Products';
            const productsToList = categoryId === 'all' 
                ? this.state.products 
                : this.state.products.filter(p => p.category === categoryId);

            this.renderHeader(title, true);
            this.elements.main.innerHTML = `
                <p>${productsToList.length} products found</p>
                ${this.renderProductGrid(productsToList)}
            `;
        },
        renderProductDetailScreen() {
            const product = this.state.products.find(p => p.id === this.state.currentProductId);
            if (!product) {
                this.elements.main.innerHTML = '<p>Product not found.</p>';
                return;
            }
            this.renderHeader(product.name, true);
            this.elements.main.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-detail-img">
                <h2 class="product-detail-name">${product.name}</h2>
                <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                <p class="product-detail-desc">${product.description}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
        },
        renderCartScreen() {
            this.renderHeader('Shopping Cart');
            if (this.state.cart.length === 0) {
                this.elements.main.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                    </div>
                `;
                return;
            }

            const subtotal = this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shipping = 5.00;
            const total = subtotal + shipping;

            this.elements.main.innerHTML = `
                ${this.state.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-actions">
                                <div class="cart-item-quantity">
                                    <button class="qty-change" data-id="${item.id}" data-change="-1">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="qty-change" data-id="${item.id}" data-change="1">+</button>
                                </div>
                                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('')}

                <div class="cart-summary">
                    <div class="summary-line">
                        <span>Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-line">
                        <span>Shipping</span>
                        <span>$${shipping.toFixed(2)}</span>
                    </div>
                    <div class="summary-line total">
                        <span>Total</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                <button class="btn" style="margin-top: 2rem;">Proceed to Checkout</button>
            `;
        },
        addToCart(productId) {
            const product = this.state.products.find(p => p.id === productId);
            const cartItem = this.state.cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                this.state.cart.push({ ...product, quantity: 1 });
            }
            this.renderNav(); // Update cart badge
        },
        removeFromCart(productId) {
            this.state.cart = this.state.cart.filter(item => item.id !== productId);
            this.renderCartScreen();
            this.renderNav();
        },
        updateQuantity(productId, change) {
            const cartItem = this.state.cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += change;
                if (cartItem.quantity <= 0) {
                    this.removeFromCart(productId);
                } else {
                    this.renderCartScreen();
                    this.renderNav();
                }
            }
        }
    };

    app.init();
});
