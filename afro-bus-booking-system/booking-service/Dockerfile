FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY build/libs/*.jar booking-service.jar
EXPOSE 8083
ENTRYPOINT ["java","-jar","booking-service.jar"]