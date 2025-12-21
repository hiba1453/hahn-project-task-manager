package com.hahn.projectmanager.service;

import java.util.List;

import com.hahn.projectmanager.dto.ProjectCreateRequest;
import com.hahn.projectmanager.dto.ProjectUpdateRequest;
import com.hahn.projectmanager.entity.Project;

public interface ProjectService {
    Project createProject(Long userId, ProjectCreateRequest req);
    List<Project> getMyProjects(Long userId);
    Project getMyProjectById(Long userId, Long projectId);
    Project updateMyProject(Long userId, Long projectId, ProjectUpdateRequest req);
    void deleteMyProject(Long userId, Long projectId);
}
