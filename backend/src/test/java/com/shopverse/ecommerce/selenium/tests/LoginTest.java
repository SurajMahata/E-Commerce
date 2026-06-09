package com.shopverse.ecommerce.selenium.tests;

import com.shopverse.ecommerce.selenium.core.BaseTest;
import com.shopverse.ecommerce.selenium.pages.HeaderComponent;
import com.shopverse.ecommerce.selenium.pages.LoginPage;
import com.shopverse.ecommerce.selenium.support.AuthFlows;
import com.shopverse.ecommerce.selenium.support.UserCredentials;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {
    @Test(description = "T072/T079: Automate login with valid customer credentials using reusable utilities.")
    public void logsInWithValidCustomerCredentials() {
        AuthFlows authFlows = new AuthFlows(driver, wait, baseUrl);
        UserCredentials customer = authFlows.registerCustomerAndLogout();

        LoginPage loginPage = new LoginPage(driver, wait, baseUrl);
        loginPage.open();
        loginPage.login(customer.email(), customer.password());

        Assert.assertTrue(new HeaderComponent(driver, wait, baseUrl).isCustomerMenuVisible(), "Customer should be logged in.");
    }

    @Test(description = "T072/T079: Automate login with valid admin credentials using reusable utilities.")
    public void logsInWithValidAdminCredentials() {
        new AuthFlows(driver, wait, baseUrl).loginAsAdmin();
        Assert.assertTrue(new HeaderComponent(driver, wait, baseUrl).isAdminMenuVisible(), "Admin should see admin-only navigation.");
    }

    @Test(description = "T073/T074/T075: Automate invalid login and validate error messages.")
    public void rejectsInvalidCredentials() {
        LoginPage loginPage = new LoginPage(driver, wait, baseUrl);
        loginPage.open();
        loginPage.login("missing-user@example.com", "Wrong123");

        Assert.assertEquals(loginPage.errorMessage(), "Invalid credentials");
        Assert.assertTrue(new HeaderComponent(driver, wait, baseUrl).isSignedOut(), "Invalid login should keep the visitor signed out.");
    }
}
