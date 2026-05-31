package com.shopverse.ecommerce.controller;

import com.shopverse.ecommerce.entity.WishlistItem;
import com.shopverse.ecommerce.service.UserService;
import com.shopverse.ecommerce.service.WishlistService;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserService userService;

    public WishlistController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    @GetMapping
    public List<WishlistItem> all(Authentication authentication) {
        return wishlistService.findWishlist(userService.currentUser(authentication));
    }

    @PostMapping
    public WishlistItem add(@RequestBody Map<String, Long> request, Authentication authentication) {
        return wishlistService.add(userService.currentUser(authentication), request.get("productId"));
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id, Authentication authentication) {
        wishlistService.remove(userService.currentUser(authentication), id);
    }
}
