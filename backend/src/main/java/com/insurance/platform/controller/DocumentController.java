package com.insurance.platform.controller;

import com.insurance.platform.dto.document.DocumentResponse;
import com.insurance.platform.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "customerId", required = false) Long customerId,
            @RequestParam(value = "policyId", required = false) Long policyId,
            @RequestParam(value = "claimId", required = false) Long claimId) {
            
        DocumentResponse response = documentService.storeDocument(file, documentType, customerId, policyId, claimId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(documentService.getDocumentsByCustomer(customerId));
    }

    @GetMapping("/policy/{policyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByPolicy(@PathVariable Long policyId) {
        return ResponseEntity.ok(documentService.getDocumentsByPolicy(policyId));
    }

    @GetMapping("/claim/{claimId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(documentService.getDocumentsByClaim(claimId));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Resource resource = documentService.loadFileAsResource(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
