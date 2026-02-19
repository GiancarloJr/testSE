package com.br.task.dto.response;

import com.br.task.model.enums.Role;

import java.util.Set;

public record UserResponse(
        Long id,
        String name,
        String email,
        Set<Role> roles
) {}
