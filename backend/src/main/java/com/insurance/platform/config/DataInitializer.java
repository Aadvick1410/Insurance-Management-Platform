package com.insurance.platform.config;

import com.insurance.platform.entity.*;
import com.insurance.platform.entity.enums.*;
import com.insurance.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final PremiumPaymentRepository premiumPaymentRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        System.out.println("[DataInitializer] Starting...");
        seedUser("Admin User",    "admin@insurance.com",    "admin123",    Role.ADMIN);
        seedUser("Agent Smith",   "agent@insurance.com",    "agent123",    Role.AGENT);
        
        seedCustomer("John Doe",  "customer@insurance.com", "customer123");
        seedCustomer("Alice Smith", "alice@insurance.com", "customer123");
        seedCustomer("Bob Jones", "bob@insurance.com", "customer123");
        seedCustomer("Eve Adams", "eve@insurance.com", "customer123");
        seedCustomer("Charlie Brown", "charlie@insurance.com", "customer123");

        if (policyRepository.count() == 0) {
            System.out.println("[DataInitializer] Policy count is 0. Generating dummy data...");
            List<Customer> allCustomers = customerRepository.findAll();
            if (!allCustomers.isEmpty()) {
                seedInsuranceData(allCustomers);
            } else {
                System.out.println("[DataInitializer] Error: No customers found to assign policies to!");
            }
        }

        System.out.println("[DataInitializer] Demo data ready.");
    }

    private void seedInsuranceData(List<Customer> customers) {
        PolicyType[] pTypes = PolicyType.values();
        PolicyStatus[] pStatuses = PolicyStatus.values();
        ClaimStatus[] cStatuses = ClaimStatus.values();
        
        for (int i = 0; i < 40; i++) {
            Customer c = customers.get(random.nextInt(customers.size()));
            
            Policy policy = new Policy();
            policy.setCustomer(c);
            policy.setPolicyNumber("POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            policy.setPolicyType(pTypes[random.nextInt(pTypes.length)]);
            policy.setStatus(pStatuses[random.nextInt(pStatuses.length)]);
            policy.setStartDate(LocalDate.now().minusDays(random.nextInt(365)));
            policy.setEndDate(policy.getStartDate().plusYears(1));
            policy.setPremiumAmount(BigDecimal.valueOf(1000 + random.nextInt(9000)));
            policy = policyRepository.save(policy);
            
            int numPayments = random.nextInt(4);
            for (int j = 0; j < numPayments; j++) {
                PremiumPayment pp = new PremiumPayment();
                pp.setPolicy(policy);
                pp.setAmount(policy.getPremiumAmount().divide(BigDecimal.valueOf(12), 2, java.math.RoundingMode.HALF_UP));
                pp.setPaymentDate(LocalDate.now().minusDays(random.nextInt(60)));
                pp.setPaymentStatus(random.nextDouble() > 0.2 ? PaymentStatus.PAID : (random.nextDouble() > 0.5 ? PaymentStatus.PENDING : PaymentStatus.OVERDUE));
                premiumPaymentRepository.save(pp);
            }
            
            if (random.nextDouble() > 0.7) {
                Claim claim = new Claim();
                claim.setPolicy(policy);
                claim.setClaimAmount(BigDecimal.valueOf(500 + random.nextInt(5000)));
                claim.setClaimStatus(cStatuses[random.nextInt(cStatuses.length)]);
                claim.setDateOfIncident(LocalDate.now().minusDays(random.nextInt(100)));
                claim.setDescription("Incident reported for policy " + policy.getPolicyNumber());
                if (claim.getClaimStatus() == ClaimStatus.APPROVED || claim.getClaimStatus() == ClaimStatus.REJECTED) {
                    claim.setReviewedBy("Admin User");
                    claim.setReviewNotes("Review completed.");
                }
                claimRepository.save(claim);
            }
        }
        System.out.println("[DataInitializer] Seeded policies, claims and payments.");
    }

    private void seedUser(String name, String email, String password, Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
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
            customer.setDob(LocalDate.of(1980 + random.nextInt(20), 1 + random.nextInt(12), 1 + random.nextInt(28)));
            customer.setPhone("+1" + (1000000000L + random.nextInt(900000000)));
            customer.setAddress(random.nextInt(999) + " Main St, City");
            customerRepository.save(customer);
        }
    }
}
