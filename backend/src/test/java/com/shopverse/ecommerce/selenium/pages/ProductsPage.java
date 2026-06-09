package com.shopverse.ecommerce.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ProductsPage extends BasePage {
    private final By title = testId("products-title");
    private final By search = testId("product-search-input");
    private final By category = testId("category-filter");
    private final By apply = testId("apply-filters");
    private final By productCard = testId("product-card");

    public ProductsPage(WebDriver driver, WebDriverWait wait, String baseUrl) {
        super(driver, wait, baseUrl);
    }

    public void open() {
        openPath("/products");
        waitForProductsToFinishLoading();
    }

    public void applySearch(String query) {
        type(search, query);
        click(apply);
        waitForProductsToFinishLoading();
    }

    public void applyCategory(String categoryName) {
        selectByVisibleText(category, categoryName);
        click(apply);
        waitForProductsToFinishLoading();
    }

    public String title() {
        return text(title);
    }

    public int productCount() {
        waitForProductsToFinishLoading();
        return driver.findElements(productCard).size();
    }
}
