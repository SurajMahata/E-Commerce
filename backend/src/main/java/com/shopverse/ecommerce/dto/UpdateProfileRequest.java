package com.shopverse.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record UpdateProfileRequest(
        @NotBlank(message = "Name is required")
        String name,

        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,15}$", message = "Enter a valid phone number")
        String phone,

        String gender,
        LocalDate dateOfBirth,
        String profileImageUrl
) {
}
