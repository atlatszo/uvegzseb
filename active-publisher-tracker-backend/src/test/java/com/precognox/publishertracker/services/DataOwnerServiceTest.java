package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.beans.DataOwnerFilterBean;
import com.precognox.publishertracker.beans.DataOwnerUpdateRequest;
import com.precognox.publishertracker.beans.IdAndValue;
import com.precognox.publishertracker.beans.ListDataOwnersResult;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.DataOwnerEmail;
import com.precognox.publishertracker.entities.Role;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.exceptions.NonUniqueEntityException;
import com.precognox.tas.keycloak.services.KeycloakService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 *
 * @author precognox
 */
public class DataOwnerServiceTest extends DropwizardTestSkeleton {
    
    private DataOwnerService dataOwnerService;
    
    private Account user;
    private DataOwner dataOwner;

    @Before
    public void setUpInstance() {
        UserRepresentation mockKeycloakUser = new UserRepresentation();
        mockKeycloakUser.setUsername("mock-user");
        mockKeycloakUser.setUsername("mock-email");

        KeycloakService mockKeycloakService = mock(KeycloakService.class);
        when(mockKeycloakService.getUserInfo(anyString(), anyString())).thenReturn(mockKeycloakUser);

        dataOwnerService = new DataOwnerService(mockKeycloakService, "master");
    }
    
    @Before
    public void setUpEntities() throws Exception {
        dataOwner = new DataOwner();
        dataOwner.setLongName("mockLongName");
        dataOwner.setShortName("mockShortName");
        dataOwner.setUuid(UUID.randomUUID().toString());
        Ebean.save(dataOwner);

        DataOwner dataOwner2 = new DataOwner();
        dataOwner2.setLongName("mock1");
        dataOwner2.setShortName("mock2");
        dataOwner2.setUuid(UUID.randomUUID().toString());
        Ebean.save(dataOwner2);

        DataOwner dataOwner3 = new DataOwner();
        dataOwner3.setLongName("mock3");
        dataOwner3.setShortName("mock4");
        dataOwner3.setUuid(UUID.randomUUID().toString());
        Ebean.save(dataOwner3);

        Role role = new Role();
        role.setName("mockRole");
        Ebean.save(role);

        user = new Account();
        user.setKeycloakSubjectUuid(UUID.randomUUID().toString());
        user.setRole(role);
        Ebean.save(user);

        Update update = new Update();
        update.setAccount(user);
        update.setDataOwner(dataOwner3);
        Ebean.save(update);

        Update update2 = new Update();
        update2.setAccount(user);
        update2.setDataOwner(dataOwner3);
        Ebean.save(update2);
    }
    
    @Test
    public void listAllDataOwner() {
        List<IdAndValue> dataOwners = dataOwnerService.getDataOwnerDropdownData();
        Assert.assertEquals(1, dataOwners.size());
    }
    
