# Certificate Verification System - Frontend

A modern, responsive web application for managing and verifying internship certificates.

## 🎨 Design Theme

- **Primary Color**: #4bb564 (Green)
- **Secondary Color**: #3a9450 (Dark Green)
- **Accent Color**: #d4af37 (Gold)
- **Background**: #f0f2f5 (Light Gray)
- **Font**: Poppins (sans-serif), Georgia (serif for certificates)

## 📁 Project Structure

```
Frontend/
├── Home/
│   ├── index.html          # Landing page
│   ├── style.css
│   ├── script.js
│   └── hero.png
│
├── Admin authentication/
│   ├── admin-login.html    # Admin login/register
│   ├── style.css
│   ├── script.js
│   └── admin-hero.png
│
├── Admin dashboard/
│   ├── admin-dashboard.html    # Admin dashboard with data management
│   ├── admin-dashboard.css
│   └── admin-dashboard.js
│
├── User authentication/
│   ├── login.html          # User login/register
│   ├── style.css
│   ├── script.js
│   └── user-hero.png
│
├── User dashboard/
│   ├── dashboard.html          # User dashboard for certificate search
│   ├── dashboardstyle.css
│   ├── dashboardscript.js
│   ├── certificate-result.html # Certificate verification results
│   ├── certificate-result.css
│   └── certificate-result.js
│
├── Certificate template/
│   ├── certificate-template.html   # Professional certificate design
│   └── certificate-template.css
│
├── Forgot/
│   ├── forgotpassword.html
│   ├── style.css
│   ├── script.js
│   └── forgot-hero.png
│
└── js/
    └── common.js           # Shared utilities
```

## 🚀 Features Implemented

### ✅ Completed Features

1. **Landing Page**
   - Professional hero section
   - About section
   - Navigation to login/admin pages
   - Modal for login requirement

2. **Authentication Pages**
   - User login/register
   - Admin login/register
   - Forgot password
   - Form validation

3. **Admin Dashboard**
   - Statistics cards (total certificates, students, uploads)
   - Excel/CSV file upload with drag & drop
   - Student data management table
   - Search and filter functionality
   - Add/Edit/Delete student records
   - Pagination support

4. **User Dashboard**
   - Certificate search by ID
   - Form validation
   - Recent searches tracking

5. **Certificate Verification**
   - Certificate details display
   - Success/error states
   - Certificate preview
   - Download and print buttons

6. **Certificate Template**
   - Professional certificate design
   - Dynamic fields for student data
   - Print-optimized layout
   - Decorative elements

## 🔧 Setup Instructions

1. **Clone or Download** the project files

2. **Open in Browser**
   - Navigate to `Frontend/Home/index.html` to start
   - Or open any specific page directly

3. **No Build Required**
   - Pure HTML, CSS, and JavaScript
   - No dependencies or build tools needed

## 📱 Navigation Flow

```
Home (index.html)
├── User Login → User Dashboard → Certificate Search → Certificate Result
└── Admin Login → Admin Dashboard → Manage Students → View Certificates
```

### User Flow
1. Start at **Home** page
2. Click **Login** → User authentication
3. After login → **User Dashboard**
4. Enter certificate ID → Click **Verify**
5. View **Certificate Result** with details
6. **Download** or **Print** certificate

### Admin Flow
1. Start at **Home** page
2. Click **Admin Login** → Admin authentication
3. After login → **Admin Dashboard**
4. Upload Excel/CSV file OR add students manually
5. Manage student records (view, edit, delete)
6. View generated certificates

## 🎯 Key Pages

### 1. Home Page
- **Path**: `Home/index.html`
- **Features**: Landing page, navigation, about section

### 2. Admin Dashboard
- **Path**: `Admin dashboard/admin-dashboard.html`
- **Features**: File upload, student management, statistics

### 3. User Dashboard
- **Path**: `User dashboard/dashboard.html`
- **Features**: Certificate search, verification

### 4. Certificate Result
- **Path**: `User dashboard/certificate-result.html`
- **Features**: Certificate details, preview, download/print

### 5. Certificate Template
- **Path**: `Certificate template/certificate-template.html`
- **Features**: Professional certificate design, print-ready

## 🔌 Backend Integration (Future)

The frontend is ready for backend integration. Key integration points:

### API Endpoints Needed

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/forgot-password

// Certificates
GET  /api/certificates/verify/:id
GET  /api/certificates/:id/download
POST /api/certificates/generate

// Students
POST /api/students/upload          // Bulk upload via Excel/CSV
GET  /api/students
POST /api/students
PUT  /api/students/:id
DELETE /api/students/:id
```

### Files to Update for Backend

1. **common.js** - Update API endpoints
2. **admin-dashboard.js** - Connect upload and CRUD operations
3. **certificate-result.js** - Connect verification API
4. **Authentication scripts** - Connect login/register APIs

## 📊 Sample Data Format

### Excel/CSV Upload Format
```
Certificate ID | Student Name | Domain | Start Date | End Date
CERT001 | John Doe | Web Development | 01/01/2026 | 31/03/2026
CERT002 | Jane Smith | Data Science | 15/01/2026 | 15/04/2026
```

### Certificate Data Object
```javascript
{
  certId: "CERT001",
  studentName: "John Doe",
  domain: "Web Development",
  startDate: "01/01/2026",
  endDate: "31/03/2026"
}
```

## 🎨 Design Guidelines

### Colors
- **Primary Actions**: #4bb564 (green buttons, headers)
- **Secondary Actions**: #3498db (blue for info)
- **Danger Actions**: #e74c3c (red for delete)
- **Success States**: #4bb564 gradient
- **Error States**: #e74c3c gradient

### Typography
- **Headings**: Poppins, bold
- **Body Text**: Poppins, regular
- **Certificates**: Georgia, serif

### Components
- **Buttons**: Rounded (border-radius: 25px)
- **Cards**: Subtle shadow, rounded corners
- **Forms**: Clean, minimal design
- **Tables**: Striped rows, hover effects

## 📱 Responsive Design

All pages are responsive and work on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🖨️ Print Support

Certificate pages include print-optimized CSS:
- Removes navigation and buttons
- Optimizes layout for A4 paper
- Preserves colors and styling

## 🔒 Security Notes

**Frontend Only** - Current implementation:
- Form validation (client-side only)
- No actual authentication
- Sample data in JavaScript

**For Production**:
- Implement backend authentication
- Add HTTPS
- Validate all inputs server-side
- Implement CSRF protection
- Add rate limiting

## 🐛 Known Limitations

1. **No Backend**: All data is stored in JavaScript arrays/localStorage
2. **No PDF Generation**: Download button shows placeholder
3. **No Email**: Forgot password doesn't send emails
4. **No File Parsing**: Excel/CSV upload shows success but doesn't parse
5. **No Database**: Data resets on page refresh

## 📝 Future Enhancements

- [ ] Connect to backend API
- [ ] Implement PDF generation
- [ ] Add email notifications
- [ ] Implement file parsing (Excel/CSV)
- [ ] Add database integration
- [ ] Implement real authentication
- [ ] Add certificate templates selection
- [ ] Implement bulk certificate generation
- [ ] Add analytics dashboard
- [ ] Implement QR code on certificates

## 👥 Credits

**Frontend Project by Rahul**
Certificate Verification System © 2026

## 📞 Support

For issues or questions about the frontend:
- Review the code comments
- Check browser console for errors
- Ensure all files are in correct directories
- Verify file paths in HTML are correct

---

**Note**: This is a frontend-only implementation. Backend integration is required for full functionality.
