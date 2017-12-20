package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.ExpressionList;
import com.precognox.publishertracker.beans.DataOwnerDetailRb;
import com.precognox.publishertracker.beans.DataOwnerFilterBean;
import com.precognox.publishertracker.beans.DataOwnerRb;
import com.precognox.publishertracker.beans.DataOwnerUpdateRequest;
import com.precognox.publishertracker.beans.IdAndValue;
import com.precognox.publishertracker.beans.ListDataOwnersResult;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.DataOwnerEmail;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.enums.FilterErrorTypes;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import com.precognox.publishertracker.exceptions.NonUniqueEntityException;
import com.precognox.publishertracker.services.KeycloakService;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Slf4j
public class DataOwnerService {

    private final KeycloakService keycloakService;
    private final String keycloakRealmName;

    public DataOwnerService(KeycloakService keycloakService, String keycloakRealmName) {
        this.keycloakService = keycloakService;
        this.keycloakRealmName = keycloakRealmName;
    }

    private enum DataOwnerErrorTypes {
        NONE, ANY
    }
    
    public ListDataOwnersResult filterDataOwners(DataOwnerFilterBean filterBean) {
        ExpressionList<DataOwner> query = Ebean.find(DataOwner.class).where().or();
        
        if (!isEmpty(filterBean.getNameFragment())) {
            query = query
                    .icontains("shortName", filterBean.getNameFragment())
                    .icontains("longName", filterBean.getNameFragment());
        }
        
        List<DataOwner> dataOwners = query.endOr().findList();
        
        if (filterBean.getCrawlerUserId() != null) {
            dataOwners = dataOwners.stream()
                    .filter(dataOwner -> this.hasCrawlerUser(dataOwner, filterBean.getCrawlerUserId()))
                    .collect(toList());
        }
        
        if (DataOwnerErrorTypes.ANY.name().equals(filterBean.getError())) {
            dataOwners = dataOwners.stream()
                    .filter(dataOwner -> dataOwner.getUpdates().isEmpty())
                    .collect(toList());
        } else if (DataOwnerErrorTypes.NONE.name().equals(filterBean.getError())) {
            dataOwners = dataOwners.stream()
                    .filter(dataOwner -> !dataOwner.getUpdates().isEmpty())
                    .collect(toList());
        }

        int totalCount = dataOwners.size();

        dataOwners.sort(Comparator.comparing(DataOwner::getLongName));

        if (!dataOwners.isEmpty() && filterBean.getRows() > 0) {
            int toIndex = filterBean.getStart() + filterBean.getRows();

            if (toIndex > dataOwners.size()) {
                toIndex = dataOwners.size();
            }

            dataOwners = dataOwners.subList(filterBean.getStart(), toIndex);
        }

        ListDataOwnersResult result = new ListDataOwnersResult();
        result.setTotalCount(totalCount);
        result.setDataOwners(dataOwners.stream().map(this::mapDataOwnerToRB).collect(toList()));

        return result;
    }

    private boolean hasCrawlerUser(DataOwner dataOwner, int crawlerUserId) {
        return dataOwner.getUpdates()
                .stream()
                .map(Update::getAccount)
                .anyMatch(acc -> acc.getId().equals(crawlerUserId));
    }
    
    private DataOwnerRb mapDataOwnerToRB(DataOwner owner) {
        DataOwnerDetailRb dataOwnerDetailRb = new DataOwnerDetailRb();
        List<Update> updates = owner.getUpdates();
        updates.sort(Comparator.comparing(Update::getDate).reversed());
        
        if (updates.isEmpty()) {
            dataOwnerDetailRb.setError(FilterErrorTypes.NO_DATA.name());
        } else {
            Update lastUpdate = updates.get(0);

            UserRepresentation keycloakuserInfo =
                    keycloakService.getUserInfo(keycloakRealmName, lastUpdate.getAccount().getKeycloakSubjectUuid());

            dataOwnerDetailRb.setCrawlerName(keycloakuserInfo.getUsername());
            dataOwnerDetailRb.setLastSuccessfulHarvestDate(lastUpdate.getDate().format(DateTimeFormatter.ISO_DATE));
        }
        
        DataOwnerRb dataOwnerRb = new DataOwnerRb();
        dataOwnerRb.setId(owner.getId());
        dataOwnerRb.setUuid(owner.getUuid());
        dataOwnerRb.setShortName(owner.getShortName());
        dataOwnerRb.setLongName(owner.getLongName());
        dataOwnerRb.setWeight(owner.getWeight());
        
        if (owner.getEmails()!= null) {
            List<String> emails = owner.getEmails().stream().map(DataOwnerEmail::getEmail).collect(toList());
            dataOwnerRb.setEmails(emails);
        }
        
        dataOwnerRb.setDescription(owner.getDescription());
        dataOwnerRb.setDetail(dataOwnerDetailRb);

        return dataOwnerRb;
    }
    
