package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.beans.CreateAccountRequest;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.exceptions.NotAuthorizedException;
import com.precognox.publishertracker.services.KeycloakService;
import org.junit.Before;
import org.junit.Test;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;

import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AccountWriterServiceTest extends DropwizardTestSkeleton {

    private AccountWriterService instance;
    
    private final KeycloakService keycloakService = mock(KeycloakService.class);
    private final UsersResource usersResource = mock(UsersResource.class);
    private final UserResource resource = mock(UserResource.class);

    @Before
    public void setUpInstance() throws Exception {
        instance = new AccountWriterService(keycloakService, "master");
        Keycloak mockKeycloakClient = mock(Keycloak.class);
        when(keycloakService.getKeycloakClient()).thenReturn(mockKeycloakClient);
        
        RealmResource realmResource = mock(RealmResource.class);
        when(mockKeycloakClient.realm("master")).thenReturn(realmResource);
        
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.get(anyString())).thenReturn(resource);
    }

    private Account setUpTestAdmin() {
        Account testAdminAccount = new Account();
        testAdminAccount.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        testAdminAccount.setRole(getAdminRole());
        Ebean.save(testAdminAccount);

        UserRepresentation adminKeycloakUser = new UserRepresentation();
        adminKeycloakUser.setEmail("admin@email.com");

        return testAdminAccount;
    }

    private Account setUpTestConfigurator() {
        Account testConfiguratorAccount = new Account();
        testConfiguratorAccount.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        testConfiguratorAccount.setRole(getConfiguratorRole());
        Ebean.save(testConfiguratorAccount);

        UserRepresentation configuratorKeycloakUser = new UserRepresentation();
        configuratorKeycloakUser.setEmail("configurator@email.com");

        return testConfiguratorAccount;
    }

    @Test
    public void addNewAccount_withAdmin_shouldWork() throws Exception {
        Account testAdmin = setUpTestAdmin();

        String newAccountUuid = UUID.randomUUID().toString();
                
        UserRepresentation newKeycloakUser = new UserRepresentation();
        newKeycloakUser.setEnabled(Boolean.TRUE);
        newKeycloakUser.setId(newAccountUuid);
        
        when(usersResource.search(anyString())).thenReturn(Collections.singletonList(newKeycloakUser));
        when(usersResource.create(anyObject())).thenReturn(Response.status(Response.Status.CREATED).build());

        instance.addNewAccount(getRequest("CONFIGURATOR"), testAdmin.getKeycloakSubjectUuid());

        Account savedAccount = findAccount(newAccountUuid);

        assertNotNull(savedAccount);
        assertEquals("CONFIGURATOR", savedAccount.getRole().getName());
    }

    @Test(expected = NotAuthorizedException.class)
    public void addNewAccount_withConfigurator_shouldFail() throws Exception {
        Account testConfigurator = setUpTestConfigurator();
        instance.addNewAccount(getRequest("ADMIN"), testConfigurator.getKeycloakSubjectUuid());
    }

    @Test
    public void updateRole_withAdmin_shouldWork() throws Exception {
        Account testAdmin = setUpTestAdmin();
        Account testConfigurator = setUpTestConfigurator();
        
        instance.updateUser(testConfigurator.getId(), getRequest("ADMIN"), testAdmin.getKeycloakSubjectUuid());

        Account updatedAccount = findAccount(testConfigurator.getKeycloakSubjectUuid());

        assertEquals("ADMIN", updatedAccount.getRole().getName());
    }

    @Test(expected = NotAuthorizedException.class)
    public void updateRole_withConfigurator_shouldFail() throws Exception {
        Account testAdmin = setUpTestAdmin();
        Account testConfigurator = setUpTestConfigurator();
        
        instance.updateUser(testAdmin.getId(), getRequest("ADMIN"), testConfigurator.getKeycloakSubjectUuid());
    }

    @Test(expected = NotAuthorizedException.class)
    public void configurator_shouldNotUpdateItsOwnRole() throws Exception {
        Account testConfigurator = setUpTestConfigurator();

        instance.updateUser(testConfigurator.getId(), getRequest("ADMIN"), testConfigurator.getKeycloakSubjectUuid());
    }

    @Test
    public void deleteAccount_withAdmin_shouldWork() throws Exception {
        Account testAdmin = setUpTestAdmin();
        Account testConfigurator = setUpTestConfigurator();
        
        instance.deleteAccount(testConfigurator.getId(), testAdmin.getKeycloakSubjectUuid());

        Account deletedAccount = findAccount(testConfigurator.getKeycloakSubjectUuid());

        assertNotNull(deletedAccount.getDeletedAt());
    }

    @Test(expected = NotAuthorizedException.class)
    public void deleteAccount_withConfigurator_shouldFail() throws Exception {
        Account testAdmin = setUpTestAdmin();
        Account testConfigurator = setUpTestConfigurator();
        
        instance.deleteAccount(testAdmin.getId(), testConfigurator.getKeycloakSubjectUuid());
    }
    
    private CreateAccountRequest getRequest(String role) {
        CreateAccountRequest request = new CreateAccountRequest();
        request.setRole(role);
        request.setEmail("mockUserName");
        return request;
    }


    private Account findAccount(String uuid) {
        return Ebean.find(Account.class).where().eq("keycloakSubjectUuid", uuid).findUnique();
    }
    
}
