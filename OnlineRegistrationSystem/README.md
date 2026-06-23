# 🚀 Online Registration System

A RESTful **Microservices-based Online Registration System** built with **Spring Boot**, designed to manage Students, Courses, and Registrations independently using **PostgreSQL** for persistence.

---

## 📚 Project Overview

This system is composed of **three decoupled microservices**:

1. 🎓 **Student Service** – Manages student data  
2. 📘 **Course Service** – Manages course information  
3. 📝 **Registration Service** – Manages student-course registrations  

Each microservice operates independently and communicates using RESTful APIs. Data is persisted in an SQL database backend.

---

## 🧱 Tech Stack

- **Java 21+**
- **Spring Boot**
- **Spring Web**
- **Spring Data JPA**
- **PostgreSQL**
- **JUnit**
- **Postman** (for API testing)
- **Maven**
- **Lombok**

---

## Prerequisites

- Maven
- PostgreSQL

The services expect the following databases to exist:

- `studentdb`
- `coursedb`
- `registrationdb`

Default database credentials are:

- username: `postgres`
- password: `2001`

## 🧩 Microservices Breakdown

### 🎓 Student Microservice

Handles all operations related to **Student** data.

#### ➕ Endpoints

- `POST /api/students` – Add a new student  
- `GET /api/students` – Retrieve all students  
- `GET /api/students/{id}` – Get student details by ID

Example student payload:

```json
{
  "firstName": "Amina",
  "lastName": "Khan",
  "email": "aminakhan@gmail.com",
  "phoneNumber": "555-002-786",
  "dateOfBirth": "2001-04-18"
}
```
---

### 📘 Course Microservice

Handles all operations related to **Courses**.

#### ➕ Endpoints

- `POST /api/courses` – Add a new course  
- `GET /api/courses` – Retrieve all courses

Example course payload:

```json
{
  "name": "Spring Boot Basics",
  "description": "Introduction to Spring Boot",
  "studentId": 1
}
```
---

### 📝 Registration Microservice

Handles **student-course registrations**, and references both `studentID` and `courseID`.

#### ➕ Endpoints

- `POST /api/registrations` – Create a new registration  
- `GET /api/registrations` – Retrieve all registrations with full student details

> 🔁 Makes inter-service calls to the **Student Service** to fetch student details.

```json
{
  "courseId": 2,
  "studentId": 1
}
```
---

## 🐳 Docker Integration

### 🛠 Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- Docker files in each microservice
- Docker compose file in the root project to run the entire project



## 🧪 Integration & Testing

- ✅ Test each service independently with **Postman**
- ✅ Verify service-to-service communication
- ✅ Full workflow:
  - Register a **Student**
  - Register a **Course**
  - Register the **Student to the Course**
  - Retrieve **Registration** with full **Student** info and **Course** reference

---

## ⚙️ Getting Started

> Ensure PostgreSQL is running and accessible.

### 🚀 Run SpringBoot

Inside each microservice directory run:

--💻Git bash--

`mvn clean install`

`mvn spring-boot:run`

### 🚀 Run Docker
Navigate into each service directory and run:

--💻Git bash--

`docker build -t student-service`

`docker build -t course-service`

`docker build -t registration-service`

Navigate into the root directory and run:

`docker-compose up --build`

---