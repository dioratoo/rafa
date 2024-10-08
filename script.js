

const menu = document.querySelector('#menu');
const cartBtn = document.querySelector('#cart-btn');
const cartModal = document.querySelector('#cart-modal');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const checkoutBtn = document.querySelector('#checkout-btn');
const closeModelBtn = document.querySelector('#close-modal-btn');
const cartCounter = document.querySelector('#cart-count');
const addressInput = document.querySelector('#address');
const addreessWarn = document.querySelector('#address-warn');

// Criando um array
let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = 'flex'
    updateCartModal()
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModelBtn.addEventListener("click", function () {
    cartModal.style.display = 'none'
})

menu.addEventListener("click", function (event) {

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        // chamando a função
        addToCart(name, price)
    }


})

// Funcão para adicionar no carrinho
function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // Se o item já existe, aumenta a quantidade + 1
        existingItem.quantity += 1

    } else {

        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

// Atualizar o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0

    cart.forEach(item => {
        // Criando elemento HTML
        const cartItemElement = document.createElement('div');

        // Criando estilos no elemento div
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium">R$${item.price.toFixed(2)}</p>
                </div>
          
                    <button class="remove-cart-btn" data-name="${item.name}">
                    Remover
                    </button>
     

            </div>
        `


        total += item.price * item.quantity;
        console.log(total);


        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("col", {
        style: "currency",
        currency: 'COL'
    });

    cartCounter.innerHTML = cart.length;
}

// Função pra remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)

    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal()
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addreessWarn.classList.add("hidden")
    }
})

// Finalizar pedido


checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen()
    if (!isOpen) {
        Toastify({
            text: "RESTAURANTE NO MOMENTO CERRADO!",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            onClick: function () { } // Callback after click
        }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addreessWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar o pedido para api whatts
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Precio: COL${item.price}|`
        )
    }).join("")

    const message = encodeURIComponent(cartItems);
    const phone = "3138310085";

    window.open(`https://wa.me/${phone}?text=${message} Direccion: ${addressInput.value}`, "_black");

    cart = [];
    updateCartModal()
})

// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours()

    return hora >= 18 && hora < 23

    // true = restaurante está aberto


}


const spanItem = document.querySelector("#date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-500"),
        spanItem.classList.add("bg-red-500")
}