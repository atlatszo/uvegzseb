package com.precognox.publishertracker.background;

import com.avaje.ebean.Ebean;
import com.precognox.emailservice.beans.EmailDeliveryRequest;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.PublisherTrackerConfiguration;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.DataOwnerEmail;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.ranking.ExampleRankingPlugin;
import com.precognox.publishertracker.services.RankingService;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ReminderEmailBuilderTest extends DropwizardTestSkeleton {

    private ReminderEmailBuilder instance;

    @Before
    public void setUp() throws Exception {
        PublisherTrackerConfiguration.EmailConfig emailConfig = new PublisherTrackerConfiguration.EmailConfig();
        emailConfig.setSenderAddress("test-sender@email.com");
        emailConfig.setReplyToAddress("test-reply-to@email.com");
        emailConfig.setReminderThresholdDays(5);

        instance = new ReminderEmailBuilder(new RankingService(new ExampleRankingPlugin()), emailConfig);
    }

    @Test
    public void testWithEmptyDb() throws Exception {
        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertTrue(result.isEmpty());
    }

    @Test
    public void testWithOldUpdate() throws Exception {
        setUpTestDataOwner(LocalDateTime.now().minusDays(30));

        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertEquals(1, result.size());
        assertEquals("test-email@email.com", result.get(0).getToAddressList().get(0));
        assertEquals("test-sender@email.com", result.get(0).getSenderAddress());
        assertEquals("test-reply-to@email.com", result.get(0).getReplyTo());

        assertEquals("30 napja nem tett közzé adatfrissítést.", result.get(0).getSubject());

        assertTrue(result.get(0).getBody().contains("test-long-name"));
        assertTrue(result.get(0).getBody().contains("30"));
    }

    private void setUpTestDataOwner(LocalDateTime updateDate) {
        Document document = new Document();
        document.setProvidedDate(updateDate);
        document.setTitle("test-doc");
        document.setDocumentUrl("test-url");
        document.setPageUrl("test-page-url");

        DataOwner dataOwner = new DataOwner();
        dataOwner.setLongName("test-long-name");
        dataOwner.setShortName("test-short-name");

        DataOwnerEmail dataOwnerEmail = new DataOwnerEmail();
        dataOwnerEmail.setEmail("test-email@email.com");
        dataOwnerEmail.setDataOwner(dataOwner);

        Account account = new Account();
        account.setRole(getApiUserRole());
        account.setKeycloakSubjectUuid(UUID.randomUUID().toString());

        Update update = new Update();
        update.setDate(updateDate);
        update.setDocuments(Collections.singletonList(document));
        update.setDataOwner(dataOwner);
        update.setAccount(account);

        document.setUpdate(update);

        Ebean.save(account);
        Ebean.save(dataOwner);
        Ebean.save(update);
        Ebean.save(document);
        Ebean.save(dataOwnerEmail);
    }

    @Test
    public void testWithNewUpdate() throws Exception {
        setUpTestDataOwner(LocalDateTime.now().minusDays(1));

        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertEquals(0, result.size());
    }

    @Test
    public void testWithNoUpdates() throws Exception {
        setUpTestDataOwner_withNoUpdate();

        List<EmailDeliveryRequest> result = instance.buildEmails();

        assertEquals(1, result.size());
        assertEquals("Még nem tett közzé adatfrissítést.", result.get(0).getSubject());
    }

    private void setUpTestDataOwner_withNoUpdate() {
        DataOwner dataOwner = new DataOwner();
        dataOwner.setLongName("test-long-name");
        dataOwner.setShortName("test-short-name");

        DataOwnerEmail dataOwnerEmail = new DataOwnerEmail();
        dataOwnerEmail.setEmail("test-email@email.com");
        dataOwnerEmail.setDataOwner(dataOwner);

        Ebean.save(dataOwner);
        Ebean.save(dataOwnerEmail);
    }

    @Test
    public void shouldContainRankingPosition() throws Exception {
        setUpTestDataOwner(LocalDateTime.now().minusDays(30));

        List<EmailDeliveryRequest> result = instance.buildEmails();

        String expectedText = "A jelenlegi helye az adatgazdák rangsorában: 1.";

        assertEquals(1, result.size());
        assertTrue(result.get(0).getBody().contains(expectedText));
    }

}
