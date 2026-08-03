package com.insurance.platform.service;

import com.insurance.platform.dto.claim.ClaimRequest;
import com.insurance.platform.dto.claim.ClaimResponse;
import com.insurance.platform.entity.Claim;
import com.insurance.platform.entity.Policy;
import com.insurance.platform.entity.enums.ClaimStatus;
import com.insurance.platform.repository.ClaimRepository;
import com.insurance.platform.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;

    @Transactional
    public ClaimResponse createClaim(ClaimRequest request) {
        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + request.getPolicyId()));

        Claim claim = new Claim();
        claim.setPolicy(policy);
        claim.setDescription(request.getDescription());
        claim.setClaimAmount(request.getClaimAmount());
        claim.setDateOfIncident(request.getDateOfIncident());
        claim.setClaimStatus(ClaimStatus.PENDING); // Default status

        Claim saved = claimRepository.save(claim);
        return mapToResponse(saved);
    }

    public Page<ClaimResponse> getAllClaims(Pageable pageable) {
        return claimRepository.findAll(pageable).map(this::mapToResponse);
    }

    public ClaimResponse getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
        return mapToResponse(claim);
    }

    public List<ClaimResponse> getClaimsByPolicy(Long policyId) {
        if (!policyRepository.existsById(policyId)) {
            throw new RuntimeException("Policy not found with id: " + policyId);
        }
        return claimRepository.findByPolicyId(policyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimResponse updateClaimStatus(Long id, ClaimStatus status) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
        
        claim.setClaimStatus(status);
        Claim updated = claimRepository.save(claim);
        return mapToResponse(updated);
    }
    
    @Transactional
    public ClaimResponse updateClaimDetails(Long id, ClaimRequest request) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
        
        if (claim.getClaimStatus() != ClaimStatus.PENDING) {
             throw new RuntimeException("Only pending claims can be edited");
        }
                
        claim.setDescription(request.getDescription());
        claim.setClaimAmount(request.getClaimAmount());
        claim.setDateOfIncident(request.getDateOfIncident());
        
        Claim updated = claimRepository.save(claim);
        return mapToResponse(updated);
    }

    private ClaimResponse mapToResponse(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId())
                .policyId(claim.getPolicy().getId())
                .policyNumber(claim.getPolicy().getPolicyNumber())
                .customerName(claim.getPolicy().getCustomer().getName())
                .description(claim.getDescription())
                .claimAmount(claim.getClaimAmount())
                .dateOfIncident(claim.getDateOfIncident())
                .claimStatus(claim.getClaimStatus())
                .createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt())
                .build();
    }
}
