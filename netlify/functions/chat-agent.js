// ============================================
// AI CHAT AGENT - LA CASA DE LAS CORTINAS
// Genera respuestas automáticas para Brevo
// ============================================

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        const { message, visitorId } = JSON.parse(event.body);
        const msg = message.toLowerCase();

        // Lógica de respuesta inteligente (Knowledge Base)
        let response = "";

        if (msg.includes("hola") || msg.includes("buen")) {
            response = "¡Hola! 👋 Soy el asistente virtual de La Casa de las Cortinas. ¿En qué puedo ayudarte hoy?";
        } else if (msg.includes("precio") || msg.includes("cuanto cuesta") || msg.includes("cotización") || msg.includes("presupuesto")) {
            response = "Para darte un presupuesto exacto, necesito las medidas aproximadas (ancho x alto). ¿Qué tipo de cortina te interesa? (Roller, Toldos, Blackout, etc.)";
        } else if (msg.includes("donde están") || msg.includes("direccion") || msg.includes("rosario") || msg.includes("ubicacion")) {
            response = "Estamos en Rosario. Realizamos mediciones e instalaciones a domicilio sin cargo en toda la zona. ¿Querés agendar una visita?";
        } else if (msg.includes("roller") || msg.includes("screen") || msg.includes("blackout")) {
            response = "Las cortinas Roller son nuestra especialidad. Tenemos telas Blackout (oscuridad total) y Sunscreen (control solar). ¿Buscás alguna en particular?";
        } else if (msg.includes("toldo")) {
            response = "Ofrecemos toldos de lona acrílica y vinílica con sistemas manuales o automatizados. ¿Es para un balcón, patio o local comercial?";
        } else if (msg.includes("tiempo") || msg.includes("demora") || msg.includes("entrega")) {
            response = "Nuestro tiempo de entrega promedio es de 10 a 15 días hábiles, ya que fabricamos todo a medida con la mejor calidad.";
        } else {
            response = "Entiendo. Dejame consultar con un asesor humano para darte la mejor respuesta. Mientras tanto, ¿podrías dejarme un teléfono de contacto?";
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                reply: response,
                agent: "LCDC-AI-Agent"
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
