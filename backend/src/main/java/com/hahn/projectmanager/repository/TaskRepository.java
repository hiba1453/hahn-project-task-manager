package com.hahn.projectmanager.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hahn.projectmanager.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);

    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    long countByProjectId(Long projectId);

    long countByProjectIdAndCompletedTrue(Long projectId);
}
