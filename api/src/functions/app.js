const { app } = require('@azure/functions');

app.http('health', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return {
            status: 200,
            jsonBody: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                message: 'ProjectConnect API on Static Web Apps!'
            }
        };
    }
});

app.http('test', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return {
            status: 200,
            jsonBody: {
                message: 'Unified domain backend working!',
                success: true,
                version: '3.0.0',
                domain: 'projectconnect.tech'
            }
        };
    }
});
