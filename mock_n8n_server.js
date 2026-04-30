const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5678;

app.use(cors());
app.use(express.json());

// Endpoint to receive agent reports
app.post('/webhook/agents', (req, res) => {
    const { agent, status, data, timestamp } = req.body;
    
    console.log(`\n[N8N MOCK] 🤖 Report received from: ${agent}`);
    console.log(`[STATUS] ${status === 'SUCCESS' ? '✅' : '❌'} ${status}`);
    console.log(`[DATA]`, JSON.stringify(data, null, 2));
    console.log(`[TIME] ${timestamp}`);
    
    res.status(200).json({
        message: 'Report received successfully by Mock n8n',
        receivedAt: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('Mock n8n Server is running 🚀');
});

app.listen(PORT, () => {
    console.log(`
    🚀 MOCK N8N SERVER LOADED
    -------------------------
    Endpoint: http://localhost:${PORT}/webhook/agents
    Monitoring agents in real-time...
    `);
});
