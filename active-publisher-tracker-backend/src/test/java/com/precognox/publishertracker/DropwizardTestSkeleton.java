package com.precognox.publishertracker;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Role;
import io.dropwizard.testing.ResourceHelpers;
import io.dropwizard.testing.junit.DropwizardAppRule;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.ClassRule;

import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

public class DropwizardTestSkeleton {

    @ClassRule
    public static final DropwizardAppRule<PublisherTrackerConfiguration> RULE =
            new DropwizardAppRule<>(PublisherTrackerApplication.class, ResourceHelpers.resourceFilePath("test-config.yml"));

    protected final String APP_URL = String.format("http://localhost:%s", RULE.getLocalPort());

    private String truncateScript;

    public DropwizardTestSkeleton() {
        try {
            truncateScript = new String(
                    Files.readAllBytes(Paths.get(ResourceHelpers.resourceFilePath("scripts/truncate_all.sql")))
            );
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to read teardown script", ex);
        }
    }

    @AfterClass
    public static void tearDown() throws Exception {
        RULE.getTestSupport().after();
    }

    @After
    public void clearDb() throws Exception {
        Ebean.createSqlUpdate(truncateScript).execute();
    }

    protected HttpResponse<String> get(String path) throws Exception {
        return Unirest.get(APP_URL + path).asString();
    }

    protected HttpResponse<String> post(String path, Object body) throws Exception {
        return Unirest.post(APP_URL + path)
                .header("Content-Type", MediaType.APPLICATION_JSON)
                .body(writeToJson(body))
                .asString();
    }

    protected HttpResponse<String> put(String path) throws Exception {
        return Unirest.put(APP_URL + path).asString();
    }

    protected HttpResponse<String> put(String path, Object body) throws Exception {
        return Unirest.put(APP_URL + path)
                .header("Content-Type", MediaType.APPLICATION_JSON)
                .body(writeToJson(body))
                .asString();
    }

    protected HttpResponse<String> delete(String path, Object body) throws Exception {
        return Unirest.delete(APP_URL + path)
                .header("Content-Type", MediaType.APPLICATION_JSON)
                .body(writeToJson(body))
                .asString();
    }

    private String writeToJson(Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException(e);
        }
    }

    protected Account setUpTestUser(Role role) {
        Account testUser = new Account();
        testUser.setRole(role);
        testUser.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        Ebean.save(testUser);

        return testUser;
    }

    protected Role getAdminRole() {
        return Ebean.find(Role.class, 1);
    }

    protected Role getConfiguratorRole() {
        return Ebean.find(Role.class, 2);
    }

    protected Role getApiUserRole() {
        return Ebean.find(Role.class, 3);
    }

    protected Role getDisabledApiUserRole() {
        return Ebean.find(Role.class, 4);
    }
    
    protected DataOwner createDataOwnerWithName(String shortName, String longName) {
        DataOwner dataOwner = new DataOwner();
        dataOwner.setShortName(shortName);
        dataOwner.setLongName(longName);
        Ebean.save(dataOwner);
        return dataOwner;
    }

}
