package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.DropwizardTestSkeleton;
import com.precognox.publishertracker.beans.IdAndValue;
import com.precognox.publishertracker.beans.ListUpdatesResult;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.Category;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Update;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 *
 * @author precognox
 */
public class UpdateServiceTest extends DropwizardTestSkeleton {
    
    private final UpdateService updateService = new UpdateService();
    private final String PAGE_URL_1 = "pageUrl1";
    private final String PAGE_URL_2 = "pageUrl2";
    
    @Test
    public void testListCategories() {
        createCategory("cat1");
        List<IdAndValue> idAndValues = updateService.listCategories();
        assertEquals(1, idAndValues.size());   
    }
    
    @Test
    public void testListUpdates_withStartAndRowsParameter() {
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("shortName", "longName");
        
        createUpdate(account, dataOwner, PAGE_URL_1, LocalDateTime.now().minusDays(1));
        createUpdate(account, dataOwner, PAGE_URL_2, LocalDateTime.now());
        
        ListUpdatesResult result = updateService.listUpdates(0, 1, null, new ArrayList<>());
        assertEquals(2, result.getTotalCount());
        assertEquals(1, result.getUpdates().size());
        assertEquals(PAGE_URL_2, result.getUpdates().get(0).getDetails().get(0).getPageUrl());
        
        result = updateService.listUpdates(1, 1, null, new ArrayList<>());
        assertEquals(2, result.getTotalCount());
        assertEquals(1, result.getUpdates().size());
        assertEquals(PAGE_URL_1, result.getUpdates().get(0).getDetails().get(0).getPageUrl());
        
        result = updateService.listUpdates(0, 3, null, new ArrayList<>());
        assertEquals(2, result.getTotalCount());
        assertEquals(2, result.getUpdates().size());
    }
    
    @Test
    public void testListUpdates_searchNameFragmentInShortName() {
        createEntitiesForNameFragmentTest();
            
        ListUpdatesResult result = updateService.listUpdates(0, 2, "ort", new ArrayList<>());
        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getUpdates().size());
        assertEquals(PAGE_URL_1, result.getUpdates().get(0).getDetails().get(0).getPageUrl());
        
