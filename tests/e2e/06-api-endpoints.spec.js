// tests/e2e/06-api-endpoints.spec.js
const { test, expect } = require('@playwright/test');

test.describe('API Endpoints', () => {
  test('should respond to health check endpoint', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('healthy');
    expect(data).toHaveProperty('api_key_configured');
    expect(data).toHaveProperty('requirements_met');
  });

  test('should respond to config endpoint', async ({ page }) => {
    const response = await page.request.get('/api/config');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('default_prompt');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('method');
  });

  test('should respond to elements endpoint', async ({ page }) => {
    const response = await page.request.get('/api/elements');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('elements');
    expect(data).toHaveProperty('stats');
    expect(Array.isArray(data.elements)).toBe(true);
  });

  test('should handle file listing endpoint', async ({ page }) => {
    const response = await page.request.get('/api/files');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('files');
    expect(Array.isArray(data.files)).toBe(true);
  });

  test('should handle test endpoint', async ({ page }) => {
    const response = await page.request.get('/api/test');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('API is working!');
  });
});

test.describe('POST API Endpoints', () => {
  test('should handle config processing', async ({ page }) => {
    const configData = {
      default_prompt: 'Test prompt',
      model: 'gpt-4o-mini',
      method: 'extraction',
      document_sources: [],
      referenced_elements: ['kpi-table']
    };
    
    const response = await page.request.post('/api/process-config', {
      data: configData
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('result');
  });

  test('should validate chat iteration endpoint structure', async ({ page }) => {
    const iterationData = {
      user_message: 'Test message',
      method: 'extraction',
      current_context: 'Test context',
      chat_history: [],
      element_context: {
        original_prompt: 'Test prompt'
      }
    };
    
    const response = await page.request.post('/api/chat/iterate', {
      data: iterationData
    });
    
    // Should process request (may succeed or fail based on AI availability)
    expect([200, 500]).toContain(response.status());
  });

  test('should validate element save endpoint structure', async ({ page }) => {
    const elementData = {
      element_id: 'test-element-id',
      element_name: 'Test Element',
      saved_version: 1,
      output: 'Test output',
      full_chat_history: ['Test prompt'],
      context_used: 'Test context',
      created_at: new Date().toISOString(),
      saved_at: new Date().toISOString(),
      all_versions: [{ version: 1, locked: true, timestamp: new Date().toISOString() }]
    };
    
    const response = await page.request.post('/api/elements/save', {
      data: elementData
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 for non-existent endpoints', async ({ page }) => {
    const response = await page.request.get('/api/non-existent-endpoint');
    expect(response.status()).toBe(404);
  });

  test('should handle invalid POST data', async ({ page }) => {
    const response = await page.request.post('/api/elements/save', {
      data: { invalid: 'data' }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('detail');
  });

  test('should handle missing required fields in chat iteration', async ({ page }) => {
    const response = await page.request.post('/api/chat/iterate', {
      data: {}
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.detail).toContain('User message is required');
  });
});