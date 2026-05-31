package com.shopverse.ecommerce.service;

import com.shopverse.ecommerce.dto.UpdatePasswordRequest;
import com.shopverse.ecommerce.dto.UpdateProfileRequest;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.exception.ApiException;
import com.shopverse.ecommerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User currentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    @Transactional
    public User updateProfile(Authentication authentication, UpdateProfileRequest request) {
        User user = currentUser(authentication);
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setGender(request.gender());
        user.setDateOfBirth(request.dateOfBirth());
        user.setProfileImageUrl(request.profileImageUrl());
        return userRepository.save(user);
    }

    @Transactional
    public void updatePassword(Authentication authentication, UpdatePasswordRequest request) {
        User user = currentUser(authentication);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new ApiException("Current password is incorrect", HttpStatus.BAD_REQUEST);
        }

        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new ApiException("Confirm password must match the new password", HttpStatus.BAD_REQUEST);
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new ApiException("New password must be different from the current password", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
