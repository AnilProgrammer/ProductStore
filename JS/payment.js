// todo =======================================================================================
document.addEventListener('DOMContentLoaded', function () {
    const amountInput = document.getElementById('amount');
    const totalPrice = localStorage.getItem('totalPrice');
    
    if (totalPrice) {
        amountInput.value = totalPrice; // Automatically set the amount field
    } else {
        amountInput.value = '0.00'; // Set to 0 if no total Price is available
    }
});

// Event listener for the 'Pay Now' button
document.getElementById('pay-now-btn').addEventListener('click', function (e) {
    e.preventDefault();

    let amount = parseFloat(document.getElementById('amount').value);
    let cardholderName = document.getElementById('cardholder-name').value;
    let cardNumber = document.getElementById('card-number').value;
    let expiryDate = document.getElementById('expiry-date').value;
    let cvv = document.getElementById('cvv').value;

    // Check if the amount is 0.00
    if (amount === 0.00) {
        Swal.fire({
            icon: 'error',
            title: 'Empty Cart',
            text: 'Your cart is empty. Please add items to the cart before proceeding to payment.',
        });
        return;
    }

    // Validation for empty fields
    if (cardholderName === '' || cardNumber === '' || expiryDate === '' || cvv === '') {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please fill in all fields.',
        });
        return;
    }

    // Validation for correct card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Card Number',
            text: 'Card number must be 16 digits.',
        });
        return;
    }

    // Validation for CVV (3 digits)
    if (!/^\d{3}$/.test(cvv)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid CVV',
            text: 'CVV must be 3 digits.',
        });
        return;
    }

    // Simulate a random outcome for payment processing
    let paymentSuccess = Math.random() < 0.5; // 50% chance of success or failure

    // Simulate a payment processing delay
    Swal.fire({
        title: 'Processing Payment...',
        text: 'Please wait while we process your payment.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        willClose: () => {
            if (paymentSuccess) {
                // Simulate successful payment
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    text: 'Your payment was processed successfully.',
                }).then(() => {
                    // Clear the cart after successful payment
                    localStorage.removeItem('cart');
                    localStorage.removeItem('totalPrice');
                    window.location.assign('./Index.html'); // Redirect to product page
                });
            } else {
                // Simulate failed payment
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong with your payment!',
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        }
    });
});


