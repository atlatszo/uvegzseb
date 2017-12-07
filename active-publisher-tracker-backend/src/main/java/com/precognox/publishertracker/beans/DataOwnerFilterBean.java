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
public class DataOwnerFilterBean {
    private int start;
    private int rows;
    private String nameFragment;
    private Integer crawlerUserId;
    private String error;
}
