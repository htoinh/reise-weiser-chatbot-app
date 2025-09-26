package com.studiosus.trainee.passengerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication        (
        exclude = {
                org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class
        }
)
public class PassengerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PassengerServiceApplication.class, args);
    }

}
