package com.precognox.publishertracker.exceptions;

public class NotAuthorizedException extends ActivePublisherTrackerException {

    public NotAuthorizedException() {
    }

    public NotAuthorizedException(String message) {
        super(message);
    }

}
