package eu.basora.circulation.application;

public class BorrowLimitExceededException extends RuntimeException {
    public BorrowLimitExceededException() {
        super("Active borrowing limit reached for your membership level");
    }
}
