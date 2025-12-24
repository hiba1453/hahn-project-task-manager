package com.hahn.projectmanager.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hahn.projectmanager.dto.TaskCreateRequest;
import com.hahn.projectmanager.dto.TaskUpdateRequest;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.Task;
import com.hahn.projectmanager.exception.AccessDeniedException;
import com.hahn.projectmanager.repository.ProjectRepository;
import com.hahn.projectmanager.repository.TaskRepository;
import com.hahn.projectmanager.service.TaskService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    private Project checkProject(Long userId, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (!project.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("Access denied");
        }
        return project;
    }

    @Override
    public Task addTask(Long userId, Long projectId, TaskCreateRequest req) {
        Project project = checkProject(userId, projectId);

        Task task = Task.builder()
                .title(req.title())
                .description(req.description())
                .dueDate(req.dueDate())
                .completed(false)
                .project(project)
                .build();

        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasks(Long userId, Long projectId) {
        checkProject(userId, projectId);
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public Page<Task> getTasksPaged(Long userId, Long projectId, Pageable pageable) {
        checkProject(userId, projectId);
        return taskRepository.findByProjectId(projectId, pageable);
    }

    @Override
    public Task getTaskById(Long userId, Long projectId, Long taskId) {
        checkProject(userId, projectId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        // sécurité: vérifier que la task appartient bien au project demandé
        if (!task.getProject().getId().equals(projectId)) {
            throw new AccessDeniedException("Access denied");
        }

        return task;
    }

    @Override
    public Task updateTask(Long userId, Long projectId, Long taskId, TaskUpdateRequest req) {
        Task task = getTaskById(userId, projectId, taskId);
        task.setTitle(req.title());
        task.setDescription(req.description());
        task.setDueDate(req.dueDate());
        return taskRepository.save(task);
    }

    @Override
    public Task toggleComplete(Long userId, Long projectId, Long taskId) {
        Task task = getTaskById(userId, projectId, taskId);
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long userId, Long projectId, Long taskId) {
        taskRepository.delete(getTaskById(userId, projectId, taskId));
    }
}
