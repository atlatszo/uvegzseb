package com.precognox.publishertracker.beans;

import lombok.Data;

import java.util.List;

@Data
public class ListSubscriptionsResult {

    private int totalCount;

    private List<SubscriptionRB> subscriptions;

}
