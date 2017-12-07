package com.precognox.publishertracker.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
public class Subscriber {

    @Id
    private Integer id;

    private String email;

    private LocalDateTime subscriptionDate;

    private String unsubscribeToken;

    public Subscriber(String email) {
        this.email = email;
    }

    @PrePersist
    public void setSubscriptionDate() {
        subscriptionDate = LocalDateTime.now();
    }

    @PrePersist
    public void generateToken() {
        unsubscribeToken = UUID.randomUUID().toString();
    }

}
