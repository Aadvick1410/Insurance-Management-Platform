package com.insurance.platform.config;

import com.insurance.platform.entity.Customer;
import com.insurance.platform.entity.User;
import com.insurance.platform.entity.enums.Role;
import com.insurance.platform.repository.CustomerRepository;
import com.insurance.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds demo accounts into the database on startup if they don't already exist.
 * This ensures the demo credentials shown on the login page actually work in production.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("Admin User",    "admin@insurance.com",    "admin123",    Role.ADMIN);
        seedUser("Agent Smith",   "agent@insurance.com",    "agent123",    Role.AGENT);
        seedCustomer("John Doe",  "customer@insurance.com", "customer123");
        System.out.println("[DataInitializer] Demo accounts ready.");
    }

    private void seedUser(String name, String email, String password, Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
            System.out.println("[DataInitializer] Created user: " + email);
        }
    }

    private void seedCustomer(String name, String email, String password) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(Role.CUSTOMER);
            User savedUser = userRepository.save(user);

            Customer customer = new Customer();
            customer.setUser(savedUser);
            customer.setName(name);
            customer.setEmail(email);
            customerRepository.save(customer);
            System.out.println("[DataInitializer] Created customer: " + email);
        }
    }
}
