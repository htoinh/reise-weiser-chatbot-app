FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY build/libs/*.jar passenger-service.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","passenger-service.jar"]