package com.shopverse.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String name,
        @Email(message = "Enter a valid email") @NotBlank String email,
        @Size(min = 6, message = "Password must be at least 6 characters")
        @Pattern(regexp = ".*[A-Za-z].*", message = "Password must include a letter")
        @Pattern(regexp = ".*\\d.*", message = "Password must include a number")
        String password,
        String phone,
        String address
) {
}
