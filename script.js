document.addEventListener('DOMContentLoaded', function() {
    // Predefined credentials
    const validCredentials = {
        admin: {
            username: "admin",
            password: "admin123"
        },
        drivers: {
            "DRV-1001": { pin: "7890", route: "Route 1: Downtown Loop", bus: "B-101" },
            "DRV-1002": { pin: "4567", route: "Route 2: University Express", bus: "B-202" },
            "DRV-1003": { pin: "1234", route: "Route 3: Suburban Connector", bus: "B-303" }
        }
    };

    // Route information
    const routeInfo = {
        "Route 1: Downtown Loop": {
            description: "Stops: 15 | Frequency: 20 mins",
            mapInfo: "Downtown area covering main business district and shopping centers"
        },
        "Route 2: University Express": {
            description: "Stops: 8 | Frequency: 15 mins",
            mapInfo: "Connects university campus with student residential areas"
        },
        "Route 3: Suburban Connector": {
            description: "Stops: 12 | Frequency: 30 mins",
            mapInfo: "Links suburban neighborhoods with downtown transfer station"
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
        document.querySelector('.action-buttons').classList.add('hidden');
        routesContainer.classList.add('hidden');
        mapContainer.classList.remove('hidden');
        driverLoginContainer.classList.add('hidden');
        adminLoginContainer.classList.add('hidden');
        
        mapRouteName.textContent = routeName;
        mapDescription.textContent = routeInfo[routeName].mapInfo;
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
