package com.insurance.platform.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponse {
    private Long id;
    private String fileName;
    private String documentType;
    private Long customerId;
    private String customerName;
    private Long policyId;
    private Long claimId;
    private LocalDateTime uploadedAt;
}
