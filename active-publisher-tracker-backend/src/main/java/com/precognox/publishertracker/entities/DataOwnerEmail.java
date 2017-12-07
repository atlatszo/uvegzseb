package com.precognox.publishertracker.entities;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Getter
@Setter
@Entity
public class DataOwnerEmail {

    @Id
    private Integer id;

    private String email;

    @ManyToOne
    @JoinColumn(name = "data_owner_id")
    private DataOwner dataOwner;

}
