// ============================================
// NETLIFY FUNCTION: run-agents
// Ejecuta agentes y devuelve resultados directamente
// ============================================

const { runAllAgents } = require('../../agents/agent_orchestrator');

exports.handler = async (event, context) => {
    console.log('🚀 Netlify Function: Ejecutando agentes reales...');
    
    // Log para debugging
    console.log('Method:', event.httpMethod);
    console.log('Headers:', JSON.stringify(event.headers));
    
    try {
        // Ejecutar todos los agentes
        const results = await runAllAgents();
        
        console.log('✅ Ejecución completada. Health Score:', results.healthScore);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            },
            body: JSON.stringify({
                status: 'success',
                message: 'Agents executed successfully',
                timestamp: new Date().toISOString(),
                data: results
            })
        };
        
    } catch (error) {
        console.error('❌ Error executing agents:', error);
        console.error('Stack:', error.stack);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                status: 'error',
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                timestamp: new Date().toISOString()
            })
        };
    }
};
