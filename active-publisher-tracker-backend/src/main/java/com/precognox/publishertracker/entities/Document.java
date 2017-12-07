package com.precognox.publishertracker.entities;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Document {

    @Id
    private Integer id;

    private String title;

    private String pageUrl;
    
    private String documentUrl;

    private LocalDateTime providedDate;

    @ManyToOne
    @JoinColumn(name = "update_id")
    private Update update;

}
