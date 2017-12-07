package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.beans.ScrapedDataDetailRB;
import com.precognox.publishertracker.beans.ScrapedDataRB;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.Category;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 *
 * @author precognox
 */
public class DataServiceTest extends DropwizardTestSkeleton {
    
    private final DataService dataService = new DataService(Mockito.mock(RankingService.class));
    
    private final static String KEYCLOAK_SUBJECT_UUID = UUID.randomUUID().toString();
    
    private Account user;
    
    private DataOwner dataOwner;
    private Category category;
    
    @Before
    public void setUpEntities() throws Exception {
        dataOwner = new DataOwner();
        dataOwner.setLongName("mockLongName");
        dataOwner.setShortName("mockShortName");
        Ebean.save(dataOwner);
        
        user = new Account();
        user.setKeycloakSubjectUuid(KEYCLOAK_SUBJECT_UUID);
        user.setRole(getApiUserRole());
        Ebean.save(user);
        
        category = new Category();
        category.setName("mockCategory");
        Ebean.save(category);
        
    }
    
    @Test
    public void testSaveScrapedData_withEmptyDb() {
        dataService.saveScrapedData(getScrapedDataRbs(), KEYCLOAK_SUBJECT_UUID);
        List<Document> dataItems = Ebean.find(Document.class).findList();
        
        Assert.assertEquals(1, dataItems.size());
    }
    
    @Test
    public void testSaveScrapedData_withExistItems() {
        createUpdate();       
        
        List<Document> dataItems = Ebean.find(Document.class).findList();
        Assert.assertEquals(1, dataItems.size());
        
        dataService.saveScrapedData(getScrapedDataRbs(), KEYCLOAK_SUBJECT_UUID);
        
        dataItems = Ebean.find(Document.class).findList();
        Assert.assertEquals(1, dataItems.size());
    }
    
    @Test
    public void testSaveScrapedData_withExistAndNotExistData () {
        createUpdate();
        
        List<ScrapedDataRB> dataRBs = new ArrayList<>();
        ScrapedDataRB dataRB = new ScrapedDataRB();
        dataRB.setDataOwnerUuid(dataOwner.getUuid());
        
        List<ScrapedDataDetailRB> dataDetailRBs = new ArrayList<>();
        ScrapedDataDetailRB dataDetailRB = new ScrapedDataDetailRB();
        dataDetailRB.setDocumentUrl("http://url.hu/uniqpart");
        dataDetailRB.setPageUrl("http://url.hu");
        dataDetailRB.setTitle("mockTitle");
        dataDetailRB.setProvidedDate("2017-09-07T08:00:41.955");
        dataDetailRBs.add(dataDetailRB);
        
        ScrapedDataDetailRB dataDetailRB2 = new ScrapedDataDetailRB();
        dataDetailRB2.setDocumentUrl("http://url.hu/anotherUniqPart");
        dataDetailRB2.setPageUrl("http://url.hu");
        dataDetailRB2.setTitle("mockTitle");
        dataDetailRB2.setProvidedDate("2017-09-07T08:00:41.955");
        dataDetailRBs.add(dataDetailRB2);
        
        dataRB.setDetails(dataDetailRBs);
        
        dataRBs.add(dataRB);
        
        List<Document> dataItems = Ebean.find(Document.class).findList();
        Assert.assertEquals(1, dataItems.size());
        
        dataService.saveScrapedData(dataRBs, KEYCLOAK_SUBJECT_UUID);
        
        dataItems = Ebean.find(Document.class).findList();
        Assert.assertEquals(2, dataItems.size());
    }
    
    @Test(expected = EntityNotFoundException.class)
    public void testSaveScrapedData_withNotExistingDataOwner () {
        List<ScrapedDataRB> dataRBs = new ArrayList<>();
        ScrapedDataRB dataRB = new ScrapedDataRB();
        dataRB.setDataOwnerUuid("notExistUuid");
        dataRBs.add(dataRB);
        
        dataService.saveScrapedData(dataRBs, KEYCLOAK_SUBJECT_UUID);
    }
    
    @Test(expected = EntityNotFoundException.class)
    public void testSaveScrapedData_withNotExistAccount() {
        List<ScrapedDataRB> dataRBs = new ArrayList<>();
        ScrapedDataRB dataRB = new ScrapedDataRB();
        dataRB.setDataOwnerUuid(dataOwner.getUuid());
        dataRBs.add(dataRB);
        
        dataService.saveScrapedData(dataRBs, "mockUserUuid");
    }
    
    private void createUpdate() {
        Update update = new Update();
        update.setAccount(user);
        update.setCategory(category);
        update.setDataOwner(dataOwner);
        Ebean.save(update);
        Document dataItem = new Document();
        dataItem.setUpdate(update);
        dataItem.setDocumentUrl("http://url.hu/uniqpart");
        dataItem.setTitle("title");
        Ebean.save(dataItem);     
    }
    
    private List<ScrapedDataRB> getScrapedDataRbs() {
        List<ScrapedDataRB> dataRBs = new ArrayList<>();
        ScrapedDataRB dataRB = new ScrapedDataRB();
        dataRB.setCategory(category.getId());
        dataRB.setDataOwnerUuid(dataOwner.getUuid());
        
        List<ScrapedDataDetailRB> dataDetailRBs = new ArrayList<>();
        ScrapedDataDetailRB dataDetailRB = new ScrapedDataDetailRB();
        dataDetailRB.setDocumentUrl("http://url.hu/uniqpart");
        dataDetailRB.setPageUrl("http://url.hu");
        dataDetailRB.setTitle("mockTitle");
        dataDetailRB.setProvidedDate("2017-09-07T08:00:41.955");
        dataDetailRBs.add(dataDetailRB);
        
        dataRB.setDetails(dataDetailRBs);
        
        dataRBs.add(dataRB);
        return dataRBs;
    }
}
