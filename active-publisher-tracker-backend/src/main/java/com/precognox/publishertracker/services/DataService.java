package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.beans.ScrapedDataDetailRB;
import com.precognox.publishertracker.beans.ScrapedDataRB;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.Category;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 *
 * @author precognox
 */
public class DataService {

    private final RankingService rankingService;

    public DataService(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    public void saveScrapedData(List<ScrapedDataRB> scrapedDataRBs, String currentUserUuid) {
        scrapedDataRBs.forEach(data -> {
            DataOwner dataOwner = getDataOwner(data.getDataOwnerUuid());
            
            Category category = null;
            if (data.getCategory() != null) {
                category = getCategory(data.getCategory());
            }
            
            Account account = getAccount(currentUserUuid);
                        
            saveUpdate(account, category, dataOwner, filterExistingRecords(data, dataOwner));
        });

        rankingService.updateCache();
    }
    
    private DataOwner getDataOwner(String uuid) {
        DataOwner dataOwner = Ebean.find(DataOwner.class).where().eq("uuid", uuid).findUnique();

        return Optional.ofNullable(dataOwner).orElseThrow(
                () -> new EntityNotFoundException("Data owner not exist with uuid: " + uuid)
        );
    }
    
    private Category getCategory(Integer categoryId) {
        return Optional.ofNullable(Ebean.find(Category.class, categoryId))
            .orElseThrow(() -> new EntityNotFoundException("Category does not exist with id: " + categoryId));
    }
    
    private Account getAccount(String uuid) {
        Account account = Ebean.find(Account.class).where().eq("keycloakSubjectUuid", uuid).findUnique();

        return Optional.ofNullable(account).orElseThrow(
                () -> new EntityNotFoundException("Account not exist with uuid: " + uuid)
        );
    }    
    
    private List<ScrapedDataDetailRB> filterExistingRecords(ScrapedDataRB data, DataOwner dataOwner) {
        List<Document> existingDocuments = getExistingDocumentsForDataOwner(dataOwner);

        return data.getDetails()
                .stream()
                .filter(detail -> existingDocuments.stream().map(Document::getDocumentUrl).noneMatch(url -> url.equals(detail.getDocumentUrl())))
                .collect(Collectors.toList());
    }
    
    private List<Document> getExistingDocumentsForDataOwner(DataOwner dataOwner) {
        return Ebean.find(Document.class)
                .where()
                .eq("update.dataOwner", dataOwner)
                .findList();
    }
    
    private void saveUpdate(Account account, Category category, DataOwner dataOwner, List<ScrapedDataDetailRB> scrapedDetails) {
        if (!scrapedDetails.isEmpty()) {
            Update update = new Update();
            update.setAccount(account);
            update.setCategory(category);
            update.setDataOwner(dataOwner);
            Ebean.save(update);

            scrapedDetails
                .forEach(dataDetailRB -> {
                   Document dataItem = new Document();
                   dataItem.setDocumentUrl(dataDetailRB.getDocumentUrl());
                   dataItem.setPageUrl(dataDetailRB.getPageUrl());
                   dataItem.setProvidedDate(LocalDateTime.parse(dataDetailRB.getProvidedDate()));
                   dataItem.setTitle(dataDetailRB.getTitle());
                   dataItem.setUpdate(update);

                   Ebean.save(dataItem);
            });
        }
    }
    
}
