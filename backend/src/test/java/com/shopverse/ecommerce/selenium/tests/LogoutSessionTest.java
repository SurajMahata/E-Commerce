package com.shopverse.ecommerce.selenium.tests;

import com.shopverse.ecommerce.selenium.core.BaseTest;
import com.shopverse.ecommerce.selenium.pages.HeaderComponent;
import com.shopverse.ecommerce.selenium.pages.LoginPage;
import com.shopverse.ecommerce.selenium.support.AuthFlows;
import com.shopverse.ecommerce.selenium.support.UserCredentials;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LogoutSessionTest extends BaseTest {
    @Test(description = "T076/T077: Automate logout functionality and validate session handling.")
    public void logsOutAndProtectsCustomerRoutes() {
        AuthFlows authFlows = new AuthFlows(driver, wait, baseUrl);
        UserCredentials customer = authFlows.registerCustomerAndLogout();
        authFlows.loginAsCustomer(customer);

        HeaderComponent header = new HeaderComponent(driver, wait, baseUrl);
        header.openProfile();
        header.logout();

        driver.get(baseUrl + "/profile");
        LoginPage loginPage = new LoginPage(driver, wait, baseUrl);
        Assert.assertTrue(loginPage.isLoaded(), "Protected profile route should redirect to login after logout.");
    }
}
