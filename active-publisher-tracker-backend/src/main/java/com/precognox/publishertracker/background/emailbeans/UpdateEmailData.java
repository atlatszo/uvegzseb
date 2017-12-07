package com.precognox.publishertracker.background.emailbeans;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UpdateEmailData {

    private String dataOwnerLongName;
    private String date;
    private List<EmailDocumentData> documentList = new ArrayList<>();

}
