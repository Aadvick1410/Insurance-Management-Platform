package com.insurance.platform.service;

import com.insurance.platform.dto.policy.PolicyRequest;
import com.insurance.platform.dto.policy.PolicyResponse;
import com.insurance.platform.entity.Customer;
import com.insurance.platform.entity.Policy;
import com.insurance.platform.entity.enums.PolicyStatus;
import com.insurance.platform.repository.CustomerRepository;
import com.insurance.platform.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public PolicyResponse createPolicy(PolicyRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Policy policy = new Policy();
        policy.setCustomer(customer);
        policy.setPolicyType(request.getPolicyType());
        policy.setPremiumAmount(request.getPremiumAmount());
        policy.setStartDate(request.getStartDate());
        policy.setEndDate(request.getEndDate());
        
        // Auto-generate policy number (e.g. POL-UUID)
        policy.setPolicyNumber("POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        // Set initial status
        LocalDate today = LocalDate.now();
        if (today.isBefore(request.getStartDate())) {
            policy.setStatus(PolicyStatus.PENDING_RENEWAL); // could be PENDING_START
        } else if (today.isAfter(request.getEndDate())) {
            policy.setStatus(PolicyStatus.EXPIRED);
        } else {
            policy.setStatus(PolicyStatus.ACTIVE);
        }

        Policy saved = policyRepository.save(policy);
        return mapToResponse(saved);
    }

    public Page<PolicyResponse> getAllPolicies(String search, PolicyStatus status, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return policyRepository.findByPolicyNumberContainingIgnoreCase(search, pageable).map(this::mapToResponse);
        }
        if (status != null) {
            return policyRepository.findByStatus(status, pageable).map(this::mapToResponse);
        }
        return policyRepository.findAll(pageable).map(this::mapToResponse);
    }

    public PolicyResponse getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));
        return mapToResponse(policy);
    }

    @Transactional
    public PolicyResponse updatePolicy(Long id, PolicyRequest request) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        policy.setCustomer(customer);
        policy.setPolicyType(request.getPolicyType());
        policy.setPremiumAmount(request.getPremiumAmount());
        policy.setStartDate(request.getStartDate());
        policy.setEndDate(request.getEndDate());

        Policy updated = policyRepository.save(policy);
        return mapToResponse(updated);
    }

    @Transactional
    public PolicyResponse renewPolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));

        // Basic renewal logic: extend by 1 year
        policy.setEndDate(policy.getEndDate().plusYears(1));
        
        if (LocalDate.now().isBefore(policy.getEndDate())) {
            policy.setStatus(PolicyStatus.ACTIVE);
        }

        Policy updated = policyRepository.save(policy);
        return mapToResponse(updated);
    }

    @Transactional
    public void cancelPolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));
        policy.setStatus(PolicyStatus.CANCELLED);
        policyRepository.save(policy);
    }

    private PolicyResponse mapToResponse(Policy policy) {
        return PolicyResponse.builder()
                .id(policy.getId())
                .customerId(policy.getCustomer().getId())
                .customerName(policy.getCustomer().getName())
                .policyType(policy.getPolicyType())
                .policyNumber(policy.getPolicyNumber())
                .premiumAmount(policy.getPremiumAmount())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .status(policy.getStatus())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }
}
