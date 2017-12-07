package com.precognox.publishertracker.beans;

import lombok.Data;

@Data
public class AccountRB {

    private int id;
    private String email;
    private String lastLoginDate;
    private String role;

}
