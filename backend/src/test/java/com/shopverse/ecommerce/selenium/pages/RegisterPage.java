package com.shopverse.ecommerce.selenium.pages;

import com.shopverse.ecommerce.selenium.support.UserCredentials;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RegisterPage extends BasePage {
    private final By page = testId("register-page");
    private final By name = testId("register-name");
    private final By email = testId("register-email");
    private final By password = testId("register-password");
    private final By phone = testId("register-phone");
    private final By address = testId("register-address");
    private final By submit = testId("register-submit");
    private final By signIn = testId("signin-link");

    public RegisterPage(WebDriver driver, WebDriverWait wait, String baseUrl) {
        super(driver, wait, baseUrl);
    }

    public void open() {
        openPath("/register");
        visible(page);
    }

    public void register(UserCredentials user) {
        type(name, user.name());
        type(email, user.email());
        type(password, user.password());
        type(phone, user.phone());
        type(address, user.address());
        click(submit);
    }

    public void submitEmptyForm() {
        click(submit);
    }

    public void typeInvalidEmail(String emailAddress) {
        type(email, emailAddress);
    }

    public void typeShortPassword(String passwordValue) {
        type(password, passwordValue);
    }

    public boolean isNameInvalid() {
        return isFieldInvalid(name);
    }

    public boolean isEmailInvalid() {
        return isFieldInvalid(email);
    }

    public boolean isPasswordInvalid() {
        return isFieldInvalid(password);
    }

    public String emailValidationMessage() {
        return validationMessage(email);
    }

    public void openSignIn() {
        click(signIn);
        waitForUrlContaining("/login");
    }

    public boolean isLoaded() {
        return isVisible(page);
    }
}
