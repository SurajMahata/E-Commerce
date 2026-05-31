package com.shopverse.ecommerce.repository;

import com.shopverse.ecommerce.entity.Address;
import com.shopverse.ecommerce.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserOrderByDefaultAddressDescCreatedAtDesc(User user);

    Optional<Address> findByIdAndUser(Long id, User user);
}
