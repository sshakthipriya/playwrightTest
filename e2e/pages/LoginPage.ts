import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly toggleButton: Locator;
  readonly demoAccountsBox: Locator;
  readonly authPage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authPage = page.getByTestId('auth-page');
    this.emailInput = page.getByTestId('auth-email');
    this.passwordInput = page.getByTestId('auth-password');
    this.submitButton = page.getByTestId('auth-submit-btn');
    this.toggleButton = page.getByTestId('auth-toggle');
    this.demoAccountsBox = page.locator('text=Demo Accounts').locator('..');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async isLoaded() {
    await this.authPage.waitFor({ state: 'visible' });
  }

  async getDemoAccountsText() {
    return await this.demoAccountsBox.textContent();
  }
}
