let loginEmail = document.querySelector("#email");
let Password1 = document.querySelector("#password");
let Name1 = document.querySelector("#Name"); // Get the name input field
let loginsubmit = document.querySelector("#submitbtn");
let users = JSON.parse(localStorage.getItem("users")) || []; // Load users from localStorage

loginsubmit.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("submitted");

    // Validate input fields
    if (!Name1.value || !loginEmail.value || !Password1.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'All fields are required!',
        });
        return;
    }

    // Create the new user object
    let loginUser = {
        name: Name1.value, // Store the user's name
        email: loginEmail.value,
        password: btoa(Password1.value), // Hash the password using btoa()
    };

    // Add new user to the users array
    users.push(loginUser);

    // Store updated users array in localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Sign-In successfully!',
    }).then(() => {
        // Redirect to login page after successful sign-in
        window.location.assign("./Login.html");
    });

    // Clear input fields
    Name1.value = "";
    loginEmail.value = "";
    Password1.value = "";

    console.log(users); // For debugging purposes
});
