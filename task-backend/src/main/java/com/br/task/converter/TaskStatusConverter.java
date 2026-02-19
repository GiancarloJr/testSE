package com.br.task.converter;

import com.br.task.model.enums.TaskStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.stream.Stream;

@Converter
public class TaskStatusConverter implements AttributeConverter<TaskStatus, Integer> {

    @Override
    public Integer convertToDatabaseColumn(TaskStatus attribute) {
        return attribute.getCode();
    }

    @Override
    public TaskStatus convertToEntityAttribute(Integer code) {
        return Stream.of(TaskStatus.values())
                .filter(status -> status.getCode() == code)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
