let productsData = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await fetchAndDisplayProducts();
}

async function fetchAndDisplayProducts() {
    const container = document.getElementById('products-container');
    
    try {
        showLoading(container, 'Loading products...');
        productsData = await fetchProducts();
        renderProducts(productsData, container);
    } catch (error) {
        showError(container, error.message);
    }
}

async function fetchProducts() {
    const response = await fetch('https://dummyjson.com/products?limit=194');
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
}

function renderProducts(products, container) {
    container.innerHTML = products.map(createProductCard).join('');
    attachEventListeners();
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="rating-value">${product.rating.toFixed(1)}</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-buttons">
                    <button class="btn view-details-btn" data-id="${product.id}">View Details</button>
                    <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

function attachEventListeners() {
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', handleViewDetails);
    });
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
}

function handleViewDetails(e) {
    const productId = e.target.getAttribute('data-id');
    localStorage.setItem('selectedProductId', productId);
    window.location.href = `product.html?id=${productId}`;
}

function handleAddToCart(e) {
    e.preventDefault();
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = productsData.find(p => p.id === productId);
    
    if (product) {
        addToCart(product);
    }
}
