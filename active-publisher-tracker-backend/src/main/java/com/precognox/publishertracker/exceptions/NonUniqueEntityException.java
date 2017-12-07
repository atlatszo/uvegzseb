package com.precognox.publishertracker.exceptions;

public class NonUniqueEntityException extends ActivePublisherTrackerException {

    public NonUniqueEntityException() {
    }

    public NonUniqueEntityException(String message) {
        super(message);
    }

}
