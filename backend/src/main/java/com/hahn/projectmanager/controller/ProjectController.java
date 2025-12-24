package com.hahn.projectmanager.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hahn.projectmanager.dto.ProgressResponse;
import com.hahn.projectmanager.dto.ProjectCreateRequest;
import com.hahn.projectmanager.dto.ProjectUpdateRequest;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.service.CurrentUserService;
import com.hahn.projectmanager.service.ProgressService;
import com.hahn.projectmanager.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ProgressService progressService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public Project createProject(@RequestBody @Valid ProjectCreateRequest request) {
        return projectService.createProject(currentUserService.getIdOrThrow(), request);
    }

    @GetMapping
    public List<Project> getMyProjects() {
        return projectService.getMyProjects(currentUserService.getIdOrThrow());
    }

    @GetMapping("/paged")
    public Page<Project> getMyProjectsPaged(Pageable pageable) {
        return projectService.getMyProjectsPaged(currentUserService.getIdOrThrow(), pageable);
    }

    @GetMapping("/{projectId:\\d+}/progress")
    public ProgressResponse getProjectProgress(@PathVariable Long projectId) {
        return progressService.getProgress(currentUserService.getIdOrThrow(), projectId);
    }

    @GetMapping("/{id:\\d+}")
    public Project getProject(@PathVariable Long id) {
        return projectService.getMyProjectById(currentUserService.getIdOrThrow(), id);
    }

    @PutMapping("/{id:\\d+}")
    public Project updateProject(@PathVariable Long id, @RequestBody @Valid ProjectUpdateRequest request) {
        return projectService.updateMyProject(currentUserService.getIdOrThrow(), id, request);
    }

    @DeleteMapping("/{id:\\d+}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteMyProject(currentUserService.getIdOrThrow(), id);
    }
}
