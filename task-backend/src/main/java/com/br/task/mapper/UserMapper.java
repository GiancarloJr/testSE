package com.br.task.mapper;

import com.br.task.model.User;
import com.br.task.dto.response.UserResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}
