package com.shopverse.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
        @NotBlank(message = "Current password is required")
        String currentPassword,

        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "New password must be at least 8 characters")
        @Pattern(regexp = ".*[A-Z].*", message = "New password must include one uppercase letter")
        @Pattern(regexp = ".*[a-z].*", message = "New password must include one lowercase letter")
        @Pattern(regexp = ".*\\d.*", message = "New password must include one number")
        @Pattern(regexp = ".*[^A-Za-z0-9].*", message = "New password must include one special character")
        String newPassword,

        @NotBlank(message = "Confirm password is required")
        String confirmNewPassword
) {
}
