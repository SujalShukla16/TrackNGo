document.addEventListener("DOMContentLoaded", function () {
  // Predefined credentials (in a real app, these would come from a database)
  const validCredentials = {
    admin: {
      username: "admin",
      password: "admin123",
    },
    drivers: {
      "DRIVER-101": "1111",
      "DRIVER-102": "2222",
      "DRIVER-103": "3333",
    },
  };

  // DOM Elements
  const trackBusBtn = document.getElementById("trackBusBtn");
  const viewRoutesBtn = document.getElementById("viewRoutesBtn");
  const driverBtn = document.getElementById("driverBtn");
  const adminBtn = document.getElementById("adminBtn");

  const driverLoginContainer = document.getElementById("driverLoginContainer");
  const adminLoginContainer = document.getElementById("adminLoginContainer");

  const mapContainer = document.getElementById("mapContainer");
  const routesContainer = document.getElementById("routesContainer");

  const driverLoginForm = document.getElementById("driverLoginForm");
  const adminLoginForm = document.getElementById("adminLoginForm");

  const cancelDriverLogin = document.getElementById("cancelDriverLogin");
  const cancelAdminLogin = document.getElementById("cancelAdminLogin");

  const backFromMap = document.getElementById("backFromMap");
  const backFromRoutes = document.getElementById("backFromRoutes");

  // Event Listeners
  trackBusBtn.addEventListener("click", showMap);
  viewRoutesBtn.addEventListener("click", showRoutes);
  driverBtn.addEventListener("click", showDriverLogin);
  adminBtn.addEventListener("click", showAdminLogin);

  cancelDriverLogin.addEventListener("click", hideDriverLogin);
  cancelAdminLogin.addEventListener("click", hideAdminLogin);

  backFromMap.addEventListener("click", hideMap);
  backFromRoutes.addEventListener("click", hideRoutes);

  driverLoginForm.addEventListener("submit", handleDriverLogin);
  adminLoginForm.addEventListener("submit", handleAdminLogin);

  // Show Map View
  function showMap() {
    document.querySelector(".action-buttons").classList.add("hidden");
    mapContainer.classList.remove("hidden");
  }

  // Hide Map View
  function hideMap() {
    mapContainer.classList.add("hidden");
    document.querySelector(".action-buttons").classList.remove("hidden");
  }

  // Show Routes View
  function showRoutes() {
    document.querySelector(".action-buttons").classList.add("hidden");
    routesContainer.classList.remove("hidden");
  }

  // Hide Routes View
  function hideRoutes() {
    routesContainer.classList.add("hidden");
    document.querySelector(".action-buttons").classList.remove("hidden");
  }

  // Show Driver Login
  function showDriverLogin() {
    document.querySelector(".action-buttons").classList.add("hidden");
    driverLoginContainer.classList.remove("hidden");
  }

  // Hide Driver Login
  function hideDriverLogin() {
    driverLoginContainer.classList.add("hidden");
    document.querySelector(".action-buttons").classList.remove("hidden");
    driverLoginForm.reset();
  }

  // Show Admin Login
  function showAdminLogin() {
    document.querySelector(".action-buttons").classList.add("hidden");
    adminLoginContainer.classList.remove("hidden");
  }

  // Hide Admin Login
  function hideAdminLogin() {
    adminLoginContainer.classList.add("hidden");
    document.querySelector(".action-buttons").classList.remove("hidden");
    adminLoginForm.reset();
  }

  // Handle Driver Login with Validation
  function handleDriverLogin(e) {
    e.preventDefault();

    const driverId = document
      .getElementById("driverId")
      .value.trim()
      .toUpperCase();
    const driverPin = document.getElementById("driverPin").value.trim();

    // Basic validation
    if (!driverId || !driverPin) {
      showError("Please enter both Driver ID and PIN", "driver");
      return;
    }

    // Check credentials
    if (
      validCredentials.drivers[driverId] &&
      validCredentials.drivers[driverId] === driverPin
    ) {
      // Successful login
      console.log(`Driver ${driverId} logged in successfully`);

      // Store driver ID in session (for demo purposes)
      sessionStorage.setItem("currentDriver", driverId);

      // Redirect to driver dashboard
      window.location.href = "driver.html";
    } else {
      // Failed login
      showError("Invalid Driver ID or PIN", "driver");
    }

    driverLoginForm.reset();
  }

  // Handle Admin Login with Validation
  function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    // Basic validation
    if (!username || !password) {
      showError("Please enter both username and password", "admin");
      return;
    }

    // Check credentials
    if (
      username === validCredentials.admin.username &&
      password === validCredentials.admin.password
    ) {
      // Successful login
      console.log("Admin logged in successfully");

      // Store admin login state
      sessionStorage.setItem("adminLoggedIn", "true");

      // Redirect to admin dashboard
      window.location.href = "admin.html";
    } else {
      // Failed login
      showError("Invalid username or password", "admin");
    }

    adminLoginForm.reset();
  }

  // Show error message
  function showError(message, loginType) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;

    // Remove existing error if any
    const existingError = document.querySelector(
      `#${loginType}LoginContainer .error-message`
    );
    if (existingError) {
      existingError.remove();
    }

    // Add new error
    const loginForm = loginType === "driver" ? driverLoginForm : adminLoginForm;
    loginForm.appendChild(errorElement);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 3000);
  }
});
// Add this with other DOM element declarations
const timetableContainer = document.getElementById('timetableContainer');
const timetableList = document.getElementById('timetableList');
const timetableRouteName = document.getElementById('timetableRouteName');
const backFromTimetable = document.getElementById('backFromTimetable');

