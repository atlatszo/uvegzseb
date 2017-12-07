package com.precognox.publishertracker.exceptions;

public class EntityNotFoundException extends ActivePublisherTrackerException {

    public EntityNotFoundException() {
    }

    public EntityNotFoundException(String message) {
        super(message);
    }

}
