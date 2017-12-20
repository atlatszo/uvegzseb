package com.precognox.publishertracker;

import com.precognox.publishertracker.ebean.EbeanLiquibaseBundle;
import com.precognox.publishertracker.adminrs.UserInitRS;
import com.precognox.publishertracker.background.NewsletterBackgroundJob;
import com.precognox.publishertracker.background.ReminderEmailBackgroundJob;
import com.precognox.publishertracker.background.ReminderEmailBuilder;
import com.precognox.publishertracker.ranking.ExampleRankingPlugin;
import com.precognox.publishertracker.rs.AdminRS;
import com.precognox.publishertracker.rs.PublicRS;
import com.precognox.publishertracker.rs.ScraperRS;
import com.precognox.publishertracker.services.AccountListerService;
import com.precognox.publishertracker.services.AccountWriterService;
import com.precognox.publishertracker.services.DataOwnerService;
import com.precognox.publishertracker.services.DataService;
import com.precognox.publishertracker.services.RankingService;
import com.precognox.publishertracker.services.ScraperAccountService;
import com.precognox.publishertracker.services.SubscriptionService;
import com.precognox.publishertracker.services.UpdateService;
import com.precognox.publishertracker.services.UserInitService;
import com.precognox.publishertracker.services.KeycloakService;
import io.dropwizard.Application;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import lombok.extern.slf4j.Slf4j;
import org.secnod.dropwizard.shiro.ShiroBundle;
import org.secnod.dropwizard.shiro.ShiroConfiguration;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class PublisherTrackerApplication extends Application<PublisherTrackerConfiguration> {

    private static final long BG_JOBS_INITIAL_DELAY_MINS = 3;

    private final ShiroBundle<PublisherTrackerConfiguration> shiro = new ShiroBundle<PublisherTrackerConfiguration>() {

        @Override
        protected ShiroConfiguration narrow(PublisherTrackerConfiguration configuration) {
            return configuration.getShiroConfig();
        }

    };

    public static void main(String[] args) throws Exception {
        new PublisherTrackerApplication().run(args);
    }

    @Override
    public void initialize(Bootstrap<PublisherTrackerConfiguration> bootstrap) {
        bootstrap.setConfigurationSourceProvider(
                new SubstitutingSourceProvider(
                        bootstrap.getConfigurationSourceProvider(),
                        new EnvironmentVariableSubstitutor(false)
                )
        );

        bootstrap.addBundle(
                new EbeanLiquibaseBundle(PublisherTrackerConfiguration::getDbConfig, "migrations/migrations.xml")
        );

        bootstrap.addBundle(shiro);
    }

    @Override
    public void run(PublisherTrackerConfiguration configuration, Environment environment) throws Exception {
        String realmName = configuration.getRealmName();

        KeycloakService keycloakService = new KeycloakService(configuration.getKeycloakConfig());
        ScraperAccountService scraperAccountService = new ScraperAccountService(keycloakService, realmName);
        AccountListerService accountListerService = new AccountListerService(keycloakService, realmName);
        AccountWriterService accountWriterService = new AccountWriterService(keycloakService, realmName);
        DataOwnerService dataOwnerService = new DataOwnerService(keycloakService, realmName);
        UpdateService updateService = new UpdateService();
        SubscriptionService subscriptionService = new SubscriptionService();
        RankingService rankingService = new RankingService(new ExampleRankingPlugin());
        DataService dataService = new DataService(rankingService);

        environment.jersey().register(new ScraperRS(dataService));
        environment.jersey().register(new PublicRS(dataOwnerService, updateService, subscriptionService, rankingService));
        environment.jersey().register(new AdminRS(dataOwnerService, scraperAccountService, accountListerService, accountWriterService, subscriptionService));
        
        UserInitService taskService = new UserInitService(keycloakService, realmName);
        environment.admin().addTask(new UserInitRS(taskService));

        startNewsletterBackgroundJob(configuration.getEmailConfig());
        startReminderBackgroundJob(configuration.getEmailConfig(), rankingService);
    }

    private void startNewsletterBackgroundJob(PublisherTrackerConfiguration.EmailConfig config) {
        log.info("Scheduling newsletter background job with period of " + config.getNewsletterFrequencyHours() + " hour(s).");

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

        NewsletterBackgroundJob newsletterBackgroundJob = new NewsletterBackgroundJob(config);

        long runPeriodMins = config.getNewsletterFrequencyHours() * 60;

        executor.scheduleAtFixedRate(newsletterBackgroundJob, BG_JOBS_INITIAL_DELAY_MINS, runPeriodMins, TimeUnit.MINUTES);
    }

    private void startReminderBackgroundJob(PublisherTrackerConfiguration.EmailConfig config, RankingService rankingService) {
        log.info("Scheduling reminder background job with period of " + config.getReminderFrequencyHours() + " hour(s).");

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

        ReminderEmailBuilder emailBuilder = new ReminderEmailBuilder(rankingService, config);
        ReminderEmailBackgroundJob backgroundJob = new ReminderEmailBackgroundJob(config, emailBuilder);

        int runPeriodMins = config.getReminderFrequencyHours() * 60;

        executor.scheduleAtFixedRate(backgroundJob, BG_JOBS_INITIAL_DELAY_MINS, runPeriodMins, TimeUnit.MINUTES);
    }

}
