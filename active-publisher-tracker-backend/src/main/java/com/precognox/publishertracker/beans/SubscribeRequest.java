package com.precognox.publishertracker.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Email;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscribeRequest {

    @Email(message = "E-mail is not valid")
    @NotNull(message = "E-mail must not be empty")
    private String email;

}
