package com.studiosus.trainee.busservice;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
//Runs Application on startup
public class DataSeeder implements CommandLineRunner {
    private final BusRepository busRepository;

    @Autowired
    public DataSeeder(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        //Seeding will only happen if the database is empty
        if(busRepository.count() == 0){
            //Reads JSON file and turns it into Java objects
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = new ClassPathResource("data/buses.json").getInputStream();
            List<Bus> buses = mapper.readValue(is, new TypeReference<List<Bus>>() {});
            busRepository.saveAll(buses);
        }
    }
}
