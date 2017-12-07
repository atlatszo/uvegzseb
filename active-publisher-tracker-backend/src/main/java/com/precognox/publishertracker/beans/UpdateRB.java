package com.precognox.publishertracker.beans;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 *
 * @author precognox
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRB {
    private String dataOwnerName;
    private String updateDate;
    private String categoryName;
    private List<UpdateDetailsRB> details;
}
