package com.br.task.controller;

import com.br.task.dto.response.PageResponse;
import com.br.task.model.enums.TaskStatus;
import com.br.task.dto.request.TaskRequest;
import com.br.task.dto.response.TaskResponse;
import com.br.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request,
                                               JwtAuthenticationToken auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.create(request, getUserId(auth)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody TaskRequest request,
                                               JwtAuthenticationToken auth) {
        return ResponseEntity.ok(taskService.update(id, request, getUserId(auth)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, JwtAuthenticationToken auth) {
        taskService.delete(id, getUserId(auth));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> findById(@PathVariable Long id, JwtAuthenticationToken auth) {
        return ResponseEntity.ok(taskService.findById(id, getUserId(auth)));
    }

    @GetMapping
    public ResponseEntity<PageResponse<TaskResponse>> findAll(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) LocalDateTime finishDate,
            @PageableDefault Pageable pageable,
            JwtAuthenticationToken auth
    ) {
        PageResponse<TaskResponse> response = taskService.findAll(getUserId(auth), status, finishDate, pageable);
        return ResponseEntity.ok(response);
    }


    private Long getUserId(JwtAuthenticationToken auth) {
        return Long.valueOf(auth.getName());
    }
}
