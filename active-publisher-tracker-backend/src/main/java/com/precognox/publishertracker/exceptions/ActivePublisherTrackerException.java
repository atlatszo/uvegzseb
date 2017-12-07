package com.precognox.publishertracker.exceptions;

/**
 * Parent for the other exceptions (for type safety).
 */
public class ActivePublisherTrackerException extends RuntimeException {

    public ActivePublisherTrackerException() {
    }

    public ActivePublisherTrackerException(String message) {
        super(message);
    }

}
