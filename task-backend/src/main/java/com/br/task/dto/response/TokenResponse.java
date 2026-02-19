package com.br.task.dto.response;

public record TokenResponse(
        String token,
        Long expiresIn
) {
}
