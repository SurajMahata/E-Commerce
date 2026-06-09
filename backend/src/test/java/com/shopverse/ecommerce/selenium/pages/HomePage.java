package com.shopverse.ecommerce.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HomePage extends BasePage {
    private final By title = testId("home-title");

    public HomePage(WebDriver driver, WebDriverWait wait, String baseUrl) {
        super(driver, wait, baseUrl);
    }

    public void open() {
        openPath("/");
        visible(title);
    }

    public String title() {
        return text(title);
    }
}
