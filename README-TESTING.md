# AI Document Analysis System - Testing Guide

## 🧪 Comprehensive End-to-End Testing with Playwright

This system includes a complete Playwright test suite that covers all functionality of the AI Document Analysis System, including the dynamic element versioning system.

## 📋 Test Coverage

### Test Suites:

1. **Basic Functionality** (`01-basic-functionality.spec.js`)
   - Main page loading and components
   - System status indicators
   - Dashboard section display
   - API health checks

2. **Configuration Modal** (`02-configuration-modal.spec.js`)
   - Modal opening/closing
   - Form field validation
   - Default values and user input
   - Navigation controls

3. **Editor Modal & AI Processing** (`03-editor-modal-and-ai-processing.spec.js`)
   - Modal transitions
   - AI request processing
   - Results display
   - Version control initialization

4. **Version Control System** (`04-version-control-system.spec.js`)
   - Version creation and management
   - Lock/unlock functionality
   - Element saving
   - Chat iteration with context feeding

5. **Saved Elements Dashboard** (`05-saved-elements-dashboard.spec.js`)
   - Dashboard display
   - Element cards and metadata
   - CRUD operations
   - Refresh functionality

6. **API Endpoints** (`06-api-endpoints.spec.js`)
   - All REST API endpoints
   - Request/response validation
   - Error handling
   - Data persistence

7. **Responsive Design** (`07-responsive-design.spec.js`)
   - Desktop, tablet, mobile layouts
   - Modal responsiveness
   - Touch-friendly interactions
   - Text readability

## 🚀 Quick Start

### Prerequisites:
- Python 3.8+ (for the FastAPI backend)
- Node.js 16+ (for Playwright)
- All Python dependencies installed (`pip install -r requirements.txt`)

### Install Test Dependencies:
```bash
# Install Node.js dependencies and Playwright browsers
python run-tests.py --install-only
```

### Run All Tests:
```bash
# Run complete test suite (headless)
python run-tests.py

# Run with browser visible
python run-tests.py --headed

# Run with Playwright UI for debugging
python run-tests.py --ui

# Run specific test file
python run-tests.py --test-file tests/e2e/01-basic-functionality.spec.js
```

## 🛠 Advanced Usage

### Using NPM Scripts:
```bash
# Run tests (requires server to be running separately)
npm test

# Run with browser visible
npm run test:headed

# Run with Playwright UI
npm run test:ui

# Show test report
npm run test:report
```

### Manual Server + Tests:
```bash
# Terminal 1: Start server
python app.py

# Terminal 2: Run tests
npx playwright test
```

## 📊 Test Reports

Tests generate multiple report formats:
- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`

View HTML report:
```bash
npx playwright show-report
```

## 🎯 Test Scenarios Covered

### Complete User Flows:
1. **Basic Configuration Flow**:
   - Open configuration modal
   - Set analysis parameters
   - Continue to editor
   - View AI results

2. **Version Control Flow**:
   - Create initial element (V1)
   - Lock version for saving
   - Use chat to iterate (V2, V3...)
   - Save specific version

3. **Dashboard Management**:
   - View saved elements
   - Element metadata display
   - Delete elements
   - Refresh functionality

4. **Chat Iteration Flow**:
   - Send chat messages
   - Context feeding to AI
   - Version creation
   - Method switching (extraction/reasoning)

### AI Processing Tests:
- Extraction method processing
- Reasoning method with RAG
- Context preservation
- Error handling
- Timeout management

### Responsive Design Tests:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)
- Touch interactions
- Modal adaptability

## 🐛 Debugging Tests

### Run Single Test in Debug Mode:
```bash
npx playwright test tests/e2e/01-basic-functionality.spec.js --debug
```

### View Test Traces:
```bash
npx playwright show-trace test-results/trace.zip
```

### Screenshots and Videos:
- Screenshots saved on failure: `test-results/`
- Videos available for failed tests
- Trace files for detailed debugging

## ⚙️ Configuration

### Timeouts:
- Global test timeout: 60 seconds
- AI processing timeout: 60 seconds (configurable)
- Action timeout: 30 seconds
- Navigation timeout: 60 seconds

### Browser Configuration:
- Chromium (default)
- Firefox
- WebKit/Safari
- Mobile Chrome
- Mobile Safari

### Environment Variables:
- `CI=true`: Enables CI-specific settings
- `BASE_URL`: Override base URL (default: http://localhost:8000)

## 🔧 Troubleshooting

### Common Issues:

1. **Server not starting**:
   ```bash
   # Check if port 8000 is available
   netstat -ano | findstr :8000
   ```

2. **Tests timing out**:
   - Increase timeout in `playwright.config.js`
   - Check AI API key configuration
   - Verify server performance

3. **Playwright installation issues**:
   ```bash
   # Reinstall browsers
   npx playwright install --force
   ```

4. **Missing dependencies**:
   ```bash
   # Reinstall all dependencies
   npm install
   pip install -r requirements.txt
   ```

## 📈 Continuous Integration

The test suite is ready for CI/CD integration:
- Supports headless execution
- Generates multiple report formats
- Includes server lifecycle management
- Handles cleanup automatically

Example GitHub Actions usage:
```yaml
- name: Run E2E Tests
  run: python run-tests.py --no-cleanup
```

## 🎯 Test Development

### Adding New Tests:
1. Create test file in `tests/e2e/`
2. Follow naming convention: `##-feature-name.spec.js`
3. Use existing patterns and helpers
4. Include both positive and negative test cases

### Best Practices:
- Use descriptive test names
- Include proper setup/teardown
- Handle async operations properly
- Test error conditions
- Use page object patterns for complex interactions

## 📝 Test Results Interpretation

### Exit Codes:
- `0`: All tests passed
- `1`: Some tests failed
- `2`: Configuration or setup error

### Reports Include:
- Test execution summary
- Individual test results
- Screenshots for failures
- Performance metrics
- Browser compatibility results