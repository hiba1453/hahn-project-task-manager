package com.hahn.projectmanager.service.impl;

import org.springframework.stereotype.Service;

import com.hahn.projectmanager.dto.ProgressResponse;
import com.hahn.projectmanager.repository.TaskRepository;
import com.hahn.projectmanager.service.ProgressService;
import com.hahn.projectmanager.service.ProjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    @Override
    public ProgressResponse getProgress(Long userId, Long projectId) {
        projectService.getMyProjectById(userId, projectId);

        long total = taskRepository.countByProjectId(projectId);
        long done = taskRepository.countByProjectIdAndCompletedTrue(projectId);
        double pct = (total == 0) ? 0.0 : (done * 100.0 / total);

        return new ProgressResponse(projectId, total, done, pct);
    }
}
