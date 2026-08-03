package com.insurance.platform.service;

import com.insurance.platform.dto.payment.PaymentRequest;
import com.insurance.platform.dto.payment.PaymentResponse;
import com.insurance.platform.entity.Policy;
import com.insurance.platform.entity.PremiumPayment;
import com.insurance.platform.entity.enums.PaymentStatus;
import com.insurance.platform.repository.PolicyRepository;
import com.insurance.platform.repository.PremiumPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PremiumPaymentService {

    private final PremiumPaymentRepository paymentRepository;
    private final PolicyRepository policyRepository;

    @Transactional
    public PaymentResponse recordPayment(PaymentRequest request) {
        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + request.getPolicyId()));

        PremiumPayment payment = new PremiumPayment();
        payment.setPolicy(policy);
        payment.setPaymentDate(request.getPaymentDate());
        payment.setAmount(request.getAmount());
        payment.setPaymentStatus(request.getPaymentStatus());

        PremiumPayment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(this::mapToResponse);
    }
    
    public List<PaymentResponse> getPaymentHistory(Long policyId) {
        if (!policyRepository.existsById(policyId)) {
            throw new RuntimeException("Policy not found with id: " + policyId);
        }
        return paymentRepository.findByPolicyId(policyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getOverduePayments() {
        return paymentRepository.findByPaymentStatus(PaymentStatus.OVERDUE).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<PaymentResponse> getPaymentsDueSoon(int days) {
        // Simplified approach: find PENDING payments where date is within X days
        LocalDate futureDate = LocalDate.now().plusDays(days);
        LocalDate today = LocalDate.now();
        
        return paymentRepository.findByPaymentStatus(PaymentStatus.PENDING).stream()
                .filter(p -> !p.getPaymentDate().isBefore(today) && !p.getPaymentDate().isAfter(futureDate))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(PremiumPayment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .policyId(payment.getPolicy().getId())
                .policyNumber(payment.getPolicy().getPolicyNumber())
                .customerName(payment.getPolicy().getCustomer().getName())
                .paymentDate(payment.getPaymentDate())
                .amount(payment.getAmount())
                .paymentStatus(payment.getPaymentStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
