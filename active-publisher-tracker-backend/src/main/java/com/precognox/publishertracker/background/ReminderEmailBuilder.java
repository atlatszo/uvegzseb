package com.precognox.publishertracker.background;

import com.avaje.ebean.Ebean;
import com.precognox.emailservice.beans.EmailDeliveryRequest;
import com.precognox.publishertracker.PublisherTrackerConfiguration;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.DataOwnerEmail;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.services.RankingService;
import org.apache.velocity.VelocityContext;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ReminderEmailBuilder extends CommonEmailBuilder {

    private static final String TEMPLATE_FILE_PATH = "/templates/reminder-email-template.vm";
    private static final String SUBJECT_FILE_PATH = "/templates/reminder-email-subject.vm";

    private final RankingService rankingService;
    private final PublisherTrackerConfiguration.EmailConfig emailConfig;

    public ReminderEmailBuilder(RankingService rankingService, PublisherTrackerConfiguration.EmailConfig emailConfig) {
        this.rankingService = rankingService;
        this.emailConfig = emailConfig;
    }

    protected List<EmailDeliveryRequest> buildEmails() {
        LocalDateTime dateLimit = LocalDateTime.now().minusDays(emailConfig.getReminderThresholdDays());

        List<DataOwner> allDataOwners = Ebean.find(DataOwner.class).findList();

        List<DataOwner> relevantDataOwners = allDataOwners.stream()
                .filter(this::hasEmailAddress)
                .filter(dataOwner -> !hasRecentUpdate(dataOwner, dateLimit))
                .collect(Collectors.toList());

        return relevantDataOwners.stream().map(this::buildEmail).collect(Collectors.toList());
    }

    private boolean hasEmailAddress(DataOwner dataOwner) {
        return !dataOwner.getEmails().isEmpty();
    }

    private boolean hasRecentUpdate(DataOwner dataOwner, LocalDateTime dateLimit) {
        return dataOwner.getUpdates()
                .stream()
                .map(Update::getDate)
                .anyMatch(updateDate -> updateDate.isAfter(dateLimit));
    }

    private EmailDeliveryRequest buildEmail(DataOwner dataOwner) {
        VelocityContext bodyVariables = new VelocityContext();
        bodyVariables.put("dataOwnerLongName", dataOwner.getLongName());
        bodyVariables.put("daysSinceLastUpdate", getDaysSinceLastUpdate(dataOwner));
        bodyVariables.put("rankingPosition", getRankingPosition(dataOwner));

        VelocityContext subjectVariables =
                new VelocityContext(Collections.singletonMap("daysSinceLastUpdate", getDaysSinceLastUpdate(dataOwner)));

        String subject = resolveTemplate(SUBJECT_FILE_PATH, subjectVariables).trim();
        String emailBody = resolveTemplate(TEMPLATE_FILE_PATH, bodyVariables);

        List<String> recipientList = dataOwner.getEmails().stream()
                .map(DataOwnerEmail::getEmail)
                .collect(Collectors.toList());

        EmailDeliveryRequest email = new EmailDeliveryRequest();
        email.setSenderAddress(emailConfig.getSenderAddress());
        email.setToAddressList(recipientList);
        email.setReplyTo(emailConfig.getReplyToAddress());
        email.setSubject(subject);
        email.setBody(emailBody);

        return email;
    }

    private long getDaysSinceLastUpdate(DataOwner dataOwner) {
        if (dataOwner.getUpdates().isEmpty()) {
            return 0;
        }

        List<LocalDateTime> updateDates = dataOwner.getUpdates()
                .stream()
                .map(Update::getDate)
                .collect(Collectors.toList());

        LocalDateTime lastUpdateDate = Collections.max(updateDates);

        return ChronoUnit.DAYS.between(lastUpdateDate, LocalDateTime.now());
    }

    private int getRankingPosition(DataOwner dataOwner) {
        return rankingService.getPosition(dataOwner.getLongName());
    }

}