        result = updateService.listUpdates(0, 2, "nam", new ArrayList<>());
        assertEquals(2, result.getTotalCount());
        assertEquals(2, result.getUpdates().size());
        
    }
    
    @Test
    public void testListUpdates_searchNameFragmentInLongName() {
        createEntitiesForNameFragmentTest();
            
        ListUpdatesResult result = updateService.listUpdates(0, 2, "ry", new ArrayList<>());
        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getUpdates().size());
        assertEquals(PAGE_URL_2, result.getUpdates().get(0).getDetails().get(0).getPageUrl());
        
        result = updateService.listUpdates(0, 2, "ong", new ArrayList<>());
        assertEquals(2, result.getTotalCount());
        assertEquals(2, result.getUpdates().size());
        
    }
    
    @Test
    public void testListUpdates_withCategoryIdList() {
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("shortName", "longName");
        
        Category category = createCategory("cat1");
        Category category2 = createCategory("cat2");
        
        createUpdate(account, dataOwner, PAGE_URL_1, category, LocalDateTime.now().minusDays(1));
        createUpdate(account, dataOwner, PAGE_URL_1, category2, LocalDateTime.now());
        
        List<Integer> idList = new ArrayList<>();
        idList.add(category.getId());
        
        ListUpdatesResult result = updateService.listUpdates(0, 2, null, idList);
        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getUpdates().size());
        idList.add(category2.getId());
        
        result = updateService.listUpdates(0, 2, null, idList);
        assertEquals(2, result.getTotalCount());
        assertEquals(2, result.getUpdates().size());
    }
    
    @Test
    public void testListUpdates_withMixedParams() {
        Account account = setUpTestUser(getApiUserRole());
        
        DataOwner dataOwner = createDataOwnerWithName("shortName", "longName");
        Category category = createCategory("cat1");
        createUpdate(account, dataOwner, PAGE_URL_1, category, LocalDateTime.now().minusDays(1));
        
        DataOwner dataOwner2 = createDataOwnerWithName("mock", "mockLong");
        Category category2 = createCategory("cat2");
        createUpdate(account, dataOwner2, PAGE_URL_1, category2, LocalDateTime.now());
        
        List<Integer> idList = new ArrayList<>();
        idList.add(category.getId());
        
        ListUpdatesResult result = updateService.listUpdates(0, 2, "mock", idList);
        assertEquals(0, result.getTotalCount());
        assertEquals(0, result.getUpdates().size());
        
        result = updateService.listUpdates(0, 2, "short", idList);
        assertEquals(1, result.getTotalCount());
        assertEquals(1, result.getUpdates().size());
        
        idList.add(category2.getId());
        result = updateService.listUpdates(1, 2, "long", idList);
        assertEquals(2, result.getTotalCount());
        assertEquals(1, result.getUpdates().size());
    }
    
    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        Ebean.save(category);
        return category;
    }
    
    private void createEntitiesForNameFragmentTest() {
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("shortName", "long");
        
        createUpdate(account, dataOwner, PAGE_URL_1, LocalDateTime.now());
        
        Account account2 = setUpTestUser(getApiUserRole());
        DataOwner dataOwner2 = createDataOwnerWithName("mockName", "verylong");
        
        createUpdate(account2, dataOwner2, PAGE_URL_2, LocalDateTime.now().minusDays(1));
    }
    
    private void createUpdate(Account account, DataOwner dataOwner, String pageUrl, LocalDateTime updateDate) {
        createUpdate(account, dataOwner, pageUrl, null, updateDate);
    }
    
    private void createUpdate(Account account, DataOwner dataOwner, String pageUrl, Category category, LocalDateTime updateDate) {
        Update update = new Update();
        update.setAccount(account);
        update.setCategory(category);
        update.setDataOwner(dataOwner);
        update.setDate(updateDate);
        Ebean.save(update);
        
        Document dataItem = new Document();
        dataItem.setPageUrl(pageUrl);
        dataItem.setUpdate(update);
        dataItem.setProvidedDate(updateDate);
        Ebean.save(dataItem);
    }

    @Test
    public void shouldMergeUpdates() throws Exception {
        Category category = createCategory("cat1");
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("short", "long");

        createUpdate(account, dataOwner, "pageUrl", category, LocalDateTime.now());
        createUpdate(account, dataOwner, "pageUrl", category, LocalDateTime.now());

        ListUpdatesResult result = updateService.listUpdates(0, 10, null, Collections.emptyList());

        assertEquals(1, result.getUpdates().size());
        assertEquals(2, result.getUpdates().get(0).getDetails().size());
        assertEquals(dataOwner.getLongName(), result.getUpdates().get(0).getDataOwnerName());
    }

    @Test
    public void shouldMergeUpdates_withMissingCategories() throws Exception {
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("short", "long");

        createUpdate(account, dataOwner, "pageUrl", LocalDateTime.now());
        createUpdate(account, dataOwner, "pageUrl", LocalDateTime.now());

        ListUpdatesResult result = updateService.listUpdates(0, 10, null, Collections.emptyList());

        assertEquals(1, result.getUpdates().size());
        assertEquals(2, result.getUpdates().get(0).getDetails().size());
        assertEquals(dataOwner.getLongName(), result.getUpdates().get(0).getDataOwnerName());
    }

    @Test
    public void shouldNotMergeUpdates_withDifferentCategories() throws Exception {
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("short", "long");

        createUpdate(account, dataOwner, "pageUrl", createCategory("cat1"), LocalDateTime.now());
        createUpdate(account, dataOwner, "pageUrl", createCategory("cat2"), LocalDateTime.now());

        ListUpdatesResult result = updateService.listUpdates(0, 10, null, Collections.emptyList());

        assertEquals(2, result.getUpdates().size());
    }

    @Test
    public void shouldNotMergeUpdates_withDifferentDates() throws Exception {
        Category category = createCategory("cat1");
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("short", "long");

        createUpdate(account, dataOwner, "pageUrl", category, LocalDateTime.now());
        createUpdate(account, dataOwner, "pageUrl", category, LocalDateTime.now().minusDays(1));

        ListUpdatesResult result = updateService.listUpdates(0, 10, null, Collections.emptyList());

        assertEquals(2, result.getUpdates().size());
    }

    @Test
    public void shouldNotMergeUpdates_withDifferentDataOwners() throws Exception {
        Category category = createCategory("cat1");
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner1 = createDataOwnerWithName("short1", "long1");
        DataOwner dataOwner2 = createDataOwnerWithName("short2", "long2");

        createUpdate(account, dataOwner1, "pageUrl", category, LocalDateTime.now());
        createUpdate(account, dataOwner2, "pageUrl", category, LocalDateTime.now());

        ListUpdatesResult result = updateService.listUpdates(0, 10, null, Collections.emptyList());

        assertEquals(2, result.getUpdates().size());
    }

    @Test
    public void updatesWithSameDate_shouldBeOrderedByDataOwnerName() throws Exception {
        Category category = createCategory("cat1");
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner1 = createDataOwnerWithName("short1", "long-XYZ");
        DataOwner dataOwner2 = createDataOwnerWithName("short2", "long-ABC");
        DataOwner dataOwner3 = createDataOwnerWithName("short3", "long-DEF");

        createUpdate(account, dataOwner1, "pageUrl", category, LocalDateTime.now());
        createUpdate(account, dataOwner2, "pageUrl", category, LocalDateTime.now());
        createUpdate(account, dataOwner3, "pageUrl", category, LocalDateTime.now());

        ListUpdatesResult result = updateService.listUpdates(0, 10, null, Collections.emptyList());

        assertEquals(3, result.getUpdates().size());
        assertEquals(dataOwner2.getLongName(), result.getUpdates().get(0).getDataOwnerName());
        assertEquals(dataOwner3.getLongName(), result.getUpdates().get(1).getDataOwnerName());
        assertEquals(dataOwner1.getLongName(), result.getUpdates().get(2).getDataOwnerName());
    }

    @Test
    public void updatesShouldBeOrderedByDateDesc() throws Exception {
        Category category = createCategory("cat1");
        Account account = setUpTestUser(getApiUserRole());
        DataOwner dataOwner = createDataOwnerWithName("short", "long");

        createUpdate(account, dataOwner, "pageUrl", category, LocalDateTime.of(2017, 11, 10, 12, 30));
        createUpdate(account, dataOwner, "pageUrl", category, LocalDateTime.of(2017, 11, 5, 12, 30));
        createUpdate(account, dataOwner, "pageUrl", category, LocalDateTime.of(2017, 11, 15, 12, 30));

        ListUpdatesResult result = updateService.listUpdates(0, 10, null, Collections.emptyList());

        assertEquals(3, result.getUpdates().size());
        assertEquals("2017-11-15", result.getUpdates().get(0).getUpdateDate());
        assertEquals("2017-11-10", result.getUpdates().get(1).getUpdateDate());
        assertEquals("2017-11-05", result.getUpdates().get(2).getUpdateDate());
    }

}
