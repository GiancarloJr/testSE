package com.br.task.service;

import com.br.task.model.User;
import com.br.task.model.enums.Role;
import com.br.task.dto.request.LoginRequest;
import com.br.task.dto.request.RegisterRequest;
import com.br.task.dto.response.TokenResponse;
import com.br.task.dto.response.UserResponse;
import com.br.task.exception.BusinessException;
import com.br.task.mapper.UserMapper;
import com.br.task.repository.UserRepository;
import com.br.task.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public TokenResponse login(LoginRequest request) {
        log.info("Authenticating user with email: {}", request.email());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("User not found with email: " + request.email() + "."));

        String token = jwtService.generateToken(user);
        return new TokenResponse(token, jwtService.getExpiration());
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.email());
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("E-mail already in use: " + request.email() + ".");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .roles(Set.of(Role.ROLE_USER))
                .build();

        return userMapper.toResponse(userRepository.save(user));
    }
}
