package com.hahn.projectmanager.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectCreateRequest(
        @NotBlank String title,
        String description
) {}
