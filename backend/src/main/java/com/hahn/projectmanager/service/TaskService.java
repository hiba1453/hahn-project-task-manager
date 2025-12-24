package com.hahn.projectmanager.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.hahn.projectmanager.dto.TaskCreateRequest;
import com.hahn.projectmanager.dto.TaskUpdateRequest;
import com.hahn.projectmanager.entity.Task;

public interface TaskService {

    Task addTask(Long userId, Long projectId, TaskCreateRequest req);

    List<Task> getTasks(Long userId, Long projectId);

    Page<Task> getTasksPaged(Long userId, Long projectId, Pageable pageable);

    Task getTaskById(Long userId, Long projectId, Long taskId);

    Task updateTask(Long userId, Long projectId, Long taskId, TaskUpdateRequest req);

    Task toggleComplete(Long userId, Long projectId, Long taskId);

    void deleteTask(Long userId, Long projectId, Long taskId);
}
