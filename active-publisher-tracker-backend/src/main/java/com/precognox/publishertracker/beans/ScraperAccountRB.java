package com.precognox.publishertracker.beans;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ScraperAccountRB {

    private int id;
    private String apiUserName;
    private boolean disabled;
    private String error;
    private String lastHarvestDate;
    private List<HarvestDetails> lastHarvestData = new ArrayList<>();

}
