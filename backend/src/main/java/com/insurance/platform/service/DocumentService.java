package com.insurance.platform.service;

import com.insurance.platform.dto.document.DocumentResponse;
import com.insurance.platform.entity.Claim;
import com.insurance.platform.entity.Customer;
import com.insurance.platform.entity.Document;
import com.insurance.platform.entity.Policy;
import com.insurance.platform.repository.ClaimRepository;
import com.insurance.platform.repository.CustomerRepository;
import com.insurance.platform.repository.DocumentRepository;
import com.insurance.platform.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    // Constructor to create the uploads directory if it doesn't exist
    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Transactional
    public DocumentResponse storeDocument(MultipartFile file, String documentType, Long customerId, Long policyId, Long claimId) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Generate unique filename to avoid collisions
            String fileExtension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFileName.substring(i);
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();
            document.setFileName(uniqueFileName);
            document.setFilePath(targetLocation.toString());
            document.setFileType(com.insurance.platform.entity.enums.DocumentType.valueOf(documentType));

            if (customerId != null) {
                Customer customer = customerRepository.findById(customerId)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));
                document.setCustomer(customer);
            }
            if (policyId != null) {
                Policy policy = policyRepository.findById(policyId)
                        .orElseThrow(() -> new RuntimeException("Policy not found"));
                document.setPolicy(policy);
            }
            if (claimId != null) {
                Claim claim = claimRepository.findById(claimId)
                        .orElseThrow(() -> new RuntimeException("Claim not found"));
                document.setClaim(claim);
            }

            Document saved = documentRepository.save(document);
            return mapToResponse(saved);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(Long documentId) {
        try {
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));
            
            Path filePath = this.fileStorageLocation.resolve(document.getFileName()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + document.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found", ex);
        }
    }

    public List<DocumentResponse> getDocumentsByCustomer(Long customerId) {
        return documentRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<DocumentResponse> getDocumentsByPolicy(Long policyId) {
        return documentRepository.findByPolicyId(policyId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<DocumentResponse> getDocumentsByClaim(Long claimId) {
        return documentRepository.findByClaimId(claimId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        
        try {
            Path filePath = this.fileStorageLocation.resolve(document.getFileName()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file", e);
        }
        
        documentRepository.delete(document);
    }

    private DocumentResponse mapToResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .documentType(document.getFileType() != null ? document.getFileType().name() : null)
                .customerId(document.getCustomer() != null ? document.getCustomer().getId() : null)
                .customerName(document.getCustomer() != null ? document.getCustomer().getName() : null)
                .policyId(document.getPolicy() != null ? document.getPolicy().getId() : null)
                .claimId(document.getClaim() != null ? document.getClaim().getId() : null)
                .uploadedAt(document.getUploadedAt())
                .build();
    }
}
