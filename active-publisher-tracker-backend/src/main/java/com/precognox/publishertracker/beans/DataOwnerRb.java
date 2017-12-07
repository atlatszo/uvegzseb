package com.precognox.publishertracker.beans;

import lombok.Data;

import java.util.List;

/**
 *
 * @author precognox
 */
@Data
public class DataOwnerRb {
    private int id;
    private String uuid;
    private String shortName;
    private String longName;
    private Float weight;
    private List<String> emails;
    private String description;
    private DataOwnerDetailRb detail;
}
