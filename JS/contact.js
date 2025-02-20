document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    let name = document.querySelector('input[type=text]').value;
    let email = document.querySelector('input[type=email]').value;
    let message = document.querySelector('textarea').value;

    if (name === '' || email === '' || message === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in all fields',
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Message sent successfully!',
    });

    // Clear the form fields
    document.querySelector('form').reset();
});

