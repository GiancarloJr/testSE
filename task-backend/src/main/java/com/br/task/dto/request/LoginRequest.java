package com.br.task.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record LoginRequest(
        @NotEmpty(message = "Email cannot be empty")
        @Email(message = "Invalid email")
        String email,

        @NotEmpty(message = "Password cannot be empty")
        String password
) {}
