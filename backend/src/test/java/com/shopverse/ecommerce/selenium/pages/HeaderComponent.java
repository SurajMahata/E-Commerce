package com.shopverse.ecommerce.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HeaderComponent extends BasePage {
    private final By logo = testId("site-logo");
    private final By signIn = testId("signin-header-link");
    private final By logout = testId("logout-button");
    private final By profile = testId("profile-link");
    private final By cart = testId("cart-link");
    private final By adminProducts = testId("admin-products-link");
    private final By searchInput = testId("header-search-input");
    private final By searchSubmit = testId("header-search-submit");

    public HeaderComponent(WebDriver driver, WebDriverWait wait, String baseUrl) {
        super(driver, wait, baseUrl);
    }

    public void openHome() {
        click(logo);
    }

    public void openLogin() {
        click(signIn);
        waitForUrlContaining("/login");
    }

    public void openProfile() {
        click(profile);
        waitForUrlContaining("/profile");
    }

    public void openAdminProducts() {
        click(adminProducts);
        waitForUrlContaining("/admin/products");
    }

    public void logout() {
        click(logout);
        visible(signIn);
    }

    public void search(String query) {
        type(searchInput, query);
        click(searchSubmit);
        waitForUrlContaining("/products");
    }

    public boolean isSignedIn() {
        return isVisible(logout);
    }

    public boolean isSignedOut() {
        return isVisible(signIn);
    }

    public boolean isCustomerMenuVisible() {
        return isVisible(profile) && isVisible(cart);
    }

    public boolean isAdminMenuVisible() {
        return isVisible(adminProducts) && !exists(cart);
    }
}
