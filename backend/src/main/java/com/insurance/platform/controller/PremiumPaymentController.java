package com.insurance.platform.controller;

import com.insurance.platform.dto.payment.PaymentRequest;
import com.insurance.platform.dto.payment.PaymentResponse;
import com.insurance.platform.service.PremiumPaymentService;
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
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PremiumPaymentController {

    private final PremiumPaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<PaymentResponse> recordPayment(@Valid @RequestBody PaymentRequest request) {
        // In a real scenario, you'd verify if the CUSTOMER recording this payment actually owns the policy.
        return new ResponseEntity<>(paymentService.recordPayment(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(Pageable pageable) {
        return ResponseEntity.ok(paymentService.getAllPayments(pageable));
    }

    @GetMapping("/policy/{policyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory(@PathVariable Long policyId) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(policyId));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<List<PaymentResponse>> getOverduePayments() {
        return ResponseEntity.ok(paymentService.getOverduePayments());
    }

    @GetMapping("/due-soon")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<List<PaymentResponse>> getPaymentsDueSoon(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(paymentService.getPaymentsDueSoon(days));
    }
}
