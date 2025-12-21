package com.hahn.projectmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hahn.projectmanager.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    long countByProjectId(Long projectId);

    long countByProjectIdAndCompletedTrue(Long projectId);
}
