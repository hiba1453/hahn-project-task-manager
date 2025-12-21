package com.hahn.projectmanager.dto;

public record ProgressResponse(
        Long projectId,
        long totalTasks,
        long completedTasks,
        double progressPercentage
) {}
