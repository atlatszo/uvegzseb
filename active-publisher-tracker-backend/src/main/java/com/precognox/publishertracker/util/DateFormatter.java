package com.precognox.publishertracker.util;

import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateFormatter {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_DATE;

    public static String formatDate(@NotNull LocalDateTime date) {
        return date.format(FORMATTER);
    }

    private DateFormatter() {
    }

}
