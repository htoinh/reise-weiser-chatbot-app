# Stage 1: Build
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /app
COPY . .

RUN sed -i 's/\r$//' gradlew && sh gradlew bootJar --no-daemon

# Stage 2: Run
FROM eclipse-temurin:25-jre

WORKDIR /app
COPY --from=builder --chown=ubuntu:ubuntu /app/build/libs/*.jar app.jar

USER ubuntu
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
