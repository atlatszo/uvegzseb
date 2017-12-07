package com.precognox.publishertracker.beans;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 *
 * @author precognox
 */
@Getter
@Setter
public class ScrapedDataRB {
    
    private String dataOwnerUuid;
    private Integer category;
    private List<ScrapedDataDetailRB> details;
}
