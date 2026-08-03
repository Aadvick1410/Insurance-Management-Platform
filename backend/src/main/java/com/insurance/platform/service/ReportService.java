package com.insurance.platform.service;

import com.insurance.platform.dto.report.DashboardMetricsResponse;
import com.insurance.platform.entity.Claim;
import com.insurance.platform.entity.Policy;
import com.insurance.platform.entity.PremiumPayment;
import com.insurance.platform.entity.enums.ClaimStatus;
import com.insurance.platform.entity.enums.PaymentStatus;
import com.insurance.platform.entity.enums.PolicyStatus;
import com.insurance.platform.repository.ClaimRepository;
import com.insurance.platform.repository.CustomerRepository;
import com.insurance.platform.repository.PolicyRepository;
import com.insurance.platform.repository.PremiumPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final PremiumPaymentRepository paymentRepository;

    public DashboardMetricsResponse getDashboardMetrics() {
        long totalCustomers = customerRepository.count();
        
        List<Policy> allPolicies = policyRepository.findAll();
        long activePolicies = allPolicies.stream()
                .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                .count();

        Map<String, Long> policiesByType = allPolicies.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getPolicyType().name(),
                        Collectors.counting()
                ));

        List<Claim> allClaims = claimRepository.findAll();
        long pendingClaims = allClaims.stream()
                .filter(c -> c.getClaimStatus() == ClaimStatus.PENDING)
                .count();

        Map<String, Long> claimsByStatus = allClaims.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getClaimStatus().name(),
                        Collectors.counting()
                ));

        List<PremiumPayment> allPayments = paymentRepository.findAll();
        
        BigDecimal totalRevenue = allPayments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.PAID)
                .map(PremiumPayment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        long overduePayments = allPayments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.OVERDUE)
                .count();

        return DashboardMetricsResponse.builder()
                .totalCustomers(totalCustomers)
                .totalActivePolicies(activePolicies)
                .totalPendingClaims(pendingClaims)
                .totalRevenue(totalRevenue)
                .policiesByType(policiesByType)
                .claimsByStatus(claimsByStatus)
                .totalOverduePayments(overduePayments)
                .build();
    }
}
