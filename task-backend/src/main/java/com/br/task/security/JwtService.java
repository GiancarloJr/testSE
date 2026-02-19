package com.br.task.security;

import com.br.task.model.User;
import com.br.task.model.enums.Role;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Getter
@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    private final Long expiration;

    public JwtService(JwtEncoder jwtEncoder,
                      @Value("${spring.jwt.expiration}") Long expiration) {
        this.jwtEncoder = jwtEncoder;
        this.expiration = expiration;
    }

    public String generateToken(User user) {
        Instant now = Instant.now();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        List<String> roles = user.getRoles().stream()
                .map(Role::name)
                .toList();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("task-api")
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("roles", roles)
                .issuedAt(now)
                .expiresAt(now.plusMillis(expiration))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

}
