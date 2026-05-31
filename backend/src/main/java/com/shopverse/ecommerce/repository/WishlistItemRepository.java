package com.shopverse.ecommerce.repository;

import com.shopverse.ecommerce.entity.Product;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.entity.WishlistItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserOrderByCreatedAtDesc(User user);

    Optional<WishlistItem> findByUserAndProduct(User user, Product product);

    Optional<WishlistItem> findByIdAndUser(Long id, User user);
}
