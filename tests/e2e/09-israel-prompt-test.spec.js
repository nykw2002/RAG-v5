// tests/e2e/09-israel-prompt-test.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Israel Complaints Extraction Test', () => {
  const israelPrompt = "How many complaints are for Israel? Please provide a detailed list with all of them.";
  
  test('should process Israel complaints request successfully', async ({ page }) => {
    test.setTimeout(90000);
    
    await page.goto('/');
    
    // Open configuration modal
    await page.locator('.feature-card').click();
    await expect(page.locator('#config-modal.active')).toBeVisible();
    
    // Set the Israel prompt
    await page.locator('#default-prompt').clear();
    await page.locator('#default-prompt').fill(israelPrompt);
    
    // Set method to extraction  
    await page.locator('#method-select').selectOption('extraction');
    
    // Continue to editor
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    
    console.log('Waiting for AI to process Israel complaints...');
    
    // Wait for AI processing with extended timeout
    await page.waitForSelector('.preview-result', { timeout: 60000 });
    
    // Get the result
    const resultText = await page.locator('.preview-result').textContent();
    
    console.log('=== AI RESULT ===');
    console.log(resultText);
    console.log('=== END RESULT ===');
    
    // Basic validation - should have some content
    expect(resultText.length).toBeGreaterThan(10);
    
    // Should mention Israel (case insensitive)
    expect(resultText.toLowerCase()).toContain('israel');
    
    // Version controls should be visible
    await expect(page.locator('#version-indicator')).toBeVisible();
    await expect(page.locator('#version-text')).toContainText('Version 1');
    
    // Test version locking
    const lockBtn = page.locator('#lock-version-btn');
    await expect(lockBtn).toBeEnabled();
    await lockBtn.click();
    
    // Should show locked state
    await expect(lockBtn).toContainText('Locked');
    
    // Save button should be enabled
    await expect(page.locator('#save-element-btn')).toBeEnabled();
    
    console.log('✅ Israel complaints test completed successfully');
  });
  
  test('should handle chat iteration with realistic context', async ({ page }) => {
    test.setTimeout(120000);
    
    await page.goto('/');
    await page.locator('.feature-card').click();
    
    // Set Israel prompt
    await page.locator('#default-prompt').clear();
    await page.locator('#default-prompt').fill(israelPrompt);
    await page.locator('#method-select').selectOption('extraction');
    
    // Go to editor and wait for initial results
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    await page.waitForSelector('.preview-result', { timeout: 60000 });
    
    const initialResult = await page.locator('.preview-result').textContent();
    console.log('Initial result length:', initialResult.length);
    
    // Now test chat iteration
    const chatInput = page.locator('#chat-input');
    const sendBtn = page.locator('#send-btn');
    
    await chatInput.fill('Also show complaints from Germany');
    await sendBtn.click();
    
    // Wait for processing (should not timeout immediately)
    await expect(sendBtn).toContainText('Processing...');
    
    // Wait for processing to complete
    await page.waitForTimeout(30000); // Give it time to process
    
    // Check if version changed or result updated
    const finalResult = await page.locator('.preview-result').textContent();
    console.log('Final result length:', finalResult.length);
    console.log('Version after chat:', await page.locator('#version-text').textContent());
    
    // The result should be different or version should increment
    const versionChanged = await page.locator('#version-text').textContent() !== 'Version 1';
    const resultChanged = finalResult !== initialResult;
    
    if (versionChanged) {
      console.log('✅ Version incremented successfully');
    } else if (resultChanged) {
      console.log('✅ Result was updated (same version)');
    } else {
      console.log('⚠️ No clear change detected - this might indicate an issue');
    }
    
    expect(versionChanged || resultChanged).toBe(true);
  });
});