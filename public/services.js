const services = [
    { name: 'AC and appliances repair', price: 800, img: 'images/app.jpg' },
    { name: 'Kitchen cleaning', price: 700, img: 'images/kitchen.jpg' },
    { name: 'Washroom cleaning', price: 1000, img: 'images/washroom.jpg' },
    { name: 'Water purifier repair', price: 1200, img: 'images/waterrpuri.jpg' },
    { name: 'Full house cleaning', price: 2000, img: 'images/house.jpg' },
    { name: 'Sofa cleaning (3-seater)', price: 599, img: 'images/sofa3.jpg' },
    { name: 'Sofa cleaning (4-seater)', price: 699, img: 'images/sofa4.jpg' },
    { name: 'Sofa cleaning (6-seater)', price: 799, img: 'images/sofa6.jpg' },
    { name: 'Sofa cleaning (7-seater)', price: 999, img: 'images/sofa7.jpg' },
    { name: 'Express Services', price: null, img: 'images/express.png' } // Express service
];

// Function to generate a random 1-hour arrival time window for normal services
function getRandomArrivalTimeWindow() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Set to next day

    const minHours = 9;
    const maxHours = 18;

    const randomStartHours = Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
    const randomEndHours = randomStartHours + 1;

    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), randomStartHours);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), randomEndHours);

    return {
        start: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: startTime.toLocaleDateString()
    };
}

// Function to store selected service
function storeSelectedService(service, quantity) {
    let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    const existingServiceIndex = selectedServices.findIndex(s => s.name === service.name);

    if (existingServiceIndex > -1) {
        // Update existing service
        selectedServices[existingServiceIndex].quantity += quantity;
    } else {
        // Add new service
        const arrivalTime = (service.name === 'Express Services') ? getExpressArrivalTime() : getRandomArrivalTimeWindow();
        selectedServices.push({ 
            ...service, 
            quantity: quantity,
            arrivalTime: arrivalTime
        });
    }
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
}

// Function to generate a 30-minute arrival time window for express services
function getExpressArrivalTime() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Set to next day

    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(Math.random() * 10) + 9);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes later

    return {
        start: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: startTime.toLocaleDateString()
    };
}

// Function to render services
function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) {
        console.error('Services container not found!');
        return;
    }

    services.forEach(service => {
        const serviceDiv = document.createElement('div');
        serviceDiv.classList.add('service');
        
        const serviceImg = document.createElement('img');
        serviceImg.src = service.img;
        serviceImg.alt = service.name;
        serviceDiv.appendChild(serviceImg);

        const serviceName = document.createElement('h2');
        serviceName.textContent = service.name;
        serviceDiv.appendChild(serviceName);

        if (service.price !== null) {
            const servicePrice = document.createElement('p');
            servicePrice.textContent = `Price: ${service.price}/-`;
            serviceDiv.appendChild(servicePrice);
        }

        const bookButton = document.createElement('button');
        bookButton.classList.add('book-btn');
        bookButton.textContent = 'Book Service';
        bookButton.addEventListener('click', () => {
            if (service.price !== null) {
                const quantity = 1; // Default quantity
                storeSelectedService(service, quantity);
                bookButton.textContent = 'Booked';
                bookButton.disabled = true;
            } else {
                window.location.href = 'express.html'; // Redirect to express services page
            }
        });
        serviceDiv.appendChild(bookButton);

        container.appendChild(serviceDiv);
    });
}

document.addEventListener('DOMContentLoaded', renderServices);

// Event listener for the Proceed button on both pages
document.querySelectorAll('.proceed-button').forEach(button => {
    button.addEventListener('click', function() {
        window.location.href = 'location.html';
    });
});
