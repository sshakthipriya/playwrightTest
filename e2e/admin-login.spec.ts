import { test, expect, Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// ASSUMED: Admin credentials based on demo accounts shown in login page
const ADMIN_EMAIL = 'admin@greenway.com';
const ADMIN_PASSWORD = 'admin123';
const INVALID_PASSWORD = 'wrongpassword123';
const NONEXISTENT_EMAIL = 'nonexistent@test.com';

test.describe('Admin Login Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new AdminDashboardPage(page);
    await loginPage.goto();
    await loginPage.isLoaded();
  });

  test('should display login form with all required fields', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should display demo accounts information on login page', async () => {
    const demoText = await loginPage.getDemoAccountsText();
    expect(demoText).toContain('Demo Accounts');
    expect(demoText).toContain('Admin:');
    expect(demoText).toContain('admin@greenway.com');
  });

  test('should show error when email field is empty and submit is clicked', async ({ page }) => {
    await loginPage.passwordInput.fill(ADMIN_PASSWORD);
    await loginPage.submitButton.click();
    // Browser validation for required field
    const validationState = await loginPage.emailInput.evaluate((el: HTMLInputElement) => 
      el.validationMessage
    );
    expect(validationState).toBeTruthy();
  });

  test('should show error when password field is empty and submit is clicked', async ({ page }) => {
    await loginPage.emailInput.fill(ADMIN_EMAIL);
    await loginPage.submitButton.click();
    // Browser validation for required field
    const validationState = await loginPage.passwordInput.evaluate((el: HTMLInputElement) => 
      el.validationMessage
    );
    expect(validationState).toBeTruthy();
  });

  test('should show error when invalid email format is provided', async ({ page }) => {
    await loginPage.emailInput.fill('invalidemail');
    await loginPage.passwordInput.fill(ADMIN_PASSWORD);
    await loginPage.submitButton.click();
    const validationState = await loginPage.emailInput.evaluate((el: HTMLInputElement) => 
      el.validationMessage
    );
    expect(validationState).toBeTruthy();
  });

  test('should show error when credentials are invalid', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, INVALID_PASSWORD);
    // Wait for error toast message
  const errorToast = page.getByText(
  /invalid|incorrect|wrong|failed|unauthorized/i
);
    await expect(errorToast).toBeVisible({ timeout: 5000 });
    // Should still be on login page
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should show error when email does not exist', async ({ page }) => {
    await loginPage.login(NONEXISTENT_EMAIL, ADMIN_PASSWORD);
    // Wait for error toast message
    const errorToast = page.locator('text=/invalid|incorrect|wrong|failed|unauthorized|not found|does not exist/i');
    await expect(errorToast).toBeVisible({ timeout: 5000 });
    // Should still be on login page
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should redirect to admin dashboard on valid admin credentials', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    
    // Wait for navigation to admin dashboard
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Verify dashboard is loaded
    await dashboardPage.isLoaded();
    await expect(dashboardPage.pageTitle).toContainText('Admin Dashboard');
  });

  test('should display admin dashboard with KPI cards after successful login', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 30000 });
    
    // Verify KPI cards are visible
    const totalUsersKpi = page.locator('text=Total Users');
    const activeListingsKpi = page.locator('text=Active Listings');
    const activeAuctionsKpi = page.locator('text=Active Auctions');
    const gmvKpi = page.locator('text=GMV');
    
    await expect(totalUsersKpi).toBeVisible();
    await expect(activeListingsKpi).toBeVisible();
    await expect(activeAuctionsKpi).toBeVisible();
    await expect(gmvKpi).toBeVisible();
  });

  test('should display users table in Users tab on dashboard', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Click Users tab
    await dashboardPage.clickUsersTab();
    
    // Verify table structure
    const tableHeaders = page.locator('table thead th');
    const headerCount = await tableHeaders.count();
    expect(headerCount).toBeGreaterThan(0);
    
    // Verify table has expected columns
    await expect(tableHeaders.locator('text=Name')).toBeVisible();
    await expect(tableHeaders.locator('text=Email')).toBeVisible();
    await expect(tableHeaders.locator('text=Role')).toBeVisible();
  });

  test('should allow searching users by name in dashboard', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Click Users tab
    await dashboardPage.clickUsersTab();
    
    // Search for a user
    await dashboardPage.searchUser('admin');
    
    // Verify search input is populated
    await expect(dashboardPage.userSearchInput).toHaveValue('admin');
  });

  test('should display Financial tab with tax reporting data', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Click Financial tab
    await dashboardPage.clickFinancialTab();
    
    // Verify financial data is displayed
    const grossMerchandiseValue = page.locator('text=Gross Merchandise Value');
    const feesCollected = page.locator('text=Fees Collected');
    const taxReporting = page.locator('text=Tax Reporting by State');
    
    await expect(grossMerchandiseValue).toBeVisible();
    await expect(feesCollected).toBeVisible();
    await expect(taxReporting).toBeVisible();
  });

  test('should store authentication token in localStorage after successful login', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Check localStorage for token and user data
    const token = await page.evaluate(() => localStorage.getItem('gw_token'));
    const userData = await page.evaluate(() => localStorage.getItem('gw_user'));
    
    expect(token).toBeTruthy();
    expect(userData).toBeTruthy();
    
    // Verify user data contains admin role
    const user = JSON.parse(userData as string);
    expect(user.role).toBe('admin');
    expect(user.email).toBe(ADMIN_EMAIL);
  });

  test('should persist login state on page refresh', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Refresh the page
    await page.reload();
    
    // Verify still on dashboard and user is still authenticated
    await expect(dashboardPage.pageTitle).toBeVisible({ timeout: 5000 });
    
    const userData = await page.evaluate(() => localStorage.getItem('gw_user'));
    expect(userData).toBeTruthy();
  });

  test('should redirect unauthenticated users to login page', async ({ page }) => {
    // Navigate directly to admin dashboard without login
    await page.goto('/dashboard/admin');
    
    // Should be redirected to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should display email and password inputs with correct placeholder text', async () => {
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'you@example.com');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Your password');
  });

  test('should show loading state on submit button during login', async ({ page }) => {
    // Intercept the login API call to delay response
    await page.route('**/auth/login', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await loginPage.emailInput.fill(ADMIN_EMAIL);
    await loginPage.passwordInput.fill(ADMIN_PASSWORD);
    
    // Click and check button state before request completes
    const submitPromise = loginPage.submitButton.click();
    
    // Button should show loading state
    await expect(loginPage.submitButton).toContainText('Please wait');
    
    await submitPromise;
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
  });

  test('should not redirect non-admin users to admin dashboard', async ({ page }) => {
    // ASSUMED: Seller credentials from demo accounts
    const sellerEmail = 'seller@greenway.com';
    const sellerPassword = 'seller123';
    
    await loginPage.login(sellerEmail, sellerPassword);
    
    // Should redirect to seller dashboard instead
    await page.waitForURL(/\/dashboard\/seller|\//, { timeout: 10000 });
    
    // Should not be on admin dashboard
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/dashboard/admin');
  });

  test('should maintain case-insensitive email lookup', async ({ page }) => {
    // Try login with uppercase email
    const uppercaseEmail = ADMIN_EMAIL.toUpperCase();
    await loginPage.login(uppercaseEmail, ADMIN_PASSWORD);
    
    // Should successfully login
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    await expect(dashboardPage.pageTitle).toBeVisible();
  });

  test('should display charts on admin dashboard', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Verify chart sections are visible
    const monthlyRevenueChart = page.locator('text=Monthly Revenue');
    const listingsByCategoryChart = page.locator('text=Listings by Category');
    
    await expect(monthlyRevenueChart).toBeVisible();
    await expect(listingsByCategoryChart).toBeVisible();
  });

  test('should display secondary stats on admin dashboard', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Verify secondary stats are visible
    const verifiedSellers = page.locator('text=Verified Sellers');
    const pendingReviews = page.locator('text=Pending Reviews');
    const totalBids = page.locator('text=Total Bids');
    
    await expect(verifiedSellers).toBeVisible();
    await expect(pendingReviews).toBeVisible();
    await expect(totalBids).toBeVisible();
  });

  test('should allow admin to access all dashboard tabs', async ({ page }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 10000 });
    
    // Switch to Users tab
    await dashboardPage.clickUsersTab();
    await expect(dashboardPage.usersTable).toBeVisible();
    
    // Switch to Financial tab
    await dashboardPage.clickFinancialTab();
    const taxTable = page.locator('text=Tax Reporting by State');
    await expect(taxTable).toBeVisible();
  });
});
