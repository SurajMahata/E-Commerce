package com.shopverse.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartRequest(
        @NotNull Long productId,
        @Min(1) int quantity
) {
}
