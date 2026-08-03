package com.insurance.platform.repository;

import com.insurance.platform.entity.Policy;
import com.insurance.platform.entity.enums.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findByPolicyNumber(String policyNumber);
    List<Policy> findByCustomerId(Long customerId);
    List<Policy> findByStatus(PolicyStatus status);
    
    // Search methods
    org.springframework.data.domain.Page<Policy> findByPolicyNumberContainingIgnoreCase(String policyNumber, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Policy> findByStatus(PolicyStatus status, org.springframework.data.domain.Pageable pageable);
}
