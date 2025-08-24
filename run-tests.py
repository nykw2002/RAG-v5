#!/usr/bin/env python3
"""
Test Runner for AI Document Analysis System
Handles server startup, test execution, and cleanup
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

class TestRunner:
    def __init__(self):
        self.server_process = None
        self.test_results = {}
        
    def start_server(self):
        """Start the FastAPI server for testing"""
        print("Starting server for testing...")
        
        try:
            # Start server in background
            self.server_process = subprocess.Popen([
                sys.executable, 'app.py'
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            
            # Wait for server to be ready
            for i in range(30):
                try:
                    import requests
                    response = requests.get('http://localhost:8000/api/health', timeout=2)
                    if response.status_code == 200:
                        print("Server is ready for testing")
                        return True
                except:
                    time.sleep(2)
                    print(f"Waiting for server... ({30-i} attempts left)")
            
            print("Server failed to start within timeout")
            return False
            
        except Exception as e:
            print(f"Error starting server: {e}")
            return False
    
    def stop_server(self):
        """Stop the test server"""
        if self.server_process:
            print("Stopping test server...")
            self.server_process.terminate()
            try:
                self.server_process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.server_process.kill()
            print("Server stopped")
    
    def install_dependencies(self):
        """Install Node.js dependencies for Playwright"""
        print("Installing test dependencies...")
        
        try:
            # Install npm dependencies
            subprocess.run(['npm', 'install'], check=True, capture_output=True, text=True)
            print("[SUCCESS] npm dependencies installed")
            
            # Install Playwright browsers
            subprocess.run(['npx', 'playwright', 'install'], check=True, capture_output=True, text=True)
            print("[SUCCESS] Playwright browsers installed")
            
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"[ERROR] Error installing dependencies: {e}")
            return False
        except FileNotFoundError:
            print("[ERROR] npm not found. Please install Node.js first")
            return False
    
    def run_playwright_tests(self, headed=False, debug=False, ui=False, specific_test=None):
        """Run Playwright tests"""
        print("[TEST] Running Playwright tests...")
        
        cmd = ['npx', 'playwright', 'test']
        
        if headed:
            cmd.append('--headed')
        if debug:
            cmd.append('--debug')
        if ui:
            cmd.append('--ui')
        if specific_test:
            cmd.append(specific_test)
            
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            print("[REPORT] Test Results:")
            print(result.stdout)
            
            if result.stderr:
                print("[WARNING] Test Warnings/Errors:")
                print(result.stderr)
            
            return result.returncode == 0
            
        except Exception as e:
            print(f"[ERROR] Error running tests: {e}")
            return False
    
    def generate_report(self):
        """Generate and show test report"""
        print("[REPORT] Generating test report...")
        
        try:
            subprocess.run(['npx', 'playwright', 'show-report'], check=True)
        except Exception as e:
            print(f"[WARNING] Could not open report: {e}")
    
    def cleanup(self):
        """Cleanup test artifacts"""
        print("[CLEANUP] Cleaning up...")
        
        # Clean up test data
        test_data_dir = Path('saved_elements')
        if test_data_dir.exists():
            import shutil
            try:
                shutil.rmtree(test_data_dir)
                print("[SUCCESS] Test data cleaned")
            except Exception as e:
                print(f"[WARNING] Could not clean test data: {e}")
    
    def run_full_test_suite(self, options=None):
        """Run the complete test suite"""
        options = options or {}
        
        print("[TARGET] Starting AI Document Analysis System Test Suite")
        print("=" * 60)
        
        try:
            # Step 1: Install dependencies if needed
            if not Path('node_modules').exists():
                if not self.install_dependencies():
                    return False
            
            # Step 2: Start server
            if not self.start_server():
                return False
            
            # Step 3: Run tests
            success = self.run_playwright_tests(
                headed=options.get('headed', False),
                debug=options.get('debug', False),
                ui=options.get('ui', False),
                specific_test=options.get('test_file')
            )
            
            # Step 4: Generate report if requested
            if options.get('report', False):
                self.generate_report()
            
            # Step 5: Results
            if success:
                print("[SUCCESS] All tests passed!")
            else:
                print("[ERROR] Some tests failed. Check the report for details.")
            
            return success
            
        except KeyboardInterrupt:
            print("\n[STOP] Tests interrupted by user")
            return False
            
        finally:
            self.stop_server()
            if options.get('cleanup', True):
                self.cleanup()

def main():
    """Main test runner entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Run AI Document Analysis System tests')
    parser.add_argument('--headed', action='store_true', help='Run tests in headed mode')
    parser.add_argument('--debug', action='store_true', help='Run tests in debug mode')
    parser.add_argument('--ui', action='store_true', help='Run tests with Playwright UI')
    parser.add_argument('--report', action='store_true', help='Show test report after completion')
    parser.add_argument('--no-cleanup', action='store_true', help='Skip cleanup after tests')
    parser.add_argument('--install-only', action='store_true', help='Only install dependencies')
    parser.add_argument('--test-file', help='Run specific test file')
    
    args = parser.parse_args()
    
    runner = TestRunner()
    
    if args.install_only:
        success = runner.install_dependencies()
        sys.exit(0 if success else 1)
    
    options = {
        'headed': args.headed,
        'debug': args.debug,
        'ui': args.ui,
        'report': args.report,
        'cleanup': not args.no_cleanup,
        'test_file': args.test_file
    }
    
    success = runner.run_full_test_suite(options)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()