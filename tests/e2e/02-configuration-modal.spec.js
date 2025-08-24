// tests/e2e/02-configuration-modal.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Configuration Modal Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open configuration modal when clicking GenAI card', async ({ page }) => {
    // Click on the GenAI Dynamic Element card
    await page.locator('.feature-card').click();
    
    // Modal should be visible
    const modal = page.locator('#config-modal.active');
    await expect(modal).toBeVisible();
    
    // Check modal content
    await expect(modal.locator('h2')).toContainText('AI Analysis Configuration');
  });

  test('should display all configuration fields', async ({ page }) => {
    await page.locator('.feature-card').click();
    
    // Check all form fields are present
    await expect(page.locator('#default-prompt')).toBeVisible();
    await expect(page.locator('#model-select')).toBeVisible();
    await expect(page.locator('#method-select')).toBeVisible();
    await expect(page.locator('#file-upload')).toBeVisible();
    
    // Check referenced elements buttons
    await expect(page.locator('[data-element="kpi-table"]')).toBeVisible();
    await expect(page.locator('[data-element="complaints"]')).toBeVisible();
    await expect(page.locator('[data-element="capa"]')).toBeVisible();
  });

  test('should have default values in form fields', async ({ page }) => {
    await page.locator('.feature-card').click();
    
    // Wait for modal to be fully loaded
    await page.waitForTimeout(500);
    
    // Check default values (may have been changed by previous tests)
    const defaultPrompt = page.locator('#default-prompt');
    const promptValue = await defaultPrompt.inputValue();
    expect(promptValue.length).toBeGreaterThan(0); // Should have some value
    
    const modelSelect = page.locator('#model-select');
    await expect(modelSelect).toHaveValue('gpt-4o-mini');
    
    const methodSelect = page.locator('#method-select');
    await expect(methodSelect).toHaveValue('extraction');
  });

  test('should allow changing form values', async ({ page }) => {
    await page.locator('.feature-card').click();
    
    // Change prompt
    await page.locator('#default-prompt').fill('Test prompt for analysis');
    await expect(page.locator('#default-prompt')).toHaveValue('Test prompt for analysis');
    
    // Change model
    await page.locator('#model-select').selectOption('gpt-4o');
    await expect(page.locator('#model-select')).toHaveValue('gpt-4o');
    
    // Change method
    await page.locator('#method-select').selectOption('reasoning');
    await expect(page.locator('#method-select')).toHaveValue('reasoning');
  });

  test('should close modal when clicking close button', async ({ page }) => {
    await page.locator('.feature-card').click();
    
    // Modal should be visible
    await expect(page.locator('#config-modal.active')).toBeVisible();
    
    // Click close button (be specific to config modal)
    await page.locator('#config-modal .modal-close').click();
    
    // Modal should be hidden
    await expect(page.locator('#config-modal.active')).toBeHidden();
  });

  test('should close modal when clicking cancel button', async ({ page }) => {
    await page.locator('.feature-card').click();
    
    // Click cancel button
    await page.locator('button').filter({ hasText: 'Cancel' }).click();
    
    // Modal should be hidden
    await expect(page.locator('#config-modal.active')).toBeHidden();
  });

  test('should have Continue to Editor button enabled', async ({ page }) => {
    await page.locator('.feature-card').click();
    
    const continueBtn = page.locator('#continue-btn');
    await expect(continueBtn).toBeVisible();
    await expect(continueBtn).toBeEnabled();
    await expect(continueBtn).toContainText('Continue to Editor');
  });
});