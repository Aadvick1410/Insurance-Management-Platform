package com.insurance.platform.repository;

import com.insurance.platform.entity.Claim;
import com.insurance.platform.entity.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByPolicyId(Long policyId);
    List<Claim> findByStatus(ClaimStatus status);
}
