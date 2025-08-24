# 🔄 Frontend-Backend Communication

## System Integration Overview

```mermaid
graph LR
    A[Browser Frontend] <--> B[FastAPI Backend]
    B <--> C[OpenAI API]
    B <--> D[File System]
    
    A -->|HTTP/JSON| E[REST API Calls]
    E --> B
    B -->|Responses| A
    
    B -->|AI Requests| C
    C -->|AI Results| B
    
    B -->|Read/Write| D
    D -->|Data| B
```

---

## 🌐 Communication Architecture

### **High-Level Data Flow**
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (JS)
    participant B as Backend (FastAPI)
    participant AI as OpenAI API
    participant FS as File System
    
    U->>F: Interact with UI
    F->>B: HTTP Request (JSON)
    
    alt AI Processing Required
        B->>AI: Process Request
        AI->>B: AI Response
    end
    
    alt Data Storage Required
        B->>FS: Save/Load Data
        FS->>B: Data Response
    end
    
    B->>F: HTTP Response (JSON)
    F->>U: Update UI
```

---

## 📡 API Communication Patterns

### **Request-Response Flow**

```mermaid
graph TD
    A[User Action] --> B[JavaScript Function]
    
    B --> C[Collect Form Data]
    B --> D[Validate Input]
    B --> E[Show Loading State]
    B --> F[Make fetch() Call]
    
    C --> G[HTTP Request]
    D --> G
    E --> G
    F --> G
    
    G --> H[Method: POST/GET/DELETE]
    G --> I[Headers: Content-Type]
    G --> J[Body: JSON Payload]
    
    H --> K[Backend FastAPI]
    I --> K
    J --> K
    
    K --> L[Endpoint Handler]
    L --> M[Validate Request Data]
    L --> N[Process Business Logic]
    L --> O[External API Calls]
    L --> P[Save/Load Data]
    L --> Q[Return JSON Response]
    
    M --> R[HTTP Response]
    N --> R
    O --> R
    P --> R
    Q --> R
    
    R --> S[Status: 200/400/500]
    R --> T[Headers: Content-Type]
    R --> U[Body: JSON Data]
    
    S --> V[Frontend Processing]
    T --> V
    U --> V
    
    V --> W[Parse JSON Response]
    V --> X[Handle Success/Error]
    V --> Y[Update UI State]
    V --> Z[Show User Feedback]
```

---

## 🔄 Core Communication Flows

### **1. Configuration & AI Processing**
```mermaid
sequenceDiagram
    participant UI as Config Modal
    participant JS as JavaScript
    participant API as FastAPI
    participant AI as OpenAI
    participant Engine as Analysis Engine
    
    UI->>JS: User clicks "Continue to Editor"
    JS->>JS: Collect form data
    JS->>API: POST /api/process-config
    
    API->>Engine: process_analysis_request()
    Engine->>AI: Generate/execute analysis
    AI->>Engine: Return results
    Engine->>API: Processed output
    
    API->>JS: JSON response with results
    JS->>UI: Display results in editor
```

### **2. Element Management**
```mermaid
sequenceDiagram
    participant UI as Element UI
    participant JS as JavaScript  
    participant API as FastAPI
    participant EM as Element Manager
    participant FS as File System
    
    UI->>JS: User saves element
    JS->>API: POST /api/elements/save
    
    API->>EM: save_element()
    EM->>FS: Write element data
    FS->>EM: Confirm saved
    EM->>API: Return success
    
    API->>JS: {success: true}
    JS->>UI: Show success message
    
    Note over UI,FS: Similar flows for GET/DELETE operations
```

### **3. Chat Iteration**
```mermaid
sequenceDiagram
    participant Chat as Chat Interface
    participant JS as JavaScript
    participant API as FastAPI
    participant AI as OpenAI
    participant VC as Version Control
    
    Chat->>JS: User sends chat message
    JS->>API: POST /api/chat/iterate
    
    API->>AI: Process with context
    AI->>API: Updated response
    
    API->>VC: Create new version
    VC->>API: Version created
    
    API->>JS: New version data
    JS->>Chat: Update UI with new version
