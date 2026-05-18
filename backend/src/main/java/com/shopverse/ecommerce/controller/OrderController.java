package com.shopverse.ecommerce.controller;

import com.shopverse.ecommerce.dto.CheckoutRequest;
import com.shopverse.ecommerce.entity.Order;
import com.shopverse.ecommerce.service.OrderService;
import com.shopverse.ecommerce.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @GetMapping
    public List<Order> myOrders(Authentication authentication) {
        return orderService.findOrders(userService.currentUser(authentication));
    }

    @PostMapping("/checkout")
    public Order checkout(@Valid @RequestBody CheckoutRequest request, Authentication authentication) {
        return orderService.checkout(userService.currentUser(authentication), request);
    }

    @PatchMapping("/{id}/cancel")
    public Order cancel(@PathVariable Long id, Authentication authentication) {
        return orderService.cancelOrder(id, userService.currentUser(authentication));
    }
}
