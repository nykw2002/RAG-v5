// tests/e2e/07-responsive-design.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Responsive Design', () => {
  test('should work on desktop resolution', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Check main elements are visible
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.feature-grid')).toBeVisible();
    await expect(page.locator('.saved-elements-section')).toBeVisible();
    
    // Check that elements have proper spacing
    const featureCard = page.locator('.feature-card');
    const boundingBox = await featureCard.boundingBox();
    expect(boundingBox.width).toBeGreaterThan(300);
  });

  test('should work on tablet resolution', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // All main elements should still be visible
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.feature-grid')).toBeVisible();
    await expect(page.locator('.saved-elements-section')).toBeVisible();
  });

  test('should work on mobile resolution', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Elements should stack properly
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.feature-card')).toBeVisible();
    
    // Check that text is still readable
    const headerText = page.locator('h1');
    await expect(headerText).toContainText('AI Document Analysis System');
  });

  test('should have responsive modals', async ({ page }) => {
    // Test on mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open configuration modal
    await page.locator('.feature-card').click();
    
    const modal = page.locator('#config-modal.active');
    await expect(modal).toBeVisible();
    
    // Modal should fit within viewport
    const modalContent = modal.locator('.modal-content');
    const boundingBox = await modalContent.boundingBox();
    expect(boundingBox.width).toBeLessThanOrEqual(375);
    
    // Form elements should still be accessible
    await expect(page.locator('#default-prompt')).toBeVisible();
    await expect(page.locator('#model-select')).toBeVisible();
  });

  test('should have responsive editor modal', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Navigate to editor
    await page.locator('.feature-card').click();
    await page.locator('#continue-btn').click();
    
    const editorModal = page.locator('#editor-modal.active');
    await expect(editorModal).toBeVisible();
    
    // Chat panel and preview panel should be visible
    await expect(page.locator('.chat-panel')).toBeVisible();
    await expect(page.locator('.preview-panel')).toBeVisible();
  });

  test('should have responsive dashboard grid', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      const dashboardGrid = page.locator('.saved-elements-grid');
      await expect(dashboardGrid).toBeVisible();
      
      // Grid should adapt to viewport
      const boundingBox = await dashboardGrid.boundingBox();
      expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
    }
  });
});

test.describe('Mobile-Specific Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('should have touch-friendly buttons', async ({ page }) => {
    await page.goto('/');
    
    // Feature card should be large enough for touch
    const featureCard = page.locator('.feature-card');
    const boundingBox = await featureCard.boundingBox();
    expect(boundingBox.height).toBeGreaterThan(44); // iOS minimum touch target
  });

  test('should handle modal interactions on mobile', async ({ page }) => {
    await page.goto('/');
    await page.locator('.feature-card').click();
    
    // Modal should be full-screen friendly
    const modal = page.locator('#config-modal.active');
    await expect(modal).toBeVisible();
    
    // Close button should be easily accessible
    const closeBtn = page.locator('.modal-close');
    await expect(closeBtn).toBeVisible();
    
    const closeBtnBox = await closeBtn.boundingBox();
    expect(closeBtnBox.width).toBeGreaterThan(44);
    expect(closeBtnBox.height).toBeGreaterThan(44);
  });

  test('should have readable text on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check font sizes are appropriate
    const headerText = page.locator('h1');
    const computedStyle = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return window.getComputedStyle(h1).fontSize;
    });
    
    // Font size should be at least 16px for readability
    const fontSize = parseFloat(computedStyle);
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });
});