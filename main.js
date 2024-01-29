let products = [];
let cart = [];

//* Selectors

const Selectors = {
    products: document.querySelector(".products"),
    cartBtn: document.querySelector(".cart-btn"),
    cartQty: document.querySelector(".cart-qty"),
    cartClose: document.querySelector(".cart-close"),
    cart: document.querySelector(".cart"),
    cartOverlay: document.querySelector(".cart-overlay"),
    cartClear: document.querySelector(".cart-clear"),
    cartBody: document.querySelector(".cart-body"),
    cartTotal: document.querySelector(".cart-total"),
};


//* event listenes

const setUpListeners = () => {
    document.addEventListener('DOMContentLoaded' , initStore);

    //product event 
    Selectors.products.addEventListener("click" , addToCart);

    // cart events 
    Selectors.cartBtn.addEventListener('click' , showCart);
    Selectors.cartOverlay.addEventListener('click' , hideCart);
    Selectors.cartClose.addEventListener('click' , hideCart);
    Selectors.cartBody.addEventListener('click' , updateCart);
    Selectors.cartClear.addEventListener('click' , clearCart);



}

//* event handlers

const initStore = () => {
    loadCart();
    loadProducts('https://fakestoreapi.com/products')
    .then(() => renderProducts())
    .catch(() => alert("URL not found"))
    .finally(() =>  renderCart());
    
}

const showCart = () => {
    Selectors.cart.classList.add("show");
    Selectors.cartOverlay.classList.add("show");
}

const hideCart = () => {
    Selectors.cart.classList.remove("show");
    Selectors.cartOverlay.classList.remove("show");
}

const clearCart = () => {
    cart = [];
    saveCart();
    renderCart();
    renderProducts();
    setTimeout(hideCart , 500);
}

const addToCart = (e) => {
    if(e.target.hasAttribute('data-id')) {
        const id = parseInt(e.target.dataset.id);
        const inCart = cart.find((x) => x.id === id);

        if(inCart) {
            alert("Item is alredy in cart");
            return;
        }

        cart.push({id , qty: 1});
        saveCart();
        renderProducts();
        renderCart();
        showCart();
    }
}

const removeFromCart = (id) => {
    cart = cart.filter(x => x.id !== id);

    // if the last item is removed , then close the cart
    cart.length === 0 && setTimeout(hideCart , 500)


    renderProducts();
}


const increaseQty = (id) => {
    const item = cart.find((x) => x.id === id);
    if(!item) return;
    
    item.qty++;
}

const decreaseQty = (id) => {
    const item = cart.find((x) => x.id === id);
    if(!item) return;

    item.qty--;

    if(item.qty === 0) removeFromCart(id);
}

const updateCart = (e) => {
    if(e.target.hasAttribute('data-btn')) {
        const cartItem = e.target.closest('.cart-item');
        const id = parseInt(cartItem.dataset.id);
        const btn = e.target.dataset.btn;



        if (btn === 'incr'){
            increaseQty(id);
        }else if(btn === 'decr') {
            decreaseQty(id);
        }


        // btn === 'incr' && increaseQty(id);
        // btn === 'decr' && decreaseQty(id);

        saveCart();
        renderCart();
    }
}


const saveCart = () => {
    localStorage.setItem('online-store' , JSON.stringify(cart));
}

const loadCart = () => {
    cart = JSON.parse(localStorage.getItem('online-store')) || [];
}


//* render functions



const renderCart = () => {

    // show card qty in navbar
    // const cartQty = cart.reduce((sum , item) => {
    //     return sum + item.qty;
    // }, 0);
    const cartQty = cart.length;
    Selectors.cartQty.textContent = cartQty;
    Selectors.cartQty.classList.toggle('visibal' , cartQty )


    // show cart total

    Selectors.cartTotal.textContent = calculateTotal().format();

    // shoe empty card 
    if (cart.length === 0) {
        Selectors.cartBody.innerHTML = 
        '<div class="cart-empty">Your cart is empty.</div>';
        return;
    }


    //show cart item
    Selectors.cartBody.innerHTML = cart.map(({id , qty}) => {
        

        //get product information of each card item
        const product = products.find((product) => product.id === id);

        const {title , image , price} = product;
        
        const amount = price * qty ; 

        return `
        <div class="cart-item" data-id=${id}>
            <img src="${image}" alt="${title}">
            <div class="cart-item-detail">
                <h3>${title}</h3>
                <h5>${price.format()}</h5>
                <div class="cart-item-amount">
                    <i class="bi bi-dash-lg" data-btn="decr"></i>
                    <span class="qty">${qty}</span>
                    <i class="bi bi-plus-lg" data-btn="incr"></i>
                    <span class="cart-item-price">
                    ${amount.format()}
                    </span>
                </div>
            </div>
        </div>`;

    }).join("")
}


const renderProducts = () => {
    Selectors.products.innerHTML = products.map(product => {
        const {id , title , image , price} = product;
        //check if the product already in card
        const inCart = cart.find((x) => x.id === id);
        //make the add to cart button disabled if product already in cart
        const disabled = inCart ? "disabled" : "";
        //change the text if already in cart
        const text = inCart ? "Add in cart" : "Add to cart";

        return  `
            <div class="product  " >
               <div class="d-flex flex-column h-100">
                <div>
                <img src="${image}" alt="${title}" class="">
                </div>
                <div>
                <h3 class="">${title}</h3>
                </div>
                <div>
                <h5>${price.format()}</h5>
                </div>
               

                <div class="mt-auto d-flex justify-content-between align-items-center">
                <button ${disabled} data-id=${id} class="btn btn-primary">${text}</button>
                    <a href ='./product.html?id=${id}' class="btn btn-secondary" >View</a>
                </div>
               </div>
            </div> 
        `;
    }).join("");
}





//* api functions

const loadProducts = async (apiURL) => {
    try {
        const response = await fetch(apiURL);
        if(!response.ok){
            throw new Error(`http error! status= ${respones.status}`)
        }
        products = await response.json();
        console.log(products);
    } catch (error) {
        console.log("fetch error: " , error)
    }
}

//* helper functions

const calculateTotal = () => {
    return cart.map(({id , qty}) => {
        const{price} = products.find((x) => x.id === id);

        return qty * price;
    }).reduce((sum , number) => {
        return sum + number;
    }, 0) 
};

Number.prototype.format = function () {
    return this.toLocaleString("en-SA", {
        style : "currency",
        currency : "USD", 
        
    });
};



//* initialize

setUpListeners();









