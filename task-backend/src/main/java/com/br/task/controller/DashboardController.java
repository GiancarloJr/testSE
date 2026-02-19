package com.br.task.controller;

import com.br.task.dto.response.DashboardResponse;
import com.br.task.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/user")
    public ResponseEntity<DashboardResponse> getResumeByUser(JwtAuthenticationToken auth) {
        Long userId = Long.valueOf(auth.getName());
        return ResponseEntity.ok(dashboardService.getResumeByUser(userId));
    }

    @GetMapping("/total")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<DashboardResponse> getResume() {
        return ResponseEntity.ok(dashboardService.getResume());
    }
}
