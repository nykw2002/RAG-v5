// tests/global-teardown.js

async function globalTeardown(config) {
  console.log('🧹 Starting global test teardown...');
  
  // Clean up test data if needed
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Clean up any test-generated files
    const testDataDir = path.join(__dirname, '..', 'saved_elements');
    if (fs.existsSync(testDataDir)) {
      console.log('🗑️ Cleaning up test data...');
      // We could clean test data here, but for now keep it for inspection
    }
    
    console.log('✅ Global teardown completed');
  } catch (error) {
    console.warn('⚠️ Warning during teardown:', error.message);
  }
}

module.exports = globalTeardown;