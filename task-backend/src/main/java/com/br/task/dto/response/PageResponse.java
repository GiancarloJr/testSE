package com.br.task.dto.response;

import java.util.List;

public record PageResponse<T>(
        List<T> data,
        PageMeta meta
) {
    public record PageMeta(
            int page,
            int size,
            long totalElements,
            int totalPages
    ) {}
}

