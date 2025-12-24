package com.hahn.projectmanager.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hahn.projectmanager.dto.ProjectCreateRequest;
import com.hahn.projectmanager.dto.ProjectUpdateRequest;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.exception.AccessDeniedException;
import com.hahn.projectmanager.repository.ProjectRepository;
import com.hahn.projectmanager.repository.UserRepository;
import com.hahn.projectmanager.service.ProjectService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public Project createProject(Long userId, ProjectCreateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Project p = Project.builder()
                .title(req.title())
                .description(req.description())
                .owner(user)
                .build();

        return projectRepository.save(p);
    }

    @Override
    public List<Project> getMyProjects(Long userId) {
        return projectRepository.findByOwnerId(userId);
    }

    @Override
    public Page<Project> getMyProjectsPaged(Long userId, Pageable pageable) {
        return projectRepository.findByOwnerId(userId, pageable);
    }

    @Override
    public Project getMyProjectById(Long userId, Long projectId) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (!p.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("Access denied");
        }
        return p;
    }

    @Override
    public Project updateMyProject(Long userId, Long projectId, ProjectUpdateRequest req) {
        Project p = getMyProjectById(userId, projectId);
        p.setTitle(req.title());
        p.setDescription(req.description());
        return projectRepository.save(p);
    }

    @Override
    public void deleteMyProject(Long userId, Long projectId) {
        Project p = getMyProjectById(userId, projectId);
        projectRepository.delete(p);
    }
}
