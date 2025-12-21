package com.hahn.projectmanager.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectUpdateRequest(
        @NotBlank String title,
        String description
) {}
