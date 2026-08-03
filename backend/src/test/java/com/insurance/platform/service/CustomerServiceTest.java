package com.insurance.platform.service;

import com.insurance.platform.dto.customer.CustomerRequest;
import com.insurance.platform.dto.customer.CustomerResponse;
import com.insurance.platform.entity.Customer;
import com.insurance.platform.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private CustomerRequest customerRequest;
    private Customer customer;

    @BeforeEach
    void setUp() {
        customerRequest = new CustomerRequest();
        customerRequest.setName("John Doe");
        customerRequest.setEmail("john@example.com");
        customerRequest.setPhone("1234567890");
        customerRequest.setAddress("123 Main St");
        customerRequest.setDob(LocalDate.of(1990, 1, 1));

        customer = new Customer();
        customer.setId(1L);
        customer.setName("John Doe");
        customer.setEmail("john@example.com");
        customer.setPhone("1234567890");
        customer.setAddress("123 Main St");
        customer.setDob(LocalDate.of(1990, 1, 1));
    }

    @Test
    void createCustomer_Success() {
        when(customerRepository.existsByEmail(anyString())).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        CustomerResponse response = customerService.createCustomer(customerRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John Doe", response.getName());
        assertEquals("john@example.com", response.getEmail());

        verify(customerRepository, times(1)).existsByEmail(anyString());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void createCustomer_EmailAlreadyExists_ThrowsException() {
        when(customerRepository.existsByEmail(anyString())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            customerService.createCustomer(customerRequest);
        });

        assertEquals("Email is already registered as a customer", exception.getMessage());
        verify(customerRepository, times(1)).existsByEmail(anyString());
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void getCustomerById_Success() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        CustomerResponse response = customerService.getCustomerById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John Doe", response.getName());

        verify(customerRepository, times(1)).findById(1L);
    }

    @Test
    void getCustomerById_NotFound_ThrowsException() {
        when(customerRepository.findById(2L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            customerService.getCustomerById(2L);
        });

        assertEquals("Customer not found with id: 2", exception.getMessage());
        verify(customerRepository, times(1)).findById(2L);
    }
}
