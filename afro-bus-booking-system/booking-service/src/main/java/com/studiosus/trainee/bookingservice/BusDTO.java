package com.studiosus.trainee.bookingservice;

import lombok.Data;

@Data
public class BusDTO {
    private String busId;
    private String busType;
    private String departureTime;
    private String arrivalTime;
    private int busCapacity;
    private int availableSeats;
    private String tripStatus;
    private String busNumber;
    private String busName;
    private String busRoute;

}
