package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.beans.CreateAccountRequest;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.Role;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import com.precognox.publishertracker.exceptions.NonUniqueEntityException;
import com.precognox.publishertracker.exceptions.NotAuthorizedException;
import com.precognox.tas.keycloak.services.KeycloakService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import javax.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
public class AccountWriterService {
    
    private final KeycloakService keycloakService;
    private final String realmName;

    public AccountWriterService(KeycloakService keycloakService, String realmName) {
        this.keycloakService = keycloakService;
        this.realmName = realmName;
    }
        
    public void addNewAccount(CreateAccountRequest request, String currentUserSubjectId) {
        checkIfAdmin(currentUserSubjectId);

        String newUserUuid = createKeycloakUser(request.getEmail());
        
        setPassword(request.getPassword(), newUserUuid);
        
        Role role = findRole(request.getRole());
        
        Account account = new Account();
        account.setRole(role);
        account.setKeycloakSubjectUuid(newUserUuid);

        Ebean.save(account);

        log.info("Account created with UUID " + newUserUuid + " by user " + currentUserSubjectId);
    }
               
    private String createKeycloakUser(String loginEmail) {
        String newUsername = UUID.randomUUID().toString();

        UserRepresentation ur = getUserRepresentation(loginEmail);
        ur.setUsername(newUsername);
        Response keycloakResponse = getKeycloakClientForUsers().create(ur);

        if (keycloakResponse.getStatus() == Response.Status.CONFLICT.getStatusCode()) {
            throw new NonUniqueEntityException("Email is not unique: " + loginEmail);
        }

        if (keycloakResponse.getStatus() != Response.Status.CREATED.getStatusCode()) {
            throw new IllegalStateException("Could not create Keycloak account, response: " + keycloakResponse.getStatus());
        }

        List<UserRepresentation> urs = searchUserByUsername(newUsername);

        return urs.get(0).getId();
    }
    
    private UsersResource getKeycloakClientForUsers() {
        return keycloakService.getKeycloakClient().realm(realmName).users();
    }
    
    private List<UserRepresentation> searchUserByUsername(String username) {
        return getKeycloakClientForUsers().search(username);
    }
    
    private void setPassword(String password, String userUuid) {
        CredentialRepresentation cr = new CredentialRepresentation();
        cr.setTemporary(Boolean.FALSE);
        cr.setType("password");
        cr.setValue(password);
        getKeycloakClientForUsers().get(userUuid).resetPassword(cr);
    }
    
    private UserRepresentation getUserRepresentation(String loginName) {
        UserRepresentation ur = new UserRepresentation();
        ur.setEnabled(Boolean.TRUE);
        ur.setEmail(loginName);
        return ur;
    }

    private void checkIfAdmin(String currentUserSubjectId) {
        Account account = findAccount(currentUserSubjectId);

        if (!Account.Roles.ADMIN.name().equals(account.getRole().getName())) {
            throw new NotAuthorizedException();
        }
    }

    private Account findAccount(String subjectId) {
        Account account = Ebean.find(Account.class).where().eq("keycloakSubjectUuid", subjectId).findUnique();

        if (account == null) {
            throw new EntityNotFoundException("Account with the given subject ID does not exist in the DB: " + subjectId);
        }

        return account;
    }

    private Account findAccount(int id) {
        Account account = Ebean.find(Account.class, id);

        return Optional.ofNullable(account).orElseThrow(
                () -> new EntityNotFoundException("Account not found by ID: " + id)
        );
    }

    private Role findRole(String roleName) {
        Optional<Role> roleInDb = Optional.ofNullable(Ebean.find(Role.class).where().eq("name", roleName).findUnique());

        return roleInDb.orElseThrow(
                () -> new EntityNotFoundException("No role exists with name: " + roleName)
        );
    }

    public void updateUser(int accountId, CreateAccountRequest request, String currentUserSubjectId) {
        Account updatedAccount = findAccount(accountId);

        if (!updatedAccount.getKeycloakSubjectUuid().equals(currentUserSubjectId)
                || !Objects.equals(updatedAccount.getRole().getName(), request.getRole())) {
            checkIfAdmin(currentUserSubjectId);
        }

        if (StringUtils.isNotBlank(request.getPassword())) {
            setPassword(request.getPassword(), updatedAccount.getKeycloakSubjectUuid());
        }

        if (StringUtils.isNotBlank(request.getEmail())) {
            getKeycloakClientForUsers().get(updatedAccount.getKeycloakSubjectUuid()).update(getUserRepresentation(request.getEmail()));
        }

        updatedAccount.setRole(findRole(request.getRole()));

        Ebean.update(updatedAccount);

        log.info("Account " + accountId + " updated by user " + currentUserSubjectId);
    }

    public void deleteAccount(int accountId, String currentUserSubjectId) {
        checkIfAdmin(currentUserSubjectId);

        Account account = findAccount(accountId);
        account.setDeletedAt(LocalDateTime.now());
        
        UserResource ur = getKeycloakClientForUsers().get(account.getKeycloakSubjectUuid());
        ur.logout();
        ur.remove();
        
        Ebean.update(account);

        log.info("Account " + accountId + " deleted by " + currentUserSubjectId);
    }

}
