package com.br.task.service;

import com.br.task.dto.request.TaskRequest;
import com.br.task.dto.response.PageResponse;
import com.br.task.dto.response.TaskResponse;
import com.br.task.exception.ResourceNotFoundException;
import com.br.task.mapper.TaskMapper;
import com.br.task.model.Task;
import com.br.task.model.User;
import com.br.task.repository.TaskRepository;
import com.br.task.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskService taskService;

    @Test
    void create_shouldReturnTaskResponse() {
        var user = mock(User.class);
        var request = mock(TaskRequest.class);
        var task = mock(Task.class);
        var savedTask = mock(Task.class);
        var expected = mock(TaskResponse.class);

        when(expected.id()).thenReturn(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskMapper.toEntity(request)).thenReturn(task);
        when(taskRepository.save(task)).thenReturn(savedTask);
        when(taskMapper.toResponse(savedTask)).thenReturn(expected);

        TaskResponse result = taskService.create(request, 1L);

        assertThat(result.id()).isEqualTo(1L);
        verify(taskRepository).save(task);
    }

    @Test
    void create_shouldThrow_whenUserNotFound() {
        var request = mock(TaskRequest.class);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.create(request, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }


    @Test
    void update_shouldReturnUpdatedTask() {
        var task = mock(Task.class, RETURNS_DEEP_STUBS);
        var request = mock(TaskRequest.class);
        var expected = mock(TaskResponse.class);

        when(expected.title()).thenReturn("Teste 1");

        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(expected);

        TaskResponse result = taskService.update(1L, request, 1L);

        assertThat(result.title()).isEqualTo("Teste 1");
        verify(taskMapper).updateEntityFromRequest(request, task);
    }

    @Test
    void update_shouldThrow_whenTaskNotFound() {
        var request = mock(TaskRequest.class);
        when(taskRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.update(99L, request, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_shouldThrow_whenTaskNotFoundOrBelongsToAnotherUser() {
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.delete(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_shouldDeleteTask() {
        var task = mock(Task.class, RETURNS_DEEP_STUBS);

        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(task));

        taskService.delete(1L, 1L);

        verify(taskRepository).delete(task);
    }


    @Test
    void findById_shouldReturnTask() {
        var task = mock(Task.class, RETURNS_DEEP_STUBS);
        var expected = mock(TaskResponse.class);

        when(expected.id()).thenReturn(1L);
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(task));
        when(taskMapper.toResponse(task)).thenReturn(expected);

        TaskResponse result = taskService.findById(1L, 1L);

        assertThat(result.id()).isEqualTo(1L);
    }

    @Test
    void findById_shouldThrow_whenNotFound() {

        assertThatThrownBy(() -> taskService.findById(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void findAll_shouldReturnPageResponse() {
        var task = mock(Task.class, RETURNS_DEEP_STUBS);
        var taskResponse = mock(TaskResponse.class);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> page = new PageImpl<>(List.of(task), pageable, 1);
        var expectedPage = new PageResponse<>(
                List.of(taskResponse),
                new PageResponse.PageMeta(0, 10, 1, 1)
        );

        when(taskRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(taskMapper.toPageResponse(page)).thenReturn(expectedPage);

        PageResponse<TaskResponse> result = taskService.findAll(1L, null, null, pageable);

        assertThat(result.data()).hasSize(1);
        assertThat(result.meta().totalElements()).isEqualTo(1);
    }
}
