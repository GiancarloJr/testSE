package com.br.task.service;

import com.br.task.dto.response.PageResponse;
import com.br.task.model.Task;
import com.br.task.model.User;
import com.br.task.model.enums.TaskStatus;
import com.br.task.dto.request.TaskRequest;
import com.br.task.dto.response.TaskResponse;
import com.br.task.exception.ResourceNotFoundException;
import com.br.task.mapper.TaskMapper;
import com.br.task.repository.TaskRepository;
import com.br.task.repository.UserRepository;
import com.br.task.repository.spec.TaskSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    @Transactional
    public TaskResponse create(TaskRequest request, Long userId) {
        log.info("Creating task for user ID: {} with title: {}", userId, request.title());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Task task = taskMapper.toEntity(request);
        task.setUser(user);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse update(Long taskId, TaskRequest request, Long userId) {
        log.info("Updating task ID: {} for user ID: {}", taskId, userId);
        Task task = findTaskByIdAndUser(taskId, userId);
        taskMapper.updateEntityFromRequest(request, task);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public void delete(Long taskId, Long userId) {
        log.info("Deleting task ID: {} for user ID: {}", taskId, userId);
        Task task = findTaskByIdAndUser(taskId, userId);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long taskId, Long userId) {
        log.info("Finding task ID: {} for user ID: {}", taskId, userId);
        Task task = findTaskByIdAndUser(taskId, userId);
        return taskMapper.toResponse(task);
    }

    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> findAll(Long userId, TaskStatus status, LocalDateTime finishDate, Pageable pageable) {
        log.info("Finding all tasks for user ID: {}", userId);
        Page<Task> taskPage = taskRepository.findAll(
                TaskSpecification.withFilters(userId, status, finishDate),
                pageable
        );

        return taskMapper.toPageResponse(taskPage);
    }

    @Transactional(readOnly = true)
    public Task findTaskByIdAndUser(Long taskId, Long userId) {
        log.info("Finding task ID: {} for user ID: {}", taskId, userId);
        return taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found for user with ID Task: " + taskId + " and ID User: " + userId));
    }
}
