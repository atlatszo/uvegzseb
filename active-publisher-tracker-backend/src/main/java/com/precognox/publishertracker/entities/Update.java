package com.precognox.publishertracker.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="updates")
public class Update {

    @Id
    private Integer id;

    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "data_owner_id")
    private DataOwner dataOwner;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account account;
    
    @OneToMany(mappedBy = "update", fetch = FetchType.EAGER)
    private List<Document> documents;

    @PrePersist
    public void setDate() {
        if (date == null) {
            date = LocalDateTime.now();
        }
    }

}
