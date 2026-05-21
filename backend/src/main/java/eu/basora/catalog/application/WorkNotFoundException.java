package eu.basora.catalog.application;

import java.util.UUID;

public class WorkNotFoundException extends RuntimeException {
    public WorkNotFoundException(UUID id) {
        super("Work not found: " + id);
    }
}
