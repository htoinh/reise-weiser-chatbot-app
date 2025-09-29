# 🚀 Online Registration System (Microservices Architecture)

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

## 🧩 Microservices Breakdown

### 🎓 Student Microservice

Handles all operations related to **Student** data.

#### ➕ Endpoints

- `POST /api/students` – Add a new student  
- `GET /api/students` – Retrieve all students  
- `GET /api/students/{id}` – Get student details by ID

---

### 📘 Course Microservice

Handles all operations related to **Courses**.

#### ➕ Endpoints

- `POST /api/courses` – Add a new course  
- `GET /api/courses` – Retrieve all courses

---

### 📝 Registration Microservice

Handles **student-course registrations**, and references both `studentID` and `courseID`.

#### ➕ Endpoints

- `POST /api/registrations` – Create a new registration  
- `GET /api/registrations` – Retrieve all registrations with full student details

> 🔁 Makes inter-service calls to the **Student Service** to fetch student details.

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
mvn clean install
mvn spring-boot:run

### 🚀 Run Docker
Navigate into each service directory and run:

--💻Git bash--
docker build -t student-service
docker build -t course-service
docker build -t registration-service

Navigate into the root directory and run:

docker-compose up --build

---

# 🚌 Afro-Bus Booking System (Microservices Architecture)

A distributed **Microservices-based Bus Booking System** built with **Spring Boot**, designed to handle Passenger registration, Bus availability, and Booking management using **MongoDB** for data persistence and **Docker** for containerized deployment.

---

## 📚 Project Overview

This system is composed of **three independent microservices**:

1. 🙋‍♂️ **Passenger Service** – Registers and manages passengers  
2. 🚌 **Bus Service** – Adds and lists available buses  
3. 🎟 **Booking Service** – Reserves buses for passengers  

Each microservice runs independently, communicates via **RESTful APIs**, and is fully containerized with Docker.

---

## 🧱 Tech Stack

- **Java 21**
- **Spring Boot**
- **Spring Web**
- **Spring Data JPA**
- **MongoDB**
- **Lombok**
- **Gradle**
- **Docker & Docker Compose**
- **JUnit**
- **Postman** (for API testing)

---

## 🧩 Microservices Breakdown

### 🙋‍♂️ Passenger Microservice

Manages the **Passenger** profiles and registration process.

#### ➕ Endpoints

- `POST /api/passengers` – Register a new passenger  
- `GET /api/passengers/{id}` – Retrieve passenger by ID  
- `GET /api/passengers` – Retrieve all passengers

---

### 🚌 Bus Microservice

Handles operations related to **Bus** data and availability.

#### ➕ Endpoints

- `POST /api/buses` – Add a new bus  
- `GET /api/buses` – Retrieve all available buses

---

### 🎟 Booking Microservice

Responsible for **Booking** buses for passengers.

#### ➕ Endpoints

- `POST /api/bookings` – Create a new booking  
- `GET /api/bookings` – Retrieve all bookings with passenger & bus information

> 🔁 Makes internal REST calls to **Passenger** and **Bus Services** to fetch complete data.

---

## 🐳 Docker Integration

### 🛠 Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- Dockerfiles in each microservice directory
- A root-level `docker-compose.yml` to run the entire system, including MongoDB

---

## ⚙️ Getting Started

> Ensure Docker is installed and MongoDB is accessible or included in Docker Compose.

### 🚀 Run Spring Boot Services (Without Docker)

Inside each microservice directory, run:

--💻Git bash--
./gradlew clean build
./gradlew bootRun

Navigate into the root directory and run:
--💻Git bash--
docker-compose up --build

