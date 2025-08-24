// tests/e2e/08-realistic-ai-testing.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Realistic AI Testing with Actual Data', () => {
  const israelPrompt = "How many complaints are for Israel? Please provide a detailed list with all of them.";
  
  test('should process realistic extraction request', async ({ page }) => {
    test.setTimeout(120000); // Extended timeout for AI processing
    
    await page.goto('/');
    
    // Open configuration modal
    await page.locator('.feature-card').click();
    await expect(page.locator('#config-modal.active')).toBeVisible();
    
    // Set realistic prompt
    await page.locator('#default-prompt').fill(israelPrompt);
    await expect(page.locator('#default-prompt')).toHaveValue(israelPrompt);
    
    // Set method to extraction
    await page.locator('#method-select').selectOption('extraction');
    await expect(page.locator('#method-select')).toHaveValue('extraction');
    
    // Continue to editor
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for AI processing
    console.log('Waiting for AI to process Israel complaints request...');
    await page.waitForSelector('.preview-result', { timeout: 90000 });
    
    // Check that results contain relevant data
    const previewResult = page.locator('.preview-result');
    const resultText = await previewResult.textContent();
    
    // Should contain Israel-related content
    expect(resultText.toLowerCase()).toContain('israel');
    expect(resultText.length).toBeGreaterThan(100); // Should be substantial content
    
    console.log('AI Result Preview:', resultText.substring(0, 200) + '...');
    
    // Version controls should be visible
    await expect(page.locator('#version-indicator')).toBeVisible();
    await expect(page.locator('#version-text')).toContainText('Version 1');
    
    // Lock version button should be available
    const lockBtn = page.locator('#lock-version-btn');
    await expect(lockBtn).toBeEnabled();
  });

  test('should handle chat iteration with context', async ({ page }) => {
    test.setTimeout(180000); // Extended timeout for multiple AI calls
    
    await page.goto('/');
    await page.locator('.feature-card').click();
    
    // Set initial prompt
    await page.locator('#default-prompt').fill(israelPrompt);
    await page.locator('#method-select').selectOption('extraction');
    
    // Go to editor
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for initial results
    await page.waitForSelector('.preview-result', { timeout: 90000 });
    
    // Get initial result for comparison
    const initialResult = await page.locator('.preview-result').textContent();
    
    // Now use chat to add more data
    const chatInput = page.locator('#chat-input');
    const sendBtn = page.locator('#send-btn');
    
    await chatInput.fill('Also add data from USA complaints');
    await sendBtn.click();
    
    // Wait for processing
    await expect(sendBtn).toContainText('Processing...');
    await page.waitForSelector('#send-btn:not(:disabled)', { timeout: 90000 });
    
    // Version should increment
    await expect(page.locator('#version-text')).toContainText('Version 2');
    
    // Result should be updated (different from initial)
    const updatedResult = await page.locator('.preview-result').textContent();
    expect(updatedResult).not.toBe(initialResult);
    expect(updatedResult.length).toBeGreaterThan(initialResult.length);
    
    console.log('Updated Result Preview:', updatedResult.substring(0, 200) + '...');
  });

  test('should complete full workflow with saving', async ({ page }) => {
    test.setTimeout(150000);
    
    await page.goto('/');
    await page.locator('.feature-card').click();
    
    // Use realistic prompt
    await page.locator('#default-prompt').fill(israelPrompt);
    await page.locator('#method-select').selectOption('extraction');
    
    // Go to editor and wait for results
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    await page.waitForSelector('.preview-result', { timeout: 90000 });
    
    // Lock version
    await page.locator('#lock-version-btn').click();
    await expect(page.locator('#lock-version-btn')).toContainText('Locked');
    
    // Save element
    const saveBtn = page.locator('#save-element-btn');
    await expect(saveBtn).toBeEnabled();
    
    // Handle save dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('saved successfully');
      await dialog.accept();
    });
    
    await saveBtn.click();
    await page.waitForTimeout(2000);
    
    // Go back to main page
    await page.locator('button').filter({ hasText: 'Close Editor' }).click();
    await expect(page.locator('#editor-modal.active')).toBeHidden();
    
    // Refresh dashboard
    await page.locator('.saved-elements-section button').click();
    await page.waitForTimeout(3000);
    
    // Should show saved element
    const elementCards = page.locator('.element-card');
    await expect(elementCards.first()).toBeVisible();
    
    // Element should contain relevant metadata
    const elementTitle = elementCards.first().locator('.element-title');
    const titleText = await elementTitle.textContent();
    expect(titleText.length).toBeGreaterThan(0);
  });

  test('should handle reasoning method with actual data', async ({ page }) => {
    test.setTimeout(120000);
    
    const reasoningPrompt = "Analyze overall complaint numbers and compare to previous period. State the total number of substantiated and unsubstantiated complaints during the review period.";
    
    await page.goto('/');
    await page.locator('.feature-card').click();
    
    // Set reasoning prompt
    await page.locator('#default-prompt').fill(reasoningPrompt);
    await page.locator('#method-select').selectOption('reasoning');
    
    // Go to editor
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for AI processing (reasoning may take longer)
    await page.waitForSelector('.preview-result', { timeout: 90000 });
    
    const resultText = await page.locator('.preview-result').textContent();
    
    // Should contain analytical content
    expect(resultText.toLowerCase()).toMatch(/(complaint|analysis|period|total)/);
    expect(resultText.length).toBeGreaterThan(100);
    
    console.log('Reasoning Result Preview:', resultText.substring(0, 200) + '...');
  });

  test('should handle errors gracefully', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/');
    await page.locator('.feature-card').click();
    
    // Set a potentially problematic prompt
    await page.locator('#default-prompt').fill('This is a test prompt that might cause issues');
    
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    // Wait for either result or error
    try {
      await page.waitForSelector('.preview-result', { timeout: 30000 });
      // If we get results, that's good
      const result = await page.locator('.preview-result').textContent();
      expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      // If we get an error message, that's also acceptable
      const errorMessage = await page.locator('.preview-content').textContent();
      expect(errorMessage.toLowerCase()).toContain('error');
    }
  });
});