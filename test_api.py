#!/usr/bin/env python3
"""
Simple test script for the AI Document Analysis System API
"""

import requests
import json

# Test configuration
API_BASE = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    print("🔍 Testing system health...")
    response = requests.get(f"{API_BASE}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_process_extraction():
    """Test the new process endpoint with extraction method"""
    print("📝 Testing extraction method...")
    
    config = {
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
    
    response = requests.post(
        f"{API_BASE}/api/process",
        headers={"Content-Type": "application/json"},
        json=config
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result['success']}")
        print(f"Method used: {result['method_used']}")
        print(f"Result preview: {result['result'][:200]}...")
    else:
        print(f"Error: {response.text}")
    print()

def test_process_reasoning():
    """Test the new process endpoint with reasoning method"""
    print("🧠 Testing reasoning method...")
    
    config = {
        "user_prompt": "Analyze overall complaint numbers and compare to previous period. State the total number of substantiated and unsubstantiated complaints during the review period.",
        "method": "reasoning",
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
    
    response = requests.post(
        f"{API_BASE}/api/process",
        headers={"Content-Type": "application/json"},
        json=config
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result['success']}")
        print(f"Method used: {result['method_used']}")
        print(f"Result preview: {result['result'][:200]}...")
    else:
        print(f"Error: {response.text}")
    print()

def main():
    """Run all tests"""
    print("🤖 AI Document Analysis System - API Test")
    print("=" * 50)
    
    try:
        test_health()
        test_process_extraction()
        test_process_reasoning()
        
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
