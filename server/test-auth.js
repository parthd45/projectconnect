const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('Testing user registration...');
    
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      college: "MIT",
      skills: ["JavaScript", "React", "Node.js"],
      github_link: "https://github.com/johndoe"
    };

    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    
    console.log('Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    const token = response.data.data.token;
    console.log('\nToken received:', token.substring(0, 20) + '...');
    
    return token;
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

const testLogin = async () => {
  try {
    console.log('\nTesting user login...');
    
    const loginData = {
      email: "john@example.com",
      password: "password123"
    };

    const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
    console.log('Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data.token;
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

const testGetProfile = async (token) => {
  try {
    console.log('\nTesting get profile...');
    
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile retrieved successfully!');
    console.log('Profile:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Get profile failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
};

const testCreateProject = async (token) => {
  try {
    console.log('\nTesting create project...');
    
    const projectData = {
      title: "AI-Powered Student Collaboration Platform",
      description: "Building a platform that uses AI to match students with similar interests and skills for collaborative projects. Looking for developers interested in machine learning and web development.",
      skills_needed: ["Python", "Machine Learning", "React", "Node.js", "PostgreSQL"]
    };

    const response = await axios.post('http://localhost:5000/api/projects', projectData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Project created successfully!');
    console.log('Project:', JSON.stringify(response.data, null, 2));
    
    return response.data.data.project.id;
  } catch (error) {
    console.error('Create project failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

const runTests = async () => {
  console.log('🚀 Starting Authentication and Project Tests\n');
  
  // Test registration
  const regToken = await testRegistration();
  if (!regToken) return;
  
  // Test login
  const loginToken = await testLogin();
  if (!loginToken) return;
  
  // Test profile
  await testGetProfile(loginToken);
  
  // Test project creation
  const projectId = await testCreateProject(loginToken);
  
  console.log('\n✅ All tests completed!');
  if (projectId) {
    console.log(`📝 Created project with ID: ${projectId}`);
  }
};

runTests();
