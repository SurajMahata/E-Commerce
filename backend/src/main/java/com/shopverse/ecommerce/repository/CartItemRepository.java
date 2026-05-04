package com.shopverse.ecommerce.repository;

import com.shopverse.ecommerce.entity.CartItem;
import com.shopverse.ecommerce.entity.Product;
import com.shopverse.ecommerce.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    void deleteByUser(User user);
}
