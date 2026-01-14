package com.studiosus.trainee.passengerservice;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;

    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    //Get all passengers from database
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    //Get passengers by their id
    public Passenger getPassengersByPassengerId(String passengerId) {
        return passengerRepository.findById(passengerId).orElseThrow(()-> new RuntimeException("Passenger not found with id" + passengerId));
    }

    //Register passenger
    public Passenger addPassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }
}
