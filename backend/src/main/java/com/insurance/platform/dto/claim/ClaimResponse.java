package com.insurance.platform.dto.claim;

import com.insurance.platform.entity.enums.ClaimStatus;
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
public class ClaimResponse {
    private Long id;
    private Long policyId;
    private String policyNumber;
    private String customerName;
    private String description;
    private BigDecimal claimAmount;
    private LocalDate dateOfIncident;
    private ClaimStatus claimStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
