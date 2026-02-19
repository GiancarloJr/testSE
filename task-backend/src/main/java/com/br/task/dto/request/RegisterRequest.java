package com.br.task.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotEmpty(message = "Name cannot be empty")
        @Size(max = 150)
        String name,

        @NotEmpty(message = "Email cannot be empty")
        @Email(message = "Invalid email")
        String email,

        @NotEmpty(message = "Password cannot be empty")
        String password
) {}
