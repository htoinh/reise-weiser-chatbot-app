package com.studiosus.trainee.passengerservice;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final PassengerRepository passengerRepository;

    @Autowired
    public DataSeeder(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if(passengerRepository.count() == 0){
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = new ClassPathResource("data/passengers.json").getInputStream();
            List<Passenger> passengers = mapper.readValue(is, new TypeReference<List<Passenger>>() {});
            passengerRepository.saveAll(passengers);
        }
    }
}
