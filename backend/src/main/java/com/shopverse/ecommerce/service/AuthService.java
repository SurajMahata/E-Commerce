package com.shopverse.ecommerce.service;

import com.shopverse.ecommerce.dto.AuthRequest;
import com.shopverse.ecommerce.dto.AuthResponse;
import com.shopverse.ecommerce.dto.RegisterRequest;
import com.shopverse.ecommerce.entity.Role;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.exception.ApiException;
import com.shopverse.ecommerce.repository.UserRepository;
import com.shopverse.ecommerce.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException("Email is already registered", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setRole(Role.USER);
        userRepository.save(user);
        return tokenResponse(user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));
        return tokenResponse(user);
    }

    private AuthResponse tokenResponse(User user) {
        var details = userDetailsService.loadUserByUsername(user.getEmail());
        return new AuthResponse(jwtService.generateToken(details), user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
