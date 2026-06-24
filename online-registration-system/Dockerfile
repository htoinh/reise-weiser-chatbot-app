# ==========================================
# Stage 1: Build the application using Maven
# ==========================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy the parent pom.xml
COPY pom.xml .

# Copy all microservice directories so the parent POM can build them
COPY course-service ./course-service
COPY student-service ./student-service
COPY registration-service ./registration-service

# Package the application (skip tests to speed up the docker build)
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Run the application
# ==========================================
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Define build arguments to make this Dockerfile reusable
ARG SERVICE_NAME
ARG SERVICE_PORT

# Copy the specific service .jar file
COPY --from=builder /build/${SERVICE_NAME}/target/${SERVICE_NAME}-0.0.1-SNAPSHOT.jar app.jar

EXPOSE ${SERVICE_PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]