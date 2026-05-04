package com.shopverse.ecommerce.dto;

import com.shopverse.ecommerce.entity.Role;

public record AuthResponse(
        String token,
        Long id,
        String name,
        String email,
        Role role
) {
}
