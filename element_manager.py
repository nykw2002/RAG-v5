"""
Element Management System
Handles saving, loading, and managing dynamic elements with version control
"""

import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

class ElementManager:
    """Manages dynamic elements with version control and persistence"""
    
    def __init__(self, storage_dir: str = "saved_elements"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        self.elements_file = self.storage_dir / "elements.json"
        self.elements_data = self._load_elements()
    
    def _load_elements(self) -> Dict:
        """Load elements from storage file"""
        try:
            if self.elements_file.exists():
                with open(self.elements_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {"elements": []}
        except Exception as e:
            print(f"Error loading elements: {e}")
            return {"elements": []}
    
    def _save_elements(self) -> bool:
        """Save elements to storage file"""
        try:
            with open(self.elements_file, 'w', encoding='utf-8') as f:
                json.dump(self.elements_data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Error saving elements: {e}")
            return False
    
    def save_element(self, element_data: Dict) -> Dict:
        """
        Save a dynamic element with version control
        
        Args:
            element_data: Dictionary containing element information
                - element_id: Unique identifier
                - element_name: Human readable name
                - saved_version: Version number being saved
                - output: AI analysis result
                - full_chat_history: Complete chat history
                - context_used: Context fed to AI
                - created_at: Creation timestamp
                - saved_at: Save timestamp
                - all_versions: List of all version metadata
        
        Returns:
            Dict with success status and element info
        """
        try:
            # Validate required fields
            required_fields = ['element_id', 'element_name', 'saved_version', 'output', 'full_chat_history']
            for field in required_fields:
                if field not in element_data:
                    return {"success": False, "error": f"Missing required field: {field}"}
            
            # Check if element already exists
            existing_element = None
            for element in self.elements_data["elements"]:
                if element["element_id"] == element_data["element_id"]:
                    existing_element = element
                    break
            
            if existing_element:
                # Update existing element
                existing_element.update(element_data)
                existing_element["updated_at"] = datetime.now().isoformat()
                action = "updated"
            else:
                # Add new element
                element_data["saved_at"] = datetime.now().isoformat()
                self.elements_data["elements"].append(element_data)
                action = "created"
            
            # Save to file
            if self._save_elements():
                return {
                    "success": True,
                    "message": f"Element {action} successfully",
                    "element_id": element_data["element_id"],
                    "action": action
                }
            else:
                return {"success": False, "error": "Failed to save to storage"}
                
        except Exception as e:
            print(f"Error saving element: {e}")
            return {"success": False, "error": str(e)}
    
    def get_all_elements(self) -> List[Dict]:
        """Get all saved elements with metadata"""
        try:
            elements = []
            for element in self.elements_data["elements"]:
                # Create summary for dashboard display
                summary = {
                    "element_id": element["element_id"],
                    "element_name": element["element_name"],
                    "saved_version": element["saved_version"],
                    "created_at": element.get("created_at"),
                    "saved_at": element.get("saved_at"),
                    "output_preview": element["output"][:200] + "..." if len(element["output"]) > 200 else element["output"],
                    "chat_count": len(element.get("full_chat_history", [])),
                    "version_count": len(element.get("all_versions", []))
                }
                elements.append(summary)
            
            # Sort by saved_at descending (newest first)
            elements.sort(key=lambda x: x.get("saved_at", ""), reverse=True)
            return elements
            
        except Exception as e:
            print(f"Error getting elements: {e}")
            return []
    
    def get_element(self, element_id: str) -> Optional[Dict]:
        """Get specific element by ID"""
        try:
            for element in self.elements_data["elements"]:
                if element["element_id"] == element_id:
                    return element
            return None
        except Exception as e:
            print(f"Error getting element {element_id}: {e}")
            return None
    
    def delete_element(self, element_id: str) -> bool:
        """Delete element by ID"""
        try:
            initial_count = len(self.elements_data["elements"])
            self.elements_data["elements"] = [
                element for element in self.elements_data["elements"] 
                if element["element_id"] != element_id
            ]
            
            if len(self.elements_data["elements"]) < initial_count:
                return self._save_elements()
            
            return False  # Element not found
            
        except Exception as e:
            print(f"Error deleting element {element_id}: {e}")
            return False
    
    def get_element_stats(self) -> Dict:
        """Get statistics about saved elements"""
        try:
            elements = self.elements_data["elements"]
            
            if not elements:
                return {
                    "total_elements": 0,
                    "total_versions": 0,
                    "total_chat_messages": 0,
                    "latest_save": None
                }
            
            total_versions = sum(len(element.get("all_versions", [])) for element in elements)
            total_messages = sum(len(element.get("full_chat_history", [])) for element in elements)
            
            # Find latest save
            latest_save = None
            for element in elements:
                saved_at = element.get("saved_at")
                if saved_at and (not latest_save or saved_at > latest_save):
                    latest_save = saved_at
            
            return {
                "total_elements": len(elements),
                "total_versions": total_versions,
                "total_chat_messages": total_messages,
                "latest_save": latest_save
            }
            
        except Exception as e:
            print(f"Error getting element stats: {e}")
            return {
                "total_elements": 0,
                "total_versions": 0,
                "total_chat_messages": 0,
                "latest_save": None
            }

# Global instance
element_manager = ElementManager()

def get_element_manager() -> ElementManager:
    """Get the global element manager instance"""
    return element_manager