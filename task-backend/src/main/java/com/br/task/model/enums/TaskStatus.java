package com.br.task.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;

public enum TaskStatus {
    OPEN(1),
    PREVENT(2),
    IN_PROGRESS(3),
    CLOSED(4);

    @Getter
    private final int code;

    TaskStatus(int code) {
        this.code = code;
    }

    @JsonCreator
    public static TaskStatus from(String value) {
        if (value == null) return null;
        String v = value.trim();
        if (v.isEmpty()) return null;
        return TaskStatus.valueOf(v.toUpperCase());
    }
}
