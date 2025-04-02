let map;
let routingControl;

document.addEventListener('DOMContentLoaded', function() {
    // Predefined credentials
    const validCredentials = {
        admin: {
            username: "admin",
            password: "admin123"
        },
        drivers: {
            "DRV-1001": { pin: "1111", route: "Route 1: Mohopada to Panvel", bus: "B-101" },
            "DRV-1002": { pin: "2222", route: "Route 2: Khopoli to Panvel", bus: "B-202" },
            "DRV-1003": { pin: "3333", route: "Route 3: Khopoli to Rasayani", bus: "B-303" }
        }
    };

    // Event Listeners
    document.getElementById('trackBusBtn').addEventListener('click', showRoutes);
    document.getElementById('driverBtn').addEventListener('click', showDriverLogin);
    document.getElementById('adminBtn').addEventListener('click', showAdminLogin);
    document.getElementById('backFromRoutes').addEventListener('click', showHome);
    document.getElementById('backFromMap').addEventListener('click', showRoutes);
    document.getElementById('cancelDriverLogin').addEventListener('click', showHome);
    document.getElementById('cancelAdminLogin').addEventListener('click', showHome);
    document.getElementById('driverLoginForm').addEventListener('submit', handleDriverLogin);
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);

    document.addEventListener('click', function(e) {
        if (e.target.closest('.route-item')) {
            const routeItem = e.target.closest('.route-item');
            const routeName = routeItem.querySelector('h3').textContent;
            showMap(routeName);
        }
    });

    function showHome() {
        document.querySelector('.action-buttons').classList.remove('hidden');
        document.getElementById('routesContainer').classList.add('hidden');
        document.getElementById('mapContainer').classList.add('hidden');
    }

    function showRoutes() {
        document.querySelector('.action-buttons').classList.add('hidden');
        document.getElementById('routesContainer').classList.remove('hidden');
    }

    function showMap(routeName) {
        document.querySelector('.action-buttons').classList.add('hidden');
        document.getElementById('mapContainer').classList.remove('hidden');
        document.getElementById('mapRouteName').textContent = routeName;

        if (!map) {
            initMap();
        }

        if (routeName === "Route 1: Mohopada to Panvel") {
            setRoute1();
        }
    }

    function initMap() {
        map = L.map('map').setView([18.8943, 73.1768], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }

    function setRoute1() {
        if (routingControl) {
            map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(18.8943, 73.1768), 
                L.latLng(18.9000, 73.1900), 
                L.latLng(18.9030, 73.2000), 
                L.latLng(18.9061, 73.2089)
            ],
            routeWhileDragging: false,
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            lineOptions: {
                styles: [{ color: 'blue', opacity: 0.7, weight: 5 }]
            }
        }).addTo(map);
    }

    function handleDriverLogin(e) {
        e.preventDefault();
        const driverId = document.getElementById('driverId').value.trim().toUpperCase();
        const driverPin = document.getElementById('driverPin').value.trim();

        if (validCredentials.drivers[driverId] && validCredentials.drivers[driverId].pin === driverPin) {
            sessionStorage.setItem('driverId', driverId);
            sessionStorage.setItem('driverRoute', validCredentials.drivers[driverId].route);
            sessionStorage.setItem('driverBus', validCredentials.drivers[driverId].bus);
            window.location.href = 'driver.html';
        } else {
            showError('Invalid Driver ID or PIN', 'driver');
        }
    }

    function handleAdminLogin(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();

        if (username === validCredentials.admin.username && password === validCredentials.admin.password) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            showError('Invalid username or password', 'admin');
        }
    }

    function showError(message, formType) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        const existingError = document.querySelector(`#${formType}Container .error-message`);
        if (existingError) {
            existingError.remove();
        }

        const form = formType === 'driver' ? document.getElementById('driverLoginForm') : document.getElementById('adminLoginForm');
        form.appendChild(errorElement);

        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
});
