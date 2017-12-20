package com.precognox.publishertracker.background;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.beans.EmailDeliveryRequest;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.PublisherTrackerConfiguration;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Subscriber;
import com.precognox.publishertracker.entities.Update;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class NewsletterEmailBuilderTest extends DropwizardTestSkeleton {

    private NewsletterEmailBuilder instance;

    @Before
    public void setUp() throws Exception {
        PublisherTrackerConfiguration.EmailConfig testEmailConfig = new PublisherTrackerConfiguration.EmailConfig();
        testEmailConfig.setNewsletterFrequencyHours(3*24);
        testEmailConfig.setSenderAddress("test-sender@email.com");
        testEmailConfig.setReplyToAddress("test-reply-to@email.com");
        testEmailConfig.setNewsletterUnsubscribeLinkTemplate("http://frontend-host/unsubscribe/${token}/${email}");

        instance = new NewsletterEmailBuilder(testEmailConfig);
    }

    @Test
    public void testWithEmptyDb() throws Exception {
        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertTrue(result.isEmpty());
    }

    @Test
    public void testWithOneNewUpdate() throws Exception {
        setUpTestUpdate(LocalDateTime.now().minusDays(1));
        Subscriber testSubscriber = setUpTestSubscriber();

        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertEquals(1, result.size());

        assertFalse(result.get(0).getBccAddressList().isEmpty());
        assertEquals(testSubscriber.getEmail(), result.get(0).getBccAddressList().get(0));
        assertEquals("test-sender@email.com", result.get(0).getSenderAddress());
        assertEquals("test-reply-to@email.com", result.get(0).getReplyTo());
        assertEquals("Undisclosed Recipients <test-sender@email.com>", result.get(0).getToAddressList().get(0));
        assertEquals("Active Publisher Tracker hírlevél", result.get(0).getSubject());

        assertTrue(result.get(0).getBody().contains("test-long-name"));
        assertTrue(result.get(0).getBody().contains("test-doc"));
    }

    private void setUpTestUpdate(LocalDateTime date) {
        Document document = new Document();
        document.setProvidedDate(date);
        document.setTitle("test-doc");
        document.setDocumentUrl("test-url");
        document.setPageUrl("test-page-url");

        DataOwner dataOwner = new DataOwner();
        dataOwner.setLongName("test-long-name");
        dataOwner.setShortName("test-short-name");

        Account account = new Account();
        account.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        account.setRole(getApiUserRole());

        Update update = new Update();
        update.setDate(date);
        update.setDocuments(Collections.singletonList(document));
        update.setDataOwner(dataOwner);
        update.setAccount(account);

        document.setUpdate(update);

        Ebean.save(account);
        Ebean.save(dataOwner);
        Ebean.save(update);
        Ebean.save(document);
    }

    private Subscriber setUpTestSubscriber() {
        Subscriber subscriber = new Subscriber();
        subscriber.setEmail(UUID.randomUUID().toString() + "@email.com");
        Ebean.save(subscriber);

        return subscriber;
    }

    @Test
    public void testWithOneOldUpdate() throws Exception {
        setUpTestSubscriber();
        setUpTestUpdate(LocalDateTime.now().minusDays(30));

        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertEquals(0, result.size());
    }

    @Test
    public void shouldContainUnsubscribeLink() throws Exception {
        setUpTestUpdate(LocalDateTime.now().minusDays(1));
        Subscriber testSubscriber = setUpTestSubscriber();

        List<EmailDeliveryRequest> result = instance.buildEmails();

        String expectedUnsubscribeLink =
                "http://frontend-host/unsubscribe/" + testSubscriber.getUnsubscribeToken() + "/" + testSubscriber.getEmail();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getBody().contains(expectedUnsubscribeLink));
    }

    @Test
    public void testWithMultipleSubscribers() throws Exception {
        Subscriber sub1 = setUpTestSubscriber();
        Subscriber sub2 = setUpTestSubscriber();

        setUpTestUpdate(LocalDateTime.now().minusDays(1));

        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertEquals(2, result.size());

        assertTrue(result.get(0).getBccAddressList().contains(sub1.getEmail()));
        assertTrue(result.get(0).getBody().contains(sub1.getUnsubscribeToken()));

        assertTrue(result.get(1).getBccAddressList().contains(sub2.getEmail()));
        assertTrue(result.get(1).getBody().contains(sub2.getUnsubscribeToken()));
    }

}