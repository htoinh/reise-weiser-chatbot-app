plugins {
    java
//    id("org.springframework.boot") version "3.5.6"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
description = "afro-bus-booking-system"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}


repositories {
    mavenCentral()
}

