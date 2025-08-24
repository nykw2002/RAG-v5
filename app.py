from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import uvicorn
from dotenv import load_dotenv

# Set UTF-8 encoding for Windows console
os.environ['PYTHONIOENCODING'] = 'utf-8'

# Load environment variables
load_dotenv()

# Initialize FastAPI app (simplified - no lifespan for compatibility)
app = FastAPI(
    title="AI Document Analysis System", 
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import analysis functions with error handling
try:
    from analysis_engine import (
        autonomous_analysis_loop,
        rag_analysis,
        manual_query_processor,
        check_requirements
    )
    from element_manager import get_element_manager
    print("Analysis engine imported successfully")
except ImportError as e:
    print(f"Warning: Could not import analysis engine: {e}")
    # Create dummy functions to prevent crashes
    def manual_query_processor(prompt, method, target_file):
        return f"Analysis engine not available. Query: {prompt}, Method: {method}, File: {target_file}"
    
    def check_requirements():
        return False

# Pydantic models for API requests
class DataItem(BaseModel):
    data_type: str  # string | json string | json file
    data: str       # text | json
    source: str     # sql | parameter | dynamic element

class FileItem(BaseModel):
    file_name: str
    file_type: str
    file_path: str

class ProcessRequest(BaseModel):
    user_prompt: str
    method: str = "extraction"  # extraction or reasoning
    model: str = "gpt-4o-mini"
    data: List[DataItem] = []
    files: List[FileItem] = []

class ConfigRequest(BaseModel):
    default_prompt: str = "Tell me about this document"
    model: str = "gpt-4o-mini"
    method: str = "extraction"
    document_sources: List[str] = []
    referenced_elements: List[str] = []

# Global configuration storage (in production, use a database)
app_config = {
    "default_prompt": "Tell me about this document",
    "model": "gpt-4o-mini",
    "method": "extraction",
    "document_sources": [],
    "referenced_elements": []
}

# Create necessary directories on startup
def initialize_app():
    """Initialize application directories and check requirements"""
    try:
        os.makedirs("static", exist_ok=True)
        os.makedirs("uploads", exist_ok=True)
        print("Directories created successfully")
        
        # Check requirements
        if 'check_requirements' in globals():
            if check_requirements():
                print("All requirements met!")
            else:
                print("Warning: Some requirements are not met!")
        
        return True
    except Exception as e:
        print(f"Error initializing app: {e}")
        return False

# Initialize on module load
initialize_app()

# Serve static files
try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
    print("Static files mounted successfully")
except Exception as e:
    print(f"Warning: Could not mount static files: {e}")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main HTML page"""
    try:
        if os.path.exists("static/index.html"):
            with open("static/index.html", "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read())
        else:
            return HTMLResponse(content="<h1>AI Document Analysis System</h1><p>Static files not found. Please ensure static/index.html exists.</p>")
    except Exception as e:
        return HTMLResponse(content=f"<h1>Error</h1><p>Could not load main page: {e}</p>")

@app.get("/debug", response_class=HTMLResponse)
async def debug_page():
    """Serve the debug page"""
    try:
        if os.path.exists("static/debug.html"):
            with open("static/debug.html", "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read())
        else:
            return HTMLResponse(content="<h1>Debug page not found</h1>")
    except Exception as e:
        return HTMLResponse(content=f"<h1>Error loading debug page</h1><p>{e}</p>")

@app.post("/api/process")
async def process_configuration(request: ProcessRequest):
    """Process configuration and return AI analysis"""
    try:
        print(f"Processing request: {request.user_prompt[:50]}...")
        
        # Validate method
        if request.method not in ["extraction", "reasoning"]:
            raise HTTPException(status_code=400, detail="Method must be 'extraction' or 'reasoning'")
        
        # For now, we'll use the default test.txt file if no files are provided
        target_file = "test.txt"
        
        if request.files:
            print(f"Files specified: {[f.file_name for f in request.files]}")
            
            # Check if any of the specified files exist in uploads directory
            for file_item in request.files:
                potential_path = f"uploads/{file_item.file_name}.{file_item.file_type.lower()}"
                if os.path.exists(potential_path):
                    target_file = potential_path
                    break
        
        # Check if target file exists
        if not os.path.exists(target_file):
            print(f"Target file not found: {target_file}")
            raise HTTPException(status_code=404, detail=f"Target file '{target_file}' not found")
        
        print(f"Using file: {target_file}")
        
        # Process the configuration using the existing analysis engine
        try:
            result = manual_query_processor(
                prompt=request.user_prompt,
                method=request.method,
                target_file=target_file
            )
            print("Analysis completed successfully")
        except Exception as analysis_error:
            print(f"Analysis error: {analysis_error}")
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(analysis_error)}")
        
        return {
            "success": True,
            "result": result,
            "method_used": request.method,
            "user_prompt": request.user_prompt,
            "model": request.model,
            "files_processed": [f.file_name for f in request.files] if request.files else [target_file]
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"[ERROR] Unexpected error in process_configuration: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing configuration: {str(e)}")

@app.get("/api/config")
async def get_config():
    """Get current configuration"""
    try:
        return app_config
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting configuration: {str(e)}")

@app.post("/api/config")
async def update_config(config: ConfigRequest):
    """Update application configuration"""
    try:
        app_config.update(config.dict())
        return {"success": True, "message": "Configuration updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating configuration: {str(e)}")

@app.post("/api/process-config")
async def process_config_and_continue(config: ConfigRequest):
    """Process configuration data when 'Continue to Editor' is pressed"""
    try:
        print("Processing configuration for editor transition...")
        
        # Update the global configuration
        app_config.update(config.dict())
        
        # Build the JSON structure similar to test_config.json
        process_request = {
            "user_prompt": config.default_prompt,
            "method": config.method,
            "model": config.model,
            "data": [],
            "files": []
        }
        
        # Handle file sources
        if hasattr(config, 'document_sources') and config.document_sources:
            # Convert document sources to file format
            for source in config.document_sources:
                file_info = {
                    "file_name": source,
                    "file_type": "TXT",  # Default, will be improved
                    "file_path": source
                }
                process_request["files"].append(file_info)
        else:
            # Default to test file if no files specified
            process_request["files"].append({
                "file_name": "test",
                "file_type": "TXT", 
                "file_path": "test.txt"
            })
        
        # Add referenced elements to the prompt context
        if hasattr(config, 'referenced_elements') and config.referenced_elements:
            elements_context = f"\n\nPlease focus on these referenced elements: {', '.join(config.referenced_elements)}"
            process_request["user_prompt"] += elements_context
        
        print(f"Built process request: {process_request}")
        
        # Process using the existing analysis engine
        target_file = "test.txt"  # Default file
        
        # Find the appropriate file to use
        if process_request["files"]:
            for file_item in process_request["files"]:
                # Check various potential paths
                potential_paths = [
                    file_item["file_path"],
                    f"uploads/{file_item['file_name']}",
                    f"uploads/{file_item['file_name']}.{file_item['file_type'].lower()}",
                    file_item["file_name"]
                ]
                
                for path in potential_paths:
                    if os.path.exists(path):
                        target_file = path
                        break
                
                if target_file != "test.txt":
                    break
        
        # Verify target file exists
        if not os.path.exists(target_file):
            print(f"Target file not found: {target_file}, using default test.txt")
            target_file = "test.txt"
            if not os.path.exists(target_file):
                raise HTTPException(status_code=404, detail="No valid document file found for analysis")
        
        print(f"Using target file: {target_file}")
        
        # Process using real AI analysis engine
        print("Processing with real AI analysis engine...")
        
        try:
            # Use the actual analysis engine
            ai_result = manual_query_processor(
                prompt=process_request["user_prompt"],
                method=process_request["method"],
                target_file=target_file
            )
            print(f"Real AI analysis completed successfully")
            print(f"AI result content: {str(ai_result)[:200]}...")  # Debug: Show first 200 chars
            
        except Exception as e:
            print(f"Error with real AI analysis: {e}")
            # Fallback to demo if real analysis fails
            elements_str = "kpi-table" if config.referenced_elements else "None specified"
            method_name = "Extraction" if process_request['method'] == 'extraction' else "Reasoning"
            
            ai_result = f"""ANALYSIS ERROR - FALLBACK RESULT

Error occurred during AI analysis: {str(e)}

Configuration Details:
- Document: {target_file}
- Analysis Method: {method_name}
- Processing Model: {process_request['model']}
- Query: {process_request['user_prompt'][:100]}...
- Referenced Elements: {elements_str}

Please check the server logs for more details about the analysis error."""
        
        return {
            "success": True,
            "result": ai_result,
            "method_used": process_request["method"],
            "model_used": process_request["model"],
            "user_prompt": process_request["user_prompt"],
            "files_processed": [target_file],
            "referenced_elements": config.referenced_elements if config.referenced_elements else [],
            "message": "Configuration processed successfully, ready for editor"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in process_config_and_continue: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing configuration: {str(e)}")

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a document file"""
    try:
        # Save uploaded file
        file_path = f"uploads/{file.filename}"
        os.makedirs("uploads", exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "success": True,
            "filename": file.filename,
            "file_path": file_path,
            "message": f"File '{file.filename}' uploaded successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.get("/api/files")
async def list_files():
    """List available document files"""
    try:
        files = []
        
        # Check main directory
        for file in os.listdir("."):
            if file.endswith((".txt", ".csv", ".json", ".md")):
                files.append({"name": file, "path": file})
        
        # Check uploads directory
        if os.path.exists("uploads"):
            for file in os.listdir("uploads"):
                if file.endswith((".txt", ".csv", ".json", ".md", ".pptx", ".docx", ".pdf")):
                    files.append({"name": file, "path": f"uploads/{file}"})
        
        return {"files": files}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing files: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        api_key_configured = bool(os.getenv("OPENAI_API_KEY"))
        requirements_met = check_requirements() if 'check_requirements' in globals() else False
        
        return {
            "status": "healthy",
            "api_key_configured": api_key_configured,
            "requirements_met": requirements_met
        }
    except Exception as e:
        return {
            "status": "error",
            "api_key_configured": False,
            "requirements_met": False,
            "error": str(e)
        }

# Chat Iteration Endpoints
@app.post("/api/chat/iterate")
async def chat_iterate(iteration_request: dict):
    """Process chat iteration with context feeding"""
    try:
        print(f"[PROCESSING] Processing chat iteration request")
        
        # Extract request data
        user_message = iteration_request.get("user_message", "")
        method = iteration_request.get("method", "extraction")
        current_context = iteration_request.get("current_context", "")
        chat_history = iteration_request.get("chat_history", [])
        element_context = iteration_request.get("element_context", {})
        
        if not user_message:
            raise HTTPException(status_code=400, detail="User message is required")
        
        # Build enhanced prompt with context
        original_prompt = element_context.get("original_prompt", "") if element_context else ""
        
        # Create contextual prompt that builds upon previous output
        enhanced_prompt = f"""
Context: You are continuing an analysis that started with: "{original_prompt}"

Previous output from the analysis:
{current_context[:2000]}...

New user request: {user_message}

Please UPDATE and EXTEND the previous output to incorporate the new request. 
Do not start over - build upon what was already analyzed.
If the user is asking for additional data (like more countries), add it to the existing output.
If the user is asking for modifications, modify the relevant parts while keeping the rest.

Method: {method}
"""
        
        print(f"[PROMPT] Enhanced prompt created: {enhanced_prompt[:200]}...")
        
        # Use default target file for now
        target_file = "test.txt"
        if not os.path.exists(target_file):
            raise HTTPException(status_code=404, detail="Target document not found")
        
        # Process using analysis engine
        print(f"[AI] Processing with {method} method...")
        result = manual_query_processor(
            prompt=enhanced_prompt,
            method=method,
            target_file=target_file
        )
        
        print(f"[SUCCESS] Chat iteration completed")
        print(f"[OUTPUT] Result preview: {str(result)[:200]}...")
        
        return {
            "success": True,
            "ai_response": "Analysis updated based on your request.",
            "updated_output": result,
            "method_used": method,
            "context_length": len(current_context),
            "message": "Chat iteration processed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error in chat iteration: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat iteration: {str(e)}")

# Element Management Endpoints
@app.post("/api/elements/save")
async def save_element(element_data: dict):
    """Save a dynamic element with version control"""
    try:
        if 'get_element_manager' not in globals():
            raise HTTPException(status_code=500, detail="Element manager not available")
        
        manager = get_element_manager()
        result = manager.save_element(element_data)
        
        if result.get("success"):
            return result
        else:
            raise HTTPException(status_code=400, detail=result.get("error", "Save failed"))
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in save_element endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving element: {str(e)}")

@app.get("/api/elements")
async def get_all_elements():
    """Get all saved elements for dashboard"""
    try:
        if 'get_element_manager' not in globals():
            return {"elements": [], "stats": {"total_elements": 0}}
        
        manager = get_element_manager()
        elements = manager.get_all_elements()
        stats = manager.get_element_stats()
        
        return {
            "success": True,
            "elements": elements,
            "stats": stats
        }
        
    except Exception as e:
        print(f"Error in get_all_elements endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting elements: {str(e)}")

@app.get("/api/elements/{element_id}")
async def get_element(element_id: str):
    """Get specific element by ID"""
    try:
        if 'get_element_manager' not in globals():
            raise HTTPException(status_code=500, detail="Element manager not available")
        
        manager = get_element_manager()
        element = manager.get_element(element_id)
        
        if element:
            return {"success": True, "element": element}
        else:
            raise HTTPException(status_code=404, detail="Element not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_element endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting element: {str(e)}")

@app.delete("/api/elements/{element_id}")
async def delete_element(element_id: str):
    """Delete element by ID"""
    try:
        if 'get_element_manager' not in globals():
            raise HTTPException(status_code=500, detail="Element manager not available")
        
        manager = get_element_manager()
        success = manager.delete_element(element_id)
        
        if success:
            return {"success": True, "message": "Element deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Element not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in delete_element endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting element: {str(e)}")

# Add a simple test endpoint
@app.get("/api/test")
async def test_endpoint():
    """Simple test endpoint"""
    return {"message": "API is working!", "timestamp": "2024"}

if __name__ == "__main__":
    print("Starting AI Document Analysis System...")
    print("Server will run on: http://localhost:8000")
    print("Press Ctrl+C to stop the server")
    
    # Run the server without reload when running directly
    try:
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Server error: {e}")
