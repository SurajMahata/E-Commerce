package com.shopverse.ecommerce.selenium.tests;

import com.shopverse.ecommerce.selenium.core.BaseTest;
import com.shopverse.ecommerce.selenium.pages.HeaderComponent;
import com.shopverse.ecommerce.selenium.pages.RegisterPage;
import com.shopverse.ecommerce.selenium.support.TestData;
import com.shopverse.ecommerce.selenium.support.UserCredentials;
import org.testng.Assert;
import org.testng.annotations.Test;

public class RegistrationTest extends BaseTest {
    @Test(description = "T070/T075: Automate user registration flow with assertions.")
    public void registersNewCustomer() {
        UserCredentials customer = TestData.uniqueCustomer();
        RegisterPage registerPage = new RegisterPage(driver, wait, baseUrl);
        registerPage.open();
        registerPage.register(customer);

        HeaderComponent header = new HeaderComponent(driver, wait, baseUrl);
        Assert.assertTrue(header.isCustomerMenuVisible(), "Registered users should see customer account links.");
    }

    @Test(description = "T068/T071/T075: Use explicit waits and validate browser input fields.")
    public void validatesRegistrationInputFields() {
        RegisterPage registerPage = new RegisterPage(driver, wait, baseUrl);
        registerPage.open();
        registerPage.submitEmptyForm();

        Assert.assertTrue(registerPage.isNameInvalid(), "Name is required.");
        Assert.assertTrue(registerPage.isEmailInvalid(), "Email is required.");

        registerPage.typeInvalidEmail("not-an-email");
        registerPage.typeShortPassword("123");
        registerPage.submitEmptyForm();

        Assert.assertTrue(registerPage.isEmailInvalid(), "Invalid email format should be rejected.");
        Assert.assertFalse(registerPage.emailValidationMessage().isBlank(), "Browser should expose an email validation message.");
        Assert.assertTrue(registerPage.isPasswordInvalid(), "Short passwords should be rejected by input validation.");
    }
}
