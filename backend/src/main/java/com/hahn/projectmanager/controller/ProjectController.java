package com.hahn.projectmanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hahn.projectmanager.dto.ProjectCreateRequest;
import com.hahn.projectmanager.dto.ProjectUpdateRequest;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.service.ProjectService;
import com.hahn.projectmanager.service.CurrentUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final CurrentUserService currentUserService;


    @PostMapping
    public Project createProject(@RequestBody @Valid ProjectCreateRequest request) {
        return projectService.createProject(currentUserService.getIdOrThrow(), request);
    }

    @GetMapping
    public List<Project> getMyProjects() {
        return projectService.getMyProjects(currentUserService.getIdOrThrow());
    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return projectService.getMyProjectById(currentUserService.getIdOrThrow(), id);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody @Valid ProjectUpdateRequest request) {
        return projectService.updateMyProject(currentUserService.getIdOrThrow(), id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteMyProject(currentUserService.getIdOrThrow(), id);
    }
}