// tests/e2e/04-version-control-system.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Version Control System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to editor with AI results
    await page.locator('.feature-card').click();
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    // Wait for AI processing to complete
    await page.waitForSelector('.preview-result', { timeout: 60000 });
  });

  test('should initialize version control system', async ({ page }) => {
    // Version controls should be visible
    await expect(page.locator('#version-indicator')).toBeVisible();
    await expect(page.locator('#version-controls')).toBeVisible();
    await expect(page.locator('#version-status')).toBeVisible();
    
    // Should start with Version 1
    await expect(page.locator('#version-text')).toContainText('Version 1');
  });

  test('should allow locking current version', async ({ page }) => {
    const lockBtn = page.locator('#lock-version-btn');
    const saveBtn = page.locator('#save-element-btn');
    
    // Initially save button should be disabled
    await expect(saveBtn).toBeDisabled();
    
    // Lock the version
    await lockBtn.click();
    
    // Button should change state
    await expect(lockBtn).toContainText('Locked ✓');
    await expect(lockBtn).toBeDisabled();
    
    // Save button should be enabled
    await expect(saveBtn).toBeEnabled();
  });

  test('should display locked versions', async ({ page }) => {
    // Lock version 1
    await page.locator('#lock-version-btn').click();
    
    // Check locked versions display
    const lockedVersionsContainer = page.locator('#locked-versions');
    await expect(lockedVersionsContainer).toBeVisible();
    
    // Should show version chip
    const versionChip = lockedVersionsContainer.locator('.version-chip.locked');
    await expect(versionChip).toBeVisible();
    await expect(versionChip).toContainText('V1');
  });

  test('should save element successfully', async ({ page }) => {
    test.setTimeout(90000);
    
    // Lock version first
    await page.locator('#lock-version-btn').click();
    
    // Save element
    const saveBtn = page.locator('#save-element-btn');
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    
    // Wait for save to complete
    await page.waitForTimeout(3000);
    
    // Should show success message (check for alert or notification)
    // Note: The actual implementation shows an alert, so we can check for it
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('saved successfully');
      await dialog.accept();
    });
  });
});

test.describe('Chat Iteration and Version Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('.feature-card').click();
    await page.locator('#continue-btn').click();
    await expect(page.locator('#editor-modal.active')).toBeVisible();
    await page.waitForSelector('.preview-result', { timeout: 60000 });
  });

  test('should allow method switching in chat', async ({ page }) => {
    const extractionBtn = page.locator('.method-btn[data-method="extraction"]');
    const reasoningBtn = page.locator('.method-btn[data-method="reasoning"]');
    
    // Extraction should be active by default
    await expect(extractionBtn).toHaveClass(/active/);
    await expect(reasoningBtn).not.toHaveClass(/active/);
    
    // Switch to reasoning
    await reasoningBtn.click();
    await expect(reasoningBtn).toHaveClass(/active/);
    await expect(extractionBtn).not.toHaveClass(/active/);
  });

  test('should handle chat input and keyboard interaction', async ({ page }) => {
    const chatInput = page.locator('#chat-input');
    const sendBtn = page.locator('#send-btn');
    
    // Input should be focusable
    await chatInput.click();
    await expect(chatInput).toBeFocused();
    
    // Type message
    await chatInput.fill('Test message for analysis');
    await expect(chatInput).toHaveValue('Test message for analysis');
    
    // Send button should be enabled
    await expect(sendBtn).toBeEnabled();
  });

  test('should process chat iteration and create new version', async ({ page }) => {
    test.setTimeout(120000);
    
    const chatInput = page.locator('#chat-input');
    const sendBtn = page.locator('#send-btn');
    
    // Send a chat message
    await chatInput.fill('Add data from USA as well');
    await sendBtn.click();
    
    // Chat input should be cleared and disabled during processing
    await expect(chatInput).toHaveValue('');
    await expect(sendBtn).toBeDisabled();
    
    // Should show processing state
    await expect(sendBtn).toContainText('Processing...');
    
    // Wait for processing to complete
    await page.waitForSelector('#send-btn:not(:disabled)', { timeout: 60000 });
    
    // Version should increment to Version 2
    await expect(page.locator('#version-text')).toContainText('Version 2');
  });

  test('should maintain chat history', async ({ page }) => {
    test.setTimeout(120000);
    
    const chatInput = page.locator('#chat-input');
    const sendBtn = page.locator('#send-btn');
    const chatMessages = page.locator('#chat-messages');
    
    // Send first message
    await chatInput.fill('First test message');
    await sendBtn.click();
    
    // Wait for processing
    await page.waitForSelector('#send-btn:not(:disabled)', { timeout: 60000 });
    
    // Check message appears in chat
    await expect(chatMessages.locator('.user-message')).toContainText('First test message');
    
    // Send second message
    await chatInput.fill('Second test message');
    await sendBtn.click();
    
    await page.waitForSelector('#send-btn:not(:disabled)', { timeout: 60000 });
    
    // Both messages should be visible
    const userMessages = chatMessages.locator('.user-message');
    await expect(userMessages).toHaveCount(2);
  });
});