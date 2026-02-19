package com.br.task.service;

import com.br.task.dto.response.DashboardResponse;
import com.br.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getResume() {
        log.info("Getting all tasks for dashboard");
        return taskRepository.getResume();
    }

    @Transactional(readOnly = true)
    public DashboardResponse getResumeByUser(Long userId) {
        log.info("Getting tasks for user ID: {} for dashboard", userId);
        return taskRepository.getResumeByUserId(userId);
    }

}
