import { Page, Locator } from '@playwright/test';

export class AdminDashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly kpiCards: Locator;
  readonly usersTab: Locator;
  readonly financialTab: Locator;
  readonly userSearchInput: Locator;
  readonly usersTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('text=Admin Dashboard');
    this.kpiCards = page.locator('text=Total Users').locator('..').locator('..');
    this.usersTab = page.getByRole('tab', { name: 'Users' });
    this.financialTab = page.getByRole('tab', { name: 'Financial' });
    this.userSearchInput = page.locator('input[placeholder="Search users..."]');
    this.usersTable = page.locator('table');
  }

  async isLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  async getKpiValue(label: string) {
    return await this.page.locator(`text=${label}`).locator('..').locator('p').first().textContent();
  }

  async clickUsersTab() {
    await this.usersTab.click();
  }

  async clickFinancialTab() {
    await this.financialTab.click();
  }

  async searchUser(query: string) {
    await this.userSearchInput.fill(query);
  }

  async getUserCount() {
    const rows = await this.usersTable.locator('tbody tr').count();
    return rows;
  }
}
