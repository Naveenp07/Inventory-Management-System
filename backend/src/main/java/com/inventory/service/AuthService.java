package com.inventory.service;

import com.inventory.dto.LoginRequestDTO;
import com.inventory.dto.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO request);
}
