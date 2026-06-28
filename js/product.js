document.addEventListener('DOMContentLoaded', init);

async function init() {
    const productId = getProductId();
    if (productId) {
        await fetchAndDisplayProduct(productId);
    } else {
        showNoProductError();
    }
}

function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    if (idFromUrl) {
        return idFromUrl;
    }
    return localStorage.getItem('selectedProductId');
}

async function fetchAndDisplayProduct(productId) {
    const container = document.getElementById('product-details-container');
    
    try {
        showLoading(container);
        const product = await fetchProduct(productId);
        renderProductDetails(product, container);
    } catch (error) {
        showError(container, error.message);
    }
}

async function fetchProduct(productId) {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return await response.json();
}

function showLoading(container) {
    container.innerHTML = '<p class="loading">Loading product details...</p>';
}

function showError(container, message) {
    container.innerHTML = `<p class="error">Error: ${message}</p>`;
}

function showNoProductError() {
    const container = document.getElementById('product-details-container');
    container.innerHTML = '<p class="error">No product selected</p>';
}

function renderProductDetails(product, container) {
    container.innerHTML = `
        <div class="product-details">
            <img src="${product.images[0] || product.thumbnail}" alt="${product.title}" class="product-large-image">
            <div class="product-info">
                <h1 class="product-title">${product.title}</h1>
                <p class="product-brand">Brand: ${product.brand || 'N/A'}</p>
                <p class="product-category">Category: ${product.category || 'N/A'}</p>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="rating-value">${product.rating.toFixed(1)}</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-stock">Stock: ${product.stock} units</p>
                <p class="product-description">${product.description}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    attachEventListeners();
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '☆';
    }
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

function attachEventListeners() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }
}

function handleAddToCart(e) {
}