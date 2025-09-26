FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY build/libs/*.jar bus-service.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","bus-service.jar"]