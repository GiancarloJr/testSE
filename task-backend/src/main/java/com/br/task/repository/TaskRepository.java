package com.br.task.repository;

import com.br.task.dto.response.DashboardResponse;
import com.br.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    @Query(value = """
                select
                  count(*) as total,
                  sum(case when t.status = 1 then 1 else 0 end) as open,
                  sum(case when t.status = 2 then 1 else 0 end) as prevent,
                  sum(case when t.status = 3 then 1 else 0 end) as inProgress,
                  sum(case when t.status = 4 then 1 else 0 end) as closed
                from tasks t
            """, nativeQuery = true)
    DashboardResponse getResume();

    @Query(value = """
                select
                  count(*) as total,
                  sum(case when t.status = 1 then 1 else 0 end) as open,
                  sum(case when t.status = 2 then 1 else 0 end) as prevent,
                  sum(case when t.status = 3 then 1 else 0 end) as inProgress,
                  sum(case when t.status = 4 then 1 else 0 end) as closed
                from tasks t
                where t.user_id = :userId
            """, nativeQuery = true)
    DashboardResponse getResumeByUserId(@Param("userId") Long userId);
}
