package com.studiosus.trainee.bookingservice;

import lombok.Data;

@Data
public class BookingResponseDTO {
    private Booking booking;
    private PassengerDTO passenger;
    private BusDTO bus;
}
