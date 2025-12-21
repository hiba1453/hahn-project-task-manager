package com.hahn.projectmanager.service;

import java.util.List;

import com.hahn.projectmanager.dto.TaskCreateRequest;
import com.hahn.projectmanager.dto.TaskUpdateRequest;
import com.hahn.projectmanager.entity.Task;

public interface TaskService {
    Task addTask(Long userId, Long projectId, TaskCreateRequest req);
    Task getTaskById(Long userId, Long projectId, Long taskId);
    List<Task> getTasks(Long userId, Long projectId);
    Task updateTask(Long userId, Long projectId, Long taskId, TaskUpdateRequest req);
    Task toggleComplete(Long userId, Long projectId, Long taskId);
    void deleteTask(Long userId, Long projectId, Long taskId);
}
