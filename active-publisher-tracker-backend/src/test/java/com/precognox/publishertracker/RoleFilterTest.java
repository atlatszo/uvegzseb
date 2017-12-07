package com.precognox.publishertracker;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.precognox.publishertracker.entities.Account;
import org.junit.Test;

import java.util.UUID;

import static javax.ws.rs.core.Response.Status.OK;
import static javax.ws.rs.core.Response.Status.UNAUTHORIZED;
import static org.junit.Assert.assertEquals;

public class RoleFilterTest extends DropwizardTestSkeleton {

    private static final String ADMIN_ENDPOINT_PATH = "/admin/crawlers";
    private static final String API_ENDPOINT_PATH = "/api/echo";

    @Test
    public void testAuth_withMissingSubjectUuid() throws Exception {
        assertEquals(UNAUTHORIZED.getStatusCode(), get(ADMIN_ENDPOINT_PATH).getStatus());
    }

    @Test
    public void testAuth_forAdminEndpoint_withMissingUser() throws Exception {
        HttpResponse<String> response = Unirest.get(APP_URL + ADMIN_ENDPOINT_PATH)
                .header(RoleFilter.SUBJECT_ID_HEADER_PARAM_NAME, UUID.randomUUID().toString())
                .asString();

        assertEquals(UNAUTHORIZED.getStatusCode(), response.getStatus());
    }

    @Test
    public void testAuth_forAdminEndpoint_withWrongRole() throws Exception {
        Account testApiUser = setUpTestUser(getApiUserRole());

        HttpResponse<String> response = Unirest.get(APP_URL + ADMIN_ENDPOINT_PATH)
                .header(RoleFilter.SUBJECT_ID_HEADER_PARAM_NAME, testApiUser.getKeycloakSubjectUuid())
                .asString();

        assertEquals(UNAUTHORIZED.getStatusCode(), response.getStatus());
    }

    @Test
    public void testAuth_forAdminEndpoint_withValidRole() throws Exception {
        Account testAdmin = setUpTestUser(getAdminRole());

        HttpResponse<String> response = Unirest.get(APP_URL + ADMIN_ENDPOINT_PATH)
                .header(RoleFilter.SUBJECT_ID_HEADER_PARAM_NAME, testAdmin.getKeycloakSubjectUuid())
                .asString();

        assertEquals(OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void testAuth_forApiEndpoint_withWrongRole() throws Exception {
        Account testAdmin = setUpTestUser(getAdminRole());

        HttpResponse<String> response = Unirest.get(APP_URL + API_ENDPOINT_PATH)
                .header(RoleFilter.SUBJECT_ID_HEADER_PARAM_NAME, testAdmin.getKeycloakSubjectUuid())
                .asString();

        assertEquals(UNAUTHORIZED.getStatusCode(), response.getStatus());
    }

    @Test
    public void testAuth_forApiEndpoint_withDisabledApiUser() throws Exception {
        Account testApiUser = setUpTestUser(getDisabledApiUserRole());

        HttpResponse<String> response = Unirest.get(APP_URL + API_ENDPOINT_PATH)
                .header(RoleFilter.SUBJECT_ID_HEADER_PARAM_NAME, testApiUser.getKeycloakSubjectUuid())
                .asString();

        assertEquals(UNAUTHORIZED.getStatusCode(), response.getStatus());
    }

    @Test
    public void testAuth_forApiEndpoint_withValidRole() throws Exception {
        Account testApiUser = setUpTestUser(getApiUserRole());

        HttpResponse<String> response = Unirest.get(APP_URL + API_ENDPOINT_PATH)
                .header(RoleFilter.SUBJECT_ID_HEADER_PARAM_NAME, testApiUser.getKeycloakSubjectUuid())
                .asString();

        assertEquals(OK.getStatusCode(), response.getStatus());
    }

}
