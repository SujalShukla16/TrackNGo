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
            description: "Description of route 1"
            stops: 15,
            frequency: "20 mins"
        },
        "Route 2: Khopoli to Panvel": {
            description: "Description of route 2",
            stops: 8,
            frequency: "15 mins"
        },
        "Route 3: Khopoli to Rasayani": {
            description: "Description of route 3",
            stops: 12,
            frequency: "30 mins"
        }
    };

    // DOM Elements
    const trackBusBtn = document.getElementById('trackBusBtn');
    const reportIssueBtn = document.getElementById('reportIssueBtn');
    const driverBtn = document.getElementById('driverBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    const routesContainer = document.getElementById('routesContainer');
    const mapContainer = document.getElementById('mapContainer');
    const driverLoginContainer = document.getElementById('driverLoginContainer');
    const adminLoginContainer = document.getElementById('adminLoginContainer');
    const reportIssueContainer = document.getElementById('reportIssueContainer');
    
    const backFromRoutes = document.getElementById('backFromRoutes');
    const backFromMap = document.getElementById('backFromMap');
    const cancelDriverLogin = document.getElementById('cancelDriverLogin');
    const cancelAdminLogin = document.getElementById('cancelAdminLogin');
    const cancelReportIssue = document.getElementById('cancelReportIssue');
    
    const driverLoginForm = document.getElementById('driverLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const reportIssueForm = document.getElementById('reportIssueForm');
    
    const mapRouteName = document.getElementById('mapRouteName');
    const mapElement = document.getElementById('map');

    // Map variables
    let map;
    let routingControl;
    let isMapInitialized = false;

    // Event Listeners
    trackBusBtn.addEventListener('click', showRoutes);
    reportIssueBtn.addEventListener('click', showReportIssue);
    driverBtn.addEventListener('click', showDriverLogin);
    adminBtn.addEventListener('click', showAdminLogin);
    
    backFromRoutes.addEventListener('click', showHome);
    backFromMap.addEventListener('click', showRoutes);
    cancelDriverLogin.addEventListener('click', showHome);
    cancelAdminLogin.addEventListener('click', showHome);
    cancelReportIssue.addEventListener('click', showHome);
    
    driverLoginForm.addEventListener('submit', handleDriverLogin);
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    reportIssueForm.addEventListener('submit', handleReportIssue);

    // View Management Functions
    function showHome() {
        hideAllViews();
        document.querySelector('.action-buttons').classList.remove('hidden');
    }

    function showRoutes() {
        hideAllViews();
        routesContainer.classList.remove('hidden');
    }

// Update the showMap function
    function showMap(routeName) {
        hideAllViews();
        mapContainer.classList.remove('hidden');
        mapRouteName.textContent = routeName;

        // Show loading state
        const mapElement = document.getElementById('map');
        mapElement.innerHTML = '<div class="map-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading map...</p></div>';

        // Initialize map after slight delay
        setTimeout(() => {
            if (!isMapInitialized) {
                initMap();
                isMapInitialized = true;
            } else {
                // If map exists, invalidate size to fix display issues
                map.invalidateSize();
            }

            // Set the appropriate route
            if (routeName === "Route 1: Downtown Loop") {
                setRoute1();
            }
        }, 100);
    }

    function showDriverLogin() {
        hideAllViews();
        driverLoginContainer.classList.remove('hidden');
    }

    function showAdminLogin() {
        hideAllViews();
        adminLoginContainer.classList.remove('hidden');
    }

    function showReportIssue() {
        hideAllViews();
        reportIssueContainer.classList.remove('hidden');
    }

    function hideAllViews() {
        document.querySelector('.action-buttons').classList.add('hidden');
        routesContainer.classList.add('hidden');
        mapContainer.classList.add('hidden');
        driverLoginContainer.classList.add('hidden');
        adminLoginContainer.classList.add('hidden');
        reportIssueContainer.classList.add('hidden');
    }

    function setRoute1() {
        if (!map) {
            console.error("Map not initialized!");
            return;
        }

        // Clear existing route if any
        if (routingControl) {
            map.removeControl(routingControl);
        }

        // Define route coordinates
        const Route1 = {
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
            L.marker([stop.lat, stop.lon], { icon: stopIcon })
                .addTo(map)
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

        routingControl.on('routesfound', function(e) {
            // Hide the routing instructions panel
            const itineraryPanel = document.querySelector('.leaflet-routing-container');
            if (itineraryPanel) {
                itineraryPanel.style.display = 'none';
            }
            
            // Fit the map to show the entire route
            map.fitBounds(e.routes[0].bounds);
        });

        // Error handling for route loading
        routingControl.on('routingerror', function(err) {
            console.error('Routing error:', err);
            alert('Failed to load route. Please try again later.');
        });
    }
    

// Update the initMap function
function initMap() {
        const mapElement = document.getElementById('map');
        mapElement.innerHTML = ''; // Clear loading message
        
        map = L.map('map').setView([18.8943, 73.1768], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add slight delay to ensure tiles load
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
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
            sessionStorage.setItem('driverId', driverId);
            sessionStorage.setItem('driverRoute', validCredentials.drivers[driverId].route);
            sessionStorage.setItem('driverBus', validCredentials.drivers[driverId].bus);
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
            sessionStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            showError('Invalid username or password', 'admin');
        }
        
        adminLoginForm.reset();
    }

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
        
        console.log('Issue reported:', {
            type: issueType,
            route: issueRoute,
            bus: issueBus,
            description: issueDescription
        });
        
        alert('Thank you for your report! We will address this issue promptly.');
        reportIssueForm.reset();
        showHome();
    }

    // Helper Functions
    function showError(message, formType) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const existingError = document.querySelector(`#${formType === 'report' ? 'reportIssueContainer' : formType + 'LoginContainer'} .error-message`);
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

    // Make route items clickable
    document.addEventListener('click', function(e) {
        if (e.target.closest('.route-item')) {
            const routeItem = e.target.closest('.route-item');
            const routeName = routeItem.querySelector('h3').textContent;
            showMap(routeName);
        }
    });
});
