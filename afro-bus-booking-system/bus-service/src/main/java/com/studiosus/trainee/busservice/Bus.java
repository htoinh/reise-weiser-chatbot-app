package com.studiosus.trainee.busservice;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "buses")
public class Bus {
    @Id
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
