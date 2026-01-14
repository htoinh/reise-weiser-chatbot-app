package com.studiosus.trainee.bookingservice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    //Calls the other 2 microservices
    private final RestTemplate restTemplate;

    @Value("${passenger.service.url}")
    private String passengerServiceUrl;

    @Value("${bus.service.url}")
    private String busServiceUrl;

    public BookingService(BookingRepository bookingRepository, RestTemplate restTemplate) {
        this.bookingRepository = bookingRepository;
        this.restTemplate = restTemplate;
    }


    public BookingResponseDTO createBooking(Booking bookingRequest){
        //Retrieves all bus details
        BusDTO bus = restTemplate.getForObject(busServiceUrl + bookingRequest.getBusId(), BusDTO.class);

        //Return this statement if there are no details given about the bus
        if(bus == null){
            throw new RuntimeException("Bus not found");
        }

        //Return this statement on an attempt to book a canceled bus
        if("Canceled".equalsIgnoreCase(bus.getTripStatus())){
            throw new RuntimeException("Trip is canceled");
        }

        //Return this statement on an attempt to book a bus that is full
        if (bus.getAvailableSeats() <=0){
            throw new RuntimeException(" No seats available");
        }

        //Retrieves all passenger details
        ResponseEntity<PassengerDTO> passengerResponse = restTemplate.getForEntity(passengerServiceUrl + bookingRequest.getPassengerId(), PassengerDTO.class);

        //Return statement on entry of a non-existent passenger
        if(passengerResponse.getBody() == null){
            throw new RuntimeException("Passenger not found");
        }

        PassengerDTO passenger = passengerResponse.getBody();

        //Creates and saves the booking
        bookingRequest.setBookingDate(LocalDate.now().toString());
        bookingRequest.setBookingStatus("Confirmed");
        bookingRequest.setSeatNumber(bus.getBusCapacity() - bus.getAvailableSeats() +1);
        bookingRequest.setPaymentStatus(true);

        Booking savedBooking = bookingRepository.save(bookingRequest);

        BookingResponseDTO response = new BookingResponseDTO();
        response.setBooking(savedBooking);
        response.setPassenger(passenger);
        response.setBus(bus);

        return response;
    }


    //Retrieve Passenger bookings by their Id
    public List<Booking> getBookingsByPassengerId(String passengerId){
        return bookingRepository.findByPassengerId(passengerId);
    }

    //Retrieve all bookings
    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }

}
