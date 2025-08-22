# ProjectConnect

ProjectConnect is a platform for students in Amravati to find collaborators for college assignments, hackathons, and personal projects. The goal is to connect students with complementary skills.

## Features
- **Authentication:** Sign up and log in securely
- **User Profiles:** Display name, college, skills, and GitHub link
- **Project Creation:** Post projects with required skills
- **Project Discovery:** Search and filter projects by keywords and skills
- **Connection Requests:** Request to join projects, owner can approve/deny
- **Messaging:** Direct messaging between approved users
- **Modern UI:** Built with React and Tailwind CSS
- **RESTful API:** Node.js/Express backend with PostgreSQL
- **Heroku Ready:** Configured for deployment

---

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd project-connect
```

### 2. Setup PostgreSQL Database
- Install PostgreSQL and create a database (e.g. `projectconnect`)
- Create a user and grant privileges
- Example SQL:
  ```sql
  CREATE DATABASE projectconnect;
  CREATE USER pc_user WITH PASSWORD 'yourpassword';
  GRANT ALL PRIVILEGES ON DATABASE projectconnect TO pc_user;
  ```

### 3. Configure Environment Variables
Create a `.env` file in `/server`:
```
DB_USER=pc_user
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=projectconnect
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 4. Install Dependencies
#### Backend
```sh
cd server
npm install
```
#### Frontend
```sh
cd ../client
npm install
```

### 5. Run the Application Locally
#### Start Backend
```sh
cd server
npm run dev
```
#### Start Frontend
```sh
cd ../client
npm start
```

---

## Deployment (Heroku)
1. Create a Heroku app and add PostgreSQL add-on
2. Set environment variables in Heroku dashboard
3. Push code to Heroku
4. The backend will auto-create tables on first run

---

## File Structure
```
/project-connect
|-- /client         // React Frontend
|   |-- /src
|   |   |-- /components
|   |   |-- /pages
|   |   |-- App.js
|   |   |-- index.js
|   |-- package.json
|-- /server         // Node.js/Express Backend
|   |-- /controllers
|   |-- /routes
|   |-- db.js
|   |-- server.js
|   |-- package.json
|-- .gitignore
|-- README.md
```

---

## API Endpoints
See `/server/routes` for all RESTful endpoints. All endpoints are tested and follow best practices.

---

## License
MIT
