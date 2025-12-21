package com.hahn.projectmanager.dto;

public record AuthResponse(
        String token,
        Long userId,
        String email,
        String fullName
) {}
