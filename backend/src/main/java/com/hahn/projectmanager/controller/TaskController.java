package com.hahn.projectmanager.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import com.hahn.projectmanager.dto.TaskCreateRequest;
import com.hahn.projectmanager.dto.TaskUpdateRequest;
import com.hahn.projectmanager.entity.Task;
import com.hahn.projectmanager.service.CurrentUserService;
import com.hahn.projectmanager.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public Task addTask(
            @PathVariable Long projectId,
            @RequestBody @Valid TaskCreateRequest request
    ) {
        return taskService.addTask(currentUserService.getIdOrThrow(), projectId, request);
    }

    @GetMapping
    public List<Task> getTasks(@PathVariable Long projectId) {
        return taskService.getTasks(currentUserService.getIdOrThrow(), projectId);
    }

    @GetMapping("/paged")
    public Page<Task> getTasksPaged(
            @PathVariable Long projectId,
            Pageable pageable
    ) {
        return taskService.getTasksPaged(currentUserService.getIdOrThrow(), projectId, pageable);
    }

    @GetMapping("/{taskId}")
    public Task getTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId
    ) {
        return taskService.getTaskById(currentUserService.getIdOrThrow(), projectId, taskId);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody @Valid TaskUpdateRequest request
    ) {
        return taskService.updateTask(currentUserService.getIdOrThrow(), projectId, taskId, request);
    }

    @PatchMapping("/{taskId}/toggle")
    public Task toggleTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId
    ) {
        return taskService.toggleComplete(currentUserService.getIdOrThrow(), projectId, taskId);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId
    ) {
        taskService.deleteTask(currentUserService.getIdOrThrow(), projectId, taskId);
    }
}
