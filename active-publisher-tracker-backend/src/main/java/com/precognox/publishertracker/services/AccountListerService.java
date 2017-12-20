package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.beans.AccountRB;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.Role;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import com.precognox.publishertracker.util.DateFormatter;
import com.precognox.publishertracker.services.KeycloakService;
import org.keycloak.representations.idm.UserRepresentation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class AccountListerService {

    private final KeycloakService keycloakService;
    private final String realmName;

    public AccountListerService(KeycloakService keycloakService, String realmName) {
        this.keycloakService = keycloakService;
        this.realmName = realmName;
    }
    
    public String getLoggedInUser(String currentUserSubjectUuid) {
        Account account = findAccount(currentUserSubjectUuid);
        account.setLastLoginDate(LocalDateTime.now());
        Ebean.update(account);

        return account.getRole().getName();
    }

    public List<AccountRB> listAccounts(String currentUserSubjectUuid) {
        Role userRole = getUserRole(currentUserSubjectUuid);

        if (Account.Roles.ADMIN.name().equals(userRole.getName())) {
            return listAccounts();
        }

        return getCurrentUser(currentUserSubjectUuid);
    }

    private Role getUserRole(String subjectId) {
        return findAccount(subjectId).getRole();
    }

    private Account findAccount(String subjectId) {
        Account account = Ebean.find(Account.class).where().eq("keycloakSubjectUuid", subjectId).findUnique();

        if (account == null) {
            throw new EntityNotFoundException("Account with the given subject ID does not exist in the DB: " + subjectId);
        }

        return account;
    }

    private List<AccountRB> getCurrentUser(String currentUserSubjectId) {
        UserRepresentation keycloakUserInfo = keycloakService.getUserInfo(realmName, currentUserSubjectId);

        Account account = findAccount(currentUserSubjectId);
        AccountRB accountRB = buildAccountRB(account, keycloakUserInfo);

        return Collections.singletonList(accountRB);
    }

    private List<AccountRB> listAccounts() {
        String[] listedRoles = {Account.Roles.ADMIN.name(), Account.Roles.CONFIGURATOR.name()};

        List<Account> accounts = Ebean.find(Account.class)
                .where()
                .and()
                .in("role.name", listedRoles)
                .isNull("deletedAt")
                .endAnd()
                .findList();

        List<AccountRB> results = new ArrayList<>();

        for (Account acc : accounts) {
            UserRepresentation keycloakUserInfo = keycloakService.getUserInfo(realmName, acc.getKeycloakSubjectUuid());

            results.add(buildAccountRB(acc, keycloakUserInfo));
        }

        results.sort(Comparator.comparing(AccountRB::getEmail));

        return results;
    }

    private AccountRB buildAccountRB(Account accountEntity, UserRepresentation keycloakUserInfo) {
        AccountRB accountRB = new AccountRB();
        accountRB.setId(accountEntity.getId());
        accountRB.setRole(accountEntity.getRole().getName());
        accountRB.setEmail(keycloakUserInfo.getEmail());

        if (accountEntity.getLastLoginDate() != null) {
            accountRB.setLastLoginDate(DateFormatter.formatDate(accountEntity.getLastLoginDate()));
        }

        return accountRB;
    }

}
