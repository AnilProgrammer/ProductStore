let email = document.getElementById("email");
let password = document.getElementById("password");
let loginBtn = document.getElementById("submitbtn");

// Get registered users from localStorage
let registeredUser = JSON.parse(localStorage.getItem("users")) || [];

// Add event listener to login button
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Find authenticated user by matching email and password
    let authUser = registeredUser.find((user) => {
        return user.email === email.value && user.password === btoa(password.value); 
    });

    // If authenticated, store the logged-in user's name in localStorage
    if (authUser) {
        localStorage.setItem("loggedInUser", authUser.name);

        // SweetAlert for successful login
        Swal.fire({
            icon: 'success',
            title: 'Login Successfully',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            displayCartOption();  // Add the cart option after login
            window.location.assign("./#Products"); // Redirect to products page
        });
    } else {
        // SweetAlert for unauthorized user
        Swal.fire({
            icon: 'error',
            title: 'Unauthorized user',
            text: 'Please sign up.',
            showConfirmButton: true
        }).then(() => {
            window.location.assign("./Signup.html");  // Redirect to signup page
        });
    }
});

// Function to add the cart option to the navbar
function displayCartOption() {
    const loggedInUser = localStorage.getItem('loggedInUser');  // Check if the user is logged in
    if (loggedInUser) {
        const navBar = document.querySelector('nav ul');  // Select the navbar
        if (!document.querySelector('nav ul li a[href="./cart.html"]')) {  // Avoid duplicate cart links
            const cartOption = document.createElement('li');  // Create a list item
            cartOption.innerHTML = '<a href="./cart.html">Cart</a>';  // Create cart link
            navBar.appendChild(cartOption);  // Append cart link to the navbar
        }
    }
}

// Function to display user's name and logout button in the navbar
function displayUserWelcome() {
    const loggedInUser = localStorage.getItem('loggedInUser');  // Get logged-in user's name from localStorage
    const userWelcomeDiv = document.getElementById('user-welcome');  // Get the navbar welcome span
    const userContainerDiv = document.getElementById('user-container');  // Get the container div for the welcome message

    if (loggedInUser) {
        userWelcomeDiv.innerHTML = `Welcome, ${loggedInUser}`;  // Display the user's name
        userContainerDiv.style.display = 'block';  // Show the container with the message
        displayCartOption();  // Add cart option if user is logged in
    } else {
        userContainerDiv.style.display = 'none';  // Hide the container if no user is logged in
    }
}

// Call displayUserWelcome on page load
window.onload = displayUserWelcome;

