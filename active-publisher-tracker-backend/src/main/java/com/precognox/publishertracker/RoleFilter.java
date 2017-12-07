package com.precognox.publishertracker;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.entities.Account;
import org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RoleFilter extends BasicHttpAuthenticationFilter {

    static final String SUBJECT_ID_HEADER_PARAM_NAME = "KEYCLOAK_SUBJECT";

    @Override
    public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedRoles) {
        List<String> roles = new ArrayList<>();

        if (mappedRoles != null) {
            roles = Arrays.asList((String[]) mappedRoles);
        }

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        Account account = Ebean.find(Account.class)
                .where()
                .eq("keycloakSubjectUuid", httpRequest.getHeader(SUBJECT_ID_HEADER_PARAM_NAME))
                .findUnique();

        return account != null && roles.contains(account.getRole().getName());
    }

}
