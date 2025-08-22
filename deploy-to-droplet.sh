# Digital Ocean Droplet Deployment Script
#!/bin/bash

echo "🚀 Deploying ProjectConnect to Digital Ocean..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Clone repository (replace with your repo)
git clone https://github.com/your-username/projectconnect.git
cd projectconnect

# Setup Backend
cd server
npm install --production

# Create production environment file
cat > .env << EOL
DATABASE_URL=postgresql://postgres:duPZzXJcGyiEUcHdAXatjDdNcpLMLXFq@ballast.proxy.rlwy.net:29786/railway
JWT_SECRET=ProjectConnect_Super_Secure_Production_JWT_Secret_Key_2025_Make_It_Very_Long_Random
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-domain.com
EMAIL_USER=projectconnectsupporrt@gmail.com
EMAIL_PASSWORD=htjo qbcs adcc arrd
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
SESSION_SECRET=ProjectConnect_OAuth_Session_Secret_Production_2025_Very_Secure_Random_String
EOL

# Start backend with PM2
pm2 start server.js --name "projectconnect-backend"

# Setup Frontend
cd ../client

# Create production environment file
cat > .env.production << EOL
REACT_APP_API_URL=https://your-domain.com/api
GENERATE_SOURCEMAP=false
REACT_APP_ENVIRONMENT=production
EOL

npm install
npm run build

# Configure Nginx
sudo tee /etc/nginx/sites-available/projectconnect << EOL
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (React build)
    location / {
        root /home/\$USER/projectconnect/client/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable site
sudo ln -s /etc/nginx/sites-available/projectconnect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL certificate (Certbot)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Save PM2 configuration
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://your-domain.com"
echo "📊 Backend API: https://your-domain.com/api"
echo "🔍 Health check: https://your-domain.com/api/health"
