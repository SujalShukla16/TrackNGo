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

    // Route information
    const routeInfo = {
        "Route 1: Mohopada to Panvel": {
            description: "Stops: 15 | Frequency: 20 mins",
            mapInfo: "Description for route 1"
        },
        "Route 2: Khopoli to Panvel": {
            description: "Stops: 8 | Frequency: 15 mins",
            mapInfo: "Description for route 2"
        },
        "Route 3: Khopoli to rasayni": {
            description: "Stops: 12 | Frequency: 30 mins",
            mapInfo: "Description for route 3"
        }
    };

    // DOM Elements
    const trackBusBtn = document.getElementById('trackBusBtn');
    const driverBtn = document.getElementById('driverBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    const routesContainer = document.getElementById('routesContainer');
    const mapContainer = document.getElementById('mapContainer');
    const driverLoginContainer = document.getElementById('driverLoginContainer');
    const adminLoginContainer = document.getElementById('adminLoginContainer');
    
    const backFromRoutes = document.getElementById('backFromRoutes');
    const backFromMap = document.getElementById('backFromMap');
    const cancelDriverLogin = document.getElementById('cancelDriverLogin');
    const cancelAdminLogin = document.getElementById('cancelAdminLogin');
    
    const driverLoginForm = document.getElementById('driverLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    const mapRouteName = document.getElementById('mapRouteName');
    const mapDescription = document.getElementById('mapDescription');
    const reportIssueBtn = document.getElementById('reportIssueBtn');
    const reportIssueContainer = document.getElementById('reportIssueContainer');
    const cancelReportIssue = document.getElementById('cancelReportIssue');
    const reportIssueForm = document.getElementById('reportIssueForm');

    // Event Listeners
    trackBusBtn.addEventListener('click', showRoutes);
    driverBtn.addEventListener('click', showDriverLogin);
    adminBtn.addEventListener('click', showAdminLogin);
    
    backFromRoutes.addEventListener('click', showHome);
    backFromMap.addEventListener('click', showRoutes);
    cancelDriverLogin.addEventListener('click', showHome);
    cancelAdminLogin.addEventListener('click', showHome);
    
    driverLoginForm.addEventListener('submit', handleDriverLogin);
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    reportIssueBtn.addEventListener('click', showReportIssue);
    cancelReportIssue.addEventListener('click', hideReportIssue);
    reportIssueForm.addEventListener('submit', handleReportIssue);

    // Make route items clickable
    document.addEventListener('click', function(e) {
        if (e.target.closest('.route-item')) {
            const routeItem = e.target.closest('.route-item');
            const routeName = routeItem.querySelector('h3').textContent;
            showMap(routeName);
        }
    });

    // View Management Functions
    function showHome() {
        document.querySelector('.action-buttons').classList.remove('hidden');
        routesContainer.classList.add('hidden');
        mapContainer.classList.add('hidden');
        driverLoginContainer.classList.add('hidden');
        adminLoginContainer.classList.add('hidden');
    }

    function showRoutes() {
        document.querySelector('.action-buttons').classList.add('hidden');
        routesContainer.classList.remove('hidden');
        mapContainer.classList.add('hidden');
        driverLoginContainer.classList.add('hidden');
        adminLoginContainer.classList.add('hidden');
    }

function showMap(routeName) {
    hideAllViews();
    mapContainer.classList.remove('hidden');
    mapRouteName.textContent = routeName;

    // Initialize map only once
    if (!map) {
        initMap();
    }

    // Set the appropriate route
    if (routeName === "Route 1: Downtown Loop") {
        setRoute1();
    }
    // Add conditions for other routes when implemented
}

function initMap() {
    map = L.map('map').setView([18.8943, 73.1768], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Route 1 configuration
function setRoute1() {
    // Clear existing route if any
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const route1 = {
        waypoints: [
            L.latLng(18.8943, 73.1768), // Start point (PHOCC)
            L.latLng(18.9000, 73.1900), // Stop 1
            L.latLng(18.9030, 73.2000), // Stop 2
            L.latLng(18.9061, 73.2089)  // End point (Dand Fata)
        ]
    };

    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Custom stop icon
    const stopIcon = L.divIcon({
        className: 'stop-icon',
        html: '<div style="width: 12px; height: 12px; background: white; border: 2px solid black; border-radius: 50%;"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    // Add stops
    const stops = [
        { lat: 18.9000, lon: 73.1900, name: "Stop 1" },
        { lat: 18.9030, lon: 73.2000, name: "Stop 2" }
    ];

    stops.forEach(stop => {
        L.marker([stop.lat, stop.lon], { icon: stopIcon }).addTo(map)
         .bindTooltip(stop.name, { permanent: true, direction: "top" });
    });

    // Initialize routing control
    routingControl = L.Routing.control({
        waypoints: route1.waypoints,
        routeWhileDragging: false,
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
            styles: [{ color: 'blue', opacity: 0.7, weight: 5 }]
        },
        createMarker: function(i, waypoint, n) {
            if (i === 0 || i === n - 1) {
                return L.marker(waypoint.latLng, {
                    icon: L.divIcon({
                        className: 'text-cloud',
                        html: `<div class="text-cloud">${i === 0 ? 'PHOCC' : 'Dand Fata'}</div>`
                    })
                });
            }
            return null;
        }
    }).addTo(map);

    routingControl.on('routesfound', function() {
        let itineraryPanel = document.querySelector('.leaflet-routing-container');
        if (itineraryPanel) {
            itineraryPanel.style.display = 'none';
        }
    });
}
    
    
    function showDriverLogin() {
        document.querySelector('.action-buttons').classList.add('hidden');
        routesContainer.classList.add('hidden');
        mapContainer.classList.add('hidden');
        driverLoginContainer.classList.remove('hidden');
        adminLoginContainer.classList.add('hidden');
    }

    function showAdminLogin() {
        document.querySelector('.action-buttons').classList.add('hidden');
        routesContainer.classList.add('hidden');
        mapContainer.classList.add('hidden');
        driverLoginContainer.classList.add('hidden');
        adminLoginContainer.classList.remove('hidden');
    }
    function showReportIssue() {
    hideAllViews();
    reportIssueContainer.classList.remove('hidden');
}

function hideReportIssue() {
    reportIssueContainer.classList.add('hidden');
    showHome();
}
    function hideAllViews() {
    document.querySelector('.action-buttons').classList.add('hidden');
    routesContainer.classList.add('hidden');
    mapContainer.classList.add('hidden');
    driverLoginContainer.classList.add('hidden');
    adminLoginContainer.classList.add('hidden');
    reportIssueContainer.classList.add('hidden');
}
    // New issue reporting handler
function handleReportIssue(e) {
    e.preventDefault();
    
    const issueType = document.getElementById('issueType').value;
    const issueRoute = document.getElementById('issueRoute').value;
    const issueBus = document.getElementById('issueBus').value;
    const issueDescription = document.getElementById('issueDescription').value;
    
    if (!issueType || !issueDescription) {
        showError('Please select issue type and provide description', 'report');
        return;
    }
    
    // In a real app, this would send to server
    console.log('Issue reported:', {
        type: issueType,
        route: issueRoute,
        bus: issueBus,
        description: issueDescription
    });
    
    alert('Thank you for your report! We will address this issue promptly.');
    reportIssueForm.reset();
    hideReportIssue();
}

    // Authentication Functions
    function handleDriverLogin(e) {
        e.preventDefault();
        
        const driverId = document.getElementById('driverId').value.trim().toUpperCase();
        const driverPin = document.getElementById('driverPin').value.trim();
        
        if (!driverId || !driverPin) {
            showError('Please enter both Driver ID and PIN', 'driver');
            return;
        }
        
        if (validCredentials.drivers[driverId] && validCredentials.drivers[driverId].pin === driverPin) {
            // Store driver info in session
            sessionStorage.setItem('driverId', driverId);
            sessionStorage.setItem('driverRoute', validCredentials.drivers[driverId].route);
            sessionStorage.setItem('driverBus', validCredentials.drivers[driverId].bus);
            
            // Redirect to driver dashboard
            window.location.href = 'driver.html';
        } else {
            showError('Invalid Driver ID or PIN', 'driver');
        }
        
        driverLoginForm.reset();
    }

    function handleAdminLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        
        if (!username || !password) {
            showError('Please enter both username and password', 'admin');
            return;
        }
        
        if (username === validCredentials.admin.username && 
            password === validCredentials.admin.password) {
            // Store admin login state
            sessionStorage.setItem('adminLoggedIn', 'true');
            
            // Redirect to admin dashboard
            window.location.href = 'admin.html';
        } else {
            showError('Invalid username or password', 'admin');
        }
        
        adminLoginForm.reset();
    }
function showError(message, formType) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    const existingError = document.querySelector(`#${formType}Container .error-message`);
    if (existingError) {
        existingError.remove();
    }
    
    const form = formType === 'driver' ? driverLoginForm : 
                 formType === 'admin' ? adminLoginForm : 
                 reportIssueForm;
    
    form.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

    function showError(message, loginType) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const existingError = document.querySelector(`#${loginType}LoginContainer .error-message`);
        if (existingError) {
            existingError.remove();
        }
        
        const loginForm = loginType === 'driver' ? driverLoginForm : adminLoginForm;
        loginForm.appendChild(errorElement);
        
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
});
