package com.precognox.publishertracker.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author precognox
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataOwnerUpdateRequest {
    
    @Size(max=255, message="The shortName field must be less than {max} characters" )
    private String shortName;
    
    @NotBlank
    @Size(max=255, message="The longName field must be less than {max} characters")
    private String longName;
    
    private Float weight;
    
    @NotEmpty
    private List<String> emails = new ArrayList<>();
    
    @Size(max=5000, message="The description field must be less than {max} characters")
    private String description;

}
