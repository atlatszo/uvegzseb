package com.precognox.publishertracker.util;

import com.precognox.publishertracker.exceptions.ActivePublisherTrackerException;
import com.precognox.publishertracker.exceptions.EntityNotFoundException;
import com.precognox.publishertracker.exceptions.NonUniqueEntityException;
import com.precognox.publishertracker.exceptions.NotAuthorizedException;

import javax.ws.rs.core.Response;

public class ExceptionMapper {

    public static Response mapToResponse(ActivePublisherTrackerException ex) {
        if (ex instanceof EntityNotFoundException) {
            return Response.status(Response.Status.NOT_FOUND).entity(ex.getMessage()).build();
        }

        if (ex instanceof NonUniqueEntityException) {
            return Response.status(Response.Status.CONFLICT).entity(ex.getMessage()).build();
        }

        if (ex instanceof NotAuthorizedException) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        throw new IllegalArgumentException("No mapping found for " + ex.toString());
    }

    private ExceptionMapper() {
    }

}
