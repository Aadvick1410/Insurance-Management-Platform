package com.insurance.platform.service;

import com.insurance.platform.dto.customer.CustomerRequest;
import com.insurance.platform.dto.customer.CustomerResponse;
import com.insurance.platform.entity.Customer;
import com.insurance.platform.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered as a customer");
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setDob(request.getDob());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setEmail(request.getEmail());

        Customer saved = customerRepository.save(customer);
        return mapToResponse(saved);
    }

    public Page<CustomerResponse> getAllCustomers(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return customerRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable)
                    .map(this::mapToResponse);
        }
        return customerRepository.findAll(pageable).map(this::mapToResponse);
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return mapToResponse(customer);
    }

    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        if (!customer.getEmail().equals(request.getEmail()) && customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already used by another customer");
        }

        customer.setName(request.getName());
        customer.setDob(request.getDob());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setEmail(request.getEmail());

        Customer updated = customerRepository.save(customer);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    private CustomerResponse mapToResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .userId(customer.getUser() != null ? customer.getUser().getId() : null)
                .name(customer.getName())
                .dob(customer.getDob())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .email(customer.getEmail())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}
