#!/usr/bin/env python3
"""
Portfolio Backend API Testing Script
Tests all backend API endpoints for the portfolio application
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://dev-ai-showcase.preview.emergentagent.com/api"
ADMIN_PASSWORD = "admin123"

class PortfolioAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.admin_password = ADMIN_PASSWORD
        self.test_results = []
        self.created_project_id = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
    
    def test_get_all_projects(self):
        """Test GET /api/projects - Should return list of all projects"""
        try:
            response = requests.get(f"{self.base_url}/projects")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    projects = data['data']
                    if len(projects) >= 2:  # Should have 2 seeded projects
                        # Check structure of first project
                        project = projects[0]
                        required_fields = ['id', 'title', 'description', 'features', 'techStack', 'category']
                        missing_fields = [field for field in required_fields if field not in project]
                        
                        if not missing_fields:
                            self.log_test("GET /api/projects", True, f"Retrieved {len(projects)} projects with correct structure")
                            return True
                        else:
                            self.log_test("GET /api/projects", False, f"Missing fields in project: {missing_fields}", data)
                    else:
                        self.log_test("GET /api/projects", False, f"Expected at least 2 projects, got {len(projects)}", data)
                else:
                    self.log_test("GET /api/projects", False, "Invalid response structure", data)
            else:
                self.log_test("GET /api/projects", False, f"HTTP {response.status_code}", response.json())
                
        except Exception as e:
            self.log_test("GET /api/projects", False, f"Exception: {str(e)}")
        
        return False
    
    def test_get_single_project(self):
        """Test GET /api/projects/:id - Test with valid and invalid project ID"""
        try:
            # First get all projects to get a valid ID
            response = requests.get(f"{self.base_url}/projects")
            if response.status_code == 200:
                projects = response.json()['data']
                if projects:
                    valid_id = projects[0]['id']
                    
                    # Test with valid ID
                    response = requests.get(f"{self.base_url}/projects/{valid_id}")
                    if response.status_code == 200:
                        data = response.json()
                        if data.get('success') and data['data']['id'] == valid_id:
                            self.log_test("GET /api/projects/:id (valid)", True, "Retrieved single project successfully")
                        else:
                            self.log_test("GET /api/projects/:id (valid)", False, "Invalid response structure", data)
                    else:
                        self.log_test("GET /api/projects/:id (valid)", False, f"HTTP {response.status_code}", response.json())
                    
                    # Test with invalid ID
                    invalid_id = "invalid-project-id-123"
                    response = requests.get(f"{self.base_url}/projects/{invalid_id}")
                    if response.status_code == 404:
                        data = response.json()
                        if not data.get('success') and 'not found' in data.get('error', '').lower():
                            self.log_test("GET /api/projects/:id (invalid)", True, "Correctly returned 404 for invalid ID")
                            return True
                        else:
                            self.log_test("GET /api/projects/:id (invalid)", False, "Wrong error message", data)
                    else:
                        self.log_test("GET /api/projects/:id (invalid)", False, f"Expected 404, got {response.status_code}", response.json())
                else:
                    self.log_test("GET /api/projects/:id", False, "No projects found to test with")
            else:
                self.log_test("GET /api/projects/:id", False, "Could not fetch projects for testing")
                
        except Exception as e:
            self.log_test("GET /api/projects/:id", False, f"Exception: {str(e)}")
        
        return False
    
    def test_post_contact(self):
        """Test POST /api/contact - Test valid and invalid contact submissions"""
        try:
            # Test valid contact submission
            valid_contact = {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "message": "This is a test message from the automated testing script."
            }
            
            response = requests.post(f"{self.base_url}/contact", json=valid_contact)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    contact_data = data['data']
                    if (contact_data.get('name') == valid_contact['name'] and 
                        contact_data.get('email') == valid_contact['email'] and
                        'id' in contact_data and 'createdAt' in contact_data):
                        self.log_test("POST /api/contact (valid)", True, "Contact submitted successfully")
                    else:
                        self.log_test("POST /api/contact (valid)", False, "Invalid response data structure", data)
                else:
                    self.log_test("POST /api/contact (valid)", False, "Invalid response structure", data)
            else:
                self.log_test("POST /api/contact (valid)", False, f"HTTP {response.status_code}", response.json())
            
            # Test invalid contact submission (missing fields)
            invalid_contact = {
                "name": "John Doe",
                "email": "john.doe@example.com"
                # Missing message field
            }
            
            response = requests.post(f"{self.base_url}/contact", json=invalid_contact)
            if response.status_code == 400:
                data = response.json()
                if not data.get('success') and 'required' in data.get('error', '').lower():
                    self.log_test("POST /api/contact (invalid)", True, "Correctly rejected invalid contact data")
                    return True
                else:
                    self.log_test("POST /api/contact (invalid)", False, "Wrong error message", data)
            else:
                self.log_test("POST /api/contact (invalid)", False, f"Expected 400, got {response.status_code}", response.json())
                
        except Exception as e:
            self.log_test("POST /api/contact", False, f"Exception: {str(e)}")
        
        return False
    
    def test_get_stats(self):
        """Test GET /api/stats - Should return project count, contact count, experience years"""
        try:
            response = requests.get(f"{self.base_url}/stats")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    stats = data['data']
                    required_fields = ['projects', 'contacts', 'experience']
                    missing_fields = [field for field in required_fields if field not in stats]
                    
                    if not missing_fields:
                        if (isinstance(stats['projects'], int) and 
                            isinstance(stats['contacts'], int) and 
                            isinstance(stats['experience'], int)):
                            self.log_test("GET /api/stats", True, f"Stats retrieved: {stats}")
                            return True
                        else:
                            self.log_test("GET /api/stats", False, "Stats fields are not integers", data)
                    else:
                        self.log_test("GET /api/stats", False, f"Missing stats fields: {missing_fields}", data)
                else:
                    self.log_test("GET /api/stats", False, "Invalid response structure", data)
            else:
                self.log_test("GET /api/stats", False, f"HTTP {response.status_code}", response.json())
                
        except Exception as e:
            self.log_test("GET /api/stats", False, f"Exception: {str(e)}")
        
        return False
    
    def test_admin_create_project(self):
        """Test POST /api/projects - Create new project (admin only)"""
        try:
            # Test with correct password
            new_project = {
                "password": self.admin_password,
                "title": "Test Project",
                "description": "This is a test project created by automated testing",
                "features": ["Feature 1", "Feature 2", "Feature 3"],
                "techStack": ["Python", "JavaScript", "MongoDB"],
                "category": "Testing",
                "featured": False
            }
            
            response = requests.post(f"{self.base_url}/projects", json=new_project)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    project_data = data['data']
                    if (project_data.get('title') == new_project['title'] and 
                        'id' in project_data and 'createdAt' in project_data):
                        self.created_project_id = project_data['id']  # Store for later tests
                        self.log_test("POST /api/projects (authorized)", True, "Project created successfully")
                    else:
                        self.log_test("POST /api/projects (authorized)", False, "Invalid response data structure", data)
                else:
                    self.log_test("POST /api/projects (authorized)", False, "Invalid response structure", data)
            else:
                self.log_test("POST /api/projects (authorized)", False, f"HTTP {response.status_code}", response.json())
            
            # Test with wrong password
            wrong_password_project = {
                "password": "wrong_password",
                "title": "Unauthorized Test Project",
                "description": "This should not be created",
                "features": ["Feature 1"],
                "techStack": ["Python"],
                "category": "Testing"
            }
            
            response = requests.post(f"{self.base_url}/projects", json=wrong_password_project)
            if response.status_code == 401:
                data = response.json()
                if not data.get('success') and 'unauthorized' in data.get('error', '').lower():
                    self.log_test("POST /api/projects (unauthorized)", True, "Correctly rejected unauthorized request")
                    return True
                else:
                    self.log_test("POST /api/projects (unauthorized)", False, "Wrong error message", data)
            else:
                self.log_test("POST /api/projects (unauthorized)", False, f"Expected 401, got {response.status_code}", response.json())
                
        except Exception as e:
            self.log_test("POST /api/projects", False, f"Exception: {str(e)}")
        
        return False
    
    def test_admin_update_project(self):
        """Test PUT /api/projects/:id - Update existing project (admin only)"""
        if not self.created_project_id:
            self.log_test("PUT /api/projects/:id", False, "No project ID available for testing (create test may have failed)")
            return False
        
        try:
            # Test with correct password
            update_data = {
                "password": self.admin_password,
                "title": "Updated Test Project",
                "description": "This project has been updated by automated testing",
                "features": ["Updated Feature 1", "Updated Feature 2"],
                "techStack": ["Python", "JavaScript", "MongoDB", "React"],
                "category": "Updated Testing"
            }
            
            response = requests.put(f"{self.base_url}/projects/{self.created_project_id}", json=update_data)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    project_data = data['data']
                    if (project_data.get('title') == update_data['title'] and 
                        'updatedAt' in project_data):
                        self.log_test("PUT /api/projects/:id (authorized)", True, "Project updated successfully")
                    else:
                        self.log_test("PUT /api/projects/:id (authorized)", False, "Invalid response data structure", data)
                else:
                    self.log_test("PUT /api/projects/:id (authorized)", False, "Invalid response structure", data)
            else:
                self.log_test("PUT /api/projects/:id (authorized)", False, f"HTTP {response.status_code}", response.json())
            
            # Test with wrong password
            wrong_password_update = {
                "password": "wrong_password",
                "title": "Unauthorized Update"
            }
            
            response = requests.put(f"{self.base_url}/projects/{self.created_project_id}", json=wrong_password_update)
            if response.status_code == 401:
                data = response.json()
                if not data.get('success') and 'unauthorized' in data.get('error', '').lower():
                    self.log_test("PUT /api/projects/:id (unauthorized)", True, "Correctly rejected unauthorized update")
                    return True
                else:
                    self.log_test("PUT /api/projects/:id (unauthorized)", False, "Wrong error message", data)
            else:
                self.log_test("PUT /api/projects/:id (unauthorized)", False, f"Expected 401, got {response.status_code}", response.json())
                
        except Exception as e:
            self.log_test("PUT /api/projects/:id", False, f"Exception: {str(e)}")
        
        return False
    
    def test_admin_get_contacts(self):
        """Test GET /api/contacts?password=admin123 - View all contacts (admin only)"""
        try:
            # Test with correct password
            response = requests.get(f"{self.base_url}/contacts?password={self.admin_password}")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    contacts = data['data']
                    if isinstance(contacts, list):
                        self.log_test("GET /api/contacts (authorized)", True, f"Retrieved {len(contacts)} contacts")
                    else:
                        self.log_test("GET /api/contacts (authorized)", False, "Contacts data is not a list", data)
                else:
                    self.log_test("GET /api/contacts (authorized)", False, "Invalid response structure", data)
            else:
                self.log_test("GET /api/contacts (authorized)", False, f"HTTP {response.status_code}", response.json())
            
            # Test with wrong password
            response = requests.get(f"{self.base_url}/contacts?password=wrong_password")
            if response.status_code == 401:
                data = response.json()
                if not data.get('success') and 'unauthorized' in data.get('error', '').lower():
                    self.log_test("GET /api/contacts (unauthorized)", True, "Correctly rejected unauthorized request")
                    return True
                else:
                    self.log_test("GET /api/contacts (unauthorized)", False, "Wrong error message", data)
            else:
                self.log_test("GET /api/contacts (unauthorized)", False, f"Expected 401, got {response.status_code}", response.json())
                
        except Exception as e:
            self.log_test("GET /api/contacts", False, f"Exception: {str(e)}")
        
        return False
    
    def test_admin_delete_project(self):
        """Test DELETE /api/projects/:id - Delete project (admin only)"""
        if not self.created_project_id:
            self.log_test("DELETE /api/projects/:id", False, "No project ID available for testing (create test may have failed)")
            return False
        
        try:
            # Test with wrong password first
            response = requests.delete(f"{self.base_url}/projects/{self.created_project_id}?password=wrong_password")
            if response.status_code == 401:
                data = response.json()
                if not data.get('success') and 'unauthorized' in data.get('error', '').lower():
                    self.log_test("DELETE /api/projects/:id (unauthorized)", True, "Correctly rejected unauthorized delete")
                else:
                    self.log_test("DELETE /api/projects/:id (unauthorized)", False, "Wrong error message", data)
            else:
                self.log_test("DELETE /api/projects/:id (unauthorized)", False, f"Expected 401, got {response.status_code}", response.json())
            
            # Test with correct password
            response = requests.delete(f"{self.base_url}/projects/{self.created_project_id}?password={self.admin_password}")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'deleted' in data.get('message', '').lower():
                    self.log_test("DELETE /api/projects/:id (authorized)", True, "Project deleted successfully")
                    return True
                else:
                    self.log_test("DELETE /api/projects/:id (authorized)", False, "Invalid response structure", data)
            else:
                self.log_test("DELETE /api/projects/:id (authorized)", False, f"HTTP {response.status_code}", response.json())
                
        except Exception as e:
            self.log_test("DELETE /api/projects/:id", False, f"Exception: {str(e)}")
        
        return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting Portfolio Backend API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print(f"🔐 Admin Password: {self.admin_password}")
        print("=" * 60)
        
        # Run tests in logical order
        tests = [
            self.test_get_all_projects,
            self.test_get_single_project,
            self.test_post_contact,
            self.test_get_stats,
            self.test_admin_create_project,
            self.test_admin_update_project,
            self.test_admin_get_contacts,
            self.test_admin_delete_project
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        # Print summary of failed tests
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print("\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"   • {test['test']}: {test['message']}")
        
        print(f"\n✅ All tests completed at {datetime.now().isoformat()}")
        
        return passed, total, self.test_results

if __name__ == "__main__":
    tester = PortfolioAPITester()
    passed, total, results = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if passed == total else 1)