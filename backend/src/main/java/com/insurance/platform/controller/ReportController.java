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
        // Typically only Admins and Agents should see global dashboard metrics.
        // Customers would need a specialized dashboard that only aggregates their personal data.
        return ResponseEntity.ok(reportService.getDashboardMetrics());
    }
}
