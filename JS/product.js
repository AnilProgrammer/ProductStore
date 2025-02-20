
//!!++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let product_wrapper = document.querySelector("#product_wrapper");
let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Retrieve existing cart items or start fresh

// Function to add products to cart
function addToCart(product) {
    if (!localStorage.getItem('loggedInUser')) {
        Swal.fire({
            title: 'Login Required',
            text: 'Please login to add products to cart.',
            confirmButtonText: 'Login',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.assign('./Login.html'); // Redirect to login page if not logged in
            }
        });
    } else {
        // Check if the product is already in the cart to prevent duplicates
        if (!cart.some(item => item.id === product.id)) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Product add to Cart successfully!',
            });
        } else {
            Swal.fire("This Product already exist to Cart");
        }
    }
}

async function fetchdata() {
    let response = await fetch("https://fakestoreapi.com/products");
    let data = await response.json();
    displayData(data);
}

function displayData(products) {
    products.forEach((product) => {
        let product_container = document.createElement("article");
        product_container.setAttribute("class", "product-container");

        let img = document.createElement("img");
        img.setAttribute("src", product.image);

        let para = document.createElement("p");
        para.innerText = product.description;

        let title = document.createElement("h3");
        title.innerText = product.title;

        let price = document.createElement('div');
        price.className = 'price';
        price.innerText = `$${product.price}`;

        let rating = document.createElement('div');
        rating.className = 'rating';
        rating.innerText = `Rating: ${product.rating.rate}`;

        let addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add to Cart';

        // Check login status and add to cart
        addToCartButton.addEventListener('click', () => addToCart(product));

        product_container.append(img, title, para, price, rating, addToCartButton);
        product_wrapper.append(product_container);
    });
}

fetchdata();

// Function to display user's name and logout button in the navbar
function displayUserWelcome() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userWelcomeDiv = document.getElementById('user-welcome');
    const userContainerDiv = document.getElementById('user-container');

    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    if (loggedInUser) {
        userWelcomeDiv.innerHTML = `Welcome, ${loggedInUser}`;
        userContainerDiv.style.display = 'block';

        // Remove login and signup buttons from the DOM
        if (loginBtn) loginBtn.remove();
        if (signupBtn) signupBtn.remove();


        displayCartOption();  // Display the cart option when the user is logged in
    } else {
        userContainerDiv.style.display = 'none';

        // Show login and signup buttons if user is not logged in
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
    }
}

// Function to add the cart option to the navbar
function displayCartOption() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const navBar = document.querySelector('nav ul');
        if (!document.querySelector('nav ul li a[href="./cart.html"]')) {  // Avoid duplicate cart links
            const cartOption = document.createElement('li');
            cartOption.innerHTML = '<a href="./cart.html">Cart</a>';
            navBar.appendChild(cartOption);
        }
    }
}

// Function to handle logout
function logoutUser() {
    localStorage.removeItem('loggedInUser');
    displayUserWelcome();
    alert("You have successfully logged out");
    window.location.assign("./Login.html");
}

// Call the function to check and display the user when the page loads
window.onload = function() {
    displayUserWelcome();  // Display the user's name
    displayCartOption();  // Ensure the cart option is added if user is logged in
};

// Attach the logout functionality to the logout button
document.getElementById('logout-btn').addEventListener('click', logoutUser);




// !#########################################################################################


