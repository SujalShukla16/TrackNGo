document.addEventListener('DOMContentLoaded', function() {
    // Predefined credentials (in a real app, these would come from a database)
    const validCredentials = {
        admin: {
            username: "admin",
            password: "admin123"
        },
        drivers: {
            "DRIVER-101": "1111",
            "DRIVER-102": "2222",
            "DRIVER-103": "3333"
        }
    };

    // Sample timetable data
    const routeTimetables = {
        'Route 1: Mohopada to Panvel': [
            { busNumber: 'B-101', departure: '06:00 AM', arrival: '07:20 AM' },
            { busNumber: 'B-102', departure: '06:20 AM', arrival: '07:40 AM' },
            { busNumber: 'B-103', departure: '06:40 AM', arrival: '08:00 AM' },
            { busNumber: 'B-104', departure: '07:00 AM', arrival: '08:20 AM' },
            { busNumber: 'B-105', departure: '07:20 AM', arrival: '08:40 AM' },
            { busNumber: 'B-106', departure: '04:00 PM', arrival: '05:20 PM' },
            { busNumber: 'B-107', departure: '04:20 PM', arrival: '05:40 PM' },
            { busNumber: 'B-108', departure: '04:40 PM', arrival: '06:00 PM' }
        ],
        'Route 2: Khopoli to Panvel': [
            { busNumber: 'B-201', departure: '06:15 AM', arrival: '07:00 AM' },
            { busNumber: 'B-202', departure: '07:15 AM', arrival: '08:00 AM' },
            { busNumber: 'B-203', departure: '08:15 AM', arrival: '09:00 AM' },
            { busNumber: 'B-204', departure: '03:15 PM', arrival: '04:00 PM' },
            { busNumber: 'B-205', departure: '04:15 PM', arrival: '05:00 PM' },
            { busNumber: 'B-206', departure: '05:15 PM', arrival: '06:00 PM' }
        ],
        'Route 3: Khopoli to Rasayani': [
            { busNumber: 'B-301', departure: '05:30 AM', arrival: '06:30 AM' },
            { busNumber: 'B-302', departure: '06:30 AM', arrival: '07:30 AM' },
            { busNumber: 'B-303', departure: '07:30 AM', arrival: '08:30 AM' },
            { busNumber: 'B-304', departure: '04:30 PM', arrival: '05:30 PM' },
            { busNumber: 'B-305', departure: '05:30 PM', arrival: '06:30 PM' }
        ]
    };

    // DOM Elements

    const viewRoutesBtn = document.getElementById('viewRoutesBtn');
    const driverBtn = document.getElementById('driverBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    const driverLoginContainer = document.getElementById('driverLoginContainer');
    const adminLoginContainer = document.getElementById('adminLoginContainer');
    const mapContainer = document.getElementById('mapContainer');
    const routesContainer = document.getElementById('routesContainer');
    const timetableContainer = document.getElementById('timetableContainer');
    
    const driverLoginForm = document.getElementById('driverLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    const cancelDriverLogin = document.getElementById('cancelDriverLogin');
    const cancelAdminLogin = document.getElementById('cancelAdminLogin');
    
    const backFromMap = document.getElementById('backFromMap');
    const backFromRoutes = document.getElementById('backFromRoutes');
    const backFromTimetable = document.getElementById('backFromTimetable');
    
    const timetableList = document.getElementById('timetableList');
    const timetableRouteName = document.getElementById('timetableRouteName');

    // Event Listeners
    viewRoutesBtn.addEventListener('click', showRoutes);
    driverBtn.addEventListener('click', showDriverLogin);
    adminBtn.addEventListener('click', showAdminLogin);
    
    cancelDriverLogin.addEventListener('click', hideDriverLogin);
    cancelAdminLogin.addEventListener('click', hideAdminLogin);
    
    backFromMap.addEventListener('click', hideMap);
    backFromRoutes.addEventListener('click', hideRoutes);
    backFromTimetable.addEventListener('click', hideTimetable);
    
    driverLoginForm.addEventListener('submit', handleDriverLogin);
    adminLoginForm.addEventListener('submit', handleAdminLogin);

    // View Management Functions
    function showMap() {
        hideAllViews();
        mapContainer.classList.remove('hidden');
    }

    function showRoutes() {
        hideAllViews();
        routesContainer.classList.remove('hidden');
        
        // Make route items clickable
        const routeItems = document.querySelectorAll('.route-item');
        routeItems.forEach(item => {
            item.addEventListener('click', function() {
                const routeName = this.querySelector('h3').textContent;
                showTimetable(routeName);
            });
        });
    }

    function showTimetable(routeName) {
        hideAllViews();
        timetableContainer.classList.remove('hidden');
        timetableRouteName.textContent = routeName;
        
        // Clear previous timetable
        timetableList.innerHTML = '';
        
        // Add timetable items
        if (routeTimetables[routeName]) {
            routeTimetables[routeName].forEach(trip => {
                const timetableItem = document.createElement('div');
                timetableItem.className = 'timetable-item';
                timetableItem.innerHTML = `
                    <span class="bus-number">${trip.busNumber}</span>
                    <span class="time">${trip.departure}</span>
                    <span class="time">${trip.arrival}</span>
                `;
                timetableList.appendChild(timetableItem);
            });
        } else {
            timetableList.innerHTML = '<div class="error-message">No timetable available for this route</div>';
        }
    }

    function showDriverLogin() {
        hideAllViews();
        driverLoginContainer.classList.remove('hidden');
    }

    function showAdminLogin() {
        hideAllViews();
        adminLoginContainer.classList.remove('hidden');
    }

    function hideMap() {
        mapContainer.classList.add('hidden');
        showHome();
    }

    function hideRoutes() {
        routesContainer.classList.add('hidden');
        showHome();
    }

    function hideTimetable() {
        timetableContainer.classList.add('hidden');
        showRoutes();
    }

    function hideDriverLogin() {
        driverLoginContainer.classList.add('hidden');
        showHome();
    }

    function hideAdminLogin() {
        adminLoginContainer.classList.add('hidden');
        showHome();
    }

    function hideAllViews() {
        document.querySelector('.action-buttons').classList.add('hidden');
        driverLoginContainer.classList.add('hidden');
        adminLoginContainer.classList.add('hidden');
        mapContainer.classList.add('hidden');
        routesContainer.classList.add('hidden');
        timetableContainer.classList.add('hidden');
    }

    function showHome() {
        hideAllViews();
        document.querySelector('.action-buttons').classList.remove('hidden');
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
        
        if (validCredentials.drivers[driverId] && validCredentials.drivers[driverId] === driverPin) {
            sessionStorage.setItem('currentDriver', driverId);
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
