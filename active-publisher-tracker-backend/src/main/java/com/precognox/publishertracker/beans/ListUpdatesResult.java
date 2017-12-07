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
public class ListUpdatesResult {
    
    private int totalCount;
    private List<UpdateRB> updates;
}