    @Test
    public void filterDataOwners_withoutParams() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(0);
        dataOwnerFilterBean.setRows(3);

        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);

        Assert.assertEquals(3, result.getDataOwners().size());
        Assert.assertEquals(3, result.getTotalCount());
    }
    
    @Test
    public void filterDataOwners_withStartAndRowParams() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(2);
        dataOwnerFilterBean.setRows(1);
        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);
        Assert.assertEquals(1, result.getDataOwners().size());
        Assert.assertEquals("mockLongName", result.getDataOwners().get(0).getLongName());
        Assert.assertEquals(3, result.getTotalCount());
    }
    
    @Test
    public void filterDataOwners_withNameFragmentParam() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(0);
        dataOwnerFilterBean.setRows(3);
        dataOwnerFilterBean.setNameFragment("short");

        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);

        Assert.assertEquals(1, result.getDataOwners().size());
        Assert.assertEquals(1, result.getTotalCount());
        Assert.assertEquals("mockLongName", result.getDataOwners().get(0).getLongName());
    }
    
    @Test
    public void filterDataOwners_withUserIdParam() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(0);
        dataOwnerFilterBean.setRows(3);
        dataOwnerFilterBean.setCrawlerUserId(user.getId());

        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);

        Assert.assertEquals(1, result.getDataOwners().size());
        Assert.assertEquals(1, result.getTotalCount());
        Assert.assertEquals("mock3", result.getDataOwners().get(0).getLongName());
    }
    
    @Test
    public void filterDataOwners_withNoneErrorParam() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(0);
        dataOwnerFilterBean.setRows(3);
        dataOwnerFilterBean.setError("NONE");

        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);

        Assert.assertEquals(1, result.getDataOwners().size());
        Assert.assertEquals(1, result.getTotalCount());
        Assert.assertEquals("mock3", result.getDataOwners().get(0).getLongName());
    }
    
    @Test
    public void filterDataOwners_withAllErrorParam() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(0);
        dataOwnerFilterBean.setRows(3);
        dataOwnerFilterBean.setError("ANY");

        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);

        Assert.assertEquals("mock1", result.getDataOwners().get(0).getLongName());
        Assert.assertEquals("mockLongName", result.getDataOwners().get(1).getLongName());
        Assert.assertEquals(2, result.getDataOwners().size());
        Assert.assertEquals(2, result.getTotalCount());
    }
    
    @Test
    public void filterDataOwners_withVariousParams() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(0);
        dataOwnerFilterBean.setRows(3);
        dataOwnerFilterBean.setError("NONE");
        dataOwnerFilterBean.setCrawlerUserId(user.getId());
        dataOwnerFilterBean.setNameFragment("4");

        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);

        Assert.assertEquals(1, result.getDataOwners().size());
        Assert.assertEquals(1, result.getTotalCount());
        Assert.assertEquals("mock3", result.getDataOwners().get(0).getLongName());
    }
    
    @Test
    public void filterDataOwners_withVariousParamsAndGetEmptyList() {
        DataOwnerFilterBean dataOwnerFilterBean = new DataOwnerFilterBean();
        dataOwnerFilterBean.setStart(0);
        dataOwnerFilterBean.setRows(3);
        dataOwnerFilterBean.setError("NONE");
        dataOwnerFilterBean.setCrawlerUserId(user.getId());
        dataOwnerFilterBean.setNameFragment("mock8");
        ListDataOwnersResult result = dataOwnerService.filterDataOwners(dataOwnerFilterBean);
        Assert.assertEquals(0, result.getDataOwners().size());
        Assert.assertEquals(0, result.getTotalCount());
    }
    
    @Test
    public void addDataOwner() {
        List<String> emails = new ArrayList<>();
        emails.add("mock@email.com");
        emails.add("mock2@email.com");
        
        String shortName = "shortName";
        String longName = "longName";
        String description = "description";
        Float weight = 1f;
        
        DataOwnerUpdateRequest request = new DataOwnerUpdateRequest(shortName, longName, weight, emails, description);
        dataOwnerService.addDataOwner(request);
        List<DataOwner> dataOwners = Ebean.find(DataOwner.class).findList();
        Assert.assertEquals(4, dataOwners.size());
        
        DataOwner dataOwner = dataOwners.get(3);
        Assert.assertEquals(longName, dataOwner.getLongName());
        Assert.assertEquals(shortName, dataOwner.getShortName());
        Assert.assertEquals(description, dataOwner.getDescription());
        Assert.assertEquals(weight, new Float(dataOwner.getWeight()));
        Assert.assertNotNull(dataOwner.getUuid());
        
        Assert.assertEquals(2, dataOwner.getEmails().size());
        Assert.assertEquals(emails.get(0), dataOwner.getEmails().get(0).getEmail());
        Assert.assertEquals(emails.get(1), dataOwner.getEmails().get(1).getEmail());
    }

    @Test
    public void addDataOwner_withMissingWeight() throws Exception {
        DataOwnerUpdateRequest request = new DataOwnerUpdateRequest();
        request.setShortName("shortName");
        request.setLongName("longName");

        dataOwnerService.addDataOwner(request);

        List<DataOwner> dataOwners = Ebean.find(DataOwner.class).findList();
        Assert.assertEquals(4, dataOwners.size());
    }

    @Test
    public void editDataOwner() {
        String notModifiedEmail = "1@email.com";
        String deletedEmail = "2@email.com";
        String addedEmail = "3@email.com";
        String addedEmail2 = "4@email.com";
        
        DataOwnerEmail dataOwnerEmail = new DataOwnerEmail();
        dataOwnerEmail.setDataOwner(dataOwner);
        dataOwnerEmail.setEmail(notModifiedEmail);
        Ebean.save(dataOwnerEmail);
        
        DataOwnerEmail dataOwnerEmail2 = new DataOwnerEmail();
        dataOwnerEmail2.setDataOwner(dataOwner);
        dataOwnerEmail2.setEmail(deletedEmail);
        Ebean.save(dataOwnerEmail2);
        
        
        List<String> emails = new ArrayList<>();
        emails.add(notModifiedEmail);
        emails.add(addedEmail);
        emails.add(addedEmail2);
        
        DataOwnerUpdateRequest request = new DataOwnerUpdateRequest("short", "long", 1f, emails, "description");
        
        List<DataOwner> dataOwners = Ebean.find(DataOwner.class).findList();
        DataOwner originalDataOwner = dataOwners.get(0);
        
        Assert.assertEquals(2, originalDataOwner.getEmails().size());
        Assert.assertEquals(notModifiedEmail, originalDataOwner.getEmails().get(0).getEmail());
        Assert.assertEquals(deletedEmail, originalDataOwner.getEmails().get(1).getEmail());
        
        dataOwnerService.editDataOwner(request, dataOwner.getId());
        
        dataOwners = Ebean.find(DataOwner.class).findList();
        
        Assert.assertEquals(3, dataOwners.size());
        
        DataOwner modifiedDataOwner = dataOwners.get(0);
        Assert.assertEquals(dataOwner.getId(), modifiedDataOwner.getId());
        Assert.assertEquals("short", modifiedDataOwner.getShortName());
        Assert.assertEquals("long", modifiedDataOwner.getLongName());
        Assert.assertEquals("description", modifiedDataOwner.getDescription());
        
        List<DataOwnerEmail> dataOwnerEmails = modifiedDataOwner.getEmails();
        
        Assert.assertEquals(3, dataOwnerEmails.size());
        Assert.assertEquals(notModifiedEmail, dataOwnerEmails.get(0).getEmail());
        Assert.assertEquals(addedEmail, dataOwnerEmails.get(1).getEmail());
        Assert.assertEquals(addedEmail2, dataOwnerEmails.get(2).getEmail());
    }

    @Test(expected = NonUniqueEntityException.class)
    public void addDataOwner_withExistingName() throws Exception {
        DataOwner existing = new DataOwner();
        existing.setShortName(UUID.randomUUID().toString());
        existing.setLongName(UUID.randomUUID().toString());
        Ebean.save(existing);

        DataOwnerUpdateRequest createRequest = new DataOwnerUpdateRequest();
        createRequest.setShortName(UUID.randomUUID().toString());
        createRequest.setLongName(existing.getLongName());

        dataOwnerService.addDataOwner(createRequest);
    }

    @Test(expected = NonUniqueEntityException.class)
    public void updateDataOwner_toExistingName() throws Exception {
        DataOwner existing = new DataOwner();
        existing.setShortName(UUID.randomUUID().toString());
        existing.setLongName(UUID.randomUUID().toString());
        Ebean.save(existing);

        DataOwnerUpdateRequest updateRequest = new DataOwnerUpdateRequest();
        updateRequest.setShortName(UUID.randomUUID().toString());
        updateRequest.setLongName(existing.getLongName());
        updateRequest.setWeight(1f);

        dataOwnerService.editDataOwner(updateRequest, dataOwner.getId());
    }

}