```

---

## 📊 Data Formats & Structures

### **Configuration Request**
```json
{
    "user_prompt": "How many complaints are for Israel?",
    "method": "extraction",
    "model": "gpt-4o",
    "files": [
        {
            "file_name": "test.txt",
            "file_type": "TXT", 
            "file_path": "test.txt"
        }
    ],
    "document_sources": [],
    "referenced_elements": ["kpi-table"]
}
```

### **AI Processing Response**
```json
{
    "success": true,
    "result": "Number of complaints for Israel: 14\nDetailed list...",
    "user_prompt": "How many complaints are for Israel?",
    "method": "extraction",
    "model": "gpt-4o",
    "processing_time": 12.5,
    "metadata": {
        "script_generated": true,
        "execution_successful": true
    }
}
```

### **Element Save Request**
```json
{
    "element_id": "element_1756075221594_jnli4rvwa",
    "element_name": "Israel Complaints Analysis",
    "saved_version": 1,
    "output": "Number of complaints for Israel: 14...",
    "full_chat_history": ["How many complaints..."],
    "context_used": "How many complaints are for Israel?",
    "created_at": "2025-01-24T22:40:51.594Z",
    "saved_at": "2025-01-24T22:41:15.123Z",
    "all_versions": [
        {
            "version": 1,
            "locked": true,
            "timestamp": "2025-01-24T22:40:51.594Z"
        }
    ]
}
```

---

## ⚡ Real-Time Interaction Patterns

### **Loading States Management**
```javascript
// Frontend Loading Pattern
async function processConfiguration() {
    const continueBtn = document.getElementById('continue-btn');
    
    try {
        // 1. Show loading state
        continueBtn.disabled = true;
        continueBtn.textContent = 'Processing...';
        showLoadingInPreview();
        
        // 2. Make API call
        const response = await fetch('/api/process-config', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(configData)
        });
        
        const result = await response.json();
        
        // 3. Handle response
        if (result.success) {
            displayAIResult(result);
            openEditorModal();
        } else {
            throw new Error(result.detail);
        }
        
    } catch (error) {
        // 4. Error handling
        showAlert('Error: ' + error.message, 'error');
    } finally {
        // 5. Reset UI state
        continueBtn.disabled = false;
        continueBtn.textContent = 'Continue to Editor';
    }
}
```

### **Error Propagation**

```mermaid
graph TD
    A[Backend Processing] --> B{Try/Catch Block}
    
    B -->|Success| C[Return Success Response]
    B -->|OpenAI Error| D[Return AI Error]  
    B -->|General Exception| E[Return Server Error]
    
    D --> F[JSON Response: success=false]
    E --> F
    C --> G[JSON Response: success=true]
    
    F --> H[Frontend Error Handling]
    G --> I[Frontend Success Handling]
    
    H --> J[Parse Error Message]
    H --> K[Show Error Alert]
    H --> L[Log to Console]
    
    I --> M[Parse Success Data]
    I --> N[Update UI]
    I --> O[Show Success Feedback]
```

---

## 🔐 Authentication & Security Flow

### **Current Implementation** 

```mermaid
graph LR
    A[Frontend Request] --> B[HTTP Headers]
    B --> C[Content-Type: application/json]
    B --> D[Method: POST/GET/DELETE]
    B --> E[Body: JSON Data]
    
    C --> F[Backend Endpoint]
    D --> F
    E --> F
    
    F --> G[No Authentication Currently]
    G --> H[Direct Processing]
    H --> I[Return Response]
```

### **Future Authentication Flow**
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant B as Backend API
    
    U->>F: Login Request
    F->>A: POST /auth/login
    A->>F: JWT Token
    F->>F: Store token in memory
    
    U->>F: Make API Request
    F->>B: Request + Authorization Header
    B->>B: Validate JWT
    B->>F: Authorized Response
```

---

## 📈 Performance Optimization

### **Request Optimization Strategies**

#### **1. Batch Operations**
```javascript
// Instead of multiple individual requests
const elements = await Promise.all([
    fetch('/api/elements/1'),
    fetch('/api/elements/2'), 
    fetch('/api/elements/3')
]);

// Use batch endpoint (future enhancement)
const elements = await fetch('/api/elements/batch', {
    method: 'POST',
    body: JSON.stringify({ids: [1, 2, 3]})
});
```

