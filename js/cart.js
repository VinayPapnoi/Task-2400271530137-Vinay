document.addEventListener('DOMContentLoaded', init);

function init() {
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-container');
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
    }
    
    let total = 0;
    const cartHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <p class="cart-item-total">$${itemTotal.toFixed(2)}</p>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        ${cartHTML}
        <div class="cart-total">
            <h2>Total: $${total.toFixed(2)}</h2>
        </div>
    `;
    
    attachCartEventListeners();
}

function attachCartEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
}

function handleQuantityChange(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const action = e.target.getAttribute('data-action');
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
        updateQuantity(productId, newQuantity);
        renderCart();
    }
}

function handleRemoveItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    removeFromCart(productId);
    renderCart();
}