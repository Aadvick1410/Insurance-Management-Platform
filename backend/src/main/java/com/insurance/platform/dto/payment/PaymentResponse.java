package com.insurance.platform.dto.payment;

import com.insurance.platform.entity.enums.PaymentStatus;
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
public class PaymentResponse {
    private Long id;
    private Long policyId;
    private String policyNumber;
    private String customerName;
    private LocalDate paymentDate;
    private BigDecimal amount;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
}
