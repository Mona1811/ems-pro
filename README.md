
# EMS Pro – Employee Management System

A full-stack Employee Management System built to simplify employee data management through a modern dashboard and RESTful APIs.

## 🚀 Project Overview

EMS Pro is a web-based application that helps organizations manage employee information efficiently. It provides employee CRUD operations, search, department filtering, and dashboard statistics through a clean and responsive interface.

## ✨ Features

- 📊 Dashboard with employee statistics
- 👥 Add new employees
- ✏️ Update employee details
- 🔍 View employee information
- 🗑️ Delete employee records
- 🔎 Search employees
- 🏢 Filter employees by department
- 📈 Employee status summary
- ✅ Backend validation and error handling
- 📱 Responsive user interface

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Lucide React

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST API
- Maven

### Database
- MySQL

### Tools
- Visual Studio Code
- Git & GitHub
- Postman

## 📁 Project Structure

```text
employee-management-system/
│
├── employee-management-system/
│   └── Backend (Spring Boot)
│
├── ems-frontend/
│   └── Frontend (React + Vite)
│
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the project:

- Java JDK
- Node.js and npm
- MySQL
- Git

## ▶️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Mona1811/ems-pro.git
cd ems-pro
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE employee_management_db;
```

Configure your database credentials using the `DB_PASSWORD` environment variable.

### 3. Run the Backend

Open a terminal:

```powershell
cd employee-management-system
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
.\mvnw.cmd spring-boot:run
```

Backend runs at:

`http://localhost:8080`

### 4. Run the Frontend

Open another terminal:

```bash
cd ems-frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 🔗 API Endpoint

Base URL:

`http://localhost:8080/api/employees`

The API supports employee management operations such as creating, retrieving, updating, and deleting employee records.

## 👩‍💻 Developer

**Mohana Devi S**

GitHub: [Mona1811](https://github.com/Mona1811)

---

⭐ If you find this project interesting, feel free to explore the repository!
