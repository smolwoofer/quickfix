document.addEventListener('DOMContentLoaded', function() {
    // Retrieve and display location details
    const locationData = JSON.parse(localStorage.getItem('locationData'));
    if (locationData) {
        document.getElementById('location-details').textContent = 
            `Address: ${locationData.address}, ${locationData.city}, ${locationData.postalCode}`;
    }

    // Retrieve and display selected services
    let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    const serviceDetailsContainer = document.getElementById('service-details');
    let totalPrice = 0;

    function updateTotalPrice() {
        totalPrice = selectedServices.reduce((total, service) => {
            const price = parseFloat(service.price) || 0;
            const quantity = parseInt(service.quantity, 10) || 1; // Default quantity to 1 for express services
            
            return total + (service.isExpress ? price : price * quantity);
        }, 0);
        document.getElementById('total-price').textContent = `Total Price: ₹${totalPrice.toFixed(2)}/-`; // Formatting with ₹ symbol
        localStorage.setItem('totalPrice', totalPrice); // Update total price in localStorage
    }

    // Function to update service quantity
    function updateQuantity(index, increment) {
        if (!selectedServices[index].isExpress) {
            if (increment) {
                selectedServices[index].quantity++;
            } else if (selectedServices[index].quantity > 1) {
                selectedServices[index].quantity--;
            }
            localStorage.setItem('selectedServices', JSON.stringify(selectedServices)); // Update localStorage
            renderServices(); // Re-render the service list
            updateTotalPrice(); // Update the total price
        }
    }

    // Function to remove a service
    function removeService(index) {
        selectedServices.splice(index, 1);
        localStorage.setItem('selectedServices', JSON.stringify(selectedServices)); // Update localStorage
        renderServices(); // Re-render the service list
        updateTotalPrice(); // Update the total price
    }

    function renderServices() {
        serviceDetailsContainer.innerHTML = ''; // Clear existing services
        selectedServices.forEach((service, index) => {
            const serviceDiv = document.createElement('div');
            serviceDiv.classList.add('service-item');
            
            // Determine if the service is express or not
            const isExpressService = service.isExpress || ['Plumbing', 'Electrician', 'Carpenter'].includes(service.name);
            
            // Display service name and price
            const serviceName = document.createElement('p');
            serviceName.classList.add('service-name');
            serviceName.textContent = `${service.name}: ₹${service.price * (isExpressService ? 1 : (service.quantity || 1))}/-`;

            // Create quantity control buttons and quantity display
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            if (!isExpressService) {
                const quantityControl = document.createElement('div');
                quantityControl.classList.add('quantity-control');

                const minusButton = document.createElement('button');
                minusButton.textContent = '-';
                minusButton.classList.add('quantity-button');
                minusButton.addEventListener('click', () => updateQuantity(index, false));

                const quantityDisplay = document.createElement('span');
                quantityDisplay.classList.add('quantity-display');
                quantityDisplay.textContent = service.quantity || 1;

                const plusButton = document.createElement('button');
                plusButton.textContent = '+';
                plusButton.classList.add('quantity-button');
                plusButton.addEventListener('click', () => updateQuantity(index, true));

                quantityControl.appendChild(minusButton);
                quantityControl.appendChild(quantityDisplay);
                quantityControl.appendChild(plusButton);
                buttonContainer.appendChild(quantityControl);
            }

            // Create and add remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => removeService(index));
            buttonContainer.appendChild(removeButton);

            serviceDiv.appendChild(serviceName);
            serviceDiv.appendChild(buttonContainer);
            serviceDetailsContainer.appendChild(serviceDiv);
        });
        updateTotalPrice();
    }

    renderServices();

    // Proceed to payment
    document.getElementById('confirm-button').addEventListener('click', function() {
        window.location.href = 'payment.html'; // Redirect to payment page
    });
});
