package com.shopverse.ecommerce.controller;

import com.shopverse.ecommerce.dto.UpdatePasswordRequest;
import com.shopverse.ecommerce.dto.UpdateProfileRequest;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.service.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public User me(Authentication authentication) {
        return userService.currentUser(authentication);
    }

    @PutMapping("/me")
    public User updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateProfile(authentication, request);
    }

    @PutMapping("/password")
    public Map<String, String> updatePassword(
            Authentication authentication,
            @Valid @RequestBody UpdatePasswordRequest request
    ) {
        userService.updatePassword(authentication, request);
        return Map.of("message", "Password updated successfully");
    }
}
