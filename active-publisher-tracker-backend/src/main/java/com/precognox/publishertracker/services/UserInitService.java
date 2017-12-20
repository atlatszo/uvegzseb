package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.entities.Account;
import com.precognox.publishertracker.entities.Role;
import com.precognox.publishertracker.services.KeycloakService;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;

import static java.util.stream.Collectors.toList;

/**
 *
 * @author precognox
 */
@Slf4j
public class UserInitService {

    private final KeycloakService keycloakService;
    private final String realmName;

    private static final String KEYCLOAK_GROUP_NAME = "administrators";

    public UserInitService(KeycloakService keycloakService, String realmName) {
        this.keycloakService = keycloakService;
        this.realmName = realmName;
    }
    
    public List<String> initUsers() {
        List<UserRepresentation> keycloakUserList = keycloakService.listUserInfo(realmName, KEYCLOAK_GROUP_NAME);

        Role adminRole = getAdminRole();

        return keycloakUserList.stream()
                .filter(this::isNewUser)
                .map(keycloakUser -> saveToDb(keycloakUser, adminRole))
                .collect(toList());
    }

    private String saveToDb(UserRepresentation keycloakUser, Role role) {
        String userUuid = keycloakUser.getId();

        Account account = new Account();
        account.setKeycloakSubjectUuid(userUuid);
        account.setRole(role);
        Ebean.save(account);

        log.info("User added with UUID: " +  userUuid);

        return userUuid;
    }

    private Role getAdminRole() {
        return Ebean.find(Role.class).where().eq("name", Account.Roles.ADMIN.name()).findUnique();
    }

    private boolean isNewUser(UserRepresentation user) {
        return Ebean.find(Account.class).where().eq("keycloakSubjectUuid", user.getId()).findUnique() == null;
    }

}
