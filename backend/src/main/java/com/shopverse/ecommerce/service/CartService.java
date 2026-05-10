package com.shopverse.ecommerce.service;

import com.shopverse.ecommerce.dto.CartRequest;
import com.shopverse.ecommerce.entity.CartItem;
import com.shopverse.ecommerce.entity.Role;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.exception.ApiException;
import com.shopverse.ecommerce.repository.CartItemRepository;
import com.shopverse.ecommerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> findCart(User user) {
        validateCustomer(user);
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(User user, CartRequest request) {
        validateCustomer(user);
        var product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));
        if (product.getStock() < request.quantity()) {
            throw new ApiException("Only " + product.getStock() + " items left in stock", HttpStatus.BAD_REQUEST);
        }
        CartItem item = cartItemRepository.findByUserAndProduct(user, product).orElseGet(CartItem::new);
        int updatedQuantity = item.getId() == null ? request.quantity() : item.getQuantity() + request.quantity();
        if (updatedQuantity > product.getStock()) {
            throw new ApiException("Only " + product.getStock() + " items left in stock", HttpStatus.BAD_REQUEST);
        }
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(updatedQuantity);
        return cartItemRepository.save(item);
    }

    public CartItem updateQuantity(User user, Long itemId, int quantity) {
        validateCustomer(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new ApiException("You cannot update this cart item", HttpStatus.FORBIDDEN);
        }
        if (quantity < 1) {
            throw new ApiException("Quantity must be at least 1", HttpStatus.BAD_REQUEST);
        }
        if (quantity > item.getProduct().getStock()) {
            throw new ApiException("Only " + item.getProduct().getStock() + " items left in stock", HttpStatus.BAD_REQUEST);
        }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void remove(User user, Long itemId) {
        validateCustomer(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new ApiException("You cannot remove this cart item", HttpStatus.FORBIDDEN);
        }
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clear(User user) {
        validateCustomer(user);
        cartItemRepository.deleteByUser(user);
    }

    public Map<String, Object> summary(User user) {
        validateCustomer(user);
        List<CartItem> items = findCart(user);
        BigDecimal total = items.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int count = items.stream().mapToInt(CartItem::getQuantity).sum();
        return Map.of("items", items, "count", count, "total", total);
    }

    private void validateCustomer(User user) {
        if (user.getRole() == Role.ADMIN) {
            throw new ApiException("Admin users cannot use the shopping cart", HttpStatus.FORBIDDEN);
        }
    }
}
