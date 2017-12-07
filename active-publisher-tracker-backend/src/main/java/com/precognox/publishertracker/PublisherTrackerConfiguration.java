package com.precognox.publishertracker;

import com.precognox.tas.keycloak.beans.KeycloakConfig;
import io.dropwizard.Configuration;
import lombok.Data;
import org.secnod.dropwizard.shiro.ShiroConfiguration;

import java.util.Properties;

@Data
public class PublisherTrackerConfiguration extends Configuration {

    private Properties dbConfig;
    private String realmName;
    private KeycloakConfig keycloakConfig;
    private ShiroConfiguration shiroConfig;
    private EmailConfig emailConfig;

    @Data
    public static class EmailConfig {
        private String emailServiceUrl;

        private Integer newsletterFrequencyHours;
        private Integer reminderFrequencyHours;
        private Integer reminderThresholdDays;
        private String senderAddress;
        private String replyToAddress;
        private String newsletterUnsubscribeLinkTemplate;
    }

}
