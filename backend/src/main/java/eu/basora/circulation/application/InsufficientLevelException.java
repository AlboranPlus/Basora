package eu.basora.circulation.application;

public class InsufficientLevelException extends RuntimeException {
    public InsufficientLevelException(String msg) {
        super(msg);
    }
}
