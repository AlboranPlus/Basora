package eu.basora.circulation.application;

import java.util.UUID;

public class CopyNotAvailableException extends RuntimeException {
    public CopyNotAvailableException(UUID copyId) {
        super("Copy is not available: " + copyId);
    }
}
