package com.precognox.publishertracker.background;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.beans.EmailDeliveryRequest;
import com.precognox.publishertracker.PublisherTrackerConfiguration;
import com.precognox.publishertracker.background.emailbeans.EmailDocumentData;
import com.precognox.publishertracker.background.emailbeans.UpdateEmailData;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Subscriber;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.util.DateFormatter;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.apache.velocity.VelocityContext;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class NewsletterEmailBuilder extends CommonEmailBuilder {

    private final PublisherTrackerConfiguration.EmailConfig emailConfig;

    private static final String TEMPLATE_FILE_PATH = "/templates/newsletter-template.vm";
    private static final String SUBJECT_FILE_PATH = "/templates/newsletter-subject.txt";

    public NewsletterEmailBuilder(PublisherTrackerConfiguration.EmailConfig emailConfig) {
        this.emailConfig = emailConfig;
    }

    public List<EmailDeliveryRequest> buildEmails() {
        LocalDateTime fromDate = LocalDateTime.now().minusHours(emailConfig.getNewsletterFrequencyHours());

        List<Update> updateList = Ebean.find(Update.class)
                .where()
                .gt("date", fromDate)
                .orderBy("date DESC")
                .findList();

        List<EmailDeliveryRequest> results = new ArrayList<>();

        List<Subscriber> subscriberList = getSubscriberList();

        if (!updateList.isEmpty() && !subscriberList.isEmpty()) {
            for (Subscriber subscriber : subscriberList) {
                String emailBody = buildEmailBody(updateList, subscriber);

                EmailDeliveryRequest emailDeliveryRequest = new EmailDeliveryRequest();
                emailDeliveryRequest.setBody(emailBody);
                emailDeliveryRequest.setSubject(readSubject(SUBJECT_FILE_PATH));
                emailDeliveryRequest.setSenderAddress(emailConfig.getSenderAddress());
                emailDeliveryRequest.setToAddressList(Collections.singletonList(getRecipient()));
                emailDeliveryRequest.setBccAddressList(Collections.singletonList(subscriber.getEmail()));

                Optional.ofNullable(emailConfig.getReplyToAddress()).ifPresent(
                        addr -> emailDeliveryRequest.setReplyTo(emailConfig.getReplyToAddress())
                );

                results.add(emailDeliveryRequest);
            }
        }

        return results;
    }

    private String buildEmailBody(List<Update> updateList, Subscriber subscriber) {
        List<UpdateEmailData> updateData = new ArrayList<>();

        for (Update updateEntity : updateList) {
            UpdateEmailData u = new UpdateEmailData();
            u.setDataOwnerLongName(updateEntity.getDataOwner().getLongName());
            u.setDate(DateFormatter.formatDate(updateEntity.getDate()));

            List<Document> documents = Ebean.find(Document.class)
                    .where()
                    .eq("update.id", updateEntity.getId())
                    .findList();

            for (Document docEntity : documents) {
                EmailDocumentData document = new EmailDocumentData();
                document.setTitle(docEntity.getTitle());
                document.setProvidedDate(DateFormatter.formatDate(docEntity.getProvidedDate()));

                u.getDocumentList().add(document);
            }

            updateData.add(u);
        }

        VelocityContext templateVariables = new VelocityContext();
        templateVariables.put("updateList", updateData);
        templateVariables.put("unsubscribeLink", buildUnsubscribeLink(subscriber));

        return resolveTemplate(TEMPLATE_FILE_PATH, templateVariables);
    }

    private List<Subscriber> getSubscriberList() {
        return Ebean.find(Subscriber.class).findList();
    }

    private String getRecipient() {
        return MessageFormat.format("Undisclosed Recipients <{0}>", emailConfig.getSenderAddress());
    }

    private String buildUnsubscribeLink(Subscriber subscriber) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("email", subscriber.getEmail());
        variables.put("token", subscriber.getUnsubscribeToken());

        return StrSubstitutor.replace(emailConfig.getNewsletterUnsubscribeLinkTemplate(), variables);
    }

}
