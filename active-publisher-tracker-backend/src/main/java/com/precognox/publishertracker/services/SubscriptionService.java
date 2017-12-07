package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.beans.ListSubscriptionsResult;
import com.precognox.publishertracker.beans.SubscriptionRB;
import com.precognox.publishertracker.entities.Subscriber;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import com.precognox.publishertracker.util.DateFormatter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
public class SubscriptionService {

    public void addSubscription(String email) {
        Subscriber existingSubscriber = findSubscriber(email);

        if (existingSubscriber == null) {
            Ebean.save(new Subscriber(email));
        }
    }

    private Subscriber findSubscriber(String email) {
        return Ebean.find(Subscriber.class).where().eq("email", email).findUnique();
    }

    public void removeSubscription(String email, String submittedToken) {
        Optional<Subscriber> existingSubscriber = Optional.ofNullable(findSubscriber(email));

        if (existingSubscriber.isPresent()) {
            if (tokenMatches(existingSubscriber.get(), submittedToken)) {
                Ebean.delete(existingSubscriber.get());
                log.info("Subscriber deleted: " + email);
            } else {
                log.warn("Invalid unsubscribe token for " + email + ", token: " + submittedToken);
            }
        }
    }

    private boolean tokenMatches(Subscriber existingSubscriber, String submittedToken) {
        return Objects.equals(existingSubscriber.getUnsubscribeToken(), submittedToken);
    }

    public ListSubscriptionsResult listSubscriptions(int start, int rows) {
        int totalCount = Ebean.find(Subscriber.class).findCount();

        List<Subscriber> subscribers = Ebean.find(Subscriber.class)
                .setFirstRow(start)
                .setMaxRows(rows)
                .orderBy("subscriptionDate DESC")
                .findList();

        ListSubscriptionsResult result = new ListSubscriptionsResult();
        result.setTotalCount(totalCount);

        List<SubscriptionRB> resultItems = subscribers.stream()
                .map(this::mapToRB)
                .collect(Collectors.toList());

        result.setSubscriptions(resultItems);

        return result;
    }

    private SubscriptionRB mapToRB(Subscriber entity) {
        return new SubscriptionRB(
                entity.getId(),
                entity.getEmail(),
                DateFormatter.formatDate(entity.getSubscriptionDate())
        );
    }

    public void removeSubscriptionByAdmin(int subscriptionId) {
        Optional<Subscriber> subscriberInDb = Optional.ofNullable(Ebean.find(Subscriber.class, subscriptionId));

        Subscriber subscriber = subscriberInDb.orElseThrow(
                () -> new EntityNotFoundException("Subscriber not found with ID: " + subscriptionId)
        );

        Ebean.delete(subscriber);

        log.info("Subscription deleted by admin: " + subscriber.getEmail());
    }

}
