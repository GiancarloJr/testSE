package com.br.task.mapper;

import com.br.task.dto.response.PageResponse;
import com.br.task.model.Task;
import com.br.task.dto.request.TaskRequest;
import com.br.task.dto.response.TaskResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    TaskResponse toResponse(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Task toEntity(TaskRequest request);

    @Mapping(target = "page", source = "number")
    @Mapping(target = "size", source = "size")
    @Mapping(target = "totalElements", source = "totalElements")
    @Mapping(target = "totalPages", source = "totalPages")
    PageResponse.PageMeta toMeta(Page<?> page);

    default PageResponse<TaskResponse> toPageResponse(Page<Task> page) {
        Page<TaskResponse> dtoPage = page.map(this::toResponse);
        return new PageResponse<>(dtoPage.getContent(), toMeta(page));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(TaskRequest request, @MappingTarget Task task);
}
