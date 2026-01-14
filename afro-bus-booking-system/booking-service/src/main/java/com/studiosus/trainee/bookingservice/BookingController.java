package com.studiosus.trainee.bookingservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    //Create new Booking
    public ResponseEntity<BookingResponseDTO>createBooking(@RequestBody Booking booking){
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping("by-passenger/{passengerId}")
    //Return a list of all Bookings with bus and passenger details
    public ResponseEntity<List<Booking>> getBookingsByPassengerId(@PathVariable String passengerId){
        return ResponseEntity.ok(bookingService.getBookingsByPassengerId(passengerId));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(){
        return ResponseEntity.ok(bookingService.getAllBookings());
    }


}
