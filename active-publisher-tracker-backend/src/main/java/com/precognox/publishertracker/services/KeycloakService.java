package com.precognox.publishertracker.services;

import com.precognox.publishertracker.PublisherTrackerConfiguration;
import lombok.Getter;
import lombok.Setter;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.keycloak.admin.client.Config;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.token.TokenManager;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RealmRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author precognox
 */
public class KeycloakService {
    
    @Getter
    @Setter
    private TokenManager tokenManager;
    
    private final PublisherTrackerConfiguration.KeycloakConfig config;

    public KeycloakService(PublisherTrackerConfiguration.KeycloakConfig config) {
        this.config = config;
        Config tokenManagerConfig = new Config(
            config.getServerUrl(), 
            config.getAuthRealm(), 
            config.getUsername(), 
            config.getPassword(), 
            config.getClientId(), 
            config.getClientSecret(),
            config.getGrantType());
        
        tokenManager = new TokenManager(tokenManagerConfig, new ResteasyClientBuilder().connectionPoolSize(10).build());
    }    
    
    public Keycloak getKeycloakClient() {

        return Keycloak.getInstance(
                config.getServerUrl(),
                config.getAuthRealm(),
                config.getClientId(),
                tokenManager.getAccessTokenString()
        );
    }
    
    /**
     *
     * @param realmName
     * @param groupName
     * @return
     */
    public List<UserRepresentation> listUserInfo(String realmName, String groupName) {
        Optional<GroupRepresentation> groupRepresentations= getKeycloakClient()
                .realm(realmName)
                .groups()
                .groups()
                .stream()
                .filter(group -> group.getName().equals(groupName))
            .findFirst();
        List<UserRepresentation> UserRepresentationList = new ArrayList<>();
            if (groupRepresentations.isPresent()) {
                UserRepresentationList = getKeycloakClient().realm(realmName).groups().group(groupRepresentations.get().getId()).members();
            }
            return UserRepresentationList;
    }
    
    /**
     *
     * @param realmName
     * @param userUuid
     * @return
     */
    public UserRepresentation getUserInfo(String realmName, String userUuid) {
        return getKeycloakClient().realm(realmName).users().get(userUuid).toRepresentation();
    }
    
    /**
     *
     * @param serviceName
     * @return
     */
    public List<String> getRealmNames(String serviceName) {
        List<String> resultList = new ArrayList<>();

        Keycloak keycloakClient = getKeycloakClient();

        List<RealmRepresentation> realms = keycloakClient.realms().findAll();

        for (RealmRepresentation realm : realms) {
            String realmName = realm.getRealm();
            List<RoleRepresentation> roles = keycloakClient.realm(realmName).roles().list();

            for (RoleRepresentation role : roles) {
                if (serviceName.equals(role.getName())) {
                    resultList.add(realmName);
                }
            }
        }

        return resultList;
    }
    
}

