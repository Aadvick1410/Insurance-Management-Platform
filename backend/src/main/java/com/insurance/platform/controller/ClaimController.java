package com.insurance.platform.controller;

import com.insurance.platform.dto.claim.ClaimRequest;
import com.insurance.platform.dto.claim.ClaimResponse;
import com.insurance.platform.entity.enums.ClaimStatus;
import com.insurance.platform.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ClaimResponse> createClaim(@Valid @RequestBody ClaimRequest request) {
        return new ResponseEntity<>(claimService.createClaim(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<Page<ClaimResponse>> getAllClaims(Pageable pageable) {
        return ResponseEntity.ok(claimService.getAllClaims(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ClaimResponse> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @GetMapping("/policy/{policyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<List<ClaimResponse>> getClaimsByPolicy(@PathVariable Long policyId) {
        return ResponseEntity.ok(claimService.getClaimsByPolicy(policyId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<ClaimResponse> updateClaimStatus(@PathVariable Long id, @RequestParam ClaimStatus status) {
        return ResponseEntity.ok(claimService.updateClaimStatus(id, status));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ClaimResponse> updateClaimDetails(@PathVariable Long id, @Valid @RequestBody ClaimRequest request) {
        return ResponseEntity.ok(claimService.updateClaimDetails(id, request));
    }
}
