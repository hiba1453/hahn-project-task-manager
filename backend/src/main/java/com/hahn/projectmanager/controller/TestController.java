package com.hahn.projectmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/public/ping")
    public String ping() {
        return "pong";
    }
}
