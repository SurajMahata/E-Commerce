package com.shopverse.ecommerce.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage extends BasePage {
    private final By page = testId("login-page");
    private final By email = testId("login-email");
    private final By password = testId("login-password");
    private final By submit = testId("login-submit");
    private final By error = testId("auth-error");
    private final By createAccount = testId("create-account-link");

    public LoginPage(WebDriver driver, WebDriverWait wait, String baseUrl) {
        super(driver, wait, baseUrl);
    }

    public void open() {
        openPath("/login");
        visible(page);
    }

    public void login(String emailAddress, String passwordValue) {
        type(email, emailAddress);
        type(password, passwordValue);
        click(submit);
    }

    public void openCreateAccount() {
        click(createAccount);
        waitForUrlContaining("/register");
    }

    public String errorMessage() {
        return text(error);
    }

    public boolean isLoaded() {
        return isVisible(page);
    }
}
