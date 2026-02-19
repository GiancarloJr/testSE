package com.br.task.service;

import com.br.task.dto.response.DashboardResponse;
import com.br.task.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getResume_shouldReturnGlobalDashboard() {
        DashboardResponse expected = mock(DashboardResponse.class);
        when(taskRepository.getResume()).thenReturn(expected);

        DashboardResponse result = dashboardService.getResume();

        assertThat(result).isEqualTo(expected);
        verify(taskRepository).getResume();
    }

    @Test
    void getResumeByUser_shouldReturnUserDashboard() {
        DashboardResponse expected = mock(DashboardResponse.class);
        when(taskRepository.getResumeByUserId(1L)).thenReturn(expected);

        DashboardResponse result = dashboardService.getResumeByUser(1L);

        assertThat(result).isEqualTo(expected);
        verify(taskRepository).getResumeByUserId(1L);
    }
}
