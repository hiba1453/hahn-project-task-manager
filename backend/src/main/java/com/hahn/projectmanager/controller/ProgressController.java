package com.hahn.projectmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hahn.projectmanager.dto.ProgressResponse;
import com.hahn.projectmanager.service.ProgressService;
import com.hahn.projectmanager.service.CurrentUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects/{projectId}/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final CurrentUserService currentUserService;


    @GetMapping
    public ProgressResponse getProgress(@PathVariable Long projectId) {
        return progressService.getProgress(currentUserService.getIdOrThrow(), projectId);
    }
}