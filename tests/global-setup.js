// tests/global-setup.js
const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting global test setup...');
  
  // Wait for server to be ready
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let retries = 30;
  let serverReady = false;
  
  while (retries > 0 && !serverReady) {
    try {
      await page.goto('http://localhost:8000/api/health');
      const response = await page.textContent('body');
      if (response && response.includes('healthy')) {
        serverReady = true;
        console.log('✅ Server is ready for testing');
      }
    } catch (error) {
      console.log(`⏳ Waiting for server... (${retries} retries left)`);
      await page.waitForTimeout(2000);
      retries--;
    }
  }
  
  if (!serverReady) {
    throw new Error('❌ Server failed to start within timeout period');
  }
  
  await browser.close();
  console.log('🎯 Global setup completed');
}

module.exports = globalSetup;