package com.precognox.publishertracker.beans;

import lombok.Data;

import java.util.List;

@Data
public class ListScraperAccountsResult {

    private int totalCount;
    private List<ScraperAccountRB> accounts;

}
