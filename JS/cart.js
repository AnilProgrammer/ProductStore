document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');
    // const buyButton= document.getElementById('buy');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartTimestamp = localStorage.getItem('cartTimestamp') || new Date().getTime();
    
    // Store active state in sessionStorage (to prevent premature deletion when navigating)
    let isReturningFromOtherPage = sessionStorage.getItem('isReturningFromOtherPage') === 'true';

    // Update cartTimestamp every time user adds a product or performs an action
    function updateCartTimestamp() {
        cartTimestamp = new Date().getTime();
        localStorage.setItem('cartTimestamp', cartTimestamp);
    }

    // Function to check cart expiration based on timestamp
    function checkCartExpiration() {
        const currentTime = new Date().getTime();
        const timeDiff = (currentTime - cartTimestamp) / (1000 * 60); // Convert to minutes

        // Only clear cart if more than 30 minutes have passed and user is not actively interacting
        if (timeDiff > 30 && !isReturningFromOtherPage) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        }
    }

    // Call the expiration check only if it's not a navigation from another page
    if (!isReturningFromOtherPage) {
        checkCartExpiration();
    }

    // Reset the session storage state
    sessionStorage.setItem('isReturningFromOtherPage', 'false');

    function displayCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('cart-item');

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;

            const title = document.createElement('h3');
            title.innerText = item.title;

            const price = document.createElement('div');
            price.classList.add('price');
            price.innerText = `$${item.price}`;

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotalPrice();
                displayCartItems();
                updateCartTimestamp(); // Update timestamp when item is deleted
            });

            // Append the delete button and other elements
            itemContainer.append(img, title, price, deleteButton);
            cartItemsContainer.appendChild(itemContainer);

            totalPrice += item.price;
        });

        totalPriceElement.innerText = `Total Price: $${totalPrice.toFixed(2)}`;
        localStorage.setItem('totalPrice', totalPrice.toFixed(2)); // Update totalPrice in localStorage
    }

    function updateTotalPrice() {
        let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.innerText = `Total Price: $${totalPrice.toFixed(2)}`;
        localStorage.setItem('totalPrice', totalPrice.toFixed(2)); // Update the total price in localStorage
    }

    function clearCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve the cart from localStorage
        if (cart.length === 0) {
            Swal.fire({
                title: "Your cart is empty!",
                text: "First, add a product to your cart.",
                icon: "info",
                confirmButtonText: "OK"
            });
            return; // Stop further execution of the function
        }

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
    
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to All Clear Cart this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // If the user confirms, clear the cart
                localStorage.removeItem('cart');
                cart = [];
                updateTotalPrice();
                displayCartItems();
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your cart has been cleared.",
                    icon: "success"
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your cart is safe :)",
                    icon: "error"
                });
            }
        });
    }
    

    function checkout() {
        if(cart.length==0){
            Swal.fire({
                icon: 'warning',
                title: 'No Products in Cart',
                text: 'Please add products to the cart before proceeding to checkout.',
                showConfirmButton: true
            });
            return; // Exit the function early if the cart is empty
        }
        Swal.fire({
            title: 'Processing...',
            text: 'Checking product availability...',
            timer: 3000, // Wait for 3 seconds
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Products Available!',
                text: 'All products are available. Redirecting to payment...',
                timer: 2500, // Wait for 2.5 more seconds before redirecting
                showConfirmButton: false
            }).then(() => {
                const totalPrice = totalPriceElement.innerText.replace('Total Price: $', '');
                localStorage.setItem('totalPrice', totalPrice);
                // window.location.assign('./Payment.html');
            });
        });
    }
    // function buy() {
    //     if (cart.length === 0) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'No Products in Cart',
    //             text: 'Please add products to the cart before proceeding to payment.',
    //             showConfirmButton: true
    //         });
    //     } else {
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Proceeding to Payment',
    //             text: 'You will be redirected to the payment page.',
    //             timer: 20000, // 2 second delay before redirecting
    //             showConfirmButton: false
    //         }).then(() => {
    //             const totalPrice = totalPriceElement.innerText.replace('Total Price: $', '');
    //             localStorage.setItem('totalPrice', totalPrice);
    //             window.location.assign('./Payment.html'); // Redirect to payment page
    //         });
    //     }
    // }
    
    clearCartButton.addEventListener('click', clearCart);
    checkoutButton.addEventListener('click', checkout);
    // buyButton.addEventListener('click', buy);

    // Whenever a new item is added, we update the cart and the timestamp
    function addToCart(newItem) {
        cart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartTimestamp();
        displayCartItems();
    }

    // When the user navigates back from another page, mark the session storage flag
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('isReturningFromOtherPage', 'true');
    });

    displayCartItems();
});

