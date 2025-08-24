// tests/e2e/05-saved-elements-dashboard.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Saved Elements Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard section on main page', async ({ page }) => {
    const dashboardSection = page.locator('.saved-elements-section');
    await expect(dashboardSection).toBeVisible();
    
    const header = dashboardSection.locator('h4');
    await expect(header).toContainText('Saved Dynamic Elements');
    
    const refreshBtn = dashboardSection.locator('button');
    await expect(refreshBtn).toBeVisible();
    await expect(refreshBtn).toContainText('Refresh');
  });

  test('should show empty state initially', async ({ page }) => {
    // Wait for elements to load
    await page.waitForTimeout(3000);
    
    const emptyState = page.locator('.empty-elements');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No saved elements yet');
  });

  test('should handle refresh button', async ({ page }) => {
    const refreshBtn = page.locator('.saved-elements-section button');
    
    // Should be clickable
    await expect(refreshBtn).toBeEnabled();
    await refreshBtn.click();
    
    // Should trigger reload (we can verify by checking for loading state or network request)
    await page.waitForTimeout(1000);
  });

  test('should call elements API on load', async ({ page }) => {
    // Monitor API calls
    let apiCalled = false;
    page.on('response', response => {
      if (response.url().includes('/api/elements')) {
        apiCalled = true;
      }
    });
    
    // Reload page to trigger API call
    await page.reload();
    await page.waitForTimeout(3000);
    
    expect(apiCalled).toBe(true);
  });
});

test.describe('Dashboard with Saved Elements', () => {
  test.beforeEach(async ({ page }) => {
    // Create a saved element first by going through the full flow
    await page.goto('/');
    await page.locator('.feature-card').click();
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for AI processing
    await page.waitForSelector('.preview-result', { timeout: 60000 });
    
    // Lock and save version
    await page.locator('#lock-version-btn').click();
    
    // Handle the alert dialog for successful save
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    await page.locator('#save-element-btn').click();
    await page.waitForTimeout(2000);
    
    // Go back to main page
    await page.locator('button').filter({ hasText: 'Close Editor' }).click();
  });

  test('should display saved element cards', async ({ page }) => {
    // Refresh to load saved elements
    await page.locator('.saved-elements-section button').click();
    await page.waitForTimeout(2000);
    
    // Should show element cards instead of empty state
    const elementCards = page.locator('.element-card');
    await expect(elementCards.first()).toBeVisible();
    
    // Check card content
    await expect(elementCards.first().locator('.element-title')).toBeVisible();
    await expect(elementCards.first().locator('.element-version')).toBeVisible();
    await expect(elementCards.first().locator('.element-preview')).toBeVisible();
    await expect(elementCards.first().locator('.element-meta')).toBeVisible();
  });

  test('should show element actions on hover', async ({ page }) => {
    await page.locator('.saved-elements-section button').click();
    await page.waitForTimeout(2000);
    
    const elementCard = page.locator('.element-card').first();
    await expect(elementCard).toBeVisible();
    
    // Hover over card
    await elementCard.hover();
    
    // Actions should become visible
    const actions = elementCard.locator('.element-actions');
    await expect(actions).toBeVisible();
    
    // Check action buttons
    await expect(actions.locator('.action-btn').first()).toBeVisible(); // View button
    await expect(actions.locator('.action-btn.delete')).toBeVisible(); // Delete button
  });

  test('should handle element view action', async ({ page }) => {
    await page.locator('.saved-elements-section button').click();
    await page.waitForTimeout(2000);
    
    const elementCard = page.locator('.element-card').first();
    await expect(elementCard).toBeVisible();
    
    // Handle the alert dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Viewing element');
      await dialog.accept();
    });
    
    // Click view button
    await elementCard.hover();
    await elementCard.locator('.action-btn').first().click();
  });

  test('should handle element deletion', async ({ page }) => {
    await page.locator('.saved-elements-section button').click();
    await page.waitForTimeout(2000);
    
    const elementCard = page.locator('.element-card').first();
    await expect(elementCard).toBeVisible();
    
    // Handle confirmation dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure you want to delete');
      await dialog.accept();
    });
    
    // Handle success dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('deleted successfully');
      await dialog.accept();
    });
    
    // Click delete button
    await elementCard.hover();
    await elementCard.locator('.action-btn.delete').click();
    
    // Wait for deletion to complete
    await page.waitForTimeout(2000);
  });

  test('should display element metadata correctly', async ({ page }) => {
    await page.locator('.saved-elements-section button').click();
    await page.waitForTimeout(2000);
    
    const elementCard = page.locator('.element-card').first();
    await expect(elementCard).toBeVisible();
    
    // Check version badge
    const versionBadge = elementCard.locator('.element-version');
    await expect(versionBadge).toContainText('V1');
    
    // Check stats
    const stats = elementCard.locator('.element-stats');
    await expect(stats).toBeVisible();
    
    // Should show chat count and version count
    const statItems = stats.locator('.stat-item');
    await expect(statItems).toHaveCount(2);
  });
});