// ============================================
// GET CONVERSATIONS - LUZ AI
// Netlify Function - Recupera el historial de chat para el dashboard
// ============================================

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            // Mock data for development if credentials are missing
            const mockData = [
                {
                    session_id: 'sess-123',
                    user_id: 'Diego (Demo)',
                    last_activity: new Date().toISOString(),
                    unresponded: true,
                    messages: [
                        { role: 'user', content: 'Hola, necesito presupuesto para unas roller black out.', timestamp: new Date(Date.now() - 10000).toISOString() },
                        { role: 'assistant', content: '¡Hola! Soy Luz. Con gusto te ayudo. ¿Podrías pasarme las medidas?', timestamp: new Date(Date.now() - 5000).toISOString() }
                    ]
                }
            ];
            return { statusCode: 200, headers, body: JSON.stringify(mockData) };
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const { sessionId } = event.queryStringParameters || {};

        let query = supabase.from('chat_conversations').select('*');
        
        if (sessionId) {
            query = query.eq('session_id', sessionId);
        } else {
            query = query.order('last_activity', { ascending: false }).limit(50);
        }

        const { data, error } = await query;
        
        if (error) throw error;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
