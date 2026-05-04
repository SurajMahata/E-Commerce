package com.shopverse.ecommerce.repository;

import com.shopverse.ecommerce.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
            String name,
            String category,
            String brand
    );

    List<Product> findByCategoryIgnoreCase(String category);
}
