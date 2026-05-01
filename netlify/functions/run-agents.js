// ============================================
// NETLIFY FUNCTION: run-agents
// Endpoint real que ejecuta todos los agentes
// ============================================

const { runAllAgents } = require('../../agents/agent_orchestrator');

exports.handler = async (event, context) => {
    console.log('🚀 Netlify Function: Ejecutando agentes reales...');
    
    try {
        const results = await runAllAgents();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                status: 'success',
                message: 'Agents executed successfully',
                data: results
            })
        };
        
    } catch (error) {
        console.error('Error executing agents:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                status: 'error',
                message: error.message,
                data: null
            })
        };
    }
};
