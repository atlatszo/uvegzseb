package com.precognox.publishertracker.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionRB {

    private int id;
    private String email;
    private String subscriptionDate;

}
