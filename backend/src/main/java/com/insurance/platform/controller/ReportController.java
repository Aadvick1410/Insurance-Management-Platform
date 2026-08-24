package com.insurance.platform.controller;

import com.insurance.platform.dto.report.DashboardMetricsResponse;
import com.insurance.platform.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<DashboardMetricsResponse> getDashboardMetrics() {
        return ResponseEntity.ok(reportService.getDashboardMetrics());
    }

    @GetMapping("/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<byte[]> downloadMonthlyReportPdf() {
        byte[] pdfBytes = reportService.generateMonthlyBusinessReportPdf();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Monthly_Business_Report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
