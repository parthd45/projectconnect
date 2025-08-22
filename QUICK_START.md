# Quick Start Guide for ProjectConnect

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# Run the setup script (Windows)
setup.bat

# Or manually:
cd server && npm install
cd ../client && npm install
```

### 2. Setup Database
Install PostgreSQL and create database:
```sql
CREATE DATABASE projectconnect;
CREATE USER pc_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE projectconnect TO pc_user;
```

### 3. Environment Configuration
Create `server/.env` file:
```env
DB_USER=pc_user
DB_PASSWORD=password123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=projectconnect
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Application
```bash
# Use the start script (Windows)
start.bat

# Or manually in separate terminals:
# Terminal 1 (Backend):
cd server && npm run dev

# Terminal 2 (Frontend):
cd client && npm start
```

## 🌐 Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 📱 Test the Application
1. Visit http://localhost:3000
2. Click "Sign Up" and create an account
3. Create a new project
4. Search and browse projects
5. Connect with other users

## 🛠 Development Commands

### Backend (server folder)
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
npm test         # Run tests
```

### Frontend (client folder)
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify database exists and user has permissions

### Port Already in Use
- Change PORT in server/.env (default: 5000)
- Change REACT_APP_API_URL in client if needed

### Module Not Found Errors
- Run `npm install` in both server and client folders
- Delete node_modules and package-lock.json, then reinstall

## 📦 Production Deployment
Ready for deployment to Heroku, AWS, or any cloud platform. See README.md for detailed deployment instructions.
