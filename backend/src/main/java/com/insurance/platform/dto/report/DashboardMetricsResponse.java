package com.insurance.platform.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardMetricsResponse {
    // High-level totals
    private long totalCustomers;
    private long totalActivePolicies;
    private long totalPendingClaims;
    private BigDecimal totalRevenue;

    // Charts/Breakdowns
    private Map<String, Long> policiesByType;
    private Map<String, Long> claimsByStatus;
    
    // Optional additional metrics
    private long totalOverduePayments;
}
