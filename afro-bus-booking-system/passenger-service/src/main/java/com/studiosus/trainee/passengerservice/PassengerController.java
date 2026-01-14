package com.studiosus.trainee.passengerservice;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PassengerController {
    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    //Add a passenger
    @PostMapping("/passengers")
    public Passenger addPassenger(@RequestBody Passenger passenger) {
        return passengerService.addPassenger(passenger);
    }

    //Get all passengers
    @GetMapping("/passengers")
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/passengers/{passengerId}")
    public Passenger getPassengerById(@PathVariable String passengerId) {
        return passengerService.getPassengersByPassengerId(passengerId);
    }
}
