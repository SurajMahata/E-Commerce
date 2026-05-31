package com.shopverse.ecommerce.service;

import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.entity.WishlistItem;
import com.shopverse.ecommerce.exception.ApiException;
import com.shopverse.ecommerce.repository.ProductRepository;
import com.shopverse.ecommerce.repository.WishlistItemRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class WishlistService {
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistItemRepository wishlistItemRepository, ProductRepository productRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
    }

    public List<WishlistItem> findWishlist(User user) {
        return wishlistItemRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public WishlistItem add(User user, Long productId) {
        if (productId == null) {
            throw new ApiException("Product is required", HttpStatus.BAD_REQUEST);
        }
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        return wishlistItemRepository.findByUserAndProduct(user, product).orElseGet(() -> {
            WishlistItem item = new WishlistItem();
            item.setUser(user);
            item.setProduct(product);
            return wishlistItemRepository.save(item);
        });
    }

    public void remove(User user, Long itemId) {
        WishlistItem item = wishlistItemRepository.findByIdAndUser(itemId, user)
                .orElseThrow(() -> new ApiException("Wishlist item not found", HttpStatus.NOT_FOUND));
        wishlistItemRepository.delete(item);
    }
}
