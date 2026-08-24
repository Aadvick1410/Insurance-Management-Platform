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

        long expiredPolicies = allPolicies.stream()
                .filter(p -> p.getStatus() == PolicyStatus.EXPIRED)
                .count();

        Map<String, BigDecimal> monthlyRevenue = allPayments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.PAID && p.getPaymentDate() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getPaymentDate().getMonth().name().substring(0, 3) + " " + p.getPaymentDate().getYear(),
                        Collectors.reducing(BigDecimal.ZERO, PremiumPayment::getAmount, BigDecimal::add)
                ));

        return DashboardMetricsResponse.builder()
                .totalCustomers(totalCustomers)
                .totalActivePolicies(activePolicies)
                .totalExpiredPolicies(expiredPolicies)
                .totalPendingClaims(pendingClaims)
                .totalRevenue(totalRevenue)
                .policiesByType(policiesByType)
                .claimsByStatus(claimsByStatus)
                .monthlyRevenue(monthlyRevenue)
                .totalOverduePayments(overduePayments)
                .build();
    }

    public byte[] generateMonthlyBusinessReportPdf() {
        DashboardMetricsResponse metrics = getDashboardMetrics();
        
        try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
            com.lowagie.text.Document document = new com.lowagie.text.Document();
            com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 18);
            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("Monthly Business Report", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(title);
            document.add(new com.lowagie.text.Paragraph(" "));

            com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(2);
            table.setWidthPercentage(100);
            
            table.addCell("Total Customers"); table.addCell(String.valueOf(metrics.getTotalCustomers()));
            table.addCell("Total Active Policies"); table.addCell(String.valueOf(metrics.getTotalActivePolicies()));
            table.addCell("Total Expired Policies"); table.addCell(String.valueOf(metrics.getTotalExpiredPolicies()));
            table.addCell("Total Pending Claims"); table.addCell(String.valueOf(metrics.getTotalPendingClaims()));
            table.addCell("Total Revenue"); table.addCell("$" + metrics.getTotalRevenue());
            table.addCell("Overdue Payments"); table.addCell(String.valueOf(metrics.getTotalOverduePayments()));
            
            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
