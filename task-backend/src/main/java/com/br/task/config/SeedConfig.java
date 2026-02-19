package com.br.task.config;

import com.br.task.model.User;
import com.br.task.model.enums.Role;
import com.br.task.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class SeedConfig {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin.email:admin@local.com}")
    private String adminEmail;

    @Value("${app.seed.admin.password:admin}")
    private String adminPassword;

    @Bean
    ApplicationRunner seedAdminRunner() {
        return args -> seedAdmin();
    }

    @Transactional
    void seedAdmin() {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .name("Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .roles(Set.of(Role.ROLE_ADMIN))
                .build();

        userRepository.save(admin);
    }
}