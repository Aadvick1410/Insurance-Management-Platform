package com.insurance.platform.controller;

import com.insurance.platform.dto.policy.PolicyRequest;
import com.insurance.platform.dto.policy.PolicyResponse;
import com.insurance.platform.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<PolicyResponse> createPolicy(@Valid @RequestBody PolicyRequest request) {
        return new ResponseEntity<>(policyService.createPolicy(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<Page<PolicyResponse>> getAllPolicies(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) com.insurance.platform.entity.enums.PolicyStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(policyService.getAllPolicies(search, status, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<PolicyResponse> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<PolicyResponse> updatePolicy(@PathVariable Long id, @Valid @RequestBody PolicyRequest request) {
        return ResponseEntity.ok(policyService.updatePolicy(id, request));
    }

    @PutMapping("/{id}/renew")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<PolicyResponse> renewPolicy(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.renewPolicy(id));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelPolicy(@PathVariable Long id) {
        policyService.cancelPolicy(id);
        return ResponseEntity.noContent().build();
    }
}
