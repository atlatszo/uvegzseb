package com.precognox.publishertracker;

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

    @Data
    public static class KeycloakConfig {
        private String serverUrl;
        private String authRealm;
        private String username;
        private String password;
        private String clientId;
        private String clientSecret;
        private String grantType;
    }
}
