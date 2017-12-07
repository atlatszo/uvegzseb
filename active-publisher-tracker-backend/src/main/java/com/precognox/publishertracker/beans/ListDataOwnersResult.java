package com.precognox.publishertracker.beans;

import lombok.Data;

import java.util.List;

/**
 *
 * @author precognox
 */
@Data
public class ListDataOwnersResult {
    
    private int totalCount;
    private List<DataOwnerRb> dataOwners;
}
