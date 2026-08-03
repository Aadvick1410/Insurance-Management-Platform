package com.insurance.platform.dto.claim;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaimRequest {

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Claim amount is required")
    @Positive(message = "Claim amount must be positive")
    private BigDecimal claimAmount;

    @NotNull(message = "Date of incident is required")
    private LocalDate dateOfIncident;
}
