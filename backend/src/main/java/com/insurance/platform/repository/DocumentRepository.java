package com.insurance.platform.repository;

import com.insurance.platform.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByCustomerId(Long customerId);
    List<Document> findByClaimId(Long claimId);
    List<Document> findByPolicyId(Long policyId);
}
