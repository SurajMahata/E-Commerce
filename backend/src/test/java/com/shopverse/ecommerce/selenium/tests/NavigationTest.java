package com.shopverse.ecommerce.selenium.tests;

import com.shopverse.ecommerce.selenium.core.BaseTest;
import com.shopverse.ecommerce.selenium.pages.HeaderComponent;
import com.shopverse.ecommerce.selenium.pages.HomePage;
import com.shopverse.ecommerce.selenium.pages.LoginPage;
import com.shopverse.ecommerce.selenium.pages.ProductsPage;
import com.shopverse.ecommerce.selenium.pages.RegisterPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class NavigationTest extends BaseTest {
    @Test(description = "T066/T067: Identify stable locators and automate basic navigation tests.")
    public void validatesBasicNavigationAndSearch() {
        HomePage homePage = new HomePage(driver, wait, baseUrl);
        homePage.open();
        Assert.assertEquals(homePage.title(), "ShopVerse");

        HeaderComponent header = new HeaderComponent(driver, wait, baseUrl);
        header.search("Sony");

        ProductsPage productsPage = new ProductsPage(driver, wait, baseUrl);
        Assert.assertTrue(productsPage.title().contains("Sony"), "Search results title should include the query.");
        Assert.assertTrue(productsPage.productCount() > 0, "Search should return matching seeded products.");

        LoginPage loginPage = new LoginPage(driver, wait, baseUrl);
        loginPage.open();
        Assert.assertTrue(loginPage.isLoaded(), "Login page should load.");
        loginPage.openCreateAccount();

        RegisterPage registerPage = new RegisterPage(driver, wait, baseUrl);
        Assert.assertTrue(registerPage.isLoaded(), "Register page should load.");
        registerPage.openSignIn();
        Assert.assertTrue(loginPage.isLoaded(), "Sign-in link should return to login page.");
    }
}
