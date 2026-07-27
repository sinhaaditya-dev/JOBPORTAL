# Job Portal Backend 🚀

A complete backend for a Job Portal built using **Node.js, Express.js, MongoDB, JWT Authentication, Cloudinary, and REST APIs**.

This project allows recruiters to post and manage jobs, while students can apply for jobs, upload resumes, and track their applications. The backend also includes recruiter dashboards, advanced job filtering, pagination, and secure authentication.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt.js
- Cloudinary
- Multer
- REST API

---

## Features

### Authentication

- User Registration
- User Login
- User Logout
- Get Logged-in User Profile
- JWT Authentication
- Password Hashing using Bcrypt
- Role-based Authorization (Recruiter & Student)

---

### Recruiter Features

- Create Job
- Update Job
- Delete Job
- Get All Recruiter's Jobs
- Upload Company Logo
- View Applicants
- Accept / Reject Applications
- Recruiter Dashboard

Dashboard includes:

- Total Jobs
- Active Jobs
- Closed Jobs
- Total Applicants
- Recent Jobs
- Recent Applications

---

### Student Features

- Apply for Jobs
- Upload Resume
- Add Cover Letter
- View Applied Jobs
- Withdraw Application
- Prevent Duplicate Applications

---

### Job Features

- Get All Jobs
- Get Job By ID
- Keyword Search
- Filter by Company
- Filter by Skills
- Filter by Location
- Filter by Experience
- Filter by Job Type
- Salary Filters
- Pagination
- Sorting

---

### File Upload

- Upload Company Logo
- Upload Student Resume
- Cloudinary Integration
- Multer Middleware

---

## Security

- JWT Protected Routes
- Password Encryption
- Role-based Authorization
- Recruiter Ownership Validation
- Input Validation
- Error Handling

---

## Project Structure

```
src/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── utils/
└── server.js
```

---

## API Modules

### Authentication

- Register
- Login
- Logout
- Get Profile

### Jobs

- Create Job
- Update Job
- Delete Job
- Get All Jobs
- Get Job Details
- Get Recruiter's Jobs

### Applications

- Apply Job
- View My Applications
- Withdraw Application
- Get Applicants
- Update Application Status

### Dashboard

- Dashboard Statistics
- Recent Jobs
- Recent Applications

---

## Upcoming Features

- ATS Resume Analyzer using Gemini AI
- Resume Score & Suggestions
- Job Recommendation
- Email Notifications
- Student Dashboard
- Admin Panel

---

## Author

**Aditya Kumar**

Final Year BCA Student

Currently building this project as a Final Year Project while learning the MERN Stack.