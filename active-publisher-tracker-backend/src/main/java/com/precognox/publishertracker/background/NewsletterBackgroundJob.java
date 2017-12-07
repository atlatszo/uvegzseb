package com.precognox.publishertracker.background;

import com.precognox.publishertracker.PublisherTrackerConfiguration;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class NewsletterBackgroundJob extends CommonEmailService implements Runnable {

    public NewsletterBackgroundJob(PublisherTrackerConfiguration.EmailConfig emailConfig) {
        super(emailConfig);
    }

    @Override
    public void run() {
        log.info("NewsletterBackgroundJob started.");

        try {
            sendEmails(new NewsletterEmailBuilder(emailConfig).buildEmails());
        } catch (Exception ex) {
            //must catch everything, otherwise errors would be lost
            log.error("NewsletterBackgroundJob failed.", ex);
        }
    }

}