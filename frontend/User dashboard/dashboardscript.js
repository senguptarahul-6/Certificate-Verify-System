// User Dashboard JavaScript

// DOM Elements
const certificateInput = document.querySelector(".certificate input");
const verifyBtn = document.querySelector(".btnverify");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    setupEventListeners();
    loadRecentSearches();
});

// Setup Event Listeners
function setupEventListeners() {
    // Verify button click
    if (verifyBtn) {
        verifyBtn.addEventListener("click", handleVerify);
    }

    // Enter key press
    if (certificateInput) {
        certificateInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                handleVerify();
            }
        });
    }
}

// Handle Verify
function handleVerify() {
    const certId = certificateInput.value.trim();

    if (!certId) {
        alert("Please enter a certificate ID");
        return;
    }

    // Validate certificate ID format (basic validation)
    if (!validateCertificateId(certId)) {
        alert("Invalid certificate ID format. Please enter a valid ID (e.g., CERT001)");
        return;
    }

    // Store in localStorage for the result page
    localStorage.setItem("searchedCertId", certId);

    // Save to recent searches
    saveRecentSearch(certId);

    // Navigate to result page
    window.location.href = `certificate-result.html?id=${encodeURIComponent(certId)}`;
}

// Validate Certificate ID
function validateCertificateId(certId) {
    // Basic validation: should start with CERT followed by numbers
    const pattern = /^CERT\d+$/i;
    return pattern.test(certId);
}

// Save Recent Search
function saveRecentSearch(certId) {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    // Remove if already exists
    recentSearches = recentSearches.filter((id) => id !== certId);

    // Add to beginning
    recentSearches.unshift(certId);

    // Keep only last 5 searches
    recentSearches = recentSearches.slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

// Load Recent Searches
function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    if (recentSearches.length > 0) {
        // TODO: Display recent searches in the dashboard
        console.log("Recent searches:", recentSearches);
    }
}