#### **2. Caching Strategy**

```mermaid
graph TD
    A[Request Data] --> B{Check Cache}
    
    B -->|Cache Hit| C[Return Cached Data]
    B -->|Cache Miss| D[Fetch from API]
    B -->|Cache Expired| D
    
    D --> E[Store in Cache]
    E --> F[Return Fresh Data]
    
    G[Cache Policy] --> H[5 minute TTL for config]
    G --> I[1 minute TTL for elements]
    G --> J[No cache for AI processing]
```

#### **3. Progressive Loading**
```javascript
// Load dashboard data progressively
async function loadDashboard() {
    // 1. Load critical UI first
    showDashboardSkeleton();
    
    // 2. Load configuration (fast)
    const config = await loadConfiguration();
    updateConfigUI(config);
    
    // 3. Load saved elements (slower)
    const elements = await loadSavedElements();
    updateElementsGrid(elements);
    
    // 4. Hide skeleton
    hideDashboardSkeleton();
}
```

---

## 🔧 Development & Debugging

### **API Development Workflow**
```mermaid
graph LR
    A[Frontend Change] --> B[Test in Browser]
    B --> C[Check Network Tab]
    C --> D[Inspect Request/Response]
    D --> E[Debug Backend Code]
    E --> F[Fix Issue]
    F --> G[Test Again]
    G --> A
```

### **Common Debugging Points**

```mermaid
graph TB
    A[Debugging Strategy] --> B[Frontend Debugging]
    A --> C[Backend Debugging]
    
    B --> D[Browser Console]
    B --> E[Network Tab]
    
    D --> F[JavaScript Errors]
    D --> G[Network Requests]
    D --> H[Response Data]
    
    E --> I[Request Headers]
    E --> J[Request Payload]
    E --> K[Response Status]
    E --> L[Response Time]
    
    C --> M[FastAPI Logs]
    C --> N[Custom Logging]
    
    M --> O[Request Processing]
    M --> P[AI API Calls]
    M --> Q[Error Traces]
    
    N --> R[print() Statements]
    N --> S[logging.debug()]
    N --> T[Request Timing]
```

---

## 🚀 Deployment Communication

### **Development Environment**

```mermaid
graph LR
    A[Frontend Static Files] --> B[Same Origin Communication]
    C[Backend localhost:8000] --> B
    D[OpenAI API api.openai.com] --> B
    
    B --> E[Direct API Calls]
    B --> F[No CORS Issues]  
    B --> G[Simple Development]
```

### **Production Environment (Future)**

```mermaid
graph TD
    A[CDN/Static Hosting] --> B[Frontend Assets]
    
    B --> C[JS, CSS, HTML Files]
    B --> D[Global Caching]
    B --> E[Gzip Compression]
    B --> F[Versioned URLs]
    
    C --> G[API Calls]
    
    G --> H[Application Server]
    H --> I[FastAPI Backend]
    
    I --> J[Load Balanced]
    I --> K[Auto-scaling]
    I --> L[Health Checks]
    I --> M[Monitoring]
    
    H --> N[AI Requests]
    N --> O[External APIs]
    
    O --> P[OpenAI API]
    O --> Q[Rate Limiting]
    O --> R[Error Handling]
    O --> S[Cost Monitoring]
```

---

## 📋 Integration Testing

### **End-to-End Communication Test**
```javascript
// Playwright E2E Test Example
test('Complete AI processing workflow', async ({ page }) => {
    // 1. Frontend interaction
    await page.goto('/');
    await page.click('.feature-card');
    
    // 2. API communication verification
    const configResponse = page.waitForResponse('/api/process-config');
    await page.click('#continue-btn');
    
    // 3. Verify backend processing
    const response = await configResponse;
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    
    // 4. Verify frontend update
    await expect(page.locator('.preview-result')).toBeVisible();
    await expect(page.locator('#version-text')).toContainText('Version 1');
});
```

This comprehensive documentation provides a clear overview of how the frontend and backend communicate, making it easy to understand the system's integration points and data flow patterns! 🎯