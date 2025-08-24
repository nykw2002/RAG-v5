// tests/e2e/01-basic-functionality.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Basic Application Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load main page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/AI Document Analysis System/);
    await expect(page.locator('h1')).toContainText('AI Document Analysis System');
  });

  test('should display system status indicators', async ({ page }) => {
    // Wait for status checks to complete
    await page.waitForTimeout(2000);
    
    await expect(page.locator('#system-status')).toBeVisible();
    await expect(page.locator('#api-status')).toBeVisible();
    await expect(page.locator('#requirements-status')).toBeVisible();
  });

  test('should display GenAI Dynamic Element card', async ({ page }) => {
    const featureCard = page.locator('.feature-card');
    await expect(featureCard).toBeVisible();
    await expect(featureCard).toContainText('GenAI Dynamic Element');
    await expect(featureCard).toContainText('AI Powered');
  });

  test('should display saved elements dashboard section', async ({ page }) => {
    const dashboardSection = page.locator('.saved-elements-section');
    await expect(dashboardSection).toBeVisible();
    
    const header = dashboardSection.locator('h4');
    await expect(header).toContainText('Saved Dynamic Elements');
    
    const refreshBtn = dashboardSection.locator('button');
    await expect(refreshBtn).toContainText('Refresh');
  });

  test('should show empty state when no elements are saved', async ({ page }) => {
    // Wait for elements to load
    await page.waitForTimeout(3000);
    
    const emptyState = page.locator('.empty-elements');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No saved elements yet');
  });

  test('should handle API health check', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
  });
});