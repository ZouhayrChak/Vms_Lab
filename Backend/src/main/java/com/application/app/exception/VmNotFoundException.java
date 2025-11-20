package com.application.app.exception;

public class VmNotFoundException extends RuntimeException {
    public VmNotFoundException(String message) {
        super(message);
    }
}
