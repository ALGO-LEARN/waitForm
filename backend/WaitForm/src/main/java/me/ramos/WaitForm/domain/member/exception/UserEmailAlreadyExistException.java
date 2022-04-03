package me.ramos.WaitForm.domain.member.exception;

import me.ramos.WaitForm.global.error.ErrorCode;
import me.ramos.WaitForm.global.error.exception.BusinessException;

public class UserEmailAlreadyExistException extends BusinessException {
    public UserEmailAlreadyExistException() {
        super(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    }
}
