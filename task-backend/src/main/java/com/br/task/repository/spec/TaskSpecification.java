package com.br.task.repository.spec;

import com.br.task.model.Task;
import com.br.task.model.enums.TaskStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class TaskSpecification {

    private TaskSpecification() {
    }

    public static Specification<Task> withFilters(Long userId, TaskStatus status, LocalDateTime finishDate) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (finishDate != null) {
                predicates.add(cb.lessThan(root.get("finishDate"), finishDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
