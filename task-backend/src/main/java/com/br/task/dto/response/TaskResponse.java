package com.br.task.dto.response;

import com.br.task.model.enums.TaskStatus;

import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDateTime finishDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