// Add this event listener with others
backFromTimetable.addEventListener('click', hideTimetable);

// Sample timetable data (in real app, this would come from API)
const routeTimetables = {
    'Route 1: Downtown Loop': [
        { busNumber: 'B-101', departure: '06:00 AM', arrival: '07:20 AM' },
        { busNumber: 'B-102', departure: '06:20 AM', arrival: '07:40 AM' },
        { busNumber: 'B-103', departure: '06:40 AM', arrival: '08:00 AM' },
        { busNumber: 'B-104', departure: '07:00 AM', arrival: '08:20 AM' },
        { busNumber: 'B-105', departure: '07:20 AM', arrival: '08:40 AM' },
        { busNumber: 'B-106', departure: '04:00 PM', arrival: '05:20 PM' },
        { busNumber: 'B-107', departure: '04:20 PM', arrival: '05:40 PM' },
        { busNumber: 'B-108', departure: '04:40 PM', arrival: '06:00 PM' }
    ],
    'Route 2: University Express': [
        { busNumber: 'B-201', departure: '06:15 AM', arrival: '07:00 AM' },
        { busNumber: 'B-202', departure: '07:15 AM', arrival: '08:00 AM' },
        { busNumber: 'B-203', departure: '08:15 AM', arrival: '09:00 AM' },
        { busNumber: 'B-204', departure: '03:15 PM', arrival: '04:00 PM' },
        { busNumber: 'B-205', departure: '04:15 PM', arrival: '05:00 PM' },
        { busNumber: 'B-206', departure: '05:15 PM', arrival: '06:00 PM' }
    ],
    'Route 3: Suburban Connector': [
        { busNumber: 'B-301', departure: '05:30 AM', arrival: '06:30 AM' },
        { busNumber: 'B-302', departure: '06:30 AM', arrival: '07:30 AM' },
        { busNumber: 'B-303', departure: '07:30 AM', arrival: '08:30 AM' },
        { busNumber: 'B-304', departure: '04:30 PM', arrival: '05:30 PM' },
        { busNumber: 'B-305', departure: '05:30 PM', arrival: '06:30 PM' }
    ]
};

// Add this after the route-list creation in showRoutes()
function showRoutes() {
    document.querySelector('.action-buttons').classList.add('hidden');
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

// Show timetable for a specific route
function showTimetable(routeName) {
    routesContainer.classList.add('hidden');
    timetableContainer.classList.remove('hidden');
    timetableRouteName.textContent = routeName;
    
    // Clear previous timetable
    timetableList.innerHTML = '';
    
    // Add timetable items
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
}

// Hide timetable view
function hideTimetable() {
    timetableContainer.classList.add('hidden');
    routesContainer.classList.remove('hidden');
}
