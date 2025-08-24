# Complete UI Recreation Prompt for AI Document Analysis System

Create a modern, professional web application for AI-powered document analysis with the following exact specifications:

## 🎯 APPLICATION OVERVIEW
**Name**: AI Document Analysis System
**Purpose**: Upload documents, configure AI analysis prompts, process with OpenAI models, manage versions, and save results
**Architecture**: Modal-based UI with FastAPI backend
**Color Scheme**: Purple/blue gradient theme (#667eea, #764ba2) with clean whites and grays

## 📱 MAIN DASHBOARD PAGE

### Header Section
- **Title**: "AI Document Analysis System" (large, bold)
- **Subtitle**: "Configure and analyze documents using advanced AI models with customizable extraction and reasoning capabilities."
- **Feature Badge**: "AI Powered" (small purple badge)

### Primary Feature Card
- **Large clickable card** with:
  - **Icon**: Document/AI symbol
  - **Title**: "Start New Analysis"
  - **Description**: Document analysis capabilities text
  - **Action**: Opens Configuration Modal when clicked
  - **Styling**: Hover effects, gradient borders

### Saved Elements Dashboard Section
- **Section Header**: "Saved Dynamic Elements"
- **Action Buttons**:
  - **"View All"** button (primary blue, opens Viewer Modal)
  - **"Refresh"** button (outline style)
- **Elements Grid**: 3-column responsive grid showing saved element preview cards
- **Loading State**: "Loading saved elements..." placeholder

## 🔧 CONFIGURATION MODAL

### Modal Structure
- **Header**: "Configuration" with close (×) button
- **Modal Size**: Medium width, centered overlay

### Configuration Fields
1. **Default Prompt**:
   - **Label**: "Default Prompt"
   - **Type**: Large textarea (4-5 rows)
   - **Placeholder**: "Enter your analysis prompt here..."
   - **Default Value**: "How many complaints are for Israel? Please provide a detailed list with all of them."

2. **Method Selection**:
   - **Label**: "Analysis Method"
   - **Type**: Dropdown select
   - **Options**: 
     - "extraction" (default)
     - "reasoning"

3. **Model Selection**:
   - **Label**: "AI Model"
   - **Type**: Dropdown select
   - **Options**:
     - "gpt-4o" (default)
     - "gpt-4o-mini"
     - "o1-preview"
     - "o1-mini"

4. **File Upload Section**:
   - **Label**: "Upload Documents"
   - **Type**: File input with drag-and-drop zone
   - **Accept**: .txt, .pdf, .csv, .json
   - **Default File**: "test.txt" (pre-selected)
   - **File List**: Shows selected files with remove options

### Modal Actions
- **"Continue to Editor"** button (primary, full width)
- **"Cancel"** button (secondary)

## 📝 EDITOR MODAL

### Modal Structure  
- **Header**: "AI Document Editor" with close (×) button
- **Modal Size**: Large width, nearly full screen
- **Layout**: Two-panel (chat + preview)

### Left Panel: Chat Interface

#### Method Toggle Buttons
- **"Extraction"** button (active by default)
- **"Reasoning"** button
- **Styling**: Toggle button group

#### Chat Input Section
- **Chat Input**: Large textarea
- **Placeholder**: "Refine your analysis or ask follow-up questions..."
- **Send Button**: "Send" (becomes "Processing..." when active)
- **Styling**: Modern chat interface look

### Right Panel: Analysis Results

#### Panel Header
- **Left Side**:
  - **Title**: "Analysis Results"
  - **Version Indicator**: Purple badge showing "Version 1", "Version 2", etc.

#### Header Controls (Flexible row)
- **Element Name Input**:
  - **Label**: "Name:"
  - **Input Field**: Text input, 150px width
  - **Placeholder**: "Analysis Result"
  - **Auto-populated**: Smart names like "Israel Complaints Analysis"

- **Lock Version Button**:
  - **Text**: "Lock Version" (changes to "Locked ✓" when locked)
  - **Style**: Outline button
  - **Function**: Locks current version for saving

- **Save Element Button**:
  - **Text**: "Save Element" or "Save Version X"
  - **Style**: Primary gradient button
  - **State**: Enabled when version exists (no locking required)

#### Preview Content Area
- **Content**: AI analysis results display
- **Styling**: Clean, readable text with proper formatting
- **Scrollable**: If content is long

#### Version Status Section
- **Locked Versions Display**: Shows chips for each locked version
- **Version Chips**: Small badges like "V1", "V2" with lock icons
- **Clickable**: Can select version for saving

### Modal Actions
- **"Back to Configuration"** button (secondary)
- **"Close Editor"** button (secondary)

## 👁️ VIEWER MODAL (Saved Elements)

### Modal Structure
- **Header**: "Saved Elements" with close (×) button  
- **Modal Size**: Large, full-featured

### Elements List View (Default)
- **Layout**: Responsive grid (3+ columns)
- **Element Cards**: Each card shows:
  - **Element Name**: Prominent title
  - **Version Badge**: "v1", "v2", etc.
  - **Preview**: First 150 characters of output + "..."
  - **Date**: Saved date
  - **Hover Effects**: Card lift and border highlight
- **Empty State**: "No saved elements found" message
- **Loading State**: "Loading saved elements..." with spinner

### Element Detail View
- **Navigation**:
  - **"← Back to List"** button
  - **"Delete"** button (red, danger style)

- **Element Meta**:
  - **Element Name**: Large heading
  - **Version Info**: "Version X"  
  - **Save Date**: Full timestamp

- **Output Section**:
  - **Full Output**: Complete AI analysis in code block style
  - **Styled**: Monospace font, background highlight

- **Context Section**:
  - **Heading**: "Original Request"
  - **Content**: Original user prompt that generated this result

## 🎨 VISUAL DESIGN SPECIFICATIONS


### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable sans-serif
- **Code**: Monospace (Consolas, Monaco)
- **Sizes**: Responsive scaling (0.8rem to 1.1rem range)

### Layout & Spacing
- **Modals**: Centered overlays with backdrop blur
- **Grid**: CSS Grid and Flexbox layouts
- **Spacing**: Consistent 8px, 12px, 16px, 20px intervals
- **Borders**: Subtle 1px borders, 6-8px border radius
- **Shadows**: Subtle box shadows for depth

### Interactive Elements
- **Buttons**: 
  - Primary: Gradient backgrounds with hover effects
  - Secondary: Outline style with color transitions
  - Small: Compact sizing for secondary actions
- **Hover Effects**: Smooth transitions (0.2s ease)
- **Focus States**: Clear keyboard navigation indicators
- **Loading States**: Subtle animations and disabled states

### Responsive Design
- **Breakpoint**: 768px for mobile optimization
- **Mobile Changes**:
  - Single column layouts
  - Stacked button groups
  - Full-width modals
  - Touch-friendly spacing

## 🔧 FUNCTIONAL REQUIREMENTS

### Core Workflows
1. **New Analysis**: Dashboard → Config Modal → Editor Modal → Save
2. **Version Control**: Lock versions, create new versions via chat
3. **Element Management**: Save, view all, detail view, delete
4. **Chat Iteration**: Refine results through conversational interface

### State Management
- **Version Control**: Track multiple versions per analysis
- **Element Storage**: Persistent saving with metadata
- **Modal States**: Proper modal navigation and state preservation
- **Form Data**: Maintain user inputs across modal transitions

### API Integration Points
- **POST /api/process-config**: Send config to AI for processing
- **POST /api/chat/iterate**: Chat-based iteration requests  
- **POST /api/elements/save**: Save versioned elements
- **GET /api/elements**: Fetch all saved elements
- **GET /api/elements/{id}**: Get specific element details
- **DELETE /api/elements/{id}**: Delete elements

## 📱 USER EXPERIENCE NOTES

### Navigation Flow
- **Smooth Transitions**: Modal open/close animations
- **Breadcrumb Logic**: Clear path back to previous states  
- **Auto-population**: Smart defaults and form pre-filling

### Feedback Systems
- **Loading States**: Clear processing indicators
- **Success/Error Alerts**: Toast notifications (3-second auto-dismiss)
- **Form Validation**: Real-time input validation
- **Progress Indicators**: Version tracking and status updates

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Semantic HTML and ARIA labels
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Proper focus trapping in modals

## 🚀 TECHNICAL STACK RECOMMENDATIONS
- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Styling**: CSS3 with Flexbox/Grid, CSS custom properties
- **Icons**: SVG icons or icon fonts (minimal set needed)
- **Fonts**: System fonts or Google Fonts for performance
- **Build**: No build process required - pure HTML/CSS/JS

Create this application with modern, professional styling that feels like a premium AI tool. Focus on user experience, smooth interactions, and a clean, intuitive interface that makes document analysis feel powerful yet accessible.