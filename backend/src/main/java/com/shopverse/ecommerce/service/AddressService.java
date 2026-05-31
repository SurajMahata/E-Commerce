package com.shopverse.ecommerce.service;

import com.shopverse.ecommerce.dto.AddressRequest;
import com.shopverse.ecommerce.entity.Address;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.exception.ApiException;
import com.shopverse.ecommerce.repository.AddressRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> findAddresses(User user) {
        return addressRepository.findByUserOrderByDefaultAddressDescCreatedAtDesc(user);
    }

    @Transactional
    public Address addAddress(User user, AddressRequest request) {
        Address address = new Address();
        address.setUser(user);
        apply(address, request);

        if (request.defaultAddress() || findAddresses(user).isEmpty()) {
            clearDefault(user);
            address.setDefaultAddress(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(User user, Long addressId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ApiException("Address not found", HttpStatus.NOT_FOUND));
        apply(address, request);

        if (request.defaultAddress()) {
            clearDefault(user);
            address.setDefaultAddress(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ApiException("Address not found", HttpStatus.NOT_FOUND));
        boolean wasDefault = address.isDefaultAddress();
        addressRepository.delete(address);

        if (wasDefault) {
            findAddresses(user).stream().findFirst().ifPresent(next -> {
                next.setDefaultAddress(true);
                addressRepository.save(next);
            });
        }
    }

    @Transactional
    public Address setDefault(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ApiException("Address not found", HttpStatus.NOT_FOUND));
        clearDefault(user);
        address.setDefaultAddress(true);
        return addressRepository.save(address);
    }

    private void apply(Address address, AddressRequest request) {
        address.setFullName(request.fullName());
        address.setMobileNumber(request.mobileNumber());
        address.setAddressLine1(request.addressLine1());
        address.setAddressLine2(request.addressLine2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setCountry(request.country());
        address.setPostalCode(request.postalCode());
        address.setDefaultAddress(request.defaultAddress());
    }

    private void clearDefault(User user) {
        for (Address address : addressRepository.findByUserOrderByDefaultAddressDescCreatedAtDesc(user)) {
            if (address.isDefaultAddress()) {
                address.setDefaultAddress(false);
            }
        }
    }
}
