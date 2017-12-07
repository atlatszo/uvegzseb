package com.precognox.publishertracker.beans;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

@Data
public class CreateAccountRequest {
    
    private String email;
        
    private String password;

    @NotBlank(message = "Role must not be empty")
    private String role;

}
