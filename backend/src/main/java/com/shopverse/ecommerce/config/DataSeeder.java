package com.shopverse.ecommerce.config;

import com.shopverse.ecommerce.entity.Product;
import com.shopverse.ecommerce.entity.Role;
import com.shopverse.ecommerce.entity.User;
import com.shopverse.ecommerce.repository.ProductRepository;
import com.shopverse.ecommerce.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(ProductRepository productRepository, UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@shopverse.com")) {
                User admin = new User();
                admin.setName("ShopVerse Admin");
                admin.setEmail("admin@shopverse.com");
                admin.setPassword(encoder.encode("Admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            if (productRepository.count() == 0) {
                productRepository.saveAll(List.of(
                        product("Echo Dot Smart Speaker", "Room-filling sound, voice control, smart home routines and crisp vocals.", "Electronics", "Amazon", "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=900&q=80", "4499", "5999", 4.6, 24),
                        product("NoiseFit Pro Watch", "Bright display, health tracking, Bluetooth calling and seven-day battery life.", "Wearables", "Noise", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", "3299", "5999", 4.3, 18),
                        product("Sony Wireless Headphones", "Active noise cancellation with punchy bass, soft cushions and quick charging.", "Audio", "Sony", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", "8999", "12999", 4.7, 15),
                        product("HP Pavilion Laptop", "Powerful Ryzen processor, fast SSD storage and a slim everyday productivity design.", "Computers", "HP", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", "56990", "71990", 4.4, 8),
                        product("Prestige Air Fryer", "Healthy cooking with rapid air technology, presets and an easy-clean basket.", "Home", "Prestige", "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80", "5499", "7999", 4.2, 20),
                        product("Canon Mirrorless Camera", "Sharp 24MP photos, 4K video, compact body and creator-friendly autofocus.", "Cameras", "Canon", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80", "68990", "82990", 4.8, 5)
                ));
            }
        };
    }

    private Product product(String name, String description, String category, String brand, String imageUrl, String price, String mrp, double rating, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setBrand(brand);
        product.setImageUrl(imageUrl);
        product.setPrice(new BigDecimal(price));
        product.setMrp(new BigDecimal(mrp));
        product.setRating(rating);
        product.setStock(stock);
        return product;
    }
}
