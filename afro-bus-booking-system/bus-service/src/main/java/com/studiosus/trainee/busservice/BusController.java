package com.studiosus.trainee.busservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BusController{
    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @PostMapping("/buses")
    public Bus addBus(@RequestBody Bus bus){
        return busService.addBus(bus);
    }

    @GetMapping("/buses")
    public List<Bus> getAllBuses(){
        return busService.getAllBuses();
    }

    @GetMapping("/buses/{busId}")
    public ResponseEntity<Bus> getBusById(@PathVariable String busId){
        Bus bus = busService.getBusById(busId);
        if(bus == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bus);
    }
}
