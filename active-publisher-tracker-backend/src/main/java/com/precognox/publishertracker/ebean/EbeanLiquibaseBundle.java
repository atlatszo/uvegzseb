package com.precognox.publishertracker.ebean;

import com.codahale.metrics.Timer;
import io.dropwizard.Configuration;
import io.dropwizard.setup.Environment;
import java.time.Duration;
import java.util.Properties;
import java.util.function.Function;
import liquibase.Liquibase;
import liquibase.database.DatabaseConnection;
import liquibase.database.jvm.JdbcConnection;
import liquibase.resource.ClassLoaderResourceAccessor;
import lombok.extern.slf4j.Slf4j;

/**
 * Loads Ebean from configuration then runs liquibase on it. You need to tell
 * how to get ebean properties, from your Configuration class. e.g.<br>
 * {@code bootstrap.addBundle(new EbeanBundle(MyConfiguration::getEbean));}
 *
 * @author akulcsar
 */
@Slf4j
public class EbeanLiquibaseBundle extends EbeanBundle {

    private static final String DEFAULT_MIGRATIONS_FILE = "migrations.xml";
    private final String changeLogFile;

    /**
     * Construct new instance with default changeLogFile location:
     * migrations.xml
     *
     * @param <T>
     * @param ebeanPropertiesGetter
     */
    public <T extends Configuration> EbeanLiquibaseBundle(Function<T, Properties> ebeanPropertiesGetter) {
        super(ebeanPropertiesGetter);
        this.changeLogFile = DEFAULT_MIGRATIONS_FILE;
    }

    public <T extends Configuration> EbeanLiquibaseBundle(Function<T, Properties> ebeanPropertiesGetter, String changeLogFile) {
        super(ebeanPropertiesGetter);
        this.changeLogFile = changeLogFile;
    }

    @Override
    public void afterInitialized(Configuration configuration, Environment environment) throws Exception {
        Timer.Context time = environment.metrics().timer("liquibase").time();
        try {
            DatabaseConnection connection = new JdbcConnection(ebeanServer.getPluginApi().getDataSource().getConnection());
            Liquibase liquibase = new Liquibase(changeLogFile, new ClassLoaderResourceAccessor(), connection);
            liquibase.update("");
        } finally {
            long ns = time.stop();
            log.info("Liquibase initialized in {} ms", Duration.ofNanos(ns).toMillis());
        }
    }

}