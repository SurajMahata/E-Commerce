package com.shopverse.ecommerce.selenium.support;

import com.shopverse.ecommerce.selenium.pages.HeaderComponent;
import com.shopverse.ecommerce.selenium.pages.LoginPage;
import com.shopverse.ecommerce.selenium.pages.RegisterPage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class AuthFlows {
    private final WebDriver driver;
    private final WebDriverWait wait;
    private final String baseUrl;

    public AuthFlows(WebDriver driver, WebDriverWait wait, String baseUrl) {
        this.driver = driver;
        this.wait = wait;
        this.baseUrl = baseUrl;
    }

    public UserCredentials registerCustomerAndLogout() {
        UserCredentials user = TestData.uniqueCustomer();
        RegisterPage registerPage = new RegisterPage(driver, wait, baseUrl);
        registerPage.open();
        registerPage.register(user);

        HeaderComponent header = new HeaderComponent(driver, wait, baseUrl);
        Assert.assertTrue(header.isSignedIn(), "Newly registered customer should be signed in.");
        header.logout();
        Assert.assertTrue(header.isSignedOut(), "Customer should be signed out after logout.");
        return user;
    }

    public void loginAsCustomer(UserCredentials user) {
        LoginPage loginPage = new LoginPage(driver, wait, baseUrl);
        loginPage.open();
        loginPage.login(user.email(), user.password());
        Assert.assertTrue(new HeaderComponent(driver, wait, baseUrl).isCustomerMenuVisible(), "Customer header menu should be visible.");
    }

    public void loginAsAdmin() {
        LoginPage loginPage = new LoginPage(driver, wait, baseUrl);
        loginPage.open();
        loginPage.login("admin@shopverse.com", "Admin123");
        Assert.assertTrue(new HeaderComponent(driver, wait, baseUrl).isAdminMenuVisible(), "Admin header menu should be visible.");
    }
}
