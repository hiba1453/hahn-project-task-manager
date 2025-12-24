package com.hahn.projectmanager.dto;

public record ProjectProgressResponse(
        long projectId,
        long totalTasks,
        long completedTasks,
        int progressPercentage
) {}
