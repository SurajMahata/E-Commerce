package com.shopverse.ecommerce.controller;

import com.shopverse.ecommerce.dto.AddressRequest;
import com.shopverse.ecommerce.entity.Address;
import com.shopverse.ecommerce.service.AddressService;
import com.shopverse.ecommerce.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    private final AddressService addressService;
    private final UserService userService;

    public AddressController(AddressService addressService, UserService userService) {
        this.addressService = addressService;
        this.userService = userService;
    }

    @GetMapping
    public List<Address> all(Authentication authentication) {
        return addressService.findAddresses(userService.currentUser(authentication));
    }

    @PostMapping
    public Address add(@Valid @RequestBody AddressRequest request, Authentication authentication) {
        return addressService.addAddress(userService.currentUser(authentication), request);
    }

    @PutMapping("/{id}")
    public Address update(@PathVariable Long id, @Valid @RequestBody AddressRequest request, Authentication authentication) {
        return addressService.updateAddress(userService.currentUser(authentication), id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication authentication) {
        addressService.deleteAddress(userService.currentUser(authentication), id);
    }

    @PatchMapping("/{id}/default")
    public Address setDefault(@PathVariable Long id, Authentication authentication) {
        return addressService.setDefault(userService.currentUser(authentication), id);
    }
}
