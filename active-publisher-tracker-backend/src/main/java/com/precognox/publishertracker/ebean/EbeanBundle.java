package com.precognox.publishertracker.ebean;

import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.EbeanServerFactory;
import com.avaje.ebean.config.ServerConfig;
import com.codahale.metrics.Timer;
import io.dropwizard.Configuration;
import io.dropwizard.ConfiguredBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import java.time.Duration;
import java.util.Objects;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import lombok.extern.slf4j.Slf4j;

/**
 * Loads Ebean from configuration. You need to tell how to get ebean properties,
 * from your Configuration class. e.g.<br>
 * {@code bootstrap.addBundle(new EbeanBundle(MyConfiguration::getEbean));}
 *
 * @author akulcsar
 */
@Slf4j
public class EbeanBundle implements ConfiguredBundle<Configuration> {

    private static final AtomicBoolean INITIALIZED = new AtomicBoolean();

    protected static volatile EbeanServer ebeanServer;

    private final Function<Configuration, Properties> getter;

    /**
     * Creates an EbeanBundle which initialize DB connection
     *
     * @param <T>
     * @param ebeanPropertiesGetter
     */
    public <T extends Configuration> EbeanBundle(Function<T, Properties> ebeanPropertiesGetter) {
        this.getter = (Function<Configuration, Properties>) Objects.requireNonNull(ebeanPropertiesGetter);
    }

    @Override
    public void run(Configuration configuration, Environment environment) throws Exception {
        // Lazy init at most once in a thread safe manner
        if (!INITIALIZED.get()) {
            synchronized (INITIALIZED) {
                if (!INITIALIZED.get()) {
                    Timer.Context time = environment.metrics().timer("ebean").time();
                    try {
                        Properties p = getter.apply(configuration);

                        ServerConfig config = new ServerConfig();
                        config.setName(p.getProperty("datasource.default"));
                        config.loadFromProperties(p);

                        ebeanServer = EbeanServerFactory.create(config);
                        log.info("Ebean initialized: {}", ebeanServer.getPluginApi().getDataSource().getConnection().getMetaData().getURL());
                        afterInitialized(configuration, environment);
                    } finally {
                        INITIALIZED.set(true);
                        long ns = time.stop();
                        log.info("Ebean setup finished in {} ms", Duration.ofNanos(ns).toMillis());
                    }
                }
            }
        }
    }

    @Override
    public void initialize(Bootstrap<?> bootstrap) {
        // No-op
    }

    protected void afterInitialized(Configuration configuration, Environment environment) throws Exception {
        // No-op
    }

}