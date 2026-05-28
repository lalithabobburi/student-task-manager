# 📚 Student Task Manager

A full-stack web application for managing student assignments and tasks.  
Built as part of the **CGI Apprentice – Java/Support** project portfolio.

---

## 🛠 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | Angular 17 (standalone)  |
| Backend   | Java 17 + Spring Boot 3  |
| Database  | SQLite (via JPA)         |
| Scripts   | Python 3.10+             |

---

## 📁 Project Structure

```
student-task-manager/
├── backend/                  ← Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/taskmanager/
│       ├── TaskManagerApplication.java
│       ├── config/CorsConfig.java
│       ├── controller/TaskController.java
│       ├── model/Task.java
│       ├── repository/TaskRepository.java
│       └── service/TaskService.java
│
├── frontend/                 ← Angular SPA
│   ├── angular.json
│   ├── package.json
│   └── src/app/
│       ├── components/
│       │   ├── task-dashboard/
│       │   ├── task-list/
│       │   └── task-form/
│       ├── models/task.model.ts
│       ├── services/task.service.ts
│       └── app.routes.ts
│
└── scripts/                  ← Python utilities
    ├── task_report.py        ← Daily summary report generator
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- Python 3.10+

---

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will start at `http://localhost:8080`  
SQLite database `taskmanager.db` is auto-created in the `backend/` folder.

---

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser.

---

### 3. Run the Python Report

```bash
cd scripts

# Print report to console
python task_report.py

# Also save to report.txt
python task_report.py --export

# Custom DB path
python task_report.py --db ../backend/taskmanager.db
```

---

## 🔌 API Endpoints

| Method | Endpoint                        | Description            |
|--------|---------------------------------|------------------------|
| GET    | `/api/tasks`                    | Get all tasks          |
| GET    | `/api/tasks/{id}`               | Get task by ID         |
| POST   | `/api/tasks`                    | Create new task        |
| PUT    | `/api/tasks/{id}`               | Update task            |
| DELETE | `/api/tasks/{id}`               | Delete task            |
| GET    | `/api/tasks/status/{status}`    | Filter by status       |
| GET    | `/api/tasks/priority/{priority}`| Filter by priority     |
| GET    | `/api/tasks/subject/{subject}`  | Filter by subject      |
| GET    | `/api/tasks/search?keyword=`    | Search by title        |
| GET    | `/api/tasks/due-today`          | Tasks due today        |
| GET    | `/api/tasks/stats`              | Dashboard statistics   |

---

## ✨ Features

- ✅ Create, Read, Update, Delete tasks
- 📊 Dashboard with live stats (pending / in-progress / completed / overdue)
- 🔍 Search and filter by status, priority, and subject
- ⚠️ Automatic overdue detection
- 📅 "Due Today" widget
- 🐍 Python report generator with progress bars per subject
- 💾 Persistent SQLite storage (no external DB needed)

---

## 🗄 Task Schema

```
id          - Auto-generated primary key
title       - Task title (required)
description - Optional details
subject     - Course/subject name (required)
deadline    - Due date (required)
status      - PENDING | IN_PROGRESS | COMPLETED | OVERDUE
priority    - LOW | MEDIUM | HIGH
createdAt   - Auto timestamp
updatedAt   - Auto timestamp
```

---

## 👤 Author

- **Name:** [Your Name]
- **Role:** CGI Apprentice – Java/Support
- **Position ID:** J0526-0365

---

## 📄 License

MIT License — free to use and modify.
