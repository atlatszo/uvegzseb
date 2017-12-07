package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.beans.AccountRB;
import com.precognox.publishertracker.entities.Account;
import com.precognox.tas.keycloak.services.KeycloakService;
import org.junit.Before;
import org.junit.Test;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AccountListerServiceTest extends DropwizardTestSkeleton {

    private AccountListerService instance;
    private KeycloakService mockKeycloakService;

    @Before
    public void setUpMocks() throws Exception {
        mockKeycloakService = mock(KeycloakService.class);
        instance = new AccountListerService(mockKeycloakService, "master");
    }

    private Account setUpTestAdmin() {
        Account testAdminAccount = new Account();
        testAdminAccount.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        testAdminAccount.setRole(getAdminRole());
        Ebean.save(testAdminAccount);

        UserRepresentation adminKeycloakUser = new UserRepresentation();
        adminKeycloakUser.setEmail("admin@email.com");

        when(mockKeycloakService.getUserInfo("master", testAdminAccount.getKeycloakSubjectUuid())).thenReturn(adminKeycloakUser);

        return testAdminAccount;
    }

    private Account setUpTestConfigurator() {
        Account testConfiguratorAccount = new Account();
        testConfiguratorAccount.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        testConfiguratorAccount.setRole(getConfiguratorRole());
        Ebean.save(testConfiguratorAccount);

        UserRepresentation configuratorKeycloakUser = new UserRepresentation();
        configuratorKeycloakUser.setEmail("configurator@email.com");

        when(mockKeycloakService.getUserInfo("master", testConfiguratorAccount.getKeycloakSubjectUuid())).thenReturn(configuratorKeycloakUser);

        return testConfiguratorAccount;
    }

    @Test
    public void listAccounts_withAdmin_shouldReturnAllUsers() throws Exception {
        Account testAdminAccount = setUpTestAdmin();
        setUpTestConfigurator();

        List<AccountRB> result = instance.listAccounts(testAdminAccount.getKeycloakSubjectUuid());

        assertEquals(2, result.size());

        assertEquals("admin@email.com", result.get(0).getEmail());
        assertEquals(Account.Roles.ADMIN.name(), result.get(0).getRole());

        assertEquals("configurator@email.com", result.get(1).getEmail());
        assertEquals(Account.Roles.CONFIGURATOR.name(), result.get(1).getRole());
    }

    @Test
    public void listAccounts_withConfigurator_shouldReturnCurrentUser() throws Exception {
        setUpTestAdmin();
        Account testConfiguratorAccount = setUpTestConfigurator();

        List<AccountRB> result = instance.listAccounts(testConfiguratorAccount.getKeycloakSubjectUuid());

        assertEquals(1, result.size());
        assertEquals("configurator@email.com", result.get(0).getEmail());
        assertEquals(Account.Roles.CONFIGURATOR.name(), result.get(0).getRole());
    }

}