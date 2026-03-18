# Certificate Verification System - Backend

This backend is built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configuration**
   - Environment variables are in `.env`
   - Default Port: 5000
   - Default Database: `mongodb://localhost:27017/certificate_verification_system`

3. **Running the Server**

   **Development (with auto-reload):**
   ```bash
   npm run dev
   ```

   **Production:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Students
- `GET /api/students` - Get all students (Admin)
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create student (Admin)
- `PUT /api/students/:id` - Update student (Admin)
- `DELETE /api/students/:id` - Delete student (Admin)

### Certificates
- `GET /api/certificates/verify/:certId` - Verify certificate (Public)
- `GET /api/certificates/:certId/download` - Download certificate PDF (Public)

### Upload
- `POST /api/upload/students` - Upload Excel/CSV file (Admin)

## File Upload Format

Excel or CSV file should have the following headers:
- Certificate ID
- Student Name
- Domain
- Start Date (YYYY-MM-DD)
- End Date (YYYY-MM-DD)
