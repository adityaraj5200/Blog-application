package com.codewithaditya.blog.service;

import com.codewithaditya.blog.dto.AuthRequest;
import com.codewithaditya.blog.dto.AuthResponse;
import com.codewithaditya.blog.dto.RegisterRequest;
import com.codewithaditya.blog.model.User;
import com.codewithaditya.blog.repository.UserRepository;
import com.codewithaditya.blog.security.CustomUserDetailsService;
import com.codewithaditya.blog.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        // Validate password
        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        // Check username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        // Check email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Validate email format
        if (!isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .build();
        
        userRepository.save(user);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        log.info("Attempting login for user: {}", request.getUsername());
        
        // First check if user exists
        if (!userRepository.existsByUsername(request.getUsername())) {
            log.error("Login failed: User not found - {}", request.getUsername());
            throw new UsernameNotFoundException("User not found");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            log.info("Authentication successful for user: {}", request.getUsername());
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            var jwtToken = jwtService.generateToken(userDetails);
            log.info("JWT token generated for user: {}", request.getUsername());
            
            return AuthResponse.builder()
                    .token(jwtToken)
                    .username(request.getUsername())
                    .build();
        } catch (BadCredentialsException e) {
            log.error("Login failed: Invalid password for user - {}", request.getUsername());
            throw new BadCredentialsException("Invalid password");
        } catch (Exception e) {
            log.error("Login failed for user: {} - Error: {}", request.getUsername(), e.getMessage());
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    private boolean isValidEmail(String email) {
        // Basic email validation regex
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return email != null && email.matches(emailRegex);
    }
} 