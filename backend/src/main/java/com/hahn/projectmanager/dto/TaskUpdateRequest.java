package com.hahn.projectmanager.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;

public record TaskUpdateRequest(
        @NotBlank String title,
        String description,
        LocalDate dueDate
) {}
