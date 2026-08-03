package com.insurance.platform.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {
    private Long id;
    private Long userId; // Can be null if the customer doesn't have a login
    private String name;
    private LocalDate dob;
    private String phone;
    private String address;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
