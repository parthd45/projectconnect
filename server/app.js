// Azure App Service startup file
const app = require('./server');

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL configured:', !!process.env.DATABASE_URL);
});
