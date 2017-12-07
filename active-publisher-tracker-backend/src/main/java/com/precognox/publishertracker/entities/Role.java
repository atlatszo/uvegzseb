package com.precognox.publishertracker.entities;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity
public class Role {

    @Id
    private Integer id;

    private String name;

}
