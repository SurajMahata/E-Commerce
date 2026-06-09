package com.shopverse.ecommerce.selenium.pages;

import java.time.Duration;
import java.util.List;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class BasePage {
    protected final WebDriver driver;
    protected final WebDriverWait wait;
    protected final String baseUrl;

    protected BasePage(WebDriver driver, WebDriverWait wait, String baseUrl) {
        this.driver = driver;
        this.wait = wait;
        this.baseUrl = baseUrl;
    }

    protected By testId(String value) {
        return By.cssSelector("[data-testid='" + value + "']");
    }

    protected void openPath(String path) {
        driver.get(baseUrl + path);
    }

    protected WebElement visible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected WebElement clickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected void click(By locator) {
        clickable(locator).click();
    }

    protected void type(By locator, String value) {
        WebElement element = clickable(locator);
        element.clear();
        element.sendKeys(value);
    }

    protected String text(By locator) {
        return visible(locator).getText();
    }

    protected boolean isVisible(By locator) {
        try {
            return visible(locator).isDisplayed();
        } catch (TimeoutException ex) {
            return false;
        }
    }

    protected boolean exists(By locator) {
        List<WebElement> elements = driver.findElements(locator);
        return !elements.isEmpty() && elements.get(0).isDisplayed();
    }

    protected void waitForUrlContaining(String path) {
        wait.until(ExpectedConditions.urlContains(path));
    }

    protected void waitForProductsToFinishLoading() {
        new WebDriverWait(driver, Duration.ofSeconds(15)).until((currentDriver) ->
                currentDriver.findElements(testId("products-loading")).isEmpty()
                        && (exists(testId("product-grid")) || exists(testId("no-products-message"))));
    }

    protected String validationMessage(By locator) {
        WebElement element = driver.findElement(locator);
        return (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].validationMessage;", element);
    }

    protected boolean isFieldInvalid(By locator) {
        WebElement element = driver.findElement(locator);
        return Boolean.TRUE.equals(((JavascriptExecutor) driver).executeScript("return !arguments[0].validity.valid;", element));
    }

    protected void selectByVisibleText(By locator, String value) {
        new Select(visible(locator)).selectByVisibleText(value);
    }

    protected String acceptAlert() {
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String message = alert.getText();
        alert.accept();
        return message;
    }
}
