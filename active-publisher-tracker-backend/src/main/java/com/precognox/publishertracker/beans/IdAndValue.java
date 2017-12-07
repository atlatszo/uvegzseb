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
public class IdAndValue {
    
    private int id;
    private String value;
    
}
