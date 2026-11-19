
package com.mona.ems.exception;

import java.util.Map;

public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private Map<String, String> details;

    // Constructor for normal errors
    public ErrorResponse(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.details = null;
    }

    // Constructor for validation errors
    public ErrorResponse(
            int status,
            String error,
            String message,
            Map<String, String> details) {

        this.status = status;
        this.error = error;
        this.message = message;
        this.details = details;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public Map<String, String> getDetails() {
        return details;
    }
}
