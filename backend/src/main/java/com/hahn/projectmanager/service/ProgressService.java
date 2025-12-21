package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.ProgressResponse;

public interface ProgressService {
    ProgressResponse getProgress(Long userId, Long projectId);
}
