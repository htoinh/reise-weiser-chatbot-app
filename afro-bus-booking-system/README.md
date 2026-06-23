

# 🚌 Afro-Bus Booking System 

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

`./gradlew clean build`

`./gradlew bootRun`

Navigate into the root directory and run:

--💻Git bash--

`docker-compose up --build`

