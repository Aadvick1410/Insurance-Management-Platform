package com.insurance.platform.config;

import com.insurance.platform.entity.User;
import com.insurance.platform.entity.enums.Role;
import com.insurance.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData() {
        return args -> {
            // Create Admin if not exists
            if (!userRepository.existsByEmail("admin@insurance.com")) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@insurance.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                log.info("✅ Seeded ADMIN user: admin@insurance.com / admin123");
            }

            // Create Agent if not exists
            if (!userRepository.existsByEmail("agent@insurance.com")) {
                User agent = new User();
                agent.setName("Agent Smith");
                agent.setEmail("agent@insurance.com");
                agent.setPassword(passwordEncoder.encode("agent123"));
                agent.setRole(Role.AGENT);
                userRepository.save(agent);
                log.info("✅ Seeded AGENT user: agent@insurance.com / agent123");
            }

            // Create Customer if not exists
            if (!userRepository.existsByEmail("customer@insurance.com")) {
                User customer = new User();
                customer.setName("John Doe");
                customer.setEmail("customer@insurance.com");
                customer.setPassword(passwordEncoder.encode("customer123"));
                customer.setRole(Role.CUSTOMER);
                userRepository.save(customer);
                log.info("✅ Seeded CUSTOMER user: customer@insurance.com / customer123");
            }
        };
    }
}
