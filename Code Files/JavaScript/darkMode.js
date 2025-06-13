// Inside your darkMode.js file or wherever you handle the toggle
const toggleButton = document.getElementById('toggleDarkMode');
const body = document.body;
var isDarkMode = body.classList.contains('dark-mode'); // Get current state

// Function to apply or remove dark mode class and save preference
function setDarkModePreference(enable) {
    if (enable) {
        body.classList.add('dark-mode');
        // Save preference to localStorage
        localStorage.setItem('darkModeEnabled', 'true');
    } else {
        body.classList.remove('dark-mode');
        // Save preference to localStorage
        localStorage.setItem('darkModeEnabled', 'false'); // Or remove the item: localStorage.removeItem('darkModeEnabled');
    }
}

// Initial check when the script loads (or on DOMContentLoaded)
// This should ideally run *before* window.onload to prevent a flash of incorrect mode
// Let's put this check right here, outside any function or at the top of your darkMode.js
const savedPreference = localStorage.getItem('darkModeEnabled');
if (savedPreference === 'true') {
    // Apply dark mode if it was saved as enabled
    setDarkModePreference(true);
    body.classList.add('dark-mode'); // Apply the class immediately
} else {
    // Ensure dark mode is off if preference is false or not set
    // This handles the initial state if no preference is saved
    setDarkModePreference(false);
    body.classList.remove('dark-mode');
}


// Add event listener to the toggle button
if (toggleButton) { // Check if the button exists
    toggleButton.addEventListener('click', () => {
        const currentlyEnabled = body.classList.contains('dark-mode');
        setDarkModePreference(!currentlyEnabled); // Toggle and save
        updateDeleteIcons();
        updateEditIcons();
    });
}

