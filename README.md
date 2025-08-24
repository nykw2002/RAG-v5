# AI Document Analysis System

A powerful web-based application that uses Azure OpenAI for intelligent document analysis with version control and element management.

## Features

### 🤖 AI Analysis Methods
- **Extraction Mode**: AI autonomously writes and executes Python scripts for data extraction, counting, and parsing
- **Reasoning Mode**: Advanced analysis using Azure OpenAI models for complex reasoning and comparison

### 🎨 Modern Web Interface
- **Configuration Modal**: Set up AI models, analysis methods, and file uploads
- **Editor Modal**: Chat interface with version control and real-time AI responses
- **Element Management**: Save, view, and manage analysis results
- **Dashboard**: Clean orange/black themed interface

### 🔄 Version Control System
- **Dynamic Versioning**: Create new versions through chat iterations
- **Lock System**: Lock versions to preserve important results
- **Smart Saving**: Save any version with custom element names

### 📊 Element Management
- **Save Results**: Store analysis outputs as named elements
- **Viewer Modal**: Browse and manage all saved elements
- **CRUD Operations**: Full create, read, update, delete functionality

## Quick Start

### 1. Setup Environment
```bash
# Clone or download the project
# Navigate to the project directory
cd LangGraph

# Run the startup script (Windows)
start.bat

# Or manually:
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate.bat  # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Azure OpenAI
Create a `.env` file in the project root:
```
AZURE_OPENAI_API_KEY=your_azure_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### 3. Start the Application
```bash
python app.py
```

Open your browser to `http://localhost:8000`

## Usage Guide

### Configuration Modal
1. **Default Prompt**: Set your analysis question or instruction
2. **Analysis Method**: Choose between "extraction" or "reasoning"
3. **AI Model**: Select from gpt-4o, gpt-4o-mini, o1-preview, o1-mini
4. **File Upload**: Drag & drop or select files for analysis

### Editor Modal
1. **Chat Interface**: Iterate on your analysis with follow-up questions
2. **Version Control**: Lock versions and create new ones through chat
3. **Element Naming**: Give custom names to your analysis results
4. **Save System**: Store important results as elements for later reference

## Example Queries

### Extraction Examples
- "How many complaints are for Israel?"
- "List all substantiated complaints"
- "Count complaints by country" 
- "Extract all CAPA numbers"

### Reasoning Examples
- "Analyze complaint trends compared to previous period"
- "Summarize CAPA actions and their effectiveness"
- "Compare substantiated vs unsubstantiated patterns"
- "Assess overall quality issues and recommendations"

## Architecture

### Backend (FastAPI)
- `app.py` - Main FastAPI application
- `analysis_engine.py` - Core analysis logic (script generation + RAG)
- RESTful API endpoints for configuration and query processing

### Frontend (Vanilla JS)
- `static/index.html` - Main UI structure
- `static/styles.css` - Orange/white/black theme styling
- `static/script.js` - Interactive functionality

### Analysis Engine
- **Script Generation**: GPT-4o writes Python scripts, executes them, analyzes results
- **RAG System**: Document chunking, embeddings, similarity search, context-aware responses
- **Error Handling**: Retry logic, graceful degradation, detailed logging

## File Structure
```
LangGraph/
├── app.py                 # FastAPI main application
├── analysis_engine.py     # Analysis logic
├── requirements.txt       # Python dependencies
├── start.bat             # Windows startup script
├── .env                  # API keys (create this)
├── test.txt              # Sample data file
├── static/
│   ├── index.html        # Main UI
│   ├── styles.css        # Styling
│   └── script.js         # Frontend logic
└── uploads/              # Uploaded files directory
```

## API Endpoints

- `GET /` - Serve main application
- `POST /api/process` - Process analysis configuration (new JSON structure)
- `GET/POST /api/config` - Manage configuration
- `POST /api/upload` - Upload documents (optional, files can be referenced directly)
- `GET /api/files` - List available files
- `GET /api/health` - System health check

## Requirements

- Python 3.8+
- OpenAI API key
- Modern web browser
- Required Python packages (see requirements.txt)

## Troubleshooting

### Common Issues
1. **Azure API Key Error**: Ensure `.env` file exists with valid Azure OpenAI credentials
2. **Import Errors**: Run `pip install -r requirements.txt`
3. **Port Already in Use**: Change port in `app.py` or kill existing process
4. **File Upload Issues**: Check file permissions and disk space

### Testing
The project includes Playwright end-to-end tests:
```bash
# Install Playwright browsers
playwright install

# Run tests
python -m pytest tests/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Feel free to modify and distribute.
