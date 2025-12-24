# 🗂️ Task Manager Application – Hahn Software Morocco

This project was developed as part of the **End-of-Studies Internship (PFE) 2026 evaluation process at Hahn Software Morocco**.

The objective of this task is to design and implement a **full-stack task management web application**, demonstrating skills in backend development, frontend development, database design, and application deployment.

The application allows users to:
- Manage projects
- Create and track tasks
- Handle task due dates (late, today, upcoming)
- Mark tasks as completed or pending
- Visualize basic statistics through a dashboard

This repository contains the **complete source code**, setup instructions, and execution steps required to run the application locally.

---

## 🛠️ Tools & Technologies Used

### Backend
- **Java 17**
- **Spring Boot**
- **Spring Data JPA**
- **Spring Security (JWT)**
- **Maven**
- **REST API**

### Frontend
- **React + TypeScript**
- **Vite**
- **Material UI (MUI)**

### Database
- **MySQL 5.7**

### DevOps / Tools
- **Docker**
- **Docker Compose**
- **Git & GitHub**

---

## 📂 Project Structure

hahn-project-task-manager/
│
├── backend/ # Spring Boot application
│ ├── src/main/java
│ ├── src/main/resources
│ └── pom.xml
│
├── frontend/ # React application
│ ├── src/
│ ├── public/
│ └── package.json
│
├── docker-compose.yml
└── README.md


---

## ▶️ How to Run the Application

### Prerequisites

Make sure you have installed:
- Java 17
- Node.js (v18+ recommended)
- Docker & Docker Compose
- MySQL (if running without Docker)

---

## 🧩 Database Setup

### Using Docker (Recommended)

The database is automatically configured using **Docker Compose**.

```bash
docker compose up -d
