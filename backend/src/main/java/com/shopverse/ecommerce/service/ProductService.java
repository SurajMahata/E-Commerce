package com.shopverse.ecommerce.service;

import com.shopverse.ecommerce.dto.ProductRequest;
import com.shopverse.ecommerce.entity.Product;
import com.shopverse.ecommerce.exception.ApiException;
import com.shopverse.ecommerce.repository.ProductRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll(String query, String category) {
        if (query != null && !query.isBlank()) {
            return productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
                    query,
                    query,
                    query
            );
        }
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));
    }

    public Product create(ProductRequest request) {
        return productRepository.save(toProduct(new Product(), request));
    }

    public Product update(Long id, ProductRequest request) {
        return productRepository.save(toProduct(findById(id), request));
    }

    public void delete(Long id) {
        productRepository.delete(findById(id));
    }

    private Product toProduct(Product product, ProductRequest request) {
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setMrp(request.mrp());
        product.setCategory(request.category());
        product.setBrand(request.brand());
        product.setImageUrl(request.imageUrl());
        product.setRating(request.rating() == 0 ? 4.2 : request.rating());
        product.setStock(request.stock());
        return product;
    }
}
