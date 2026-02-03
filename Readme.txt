# HRMS Lite

## Overview
HRMS Lite is a lightweight HR management system for a single admin user to manage employees and track daily attendance.
It supports employee CRUD operations and attendance marking with basic validations and error handling.

## Tech Stack
- Backend: Python, Django, Django REST Framework
- Database: SQLite (local) / Render Postgres (optional)
- Frontend: HTML, CSS, JavaScript, Bootstrap
- Deployment: Render (Backend), Netlify (Frontend)

## Features
### Employee Management
- Add employee (unique Employee ID)
- List employees
- Delete employee
- Validations: required fields, email format, duplicate employee_id/email

### Attendance Management
- Mark attendance (Present/Absent) per employee per date
- View attendance by employee
- Bonus: Filter attendance by date range, summary (present/absent counts)

## API Endpoints
- GET/POST `/api/employees/`
- DELETE `/api/employees/<id>/`
- POST `/api/attendance/`
- GET `/api/employees/<id>/attendance/?from=YYYY-MM-DD&to=YYYY-MM-DD`
- GET `/api/employees/<id>/attendance/summary/`

## Run Locally
### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
