package com.precognox.publishertracker.beans;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

import java.util.List;

@Data
public class EmailDeliveryRequest {

    @NotBlank(message = "Sender address must not be empty")
    private String senderAddress;

    private String replyTo;

    @NotEmpty(message = "To address list must not be empty")
    private List<String> toAddressList;

    private List<String> ccAddressList;

    private List<String> bccAddressList;

    private String subject;

    private String body;

}