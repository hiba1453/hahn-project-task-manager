package com.hahn.projectmanager.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hahn.projectmanager.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId);

    Page<Project> findByOwnerId(Long ownerId, Pageable pageable);
}
