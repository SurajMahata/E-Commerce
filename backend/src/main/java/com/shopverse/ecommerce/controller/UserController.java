package com.shopverse.ecommerce.controller;

import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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
}
