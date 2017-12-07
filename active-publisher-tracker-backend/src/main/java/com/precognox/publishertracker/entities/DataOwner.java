package com.precognox.publishertracker.entities;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class DataOwner {

    @Id
    private Integer id;

    private String shortName;

    private String longName;

    private float weight;

    private String description;

    private String uuid;

    @OneToMany(mappedBy = "dataOwner", fetch = FetchType.EAGER)
    private List<DataOwnerEmail> emails;
    
    @OneToMany(mappedBy = "dataOwner", fetch = FetchType.EAGER)
    private List<Update> updates;
    
    @PrePersist
    public void generateUuid() {
        uuid = UUID.randomUUID().toString();
    }

}
