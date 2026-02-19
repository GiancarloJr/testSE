package com.br.task.dto.request;

import com.br.task.model.enums.TaskStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record TaskRequest(
        @NotEmpty(message = "Title cannot be empty")
        String title,

        @NotEmpty(message = "Description cannot be empty")
        String description,

        @NotNull(message = "Status cannot be null or empty")
        TaskStatus status,

        @Future(message = "Finish date must be in the future")
        LocalDateTime finishDate
) {}
