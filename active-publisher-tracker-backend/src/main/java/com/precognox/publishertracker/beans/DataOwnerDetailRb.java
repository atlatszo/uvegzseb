package com.precognox.publishertracker.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author precognox
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataOwnerDetailRb {
    private String lastSuccessfulHarvestDate;
    private String crawlerName;
    private String error;
}
