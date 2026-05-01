// ============================================
// CHAT AGENT - LUZ (La Casa de las Cortinas)
// Netlify Function - Recibe webhooks de Brevo y responde con Gemini
// ============================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuración
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyB5BdSBtYYwSr_d25L8aMOHx56K9KaU9mI';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// System prompt de LUZ (su personalidad)
const SYSTEM_PROMPT = `Eres LUZ, una asesora experta en cortinas, toldos y automatización para "La Casa de las Cortinas" en Rosario, Argentina.

PERSONALIDAD:
- Eres cordial, amable, proactiva y extremadamente profesional
- Tu tono evoca una estética minimalista, luminosa y elegante
- Basada en Rosario, cobertura 150km a la redonda
- Contacto directo: 341-2687230

REGLAS OBLIGATORIAS (Guardrails):
1. Siempre intenta obtener medidas aproximadas (Ancho x Alto) para cotizaciones
2. Usa números redondeados para precios (ej: "desde $50.000")
3. NUNCA generes códigos QR
4. Si detectas interés claro de compra o necesidad compleja, solicita datos de contacto para visita técnica
5. SIEMPRE ofrece el plus de automatización (Smart Home, X-ONE, Somfy)

EJEMPLO DE RESPUESTA:
"¡Hola! 👋 Soy Luz, tu asesora de La Casa de las Cortinas. ¿Qué espacio estás pensando vestir hoy? Dame un aproximado de las medidas (ancho x alto) y te ayudo con opciones premium."`;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Verificar método y manejar OPTIONS para CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }
    
    try {
        // Parsear el webhook de Brevo o de chat.js
        const body = JSON.parse(event.body);
        
        // Extraer el mensaje del usuario
        let userMessage = '';
        let senderId = '';
        let conversationId = '';
        
        // Brevo envía diferentes formatos según el evento, chat.js envía "message" simple
        if (body.message && body.message.text) {
            userMessage = body.message.text;
            senderId = body.message.senderId || body.senderId;
            conversationId = body.conversationId;
        } else if (body.text) {
            userMessage = body.text;
            senderId = body.from || body.senderId;
            conversationId = body.id;
        } else if (body.content) {
            userMessage = body.content;
            senderId = body.userId;
        } else {
            // Formato alternativo / formato de chat.js custom
            userMessage = body.message || body.query || body.text;
            senderId = body.sender || body.user || 'chat-js-user';
        }
        
        console.log(`📨 Mensaje recibido: "${userMessage}" de ${senderId}`);
        
        if (!userMessage) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ status: 'ignored', reason: 'No message content' })
            };
        }
        
        // Inicializar Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // Construir el prompt con el system prompt + historial (simplificado por ahora, se puede mejorar usando el history de chat.js si llega)
        const prompt = `${SYSTEM_PROMPT}\n\nUsuario: ${userMessage}\n\nLUZ:`;
        
        // Generar respuesta
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        console.log(`🤖 Respuesta generada: "${response.substring(0, 100)}..."`);
        
        // Devolver respuesta para que Brevo la envíe al chat, y para chat.js usando "reply"
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: response,
                reply: response, // Compatibilidad con chat.js
                conversationId: conversationId,
                senderId: senderId,
                agent: "Luz-AI-Gemini"
            })
        };
        
    } catch (error) {
        console.error('❌ Error en chat-agent:', error);
        
        // Fallback amigable
        const fallbackResponse = `¡Hola! Soy Luz. En este momento estoy terminando de procesar algunos pedidos técnicos. Para no hacerte esperar, ¿podrías indicarme tu nombre y un teléfono? Así un asesor humano podrá contactarte de inmediato. También puedes escribirnos directamente al 341-2687230.`;
        
        return {
            statusCode: 200, // Devolvemos 200 aunque haya error para que Brevo no reintente infinitamente
            headers,
            body: JSON.stringify({ 
                message: fallbackResponse,
                reply: fallbackResponse, // Compatibilidad con chat.js
                agent: "Luz-Fallback"
            })
        };
    }
};
