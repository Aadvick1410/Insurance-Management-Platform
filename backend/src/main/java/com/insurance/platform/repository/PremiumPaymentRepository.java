package com.insurance.platform.repository;

import com.insurance.platform.entity.PremiumPayment;
import com.insurance.platform.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PremiumPaymentRepository extends JpaRepository<PremiumPayment, Long> {
    List<PremiumPayment> findByPolicyId(Long policyId);
    List<PremiumPayment> findByPaymentStatus(PaymentStatus status);
}
