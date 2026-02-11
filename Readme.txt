🚀 HRMS Lite
Modern HR Dashboard & Employee Management System

A production-ready HR platform built with Django, PostgreSQL & REST APIs.
Designed to simulate real-world internal HR operations with clean architecture and deployment-ready setup.

🌍 Live Application

🔗 Frontend: https://superb-manatee-5a80cb.netlify.app/attendance

🔗 Backend API: https://hrms-lite-backend-hmyy.onrender.com

📂 Repository: https://github.com/rohinisinghsenger-max/hrms-lite

💡 Product Overview

HRMS Lite is a lightweight yet structured HR system that enables:

Employee management

Attendance tracking

Real-time dashboard analytics

Data validation & error handling

Cloud database integration

This project demonstrates full-stack engineering capability from UI to production deployment.

📊 Dashboard (Key Highlight ⭐)

The Dashboard provides:

👥 Total Employees count

✅ Total Present today

❌ Total Absent today

📅 Quick attendance overview

The dashboard dynamically updates based on live database data, ensuring real-time visibility of workforce status.

✨ Core Modules
👩‍💼 Employee Management

Add employee with unique Employee ID

Email validation

Duplicate prevention

Employee list view

Safe deletion

📅 Attendance Management

Mark Present / Absent

View attendance records

Persistent storage in PostgreSQL

Duplicate attendance prevention (per date)

🛡 Data Validation & Integrity

Required field validation

Email format validation

Unique employee ID enforcement

Proper HTTP status codes (400, 404, 409)

Meaningful error messages

Client + Server-side validation

🏗 Technical Architecture
🔹 Frontend

HTML5

Bootstrap 5

Vanilla JavaScript

Fetch API

Modular JS structure

🔹 Backend

Python 3

Django 5

Django REST Framework

Gunicorn (Production WSGI)

🔹 Database

PostgreSQL (Render Hosted)

Foreign key relationships

Migration-based schema management

🔹 Deployment

Backend: Render Web Service

Database: Render PostgreSQL

Frontend: Static Hosting

Environment-based configuration

📡 API Endpoints
Method	Endpoint	Description
GET	/api/employees/	List employees
POST	/api/employees/	Create employee
DELETE	/api/employees/{id}/	Delete employee
POST	/api/attendance/	Mark attendance
GET	/api/attendance/	List attendance
GET	/api/dashboard/	Dashboard summary (if implemented)
📊 Project Structure
hrms-lite/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── settings.py
│   └── hrms/
│
├── frontend/
│   ├── index.html
│   ├── employees.html
│   ├── attendance.html
│   └── js/
│
└── README.md
🚀 Local Setup
Clone Repository
git clone https://github.com/rohinisinghsenger-max/hrms-lite.git
cd hrms-lite

Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend

Open HTML files using Live Server
Ensure correct API base URL in api.js.

🧠 Engineering Highlights

RESTful API design

Clean separation of concerns

Production database integration

Environment-based configuration

Error boundary handling

Responsive UI design

Scalable structure for future modules

🎯 Scope & Assumptions

Single admin system

No authentication module

Payroll & leave management excluded

Focused on core HR functionality

👩‍💻 Developed By

Rohini Singh Senger
Full-Stack Developer | Python | Django | PostgreSQL

⭐ Why This Project Stands Out

Demonstrates full-stack ownership

Production-ready deployment

Real-world validation handling

Clean dashboard analytics

Cloud-hosted relational database