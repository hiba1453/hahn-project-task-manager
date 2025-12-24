package com.hahn.projectmanager.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.hahn.projectmanager.dto.ProjectCreateRequest;
import com.hahn.projectmanager.dto.ProjectUpdateRequest;
import com.hahn.projectmanager.entity.Project;

public interface ProjectService {

    Project createProject(Long userId, ProjectCreateRequest req);

    List<Project> getMyProjects(Long userId);

    Page<Project> getMyProjectsPaged(Long userId, Pageable pageable);

    Project getMyProjectById(Long userId, Long projectId);

    Project updateMyProject(Long userId, Long projectId, ProjectUpdateRequest req);

    void deleteMyProject(Long userId, Long projectId);
}
