package com.br.task.security;

import com.br.task.model.User;
import com.br.task.model.enums.Role;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;
    private SecretKey secretKey;

    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final Long EXPIRATION = 86400000L;

    @BeforeEach
    void setUp() {
        secretKey = new SecretKeySpec(SECRET.getBytes(), "HmacSHA256");
        OctetSequenceKey jwk = new OctetSequenceKey.Builder(secretKey)
                .algorithm(JWSAlgorithm.HS256)
                .build();
        ImmutableJWKSet<SecurityContext> jwkSet = new ImmutableJWKSet<>(new JWKSet(jwk));
        JwtEncoder encoder = new NimbusJwtEncoder(jwkSet);

        jwtService = new JwtService(encoder, EXPIRATION);
    }

    @Test
    void generateToken_shouldReturnValidJwt() {
        var user = User.builder()
                .id(1L)
                .email("john@test.com")
                .roles(Set.of(Role.ROLE_USER))
                .build();

        String token = jwtService.generateToken(user);

        assertThat(token).isNotBlank();

        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKey).build();
        Jwt jwt = decoder.decode(token);

        assertThat(jwt.getSubject()).isEqualTo("1");
        assertThat((String) jwt.getClaim("email")).isEqualTo("john@test.com");
        assertThat(jwt.getClaimAsStringList("roles")).contains("ROLE_USER");
    }

    @Test
    void generateToken_shouldIncludeMultipleRoles() {
        var user = User.builder()
                .id(2L)
                .email("admin@test.com")
                .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER))
                .build();

        String token = jwtService.generateToken(user);

        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKey).build();
        Jwt jwt = decoder.decode(token);

        assertThat(jwt.getClaimAsStringList("roles")).containsExactlyInAnyOrder("ROLE_ADMIN", "ROLE_USER");
    }

    @Test
    void getExpiration_shouldReturnConfiguredValue() {
        assertThat(jwtService.getExpiration()).isEqualTo(EXPIRATION);
    }
}
