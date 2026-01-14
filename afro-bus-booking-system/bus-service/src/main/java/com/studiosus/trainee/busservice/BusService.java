package com.studiosus.trainee.busservice;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusService {

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    //Get all buses
    public List<Bus> getAllBuses(){
        return busRepository.findAll();
    }

    //Save buses to database
    public Bus addBus(Bus bus){
        return busRepository.save(bus);
    }

    //Get bus by Id
    public Bus getBusById(String busId){
        return busRepository.findById(busId).orElse(null);
    }
}
