// carrito.js - Funciones del carrito de compras

// Función para obtener el carrito del localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Función para guardar el carrito en localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para añadir producto al carrito
function addToCart(name, price, image, quantity = 1) {
    let cart = getCart();
    
    // Buscar si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.name === name);
    
    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: parseInt(quantity)
        });
    }
    
    saveCart(cart);
    updateCartCount();
    showAddToCartAlert();
}

// Función para eliminar producto del carrito
function removeFromCart(productName) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== productName);
    saveCart(cart);
    renderCart(); // Recargar la vista del carrito
    updateCartCount();
}

// Función para actualizar la cantidad en el ícono del carrito
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar el badge en el ícono del carrito
    let cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) {
        const cartIcon = document.querySelector('a[href="Carrito.html"]');
        cartBadge = document.createElement('span');
        cartBadge.className = 'cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
        cartIcon.parentElement.style.position = 'relative';
        cartIcon.parentElement.appendChild(cartBadge);
    }
    
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
}

// Función para mostrar alerta de producto añadido
function showAddToCartAlert() {
    // Crear alerta temporal
    const alert = document.createElement('div');
    alert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
    alert.style.zIndex = '9999';
    alert.innerHTML = '<i class="bi bi-check-circle-fill"></i> Producto añadido al carrito';
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 2000);
}

// Función para renderizar el carrito en Carrito.html
function renderCart() {
    const cartContainer = document.querySelector('#cart-items');
    const totalElement = document.querySelector('#cart-total');
    
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x" style="font-size: 4rem; color: #6c757d;"></i>
                <h4 class="mt-3">Tu carrito está vacío</h4>
                <a href="index.html" class="btn btn-danger mt-3">Seguir comprando</a>
            </div>
        `;
        totalElement.textContent = '₡0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.image}" width="60" height="60" style="object-fit: cover;">
                    <div>
                        <div class="fw-bold">${item.name}</div>
                        <small class="text-muted">₡${item.price} x ${item.quantity}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-bold">₡${itemTotal}</span>
                    <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart('${item.name}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
    
    cartContainer.innerHTML = html;
    totalElement.textContent = `₡${total}`;
}

// Función para vaciar el carrito completamente
function clearCart() {
    localStorage.removeItem('cart');
    renderCart();
    updateCartCount();
}

// Inicializar cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCart();
});