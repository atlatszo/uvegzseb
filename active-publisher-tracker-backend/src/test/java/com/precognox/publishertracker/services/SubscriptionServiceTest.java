package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.beans.ListSubscriptionsResult;
import com.precognox.publishertracker.entities.Subscriber;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class SubscriptionServiceTest extends DropwizardTestSkeleton {

    private SubscriptionService instance = new SubscriptionService();

    @Test
    public void newSubscription_shouldBeSaved() throws Exception {
        instance.addSubscription("test@email.com");

        List<Subscriber> savedSubscribers = listSubscribers();

        assertEquals(1, savedSubscribers.size());
        assertEquals("test@email.com", savedSubscribers.get(0).getEmail());
    }

    private List<Subscriber> listSubscribers() {
        return Ebean.find(Subscriber.class).findList();
    }

    @Test
    public void existingSubscription_shouldNotBeChanged() throws Exception {
        instance.addSubscription("test@email.com");
        instance.addSubscription("test@email.com");

        List<Subscriber> savedSubscribers = listSubscribers();

        assertEquals(1, savedSubscribers.size());
        assertEquals("test@email.com", savedSubscribers.get(0).getEmail());
    }

    @Test
    public void testRemoveSubscription_withCorrectToken() throws Exception {
        Subscriber subscriber = saveTestSubscriber();

        instance.removeSubscription(subscriber.getEmail(), subscriber.getUnsubscribeToken());

        List<Subscriber> savedSubscribers = listSubscribers();

        assertEquals(0, savedSubscribers.size());
    }

    private Subscriber saveTestSubscriber() {
        Subscriber subscriber = new Subscriber();
        subscriber.setEmail("test@email.com");

        Ebean.save(subscriber);
        return subscriber;
    }

    @Test
    public void testRemoveSubscription_withWrongToken() throws Exception {
        Subscriber subscriber = saveTestSubscriber();

        instance.removeSubscription(subscriber.getEmail(), "wrong-token");

        List<Subscriber> savedSubscribers = listSubscribers();

        assertEquals(1, savedSubscribers.size());
        assertEquals("test@email.com", savedSubscribers.get(0).getEmail());
    }

    @Test
    public void testRemoveSubscription_withNonExistingEmail_shouldNotThrowException() throws Exception {
        instance.removeSubscription("non-existing@email.com", "wrong-token");
    }

    @Test
    public void testListSubscriptions() throws Exception {
        Subscriber testSubscriber = saveTestSubscriber();

        ListSubscriptionsResult result = instance.listSubscriptions(0, 10);

        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getSubscriptions().size());
        assertEquals(testSubscriber.getEmail(), result.getSubscriptions().get(0).getEmail());
    }

    @Test
    public void testRemoveSubscriptionByAdmin() throws Exception {
        Subscriber testSubscriber = saveTestSubscriber();

        instance.removeSubscriptionByAdmin(testSubscriber.getId());

        List<Subscriber> subscribers = listSubscribers();

        assertEquals(0, subscribers.size());
    }

}
