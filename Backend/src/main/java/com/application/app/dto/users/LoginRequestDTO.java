package com.application.app.dto.users;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String password;
}
