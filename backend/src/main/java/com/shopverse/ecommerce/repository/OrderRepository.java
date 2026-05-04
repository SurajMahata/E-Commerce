package com.shopverse.ecommerce.repository;

import com.shopverse.ecommerce.entity.Order;
import com.shopverse.ecommerce.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
