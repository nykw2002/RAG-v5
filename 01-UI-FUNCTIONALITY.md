# 🎨 UI Functionality Overview

## System Flow: Complete User Journey

```mermaid
graph TD
    A[Dashboard] --> B[Start New Analysis]
    B --> C[Configuration Modal]
    C --> D[Editor Modal]
    D --> E[Version Control]
    E --> F[Save Element]
    F --> G[Element Viewer]
    
    D --> H[Chat Iteration]
    H --> I[New Version]
    I --> E
    
    G --> J[View Details]
    G --> K[Delete Elements]
```

---

## 🏠 Main Dashboard Flow

```mermaid
graph LR
    A[User Opens App] --> B[Dashboard Loads]
    B --> C[Shows Feature Card]
    B --> D[Shows Saved Elements Grid]
    
    C --> E[Click: Start New Analysis]
    E --> F[Opens Configuration Modal]
    
    D --> G[Click: View All]
    G --> H[Opens Viewer Modal]
    
    D --> I[Click: Element Card]
    I --> J[View Element Details]
```

**Dashboard Components:**
- **Header**: Orange gradient title with system description
- **Feature Card**: Large clickable card to start analysis
- **Saved Elements**: Grid showing previously saved analyses
- **Actions**: View All and Refresh buttons

---

## ⚙️ Configuration Modal Flow

```mermaid
graph TD
    A[Configuration Opens] --> B[Pre-filled Form]
    B --> C{User Edits Fields}
    
    C --> D[Default Prompt]
    C --> E[Analysis Method: extraction/reasoning]
    C --> F[AI Model Selection]
    C --> G[File Upload]
    
    D --> H[Continue to Editor]
    E --> H
    F --> H
    G --> H
    
    H --> I[Send to Backend]
    I --> J[AI Processing]
    J --> K[Open Editor with Results]
```

**Form Fields:**
- **Default Prompt**: Large textarea with example prompt
- **Analysis Method**: Dropdown (extraction/reasoning)
- **AI Model**: Dropdown (gpt-4o, gpt-4o-mini, o1-preview, o1-mini)
- **File Upload**: Drag & drop with `test.txt` pre-selected

---

## 📝 Editor Modal Flow

```mermaid
graph TB
    A[Editor Opens] --> B[Two-Panel Layout]
    
    B --> C[Left: Chat Interface]
    B --> D[Right: Results Panel]
    
    C --> E[Method Toggle]
    C --> F[Chat Input]
    C --> G[Send Button]
    
    D --> H[Element Name Input]
    D --> I[Version Indicator]
    D --> J[Lock/Save Buttons]
    D --> K[AI Results Display]
    
    F --> L[Send Chat Message]
    L --> M[Create New Version]
    M --> I
    
    J --> N[Lock Current Version]
    J --> O[Save Element]
    
    O --> P[Element Saved Successfully]
```

**Key Features:**
- **Split Layout**: Chat on left, results on right
- **Version Control**: Lock versions, create new versions via chat
- **Element Naming**: Custom names with smart defaults
- **Real-time Updates**: Results update as you interact

---

## 🔄 Version Control Flow

```mermaid
graph LR
    A[Initial Analysis] --> B[Version 1 Created]
    
    B --> C{User Action}
    C -->|Lock Version| D[Version 1 Locked]
    C -->|Chat Iteration| E[Version 2 Created]
    
    E --> F{User Action}
    F -->|Lock Version| G[Version 2 Locked]  
    F -->|More Chat| H[Version 3 Created]
    
    D --> I[Save Element]
    G --> I
    
    I --> J[Stored in System]
```

**Version Features:**
- **Auto-numbering**: V1, V2, V3... as you iterate
- **Locking System**: Lock versions to preserve them
- **Save Flexibility**: Can save any version (locked or unlocked)
- **Smart Defaults**: Version 1 selected if no locking done

---

## 👁️ Element Viewer Flow

```mermaid
graph TD
    A[View All Button] --> B[Viewer Modal Opens]
    
    B --> C[Grid View: All Elements]
    C --> D[Element Cards]
    
    D --> E[Click Element]
    E --> F[Detail View]
    
    F --> G[Full Output Display]
    F --> H[Original Request]
    F --> I[Element Actions]
    
    I --> J[Delete Element]
    I --> K[Back to Grid]
    
    J --> L[Confirm Delete]
    L --> C
    
    K --> C
```

**Viewer Components:**
- **Grid Layout**: Responsive cards showing element previews
- **Detail View**: Complete output with metadata
- **Actions**: Delete elements, navigate back
- **Search**: Quick filtering of saved elements

---

## 🎨 Design System

```mermaid
graph TB
    A[Orange/Black Theme] --> B[Color Palette]
    A --> C[Interactive States]
    A --> D[Typography]
    
    B --> E[Primary: #f97316 Orange]
    B --> F[Background: #ffffff White]
    B --> G[Text: #0a0a0a Black]
    
    C --> H[Hover Effects: 0.2s transitions]
    C --> I[Focus States: Orange rings]
    C --> J[Loading States: Smooth indicators]
    
    D --> K[Clean Sans-serif fonts]
    D --> L[Responsive sizing]
    D --> M[Professional hierarchy]
```

**Design Principles:**
- **Clean Interface**: No icons or emojis, text-based
- **Professional Look**: Orange accents on white/black
- **Smooth Interactions**: Hover effects and transitions
- **Accessible**: High contrast, keyboard navigation
- **Responsive**: Works on desktop and mobile

---

## 💡 Key User Flows

### **Quick Analysis Flow**
```mermaid
graph LR
    A[Open App] --> B[Click Feature Card]
    B --> C[Keep Default Settings]
    C --> D[Continue to Editor]
    D --> E[See Results]
    E --> F[Name & Save]
```

### **Iterative Analysis Flow**
```mermaid
graph LR
    A[Get Initial Results] --> B[Chat: "Also show Germany"]
    B --> C[New Version Created]
    C --> D[Chat: "Summarize trends"]
    D --> E[Version 3 Created]
    E --> F[Lock & Save Best Version]
```

### **Element Management Flow**
```mermaid
graph LR
    A[View All Elements] --> B[Browse Grid]
    B --> C[Click Element]
    C --> D[Read Full Details]
    D --> E[Delete if Needed]
    E --> F[Return to Grid]
```

The UI provides a complete workflow from initial analysis through iterative refinement to permanent storage and management of results.