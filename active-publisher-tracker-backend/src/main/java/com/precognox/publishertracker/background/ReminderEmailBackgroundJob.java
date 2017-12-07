package com.precognox.publishertracker.background;

import com.precognox.publishertracker.PublisherTrackerConfiguration;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ReminderEmailBackgroundJob extends CommonEmailService implements Runnable {

    private final ReminderEmailBuilder emailBuilder;

    public ReminderEmailBackgroundJob(PublisherTrackerConfiguration.EmailConfig emailConfig, ReminderEmailBuilder emailBuilder) {
        super(emailConfig);

        this.emailBuilder = emailBuilder;
    }

    @Override
    public void run() {
        log.info("Reminder background job started.");

        try {
            sendEmails(emailBuilder.buildEmails());
        } catch (Exception ex) {
            //must catch everything, otherwise errors would be lost
            log.error("ReminderEmailBackgroundJob failed.", ex);
        }
    }

}
