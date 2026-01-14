package com.studiosus.trainee.bookingservice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String bookingId;
    private String passengerId;
    private String busId;
    private String bookingDate;
    private String bookingStatus;
    private int seatNumber;
    private boolean paymentStatus;



}
