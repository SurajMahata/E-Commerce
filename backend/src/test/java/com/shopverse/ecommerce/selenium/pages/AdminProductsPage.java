package com.shopverse.ecommerce.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdminProductsPage extends BasePage {
    private final By page = testId("admin-products-page");
    private final By name = testId("product-name-input");
    private final By description = testId("product-description-input");
    private final By price = testId("product-price-input");
    private final By mrp = testId("product-mrp-input");
    private final By category = testId("product-category-input");
    private final By brand = testId("product-brand-input");
    private final By rating = testId("product-rating-input");
    private final By stock = testId("product-stock-input");
    private final By imageUrl = testId("product-image-url-input");
    private final By submit = testId("product-submit-button");
    private final By message = testId("admin-message");

    public AdminProductsPage(WebDriver driver, WebDriverWait wait, String baseUrl) {
        super(driver, wait, baseUrl);
    }

    public void createProduct(String productName) {
        visible(page);
        type(name, productName);
        type(description, "Selenium-created product used for automated UI coverage.");
        type(price, "1499");
        type(mrp, "1999");
        type(category, "Automation");
        type(brand, "ShopVerse QA");
        type(rating, "4.5");
        type(stock, "7");
        type(imageUrl, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80");
        click(submit);
        acceptAlert();
        visible(message);
    }

    public String successMessage() {
        return text(message);
    }

    public boolean hasProductNamed(String productName) {
        By productText = By.xpath("//article[@data-testid='admin-product-row']//strong[normalize-space()='" + productName + "']");
        return wait.until(ExpectedConditions.visibilityOfElementLocated(productText)).isDisplayed();
    }
}
