package com.studiosus.trainee.busservice;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends MongoRepository<Bus,String> {

}
