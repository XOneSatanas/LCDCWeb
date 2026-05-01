// ============================================
// MANUAL REPLY - LUZ AI
// Netlify Function - Permite al admin intervenir en un chat
// ============================================

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { sessionId, message } = JSON.parse(event.body);
        
        if (!sessionId || !message) {
            return { statusCode: 400, headers, body: 'Missing sessionId or message' };
        }

        if (!SUPABASE_URL || !SUPABASE_KEY) {
            return { statusCode: 200, headers, body: JSON.stringify({ status: 'mock_success' }) };
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        // 1. Obtener historial
        const { data: existing } = await supabase
            .from('chat_conversations')
            .select('*')
            .eq('session_id', sessionId)
            .single();

        const messages = existing ? existing.messages : [];
        messages.push({ 
            role: 'assistant', 
            content: `[ADMIN]: ${message}`, 
            timestamp: new Date().toISOString() 
        });

        // 2. Actualizar (y marcar como respondido por humano)
        await supabase
            .from('chat_conversations')
            .update({ 
                messages: messages,
                last_activity: new Date().toISOString(),
                unresponded: false 
            })
            .eq('session_id', sessionId);

        // NOTA: Aquí se podría integrar con una API de push o SSE para que el usuario vea la respuesta en tiempo real
        // Por ahora, el usuario la verá en el siguiente refresh o si el chat hace polling.

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: 'success' })
        };

    } catch (error) {
        console.error('❌ Error in manual-reply:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
