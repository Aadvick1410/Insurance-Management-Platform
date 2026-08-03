package com.insurance.platform.service;

import com.insurance.platform.dto.auth.AuthResponse;
import com.insurance.platform.dto.auth.LoginRequest;
import com.insurance.platform.dto.auth.RegisterRequest;
import com.insurance.platform.entity.User;
import com.insurance.platform.entity.Customer;
import com.insurance.platform.entity.enums.Role;
import com.insurance.platform.repository.CustomerRepository;
import com.insurance.platform.repository.UserRepository;
import com.insurance.platform.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public String register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());

        User savedUser = userRepository.save(user);

        // If the role is CUSTOMER, create a linked Customer profile
        if (registerRequest.getRole() == Role.CUSTOMER) {
            Customer customer = new Customer();
            customer.setUser(savedUser);
            customer.setName(savedUser.getName());
            customer.setEmail(savedUser.getEmail());
            customerRepository.save(customer);
        }

        return "User registered successfully!";
    }
}
