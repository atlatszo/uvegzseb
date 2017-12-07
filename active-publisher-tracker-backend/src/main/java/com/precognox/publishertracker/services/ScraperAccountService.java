package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.ExpressionList;
import com.precognox.publishertracker.beans.HarvestDetails;
import com.precognox.publishertracker.beans.IdAndValue;
import com.precognox.publishertracker.beans.ListScraperAccountsResult;
import com.precognox.publishertracker.beans.ScraperAccountRB;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.enums.FilterErrorTypes;
import com.precognox.publishertracker.util.DateFormatter;
import com.precognox.tas.keycloak.services.KeycloakService;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ScraperAccountService {

    private final KeycloakService keycloakService;
    private final String realmName;

    public ScraperAccountService(KeycloakService keycloakService, String realmName) {
        this.keycloakService = keycloakService;
        this.realmName = realmName;
    }

    public List<IdAndValue> listCrawlers() {
        return Ebean.find(Account.class)
            .where()
            .or()
                .eq("role.name", Account.Roles.API_USER.name())
                .eq("role.name", Account.Roles.DISABLED_API_USER.name())
            .endOr()
            .findList()
            .stream()
            .map(this::mapUserToIdAndValueRB)
            .collect(Collectors.toList());
    }
    
    private IdAndValue mapUserToIdAndValueRB(Account account) {
        return new IdAndValue(account.getId(), keycloakService.getUserInfo(realmName , account.getKeycloakSubjectUuid()).getUsername());
    }

    public ListScraperAccountsResult listScraperAccounts(int start, int rows) {
        ExpressionList<Account> query = Ebean.find(Account.class).where()
                .and()
                    .isNull("deletedAt")
                    .or()
                        .eq("role.name", Account.Roles.API_USER.name())
                        .eq("role.name", Account.Roles.DISABLED_API_USER.name())
                    .endOr()
                .endAnd();

        int totalCount = query.findCount();

        ListScraperAccountsResult result = new ListScraperAccountsResult();
        result.setTotalCount(totalCount);

        List<Account> accounts = query.setFirstRow(start).setMaxRows(rows).findList();

        result.setAccounts(
                accounts.stream().map(this::mapEntity).collect(Collectors.toList())
        );

        result.getAccounts().sort(Comparator.comparing(ScraperAccountRB::getLastHarvestDate).reversed());

        return result;
    }

    private ScraperAccountRB mapEntity(Account account) {
        UserRepresentation keycloakUserInfo = keycloakService.getUserInfo(realmName, account.getKeycloakSubjectUuid());

        Update lastUpdate = Ebean.find(Update.class)
                .where()
                .eq("account.id", account.getId())
                .orderBy("date DESC")
                .setMaxRows(1)
                .findUnique();

        ScraperAccountRB result = new ScraperAccountRB();

        result.setId(account.getId());
        result.setApiUserName(keycloakUserInfo.getUsername());
        result.setDisabled(
                Objects.equals(account.getRole().getName(), Account.Roles.DISABLED_API_USER.name())
        );

        if (lastUpdate != null) {
            result.setError(FilterErrorTypes.NONE.name());
            result.setLastHarvestDate(DateFormatter.formatDate(lastUpdate.getDate()));

            List<Document> updateData = Ebean.find(Document.class)
                    .where()
                    .eq("update.id", lastUpdate.getId())
                    .findList();

            result.setLastHarvestData(
                    updateData.stream().map(this::mapUpdateData).collect(Collectors.toList())
            );
        } else {
            result.setError(FilterErrorTypes.NO_DATA.name());
        }

        return result;
    }

    private HarvestDetails mapUpdateData(Document data) {
        HarvestDetails result = new HarvestDetails();
        result.setProvidedDate(DateFormatter.formatDate(data.getProvidedDate()));
        result.setDataOwnerName(data.getUpdate().getDataOwner().getShortName());

        return result;
    }

}
