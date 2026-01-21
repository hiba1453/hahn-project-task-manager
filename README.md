# 🗂️ Task & Project Management Application

This project is a **full-stack web application** for managing **projects and tasks**, designed to demonstrate skills in **backend development, frontend development, database design, and application deployment**.

The application provides an organized and intuitive way to **create projects, manage tasks, track deadlines, and monitor progress**.

---

## 🚀 Features

- Project management (create, update, delete projects)
- Task management (create, update, delete tasks)
- Task status tracking (pending / completed)
- Task deadline handling (late, today, upcoming)
- Dashboard with basic statistics
- Secure authentication using JWT
- Responsive and user-friendly interface

---

## 🛠️ Technologies Used

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security (JWT)
- Maven
- RESTful APIs

### Frontend
- React
- TypeScript
- Vite
- Material UI (MUI)

### Database
- MySQL 5.7

### DevOps & Tools
- Docker
- Docker Compose
- Git & GitHub

---

## 📂 Project Structure

~~~text
task-project-manager/
│
├── backend/              # Spring Boot application
│   ├── src/main/java
│   ├── src/main/resources
│   └── pom.xml
│
├── frontend/             # React application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml
└── README.md
~~~

---

## ▶️ Getting Started

### Prerequisites

Make sure you have installed:
- Java 17
- Node.js (v18+ recommended)
- Docker & Docker Compose

---

## 🧩 Running the Application

### Using Docker (Recommended)

~~~bash
docker compose up -d
~~~

Once the containers are running:
- Backend API: http://localhost:8080  
- Frontend App: http://localhost:5173  

---

### Running Without Docker

#### Backend

~~~bash
cd backend
mvn clean install
mvn spring-boot:run
~~~

#### Frontend

~~~bash
cd frontend
npm install
npm run dev
~~~

---

## 🔐 Authentication

The application uses **JWT-based authentication** to secure API endpoints and manage user sessions.

---

## 📊 Dashboard

The dashboard provides insights such as:
- Total number of projects
- Total number of tasks
- Completed vs pending tasks
- Tasks by deadline status

---

## 📌 Notes

- This project was developed for **educational and portfolio purposes**.
- The application follows **clean architecture principles** and **best development practices**.
