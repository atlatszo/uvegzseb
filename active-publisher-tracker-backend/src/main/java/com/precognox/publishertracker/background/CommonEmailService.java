package com.precognox.publishertracker.background;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.precognox.publishertracker.beans.EmailDeliveryRequest;
import com.precognox.publishertracker.PublisherTrackerConfiguration;
import lombok.extern.slf4j.Slf4j;

import java.text.MessageFormat;
import java.util.List;

@Slf4j
public class CommonEmailService {

    protected final PublisherTrackerConfiguration.EmailConfig emailConfig;

    protected CommonEmailService(PublisherTrackerConfiguration.EmailConfig emailConfig) {
        this.emailConfig = emailConfig;
    }

    protected void sendEmails(List<EmailDeliveryRequest> emails) {
        try {
            HttpResponse<String> response = Unirest.post(emailConfig.getEmailServiceUrl())
                    .header("Content-Type", "application/json")
                    .body(new ObjectMapper().writeValueAsString(emails))
                    .asString();

            if (response.getStatus() == 200) {
                log.info("Sent " + emails.size() + " emails");
            } else {
                String errorMsg = MessageFormat.format(
                        "E-mail service response: {0} {1}: {2}",
                        response.getStatus(),
                        response.getStatusText(),
                        response.getBody()
                );

                log.error(errorMsg);
            }
        } catch (UnirestException ex) {
            log.error("E-mail service call failed", ex);
        } catch (JsonProcessingException ex) {
            log.error("Failed to write JSON", ex);
        }
    }

}
