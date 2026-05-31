package com.shopverse.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AddressRequest(
        @NotBlank(message = "Full name is required")
        String fullName,

        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[0-9+\\-\\s]{7,15}$", message = "Enter a valid mobile number")
        String mobileNumber,

        @NotBlank(message = "Address line 1 is required")
        String addressLine1,

        String addressLine2,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "State is required")
        String state,

        @NotBlank(message = "Country is required")
        String country,

        @NotBlank(message = "Postal code is required")
        String postalCode,

        boolean defaultAddress
) {
}
