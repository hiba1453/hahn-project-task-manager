package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.AuthResponse;
import com.hahn.projectmanager.dto.LoginRequest;
import com.hahn.projectmanager.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
