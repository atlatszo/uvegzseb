package com.precognox.publishertracker.beans;

import com.precognox.publishertracker.util.ValidationPatterns;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Pattern;

/**
 *
 * @author precognox
 */
@Getter
@Setter
public class ScrapedDataDetailRB {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Page url is required")
    private String pageUrl;
    
    @NotBlank(message = "Document url is required")
    private String documentUrl;
    
    @NotBlank(message = "Provided date is required")
    @Pattern(regexp = ValidationPatterns.ISO_DATE_PATTERN, message = "provided date should be matched with pattern: yyyy-MM-ddThh:mm:ss.SSS")
    private String providedDate;
    
}
