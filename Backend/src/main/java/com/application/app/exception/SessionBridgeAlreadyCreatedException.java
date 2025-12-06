package com.application.app.exception;

public class SessionBridgeAlreadyCreatedException extends RuntimeException {
    public SessionBridgeAlreadyCreatedException(String message) {
        super(message);
    }
}
