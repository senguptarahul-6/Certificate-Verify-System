// Common JavaScript Utilities for Certificate Verification System

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// ============================================
// Form Validation Utilities
// ============================================

/**
 * Validate email format
 */
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one letter and one number
 */
function validatePassword(password) {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return pattern.test(password);
}

/**
 * Validate certificate ID format
 */
function validateCertificateId(certId) {
    const pattern = /^CERT\d+$/i;
    return pattern.test(certId);
}

/**
 * Validate date format (DD/MM/YYYY)
 */
function validateDate(dateStr) {
    const pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    return pattern.test(dateStr);
}

/**
 * Validate required field
 */
function validateRequired(value) {
    return value && value.trim().length > 0;
}

// ============================================
// Date Formatting Utilities
// ============================================

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
function formatDateForDisplay(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Format date from DD/MM/YYYY to YYYY-MM-DD
 */
function formatDateForInput(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

/**
 * Get current date in DD/MM/YYYY format
 */
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Calculate duration between two dates
 */
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""}${days > 0 ? ` ${days} day${days > 1 ? "s" : ""}` : ""}`;
    } else {
        return `${days} day${days > 1 ? "s" : ""}`;
    }
}

/**
 * Parse date string (DD/MM/YYYY) to Date object
 */
function parseDate(dateStr) {
    const parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// ============================================
// Local Storage Utilities
// ============================================

/**
 * Save data to localStorage
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error("Error saving to localStorage:", e);
        return false;
    }
}

/**
 * Get data from localStorage
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error("Error reading from localStorage:", e);
        return defaultValue;
    }
}

/**
 * Remove data from localStorage
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error("Error removing from localStorage:", e);
        return false;
    }
}

/**
 * Clear all localStorage
 */
function clearLocalStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (e) {
        console.error("Error clearing localStorage:", e);
        return false;
    }
}

// ============================================
// API Call Wrappers
// ============================================

/**
 * Generic API call wrapper
 */
async function apiCall(endpoint, method = "GET", data = null, isFormData = false) {
    const token = getFromLocalStorage('token');

    const headers = {};
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
        method: method,
        headers: headers,
    };

    if (data) {
        options.body = isFormData ? data : JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "API call failed");
        }

        return { success: true, data: result };
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Verify certificate via API
 */
async function verifyCertificateAPI(certId) {
    return await apiCall(`/certificates/verify/${certId}`, "GET");
}

/**
 * Upload student data via API
 */
async function uploadStudentDataAPI(formData) {
    return await apiCall("/upload/students", "POST", formData, true);
}

/**
 * Get all students
 */
async function getStudentsAPI() {
    return await apiCall("/students", "GET");
}

/**
 * Add student
 */
async function addStudentAPI(studentData) {
    return await apiCall("/students", "POST", studentData);
}

/**
 * Update student
 */
async function updateStudentAPI(id, studentData) {
    return await apiCall(`/students/${id}`, "PUT", studentData);
}

/**
 * Delete student
 */
async function deleteStudentAPI(id) {
    return await apiCall(`/students/${id}`, "DELETE");
}

/**
 * Login via API
 */
async function loginAPI(email, password) {
    return await apiCall("/auth/login", "POST", { email, password });
}

/**
 * Register via API
 */
async function registerAPI(name, email, password, role) {
    return await apiCall("/auth/register", "POST", { name, email, password, role });
}

// ============================================
// UI Utilities
// ============================================

/**
 * Show loading spinner
 */
function showLoading(element) {
    if (element) {
        element.dataset.originalText = element.innerHTML;
        element.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
        element.disabled = true;
    }
}

/**
 * Hide loading spinner
 */
function hideLoading(element) {
    if (element) {
        element.innerHTML = element.dataset.originalText || element.innerHTML;
        element.disabled = false;
    }
}

/**
 * Inject toast/alert styles (called once automatically)
 */
function _injectNotificationStyles() {
    if (document.getElementById('custom-notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'custom-notification-styles';
    style.textContent = `
        /* ===== TOAST NOTIFICATIONS ===== */
        .toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
        }

        .toast {
            pointer-events: auto;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            min-width: 320px;
            max-width: 420px;
            padding: 16px 20px;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
            border-left: 4px solid #4bb564;
            transform: translateX(120%);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            position: relative;
            overflow: hidden;
            font-family: 'Segoe UI', 'Poppins', sans-serif;
        }

        .toast.show {
            transform: translateX(0);
            opacity: 1;
        }

        .toast.hide {
            transform: translateX(120%);
            opacity: 0;
        }

        .toast.toast-success { border-left-color: #4bb564; }
        .toast.toast-error   { border-left-color: #e53935; }
        .toast.toast-warning { border-left-color: #ff9800; }
        .toast.toast-info    { border-left-color: #2196f3; }

        .toast-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 16px;
            color: #fff;
        }

        .toast-success .toast-icon { background: linear-gradient(135deg, #4bb564, #388e3c); }
        .toast-error .toast-icon   { background: linear-gradient(135deg, #e53935, #c62828); }
        .toast-warning .toast-icon { background: linear-gradient(135deg, #ff9800, #f57c00); }
        .toast-info .toast-icon    { background: linear-gradient(135deg, #2196f3, #1976d2); }

        .toast-body {
            flex: 1;
            min-width: 0;
        }

        .toast-title {
            font-size: 14px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 2px;
        }

        .toast-message {
            font-size: 13px;
            color: #555;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .toast-close {
            background: none;
            border: none;
            font-size: 18px;
            color: #aaa;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            flex-shrink: 0;
            transition: color 0.2s;
        }

        .toast-close:hover { color: #333; }

        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            border-radius: 0 0 0 12px;
            transition: width linear;
        }

        .toast-success .toast-progress { background: linear-gradient(90deg, #4bb564, #81c784); }
        .toast-error .toast-progress   { background: linear-gradient(90deg, #e53935, #ef5350); }
        .toast-warning .toast-progress { background: linear-gradient(90deg, #ff9800, #ffb74d); }
        .toast-info .toast-progress    { background: linear-gradient(90deg, #2196f3, #64b5f6); }

        /* ===== CUSTOM ALERT/CONFIRM MODAL ===== */
        .custom-alert-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.25s ease;
        }

        .custom-alert-overlay.show { opacity: 1; }

        .custom-alert-box {
            background: #fff;
            border-radius: 16px;
            padding: 32px;
            min-width: 340px;
            max-width: 440px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            transform: scale(0.85) translateY(20px);
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
            text-align: center;
            font-family: 'Segoe UI', 'Poppins', sans-serif;
        }

        .custom-alert-overlay.show .custom-alert-box {
            transform: scale(1) translateY(0);
        }

        .custom-alert-icon {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #fff;
        }

        .custom-alert-icon.success { background: linear-gradient(135deg, #4bb564, #388e3c); }
        .custom-alert-icon.error   { background: linear-gradient(135deg, #e53935, #c62828); }
        .custom-alert-icon.warning { background: linear-gradient(135deg, #ff9800, #f57c00); }
        .custom-alert-icon.info    { background: linear-gradient(135deg, #2196f3, #1976d2); }
        .custom-alert-icon.confirm { background: linear-gradient(135deg, #ff9800, #f57c00); }

        .custom-alert-title {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .custom-alert-message {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            margin-bottom: 24px;
        }

        .custom-alert-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .custom-alert-btn {
            padding: 10px 28px;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            letter-spacing: 0.3px;
        }

        .custom-alert-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .custom-alert-btn.primary {
            background: linear-gradient(135deg, #4bb564, #388e3c);
            color: #fff;
        }

        .custom-alert-btn.danger {
            background: linear-gradient(135deg, #e53935, #c62828);
            color: #fff;
        }

        .custom-alert-btn.cancel {
            background: #f5f5f5;
            color: #555;
            border: 1px solid #ddd;
        }

        .custom-alert-btn.cancel:hover {
            background: #eee;
        }

        @media (max-width: 480px) {
            .toast-container { top: 12px; right: 12px; left: 12px; }
            .toast { min-width: unset; }
            .custom-alert-box { min-width: unset; margin: 0 16px; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Get or create the toast container
 */
function _getToastContainer() {
    _injectNotificationStyles();
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - "success" | "error" | "warning" | "info"
 * @param {number} duration - Auto-dismiss in milliseconds (default 4000)
 */
function showToast(message, type = "success", duration = 4000) {
    const container = _getToastContainer();

    const icons = {
        success: 'fa-check',
        error: 'fa-xmark',
        warning: 'fa-exclamation',
        info: 'fa-info'
    };

    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid ${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-body">
            <div class="toast-title">${titles[type] || titles.info}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
        <div class="toast-progress" style="width: 100%;"></div>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Progress bar
    const progress = toast.querySelector('.toast-progress');
    progress.style.transitionDuration = duration + 'ms';
    requestAnimationFrame(() => {
        setTimeout(() => {
            progress.style.width = '0%';
        }, 50);
    });

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        dismissToast(toast);
    });

    // Auto dismiss
    const timer = setTimeout(() => dismissToast(toast), duration);
    toast._timer = timer;
}

function dismissToast(toast) {
    clearTimeout(toast._timer);
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
}

/**
 * Show a custom styled alert (replaces browser alert)
 * @param {string} message - Message to display
 * @param {string} type - "success" | "error" | "warning" | "info"
 * @returns {Promise} resolves when user clicks OK
 */
function showAlert(message, type = "success") {
    _injectNotificationStyles();

    return new Promise((resolve) => {
        const icons = {
            success: 'fa-check',
            error: 'fa-xmark',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };

        const titles = {
            success: 'Success!',
            error: 'Error!',
            warning: 'Warning!',
            info: 'Notice'
        };

        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.innerHTML = `
            <div class="custom-alert-box">
                <div class="custom-alert-icon ${type}">
                    <i class="fa-solid ${icons[type] || icons.info}"></i>
                </div>
                <div class="custom-alert-title">${titles[type] || titles.info}</div>
                <div class="custom-alert-message">${message}</div>
                <div class="custom-alert-buttons">
                    <button class="custom-alert-btn primary" id="alertOkBtn">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 250);
            resolve();
        };

        overlay.querySelector('#alertOkBtn').addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    });
}

/**
 * Show a custom styled confirm dialog (replaces browser confirm)
 * @param {string} message - Message to display
 * @param {string} confirmText - Text for confirm button (default "Yes, Delete")
 * @returns {Promise<boolean>} resolves true if confirmed, false if cancelled
 */
function showConfirm(message, confirmText = "Yes, Delete") {
    _injectNotificationStyles();

    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.innerHTML = `
            <div class="custom-alert-box">
                <div class="custom-alert-icon confirm">
                    <i class="fa-solid fa-question"></i>
                </div>
                <div class="custom-alert-title">Are you sure?</div>
                <div class="custom-alert-message">${message}</div>
                <div class="custom-alert-buttons">
                    <button class="custom-alert-btn cancel" id="confirmCancelBtn">Cancel</button>
                    <button class="custom-alert-btn danger" id="confirmYesBtn">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        const close = (result) => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 250);
            resolve(result);
        };

        overlay.querySelector('#confirmYesBtn').addEventListener('click', () => close(true));
        overlay.querySelector('#confirmCancelBtn').addEventListener('click', () => close(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close(false);
        });
    });
}

/**
 * Get URL parameter
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * Debounce function for search inputs
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// File Utilities
// ============================================

/**
 * Validate file type
 */
function validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
}

/**
 * Validate file size (in MB)
 */
function validateFileSize(file, maxSizeMB) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

/**
 * Read file as text
 */
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}
