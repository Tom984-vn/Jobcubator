package org.jobcubator.jobcubator.exception;

import java.io.Serializable;

public record ApiErrorResponse(int status, String message){
}
