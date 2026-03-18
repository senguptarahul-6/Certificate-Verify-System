// Certificate Result JavaScript

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
    const certId = getUrlParameter("id");

    if (certId) {
        verifyCertificate(certId);
    } else {
        // If no ID in URL, try to get from localStorage (from dashboard search)
        const searchedCertId = localStorage.getItem("searchedCertId");
        if (searchedCertId) {
            verifyCertificate(searchedCertId);
            localStorage.removeItem("searchedCertId");
        } else {
            showError();
        }
    }

    setupEventListeners();
});

// Verify Certificate
async function verifyCertificate(certId) {
    try {
        const result = await verifyCertificateAPI(certId);

        if (result.success) {
            showSuccess(result.data);
        } else {
            showError();
        }
    } catch (error) {
        console.error(error);
        showError();
    }
}

// Show Success State
function showSuccess(certificate) {
    const successCard = document.getElementById("successCard");
    const errorCard = document.getElementById("errorCard");

    successCard.classList.remove("hidden");
    errorCard.classList.add("hidden");

    // Populate certificate details
    document.getElementById("certId").textContent = certificate.certId;
    document.getElementById("studentName").textContent = certificate.name;
    document.getElementById("domain").textContent = certificate.domain;
    document.getElementById("startDate").textContent = formatDateForDisplay(certificate.startDate);
    document.getElementById("endDate").textContent = formatDateForDisplay(certificate.endDate);

    // Calculate duration
    const duration = calculateDuration(
        certificate.startDate,
        certificate.endDate
    );
    document.getElementById("duration").textContent = duration;

    // Update iframe with certificate data
    updateCertificatePreview(certificate);
}

// Show Error State
function showError() {
    const successCard = document.getElementById("successCard");
    const errorCard = document.getElementById("errorCard");

    successCard.classList.add("hidden");
    errorCard.classList.remove("hidden");
}

// Update Certificate Preview
function updateCertificatePreview(certificate) {
    const iframe = document.getElementById("certificateFrame");

    // Wait for iframe to load
    iframe.onload = function () {
        try {
            const iframeDoc =
                iframe.contentDocument || iframe.contentWindow.document;

            // Update certificate fields in iframe
            const certIdElement = iframeDoc.getElementById("cert-id");
            const nameElement = iframeDoc.getElementById("student-name");
            const domainElement = iframeDoc.getElementById("domain");
            const startDateElement = iframeDoc.getElementById("start-date");
            const endDateElement = iframeDoc.getElementById("end-date");

            if (certIdElement) certIdElement.textContent = certificate.certId;
            if (nameElement) nameElement.textContent = certificate.name;
            if (domainElement) domainElement.textContent = certificate.domain;
            if (startDateElement) startDateElement.textContent = formatDateForDisplay(certificate.startDate);
            if (endDateElement) endDateElement.textContent = formatDateForDisplay(certificate.endDate);
        } catch (e) {
            console.log("Cannot access iframe content:", e);
        }
    };
}

// Setup Event Listeners
function setupEventListeners() {
    const btnDownload = document.getElementById("btnDownload");
    const btnPrint = document.getElementById("btnPrint");
    const btnContact = document.querySelector(".btn-contact");

    if (btnDownload) {
        btnDownload.addEventListener("click", downloadCertificate);
    }

    if (btnPrint) {
        btnPrint.addEventListener("click", printCertificate);
    }

    if (btnContact) {
        btnContact.addEventListener("click", contactSupport);
    }
}

// Download Certificate
async function downloadCertificate() {
    const certId = document.getElementById("certId").textContent;

    if (!certId) return;

    const btn = document.getElementById("btnDownload");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Downloading...';
    btn.disabled = true;

    try {
        // Direct download link for PDF
        const downloadUrl = `${API_BASE_URL}/certificates/${certId}/download`;

        // Trigger download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank"; // Open in new tab or download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        alert("Download failed: " + error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Print Certificate
function printCertificate() {
    const iframe = document.getElementById("certificateFrame");

    try {
        iframe.contentWindow.print();
    } catch (e) {
        // Fallback: print entire page
        window.print();
    }
}

// Contact Support
function contactSupport() {
    showAlert(
        "Email: support@certificateverification.com<br>Phone: +1 (555) 123-4567<br><br>Our support team will assist you with any certificate-related queries.",
        "info"
    );
}
