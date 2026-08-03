package com.insurance.platform.dto.policy;

import com.insurance.platform.entity.enums.PolicyStatus;
import com.insurance.platform.entity.enums.PolicyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private PolicyType policyType;
    private String policyNumber;
    private BigDecimal premiumAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private PolicyStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
