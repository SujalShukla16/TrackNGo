<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-database-compat.js"></script>
<script>
  const firebaseConfig = {
    apiKey: "AIzaSyAWuxLWlG0YmpvqzTE-tMWEy_7xND8OI18",
    authDomain: "bustracking-daba4.firebaseapp.com",
    databaseURL: "https://bustracking-daba4-default-rtdb.firebaseio.com",
    projectId: "bustracking-daba4",
    storageBucket: "bustracking-daba4.firebasestorage.app",
    messagingSenderId: "638714966104",
    appId: "1:638714966104:web:dc5a81c5c1311c27461a2d",
    measurementId: "G-PRZCM27DDR"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
</script>


document.addEventListener('DOMContentLoaded', function() {
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

      const startShiftBtn = document.getElementById('startShiftBtn');
if (startShiftBtn) {
    startShiftBtn.addEventListener('click', () => {
        const driverId = sessionStorage.getItem('driverId');
        if (!driverId) {
            alert("Driver not logged in.");
            return;
        }

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.watchPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const timestamp = new Date().toISOString();

            firebase.database().ref(`locations/${driverId}`).set({
                lat,
                lon,
                timestamp
            });

            console.log(`Location updated for ${driverId}:`, lat, lon);
        }, error => {
            console.error("Location error:", error);
            alert("Unable to get location. Please allow access.");
        }, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000
        });
    });
}
    };

    const routeInfo = {
        "Route 1: Mohopada to Panvel": {
            description: "Description of Route 1",
            stops: 15,
            frequency: "20 mins"
        },
        "Route 2: Khopoli to Panvel": {
            description: "Description of Route 2",
            stops: 8,
            frequency: "15 mins"
        },
        "Route 3: Khopoli to Rasayani": {
            description: "Description of Route 3",
            stops: 12,
            frequency: "30 mins"
        }
    };

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

    let map;
    let routingControl;
    let isMapInitialized = false;

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

    function showHome() {
        hideAllViews();
        document.querySelector('.action-buttons').classList.remove('hidden');
    }

    function showRoutes() {
        hideAllViews();
        routesContainer.classList.remove('hidden');
    }

    function showMap(routeName) {
        hideAllViews();
        mapContainer.classList.remove('hidden');
        mapRouteName.textContent = routeName;

        const mapElement = document.getElementById('map');
        mapElement.innerHTML = '<div class="map-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading map...</p></div>';

        setTimeout(() => {
            if (!isMapInitialized) {
                initMap();
                isMapInitialized = true;
            } else {
                map.invalidateSize();
            }

            if (routeName === "Route 1: Mohopada to Panvel") {
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

        if (routingControl) {
            map.removeControl(routingControl);
        }

        const Route1 = {
            waypoints: [
                L.latLng(18.8943, 73.1768), 
                L.latLng(18.9000, 73.1900), 
                L.latLng(18.9030, 73.2000), 
                L.latLng(18.9061, 73.2089)  
            ]
        };

        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        const stopIcon = L.divIcon({
            className: 'stop-icon',
            html: '<div style="width: 12px; height: 12px; background: white; border: 2px solid black; border-radius: 50%;"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const stops = [
            { lat: 18.9000, lon: 73.1900, name: "Stop 1" },
            { lat: 18.9030, lon: 73.2000, name: "Stop 2" }
        ];

        stops.forEach(stop => {
            L.marker([stop.lat, stop.lon], { icon: stopIcon })
                .addTo(map)
                .bindTooltip(stop.name, { permanent: true, direction: "top" });
        });

        routingControl = L.Routing.control({
            waypoints: Route1.waypoints,
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
            const itineraryPanel = document.querySelector('.leaflet-routing-container');
            if (itineraryPanel) {
                itineraryPanel.style.display = 'none';
            }
            
            map.fitBounds(e.routes[0].bounds);
        });

        routingControl.on('routingerror', function(err) {
            console.error('Routing error:', err);
            alert('Failed to load route. Please try again later.');
        });
    }
    

function initMap() {
        const mapElement = document.getElementById('map');
        mapElement.innerHTML = ''; 
        
        map = L.map('map').setView([18.8943, 73.1768], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }

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

    document.addEventListener('click', function(e) {
        if (e.target.closest('.route-item')) {
            const routeItem = e.target.closest('.route-item');
            const routeName = routeItem.querySelector('h3').textContent;
            showMap(routeName);
        }
    });
});
