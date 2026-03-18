// Admin Dashboard JavaScript

// DOM Elements
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const filterDomain = document.getElementById("filterDomain");
const btnAddStudent = document.getElementById("btnAddStudent");
const studentModal = document.getElementById("studentModal");
const overlay = document.getElementById("overlay");
const closeModal = document.getElementById("closeModal");
const btnCancel = document.getElementById("btnCancel");
const studentForm = document.getElementById("studentForm");

// Statistics
const totalCertificates = document.getElementById("totalCertificates");
const totalStudents = document.getElementById("totalStudents");
const recentUploads = document.getElementById("recentUploads");

// Global state
let students = [];

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
  fetchStudents();
  setupEventListeners();
});

// Check Authentication
function checkAuth() {
  const token = getFromLocalStorage("token");
  const user = getFromLocalStorage("user");

  if (!token || !user || user.role !== "admin") {
    window.location.href = "../Admin authentication/admin-login.html";
  }
}

// Fetch Students from API
async function fetchStudents() {
  const result = await getStudentsAPI();

  if (result.success) {
    students = result.data;
    updateStatistics();
    renderTable(students);
  } else {
    showToast("Failed to fetch students: " + result.error, "error");
    if (result.error.includes("Not authorized")) {
      window.location.href = "../Admin authentication/admin-login.html";
    }
  }
}

// Update Statistics
function updateStatistics() {
  totalCertificates.textContent = students.length;
  totalStudents.textContent = students.length;
  // For recent uploads, we might need a separate API or just track session uploads
  // recentUploads.textContent = "0"; 
}

// Setup Event Listeners
function setupEventListeners() {
  // File upload - drag and drop
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const files = e.dataTransfer.files;
    handleFileUpload(files[0]);
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    handleFileUpload(e.target.files[0]);
  });

  // Search functionality
  searchInput.addEventListener("input", filterTable);

  // Domain filter
  filterDomain.addEventListener("change", filterTable);

  // Add student button
  btnAddStudent.addEventListener("click", () => {
    openModal("add");
  });

  // Close modal
  closeModal.addEventListener("click", closeModalHandler);
  btnCancel.addEventListener("click", closeModalHandler);
  overlay.addEventListener("click", closeModalHandler);

  // Form submission
  studentForm.addEventListener("submit", handleFormSubmit);

  // Logout
  const logoutLinks = document.querySelectorAll('a[href*="Logout"]');
  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      clearLocalStorage();
      window.location.href = "../Home/index.html";
    });
  });
}

// Handle File Upload
async function handleFileUpload(file) {
  if (!file) return;

  const validTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
    showToast("Please upload a valid Excel or CSV file!", "error");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  showLoading(dropzone);

  try {
    const result = await uploadStudentDataAPI(formData);

    if (result.success) {
      showToast(result.data.message, "success");
      if (result.data.errors) {
        console.warn("Upload warnings:", result.data.errors);
        showToast("Some records were skipped. Check console for details.", "warning", 6000);
      }
      fetchStudents(); // Refresh table
    } else {
      showToast("Upload failed: " + result.error, "error");
    }
  } catch (error) {
    showToast("Upload error: " + error.message, "error");
  } finally {
    hideLoading(dropzone);
    fileInput.value = "";
  }
}

// Render Table
function renderTable(data) {
  studentTableBody.innerHTML = "";

  if (data.length === 0) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
          No student records found
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.certId}</td>
      <td>${student.name}</td>
      <td>${student.domain}</td>
      <td>${formatDateForDisplay(student.startDate)}</td>
      <td>${formatDateForDisplay(student.endDate)}</td>
      <td class="action-buttons">
        <button class="btn-edit" onclick="editStudent('${student._id}')" title="Edit">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-delete" onclick="deleteStudent('${student._id}')" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
        <button class="btn-view" onclick="viewCertificate('${student.certId}')" title="View Certificate">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    `;
    studentTableBody.appendChild(row);
  });
}

// Filter Table
function filterTable() {
  const searchTerm = searchInput.value.toLowerCase();
  const domainFilter = filterDomain.value;

  const filtered = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm) ||
      student.certId.toLowerCase().includes(searchTerm);
    const matchesDomain = !domainFilter || student.domain === domainFilter;

    return matchesSearch && matchesDomain;
  });

  renderTable(filtered);
}

// Open Modal
function openModal(mode, studentId = null) {
  const modalTitle = document.getElementById("modalTitle");

  if (mode === "add") {
    modalTitle.textContent = "Add New Student";
    studentForm.reset();
    studentForm.dataset.mode = "add";
  } else if (mode === "edit") {
    modalTitle.textContent = "Edit Student";
    const student = students.find(s => s._id === studentId);
    if (student) {
      document.getElementById("certId").value = student.certId;
      document.getElementById("studentName").value = student.name;
      document.getElementById("domain").value = student.domain;
      document.getElementById("startDate").value = formatDateForInput(student.startDate);
      document.getElementById("endDate").value = formatDateForInput(student.endDate);
      studentForm.dataset.mode = "edit";
      studentForm.dataset.id = studentId;
    }
  }

  studentModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// Close Modal
function closeModalHandler() {
  studentModal.classList.add("hidden");
  overlay.classList.add("hidden");
  studentForm.reset();
}

// Handle Form Submit
async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = {
    certId: document.getElementById("certId").value,
    name: document.getElementById("studentName").value,
    domain: document.getElementById("domain").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
  };

  const mode = studentForm.dataset.mode;
  const submitBtn = studentForm.querySelector('button[type="submit"]');
  showLoading(submitBtn);

  try {
    let result;
    if (mode === "add") {
      result = await addStudentAPI(formData);
    } else if (mode === "edit") {
      const id = studentForm.dataset.id;
      result = await updateStudentAPI(id, formData);
    }

    if (result.success) {
      showToast(`Student ${mode === "add" ? "added" : "updated"} successfully!`, "success");
      closeModalHandler();
      fetchStudents();
    } else {
      showToast("Operation failed: " + result.error, "error");
    }
  } catch (error) {
    showToast("Error: " + error.message, "error");
  } finally {
    hideLoading(submitBtn);
  }
}

// Edit Student
function editStudent(id) {
  openModal("edit", id);
}

// Delete Student
async function deleteStudent(id) {
  const confirmed = await showConfirm("This will permanently delete this student record. This action cannot be undone.");
  if (!confirmed) return;

  try {
    const result = await deleteStudentAPI(id);
    if (result.success) {
      showToast("Student deleted successfully!", "success");
      fetchStudents();
    } else {
      showToast("Delete failed: " + result.error, "error");
    }
  } catch (error) {
    showToast("Delete error: " + error.message, "error");
  }
}

// View Certificate
function viewCertificate(certId) {
  window.open(`../User dashboard/certificate-result.html?id=${certId}`, '_blank');
}

// Download Template
document.querySelector(".btn-download-template")?.addEventListener("click", function (e) {
  e.preventDefault();
  // We should provide a real template file
  const csvContent = "data:text/csv;charset=utf-8,Certificate ID,Student Name,Domain,Start Date,End Date\nCERT001,John Doe,Web Development,2026-01-01,2026-03-31";
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "student_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Pagination (Basic implementation - client side for now)
let currentPage = 1;
const itemsPerPage = 10;
// Note: Real pagination should be server-side, but for now we filter the full list locally in renderTable if list is large
