# ⚙️ Backend Functionality Overview

## System Architecture Flow

```mermaid
graph TD
    A[FastAPI Server] --> B[Configuration API]
    A --> C[AI Processing Engine] 
    A --> D[Element Management]
    A --> E[Static File Serving]
    
    C --> F[OpenAI Integration]
    C --> G[Script Generation]
    C --> H[Result Processing]
    
    D --> I[File Storage System]
    D --> J[CRUD Operations]
    
    K[Playwright Testing] --> A
```

---

## 📡 API Endpoint Flow

```mermaid
graph LR
    A[Frontend Request] --> B[FastAPI Router]
    
    B --> C[/api/config - GET/POST]
    B --> D[/api/process-config - POST]
    B --> E[/api/chat/iterate - POST]
    B --> F[/api/elements/* - GET/POST/DELETE]
    B --> G[/static/* - Static Files]
    
    C --> H[Configuration Management]
    D --> I[AI Processing]
    E --> J[Chat Iterations]
    F --> K[Element CRUD]
```

**Core Endpoints:**
- **Configuration**: Load/save app settings
- **AI Processing**: Main analysis endpoint
- **Chat Iteration**: Conversational refinement
- **Elements**: Save, load, delete results
- **Static Files**: Serve UI assets

---

## 🤖 AI Processing Flow

```mermaid
graph TD
    A[User Request] --> B{Analysis Method}
    
    B -->|extraction| C[Script Generation Mode]
    B -->|reasoning| D[RAG Processing Mode]
    
    C --> E[Generate Python Script]
    E --> F[Execute Script with Data]
    F --> G[Extract Results]
    
    D --> H[Context Enhancement]
    H --> I[OpenAI Reasoning Call]
    I --> J[Process Response]
    
    G --> K[Validate & Format Output]
    J --> K
    
    K --> L[Return to Frontend]
```

**Processing Steps:**
1. **Request Analysis**: Parse user prompt and method
2. **Script Generation**: Create custom Python code for extraction
3. **Execution**: Run script against data files
4. **Result Processing**: Format and validate output
5. **Response**: Send results back to frontend

### **Current JSON Schema (test_config.json)**

The system processes requests using this exact JSON structure:

```json
{
  "user_prompt": "How many complaints are for Israel? Please provide a detailed list with all of them.",
  "method": "extraction",
  "model": "gpt-4o-mini",
  "data": [],
  "files": [
    {
      "file_name": "test",
      "file_type": "TXT",
      "file_path": "test.txt"
    }
  ]
}
```

**Schema Fields:**
- **user_prompt**: The analysis question/request
- **method**: "extraction" or "reasoning"
- **model**: OpenAI model selection
- **data**: Additional data context (currently unused)
- **files**: Array of files to process

---

## 🔄 OpenAI Integration Flow

```mermaid
graph LR
    A[Backend Request] --> B[Model Selection]
    
    B --> C[gpt-4o]
    B --> D[gpt-4o-mini]
    B --> E[o1-preview]
    B --> F[o1-mini]
    
    C --> G[OpenAI API Call]
    D --> G
    E --> G
    F --> G
    
    G --> H[Response Processing]
    H --> I[Error Handling]
    H --> J[Success Response]
    
    I --> K[Return Error to Frontend]
    J --> L[Return Results to Frontend]
```

**Model Usage:**
- **gpt-4o/gpt-4o-mini**: General analysis and script generation
- **o1-preview/o1-mini**: Advanced reasoning tasks
- **Error Handling**: Graceful failure with user feedback
- **Response Processing**: Format results for frontend

---

## 💾 Element Management Flow

```mermaid
graph TD
    A[Element Operations] --> B[Save Element]
    A --> C[Load Elements] 
    A --> D[Get Element by ID]
    A --> E[Delete Element]
    
    B --> F[Generate Element ID]
    F --> G[Store Metadata]
    G --> H[Save Content]
    H --> I[Update Index]
    
    C --> J[Read Index]
    J --> K[Load All Elements]
    K --> L[Return List]
    
    D --> M[Find by ID]
    M --> N[Load Full Details]
    N --> O[Return Element]
    
    E --> P[Confirm Deletion]
    P --> Q[Remove Files]
    Q --> R[Update Index]
```

**Storage Structure:**
- **Element ID**: Unique identifier generation
- **Metadata**: Name, version, timestamps
- **Content**: Full AI output and context
- **Indexing**: Fast retrieval system

---

## 🧪 Playwright Testing Flow

```mermaid
graph TD
    A[Test Suite] --> B[Dashboard Tests]
    A --> C[Configuration Tests]
    A --> D[Editor Tests]
    A --> E[AI Processing Tests]
    A --> F[Version Control Tests]
    A --> G[Element Management Tests]
    
    B --> H[UI Navigation]
    C --> I[Form Validation]
    D --> J[Modal Interactions]
    E --> K[Real OpenAI Calls]
    F --> L[Version Workflows]
    G --> M[Save/Load/Delete]
    
    H --> N[Test Results]
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
```

**Test Coverage:**
- **End-to-End**: Complete user workflows
- **Integration**: API and OpenAI testing
- **UI Testing**: Modal and form interactions
- **Real Data**: Actual AI processing with test files

---

## 📊 Request Processing Flow

```mermaid
graph LR
    A[HTTP Request] --> B[Input Validation]
    B --> C[Business Logic]
    C --> D{Processing Type}
    
    D -->|AI Call| E[OpenAI API]
    D -->|File Operation| F[File System]
    D -->|Data Query| G[Element Storage]
    
    E --> H[Format Response]
    F --> H
    G --> H
    
    H --> I[Send to Frontend]
```

**Processing Pipeline:**
- **Validation**: Input sanitization and checks
- **Routing**: Direct to appropriate handler
- **External Calls**: OpenAI, file system, storage
- **Response**: Formatted JSON back to frontend

---

## 🔧 Configuration Management Flow

```mermaid
graph TD
    A[App Configuration] --> B[Default Settings]
    A --> C[Environment Variables]
    A --> D[Runtime Config]
    
    B --> E[Default Prompts]
    B --> F[Model Settings]
    B --> G[File Limits]
    
    C --> H[OpenAI API Keys]
    C --> I[Server Settings]
    
    D --> J[Dynamic Updates]
    D --> K[User Preferences]
    
    E --> L[Merged Configuration]
    F --> L
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L
```

**Configuration Sources:**
- **Defaults**: Built-in application settings
- **Environment**: API keys and deployment config
- **Runtime**: Dynamic user preferences
- **Validation**: Ensure all required settings present

---

## 🚀 System Requirements

```mermaid
graph TB
    A[System Requirements] --> B[Runtime Dependencies]
    A --> C[System Resources]
    A --> D[External Services]
    
    B --> E[Python 3.8+]
    B --> F[FastAPI Framework]
    B --> G[OpenAI SDK]
    B --> H[Playwright Testing]
    
    C --> I[4GB+ RAM]
    C --> J[2+ CPU Cores]
    C --> K[10GB+ Storage]
    
    D --> L[OpenAI API Access]
    D --> M[Internet Connection]
    D --> N[File System Access]
```

**Key Dependencies:**
- **Backend**: FastAPI, OpenAI SDK, Pydantic
- **Testing**: Playwright for end-to-end testing
- **Resources**: Moderate hardware requirements
- **External**: OpenAI API key required

The backend provides a robust foundation for AI-powered document analysis with comprehensive testing and reliable processing pipelines.