package com.shopverse.ecommerce.controller;

import com.shopverse.ecommerce.dto.CartRequest;
import com.shopverse.ecommerce.entity.CartItem;
import com.shopverse.ecommerce.service.CartService;
import com.shopverse.ecommerce.service.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @GetMapping
    public Map<String, Object> getCart(Authentication authentication) {
        return cartService.summary(userService.currentUser(authentication));
    }

    @PostMapping
    public CartItem add(@Valid @RequestBody CartRequest request, Authentication authentication) {
        return cartService.addToCart(userService.currentUser(authentication), request);
    }

    @PatchMapping("/{itemId}")
    public CartItem update(@PathVariable Long itemId, @RequestParam int quantity, Authentication authentication) {
        return cartService.updateQuantity(userService.currentUser(authentication), itemId, quantity);
    }

    @DeleteMapping("/{itemId}")
    public void remove(@PathVariable Long itemId, Authentication authentication) {
        cartService.remove(userService.currentUser(authentication), itemId);
    }

    @DeleteMapping
    public void clear(Authentication authentication) {
        cartService.clear(userService.currentUser(authentication));
    }
}
