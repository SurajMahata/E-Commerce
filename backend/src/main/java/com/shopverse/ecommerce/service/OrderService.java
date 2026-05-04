package com.shopverse.ecommerce.service;

import com.shopverse.ecommerce.dto.CheckoutRequest;
import com.shopverse.ecommerce.entity.Order;
import com.shopverse.ecommerce.entity.OrderItem;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.exception.ApiException;
import com.shopverse.ecommerce.repository.CartItemRepository;
import com.shopverse.ecommerce.repository.OrderRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public List<Order> findOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Order checkout(User user, CheckoutRequest request) {
        var cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new ApiException("Your cart is empty", HttpStatus.BAD_REQUEST);
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.shippingAddress());
        BigDecimal total = BigDecimal.ZERO;

        for (var cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice());
            order.getItems().add(orderItem);
            total = total.add(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByUser(user);
        return saved;
    }
}
