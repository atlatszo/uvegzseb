package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.beans.IdAndValue;
import com.precognox.publishertracker.beans.ListScraperAccountsResult;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Role;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.enums.FilterErrorTypes;
import com.precognox.tas.keycloak.services.KeycloakService;
import org.junit.Test;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 *
 * @author precognox
 */
public class ScraperAccountServiceTest extends DropwizardTestSkeleton {
    
    private final KeycloakService keycloakService = mock(KeycloakService.class);
    private final ScraperAccountService scraperAccountService = new ScraperAccountService(keycloakService, "master");
    
    private Account apiUser;
    private Account disableApiUser;
    private Account deletedApiUser;
    private Account deletedDisableApiUser;
    
    public void setUpEntities() throws Exception {
        apiUser = createAccount(3);
        disableApiUser = createAccount(4);
        Account admin = createAccount(1);
        Account configurator = createAccount(2);
        deletedApiUser = createAccount(3);
        deletedApiUser.setDeletedAt(LocalDateTime.now());
        Ebean.save(deletedApiUser);
        deletedDisableApiUser = createAccount(4);
        deletedDisableApiUser.setDeletedAt(LocalDateTime.now());
        Ebean.save(deletedDisableApiUser);
    }
    
    private Account createAccount(Integer roleId) {
        Role role = Ebean.find(Role.class, roleId);
        Account newUser = new Account();
        newUser.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        newUser.setRole(role);
        Ebean.save(newUser);
        UserRepresentation representation = new UserRepresentation();
        representation.setUsername("mockName");
        Mockito.when(keycloakService.getUserInfo("master", newUser.getKeycloakSubjectUuid())).thenReturn(representation);
        return newUser;
    }
    
    @Test
    public void listCrawlersTest() throws Exception {
        setUpEntities();

        List<IdAndValue> crawlers = scraperAccountService.listCrawlers();
        assertEquals(4, crawlers.size());
        assertEquals(apiUser.getId(), new Integer(crawlers.get(0).getId()));
        assertEquals(disableApiUser.getId(), new Integer(crawlers.get(1).getId()));
        assertEquals(deletedApiUser.getId(), new Integer(crawlers.get(2).getId()));
        assertEquals(deletedDisableApiUser.getId(), new Integer(crawlers.get(3).getId()));
    }

    @Test
    public void listScraperAccounts_shouldListApiUser_withNoData() throws Exception {
        Account testApiUser = setUpTestUser(getApiUserRole());
        UserRepresentation mockKeycloakUser = setUpMockKeycloakUser(testApiUser);

        ListScraperAccountsResult result = scraperAccountService.listScraperAccounts(0, 10);

        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getAccounts().size());
        assertEquals(false, result.getAccounts().get(0).isDisabled());
        assertEquals(mockKeycloakUser.getUsername(), result.getAccounts().get(0).getApiUserName());
        assertEquals(FilterErrorTypes.NO_DATA.name(), result.getAccounts().get(0).getError());
        assertNull(result.getAccounts().get(0).getLastHarvestDate());
        assertTrue(result.getAccounts().get(0).getLastHarvestData().isEmpty());
    }

    @Test
    public void listScraperAccounts_shouldListDisabledApiUser() throws Exception {
        Account testApiUser = setUpTestUser(getDisabledApiUserRole());
        setUpMockKeycloakUser(testApiUser);

        ListScraperAccountsResult result = scraperAccountService.listScraperAccounts(0, 10);

        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getAccounts().size());
        assertEquals(true, result.getAccounts().get(0).isDisabled());
    }

    private UserRepresentation setUpMockKeycloakUser(Account testApiUser) {
        UserRepresentation mockKeycloakUser = new UserRepresentation();
        mockKeycloakUser.setUsername("test-user");

        when(keycloakService.getUserInfo("master", testApiUser.getKeycloakSubjectUuid())).thenReturn(mockKeycloakUser);

        return mockKeycloakUser;
    }

    @Test
    public void listScraperAccounts_shouldListApiUser_withHarvestData() throws Exception {
        Account testApiUser = setUpTestUser(getApiUserRole());
        UserRepresentation mockKeycloakUser = setUpMockKeycloakUser(testApiUser);

        DataOwner testDataOwner = new DataOwner();
        testDataOwner.setShortName("test data owner");
        testDataOwner.setLongName("long name");
        testDataOwner.setUuid(UUID.randomUUID().toString());
        Ebean.save(testDataOwner);

        Update testUpdate = new Update();
        testUpdate.setDataOwner(testDataOwner);
        testUpdate.setAccount(testApiUser);
        Ebean.save(testUpdate);

        Document document = new Document();
        document.setProvidedDate(LocalDateTime.now());
        document.setUpdate(testUpdate);
        Ebean.save(document);

        ListScraperAccountsResult result = scraperAccountService.listScraperAccounts(0, 10);

        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getAccounts().size());
        assertEquals(false, result.getAccounts().get(0).isDisabled());
        assertEquals(mockKeycloakUser.getUsername(), result.getAccounts().get(0).getApiUserName());
        assertNotNull(result.getAccounts().get(0).getLastHarvestDate());
        assertEquals(1, result.getAccounts().get(0).getLastHarvestData().size());
        assertEquals(testDataOwner.getShortName(), result.getAccounts().get(0).getLastHarvestData().get(0).getDataOwnerName());
        assertNotNull(result.getAccounts().get(0).getLastHarvestData().get(0).getProvidedDate());
    }

    @Test
    public void listScraperAccounts_shouldNotShowDeletedApiUser() throws Exception {
        Account deletedApiUser = setUpTestUser(getApiUserRole());
        deletedApiUser.setDeletedAt(LocalDateTime.now());
        Ebean.update(deletedApiUser);

        setUpMockKeycloakUser(deletedApiUser);

        ListScraperAccountsResult result = scraperAccountService.listScraperAccounts(0, 10);

        assertEquals(0, result.getTotalCount());
        assertEquals(0, result.getAccounts().size());
    }

}
