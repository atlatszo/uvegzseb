package com.precognox.publishertracker.entities;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Data
@Entity
public class Account {

    public enum Roles {
        ADMIN, CONFIGURATOR, API_USER, DISABLED_API_USER
    }

    @Id
    private Integer id;

    private String keycloakSubjectUuid;

    private LocalDateTime lastLoginDate;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    private LocalDateTime deletedAt;

}
