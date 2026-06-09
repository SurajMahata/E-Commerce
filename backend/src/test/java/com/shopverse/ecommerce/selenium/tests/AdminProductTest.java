package com.shopverse.ecommerce.selenium.tests;

import com.shopverse.ecommerce.selenium.core.BaseTest;
import com.shopverse.ecommerce.selenium.pages.AdminProductsPage;
import com.shopverse.ecommerce.selenium.pages.HeaderComponent;
import com.shopverse.ecommerce.selenium.support.AuthFlows;
import com.shopverse.ecommerce.selenium.support.TestData;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AdminProductTest extends BaseTest {
    @Test(description = "T069/T072/T075: Login as admin, handle success alert, and assert product creation.")
    public void adminCanCreateProductAndAcceptSuccessPopup() {
        new AuthFlows(driver, wait, baseUrl).loginAsAdmin();
        new HeaderComponent(driver, wait, baseUrl).openAdminProducts();

        String productName = TestData.uniqueProductName();
        AdminProductsPage adminProductsPage = new AdminProductsPage(driver, wait, baseUrl);
        adminProductsPage.createProduct(productName);

        Assert.assertEquals(adminProductsPage.successMessage(), "Product saved successfully");
        Assert.assertTrue(adminProductsPage.hasProductNamed(productName), "New admin product should be shown in the product list.");
    }
}
