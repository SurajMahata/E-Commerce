package com.shopverse.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
        @Email(message = "Enter a valid email") @NotBlank String email,
        @NotBlank String password
) {
}
