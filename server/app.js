// Azure App Service startup file - Fresh Deployment
const app = require('./fresh-server');

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Fresh ProjectConnect Backend running on port ${port}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Ready for Azure App Service!`);
    console.log(`📡 CORS enabled for: projectconnect.tech`);
});
