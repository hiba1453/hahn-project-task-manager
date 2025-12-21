package com.hahn.projectmanager.service.impl;

import java.util.List;

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

    @Override
    public Task addTask(Long userId, Long projectId, TaskCreateRequest req) {
        Project p = getProjectOwnedByUser(userId, projectId);

        Task t = new Task();
        t.setTitle(req.title());
        t.setDescription(req.description());
        t.setDueDate(req.dueDate());
        t.setCompleted(false);
        t.setProject(p);

        return taskRepository.save(t);
    }

    @Override
    public List<Task> getTasks(Long userId, Long projectId) {
        Project p = getProjectOwnedByUser(userId, projectId);
        return taskRepository.findByProjectId(p.getId());
    }

    @Override
    public Task updateTask(Long userId, Long projectId, Long taskId, TaskUpdateRequest req) {
        Task t = getTaskOwnedByUser(userId, projectId, taskId);

        t.setTitle(req.title());
        t.setDescription(req.description());
        t.setDueDate(req.dueDate());

        return taskRepository.save(t);
    }

    @Override
    public Task toggleComplete(Long userId, Long projectId, Long taskId) {
        Task t = getTaskOwnedByUser(userId, projectId, taskId);
        t.setCompleted(!t.isCompleted());
        return taskRepository.save(t);
    }

    @Override
    public void deleteTask(Long userId, Long projectId, Long taskId) {
        Task t = getTaskOwnedByUser(userId, projectId, taskId);
        taskRepository.delete(t);
    }

    @Override
    public Task getTaskById(Long userId, Long projectId, Long taskId) {
    return getTaskOwnedByUser(userId, projectId, taskId);
}


    // ---------------- helpers ----------------

    private Project getProjectOwnedByUser(Long userId, Long projectId) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (p.getOwner() == null || p.getOwner().getId() == null || !p.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You don't own this project");
        }
        return p;
    }

    private Task getTaskOwnedByUser(Long userId, Long projectId, Long taskId) {
        Task t = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (t.getProject() == null || t.getProject().getId() == null || !t.getProject().getId().equals(projectId)) {
            throw new EntityNotFoundException("Task not in this project");
        }

        Project p = t.getProject();
        if (p.getOwner() == null || p.getOwner().getId() == null || !p.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You don't own this project");
        }
        return t;
    }
}
