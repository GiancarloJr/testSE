package com.br.task.dto.response;

public record DashboardResponse(
        Long total,
        Long open,
        Long prevent,
        Long inProgress,
        Long closed
) {}