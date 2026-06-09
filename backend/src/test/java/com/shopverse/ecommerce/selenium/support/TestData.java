package com.shopverse.ecommerce.selenium.support;

public final class TestData {
    private TestData() {
    }

    public static UserCredentials uniqueCustomer() {
        long suffix = System.currentTimeMillis();
        return new UserCredentials(
                "Selenium User",
                "selenium.user." + suffix + "@example.com",
                "User123",
                "9876543210",
                "42 Selenium Street, Test City"
        );
    }

    public static String uniqueProductName() {
        return "Selenium QA Product " + System.currentTimeMillis();
    }
}
