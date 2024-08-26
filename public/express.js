// Initialize selectedServices array from localStorage or default to an empty array
let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];

const expressServices = [
    { name: 'Plumbing', price: 500, img: 'images/plumb.jpg' },
    { name: 'Electrician', price: 600, img: 'images/elect.jpg' },
    { name: 'Carpenter', price: 700, img: 'images/carp.jpg' }
];

const serviceProviders = [
    { name: 'Rahul Kumar', contact: '9876543210', rating: 4.5 },
    { name: 'Suresh Gupta', contact: '8765432109', rating: 4.7 },
    { name: 'Amit Sharma', contact: '7654321098', rating: 4.2 },
    { name: 'Ravi Verma', contact: '7543210987', rating: 4.6 },
    { name: 'Karan Singh', contact: '6543210987', rating: 4.8 },
    { name: 'Anil Mehra', contact: '5432109876', rating: 4.3 }
];

// Function to randomly assign a service provider
function assignServiceProvider() {
    const randomIndex = Math.floor(Math.random() * serviceProviders.length);
    return serviceProviders[randomIndex];
}

// Function to generate a fixed 30-minute arrival time window for express services
function getExpressArrivalTime() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Set to next day

    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(Math.random() * 10) + 9); // Random hour between 9 and 18
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes later

    return {
        start: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: startTime.toLocaleDateString()
    };
}

// Function to store selected services
function storeSelectedService(service) {
    const existingServiceIndex = selectedServices.findIndex(s => s.name === service.name);
    const assignedProvider = assignServiceProvider();
    const arrivalTime = getExpressArrivalTime(); // Set arrival time

    if (existingServiceIndex === -1) {
        // Add new service only if it does not already exist
        selectedServices.push({
            ...service,
            quantity: 1, // Set quantity to 1 for express services
            provider: assignedProvider.name,
            contact: assignedProvider.contact,
            rating: assignedProvider.rating,
            arrivalTime: arrivalTime // Add arrival time
        });
        localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    }
}

// Function to render express services
function renderExpressServices() {
    const container = document.getElementById('express-services-container');
    if (!container) {
        console.error('Express services container not found!');
        return;
    }

    expressServices.forEach(service => {
        const serviceDiv = document.createElement('div');
        serviceDiv.classList.add('express-service');

        const serviceImg = document.createElement('img');
        serviceImg.src = service.img;
        serviceImg.alt = service.name;
        serviceDiv.appendChild(serviceImg);

        const serviceName = document.createElement('h2');
        serviceName.textContent = service.name;
        serviceDiv.appendChild(serviceName);

        const servicePrice = document.createElement('p');
        servicePrice.textContent = `Price: ₹${service.price}/-`;
        serviceDiv.appendChild(servicePrice);

        // Book Service button for express services
        const bookButton = document.createElement('button');
        bookButton.classList.add('book-btn');
        bookButton.textContent = 'Book Service';
        bookButton.addEventListener('click', () => {
            storeSelectedService(service); // Store the selected service
            bookButton.textContent = 'Booked'; // Change button text
            bookButton.classList.add('booked'); // Add 'booked' class
            bookButton.disabled = true; // Disable the button
        });
        serviceDiv.appendChild(bookButton);

        container.appendChild(serviceDiv);
    });
}

// Run renderExpressServices function when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderExpressServices();

    // Handle the proceed button click event
    const proceedButton = document.getElementById('proceed-button');
    if (proceedButton) {
        proceedButton.addEventListener('click', function() {
            window.location.href = 'location.html'; // Redirect to location page
        });
    }
});