    public List<IdAndValue> getDataOwnerDropdownData() {
        return Ebean.find(DataOwner.class)
                .findList()
                .stream()
                .filter(dataOwner -> !dataOwner.getUpdates().isEmpty())
                .map(this::mapDataOwnerToIdAndValue)
                .collect(toList());
    }
    
    private IdAndValue mapDataOwnerToIdAndValue(DataOwner owner) {
        return new IdAndValue(owner.getId(), owner.getLongName());
    }
    
    public void addDataOwner(DataOwnerUpdateRequest request) {
        checkDataOwnerName(request.getLongName());

        DataOwner dataOwner = new DataOwner();

        Ebean.save(mapDataOwnerUpdateToDataOwner(dataOwner, request));
        
        request.getEmails().forEach(email -> saveDataOwnerEmail(dataOwner, email));
    }

    private void checkDataOwnerName(String newName) {
        int existingWithName = Ebean.find(DataOwner.class).where().eq("longName", newName).findCount();

        if (existingWithName > 0) {
            throw new NonUniqueEntityException("Data owner already exists with name: " + newName);
        }
    }

    public void editDataOwner(DataOwnerUpdateRequest request, int id) {
        DataOwner dataOwner = Ebean.find(DataOwner.class, id);
        
        if (dataOwner == null) {
            String message = "data owner not found with id: " + id;
            log.error(message);
            throw new EntityNotFoundException(message);
        }

        checkDataOwnerName(request.getLongName(), id);

        Ebean.update(mapDataOwnerUpdateToDataOwner(dataOwner, request));
        
        deleteRemovedEmails(dataOwner, request.getEmails());
        
        List<String> existEmails = dataOwner.getEmails().stream().map(DataOwnerEmail::getEmail).collect(toList());
        saveAddedEmails(dataOwner, request.getEmails(), existEmails);        
    }

    private void checkDataOwnerName(String newName, int id) {
        int existingWithName = Ebean.find(DataOwner.class)
                .where()
                .and()
                    .eq("longName", newName)
                    .ne("id", id)
                .endAnd()
                .findCount();

        if (existingWithName > 0) {
            throw new NonUniqueEntityException("Data owner already exists with name: " + newName);
        }
    }

    private DataOwner mapDataOwnerUpdateToDataOwner(DataOwner dataOwner, DataOwnerUpdateRequest request) {
        dataOwner.setDescription(request.getDescription());
        dataOwner.setLongName(request.getLongName());
        dataOwner.setShortName(request.getShortName());

        if (request.getWeight() != null) {
            dataOwner.setWeight(request.getWeight());
        } else {
            dataOwner.setWeight(1f);
        }

        return dataOwner;
    }
    
    private void deleteRemovedEmails(DataOwner dataOwner, List<String> emails) {
        dataOwner.getEmails()
            .stream()
            .filter(email -> !emails.contains(email.getEmail())).forEach(Ebean::delete);
    }
    
    private void saveAddedEmails(DataOwner dataOwner, List<String> emails, List<String> existEmails) {
        emails.stream()
            .filter(newEmail -> !existEmails.contains(newEmail))
            .forEach(newEmail -> saveDataOwnerEmail(dataOwner, newEmail));
    }
    
    private void saveDataOwnerEmail(DataOwner dataOwner, String email) {
        DataOwnerEmail dataOwnerEmail = new DataOwnerEmail();
        dataOwnerEmail.setDataOwner(dataOwner);
        dataOwnerEmail.setEmail(email);
        Ebean.save(dataOwnerEmail);
    }
    
}
