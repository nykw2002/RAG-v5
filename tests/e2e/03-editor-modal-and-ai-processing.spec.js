// tests/e2e/03-editor-modal-and-ai-processing.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Editor Modal and AI Processing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Open configuration modal
    await page.locator('.feature-card').click();
  });

  test('should transition from configuration to editor modal', async ({ page }) => {
    // Click Continue to Editor button
    await page.locator('#continue-btn').click();
    
    // Configuration modal should close
    await expect(page.locator('#config-modal.active')).toBeHidden();
    
    // Editor modal should open
    const editorModal = page.locator('#editor-modal.active');
    await expect(editorModal).toBeVisible();
    
    // Check editor modal content
    await expect(editorModal.locator('h2')).toContainText('AI Document Editor');
  });

  test('should display chat interface in editor', async ({ page }) => {
    await page.locator('#continue-btn').click();
    
    // Wait for editor modal
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Check chat interface components
    await expect(page.locator('.chat-panel')).toBeVisible();
    await expect(page.locator('#chat-messages')).toBeVisible();
    await expect(page.locator('#chat-input')).toBeVisible();
    await expect(page.locator('#send-btn')).toBeVisible();
    
    // Check method selector
    await expect(page.locator('.method-btn[data-method="extraction"]')).toBeVisible();
    await expect(page.locator('.method-btn[data-method="reasoning"]')).toBeVisible();
  });

  test('should display preview panel with version controls', async ({ page }) => {
    await page.locator('#continue-btn').click();
    
    // Wait for editor modal
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Check preview panel
    await expect(page.locator('.preview-panel')).toBeVisible();
    await expect(page.locator('#preview-content')).toBeVisible();
  });

  test('should process AI request and show results', async ({ page }) => {
    // Set a longer timeout for AI processing
    test.setTimeout(120000);
    
    await page.locator('#continue-btn').click();
    
    // Wait for editor modal
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for AI processing to complete (loading indicator should appear and disappear)
    await page.waitForSelector('.loading', { timeout: 10000 });
    
    // Wait for results to appear (with longer timeout for AI processing)
    await page.waitForSelector('.preview-result', { timeout: 60000 });
    
    // Check that results are displayed
    const previewResult = page.locator('.preview-result');
    await expect(previewResult).toBeVisible();
    
    // Content should not be empty
    const content = await previewResult.textContent();
    expect(content.trim().length).toBeGreaterThan(0);
  });

  test('should show version controls after AI processing', async ({ page }) => {
    test.setTimeout(120000);
    
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for AI processing to complete
    await page.waitForSelector('.preview-result', { timeout: 60000 });
    
    // Check version controls are visible
    await expect(page.locator('#version-indicator')).toBeVisible();
    await expect(page.locator('#version-controls')).toBeVisible();
    await expect(page.locator('#lock-version-btn')).toBeVisible();
    await expect(page.locator('#save-element-btn')).toBeVisible();
    
    // Check version text
    await expect(page.locator('#version-text')).toContainText('Version 1');
  });

  test('should enable lock version functionality', async ({ page }) => {
    test.setTimeout(120000);
    
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for AI processing to complete
    await page.waitForSelector('.preview-result', { timeout: 60000 });
    
    // Lock version button should be enabled
    const lockBtn = page.locator('#lock-version-btn');
    await expect(lockBtn).toBeEnabled();
    await expect(lockBtn).toContainText('Lock Version');
    
    // Click lock version
    await lockBtn.click();
    
    // Button should change to indicate locked state
    await expect(lockBtn).toContainText('Locked ✓');
    await expect(lockBtn).toBeDisabled();
    
    // Save button should become enabled
    await expect(page.locator('#save-element-btn')).toBeEnabled();
  });

  test('should have working back navigation', async ({ page }) => {
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Click Back to Configuration
    await page.locator('button').filter({ hasText: 'Back to Configuration' }).click();
    
    // Editor modal should close, config modal should open
    await expect(page.locator('#editor-modal.active')).toBeHidden();
    await expect(page.locator('#config-modal.active')).toBeVisible();
  });
});