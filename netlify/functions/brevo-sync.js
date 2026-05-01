// ============================================
// BREVO SYNC FUNCTION - LA CASA DE LAS CORTINAS
// Proxi seguro para Brevo API v3
// ============================================

const axios = require('axios');

exports.handler = async (event) => {
    // Permitir CORS (para el dashboard y formularios)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const leadData = JSON.parse(event.body);
        const BREVO_API_KEY = process.env.BREVO_API_KEY;

        if (!BREVO_API_KEY) {
            console.error('❌ Error: BREVO_API_KEY no configurada');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, error: 'Configuration missing' })
            };
        }

        console.log(`📊 [BREVO SYNC] Sincronizando lead: ${leadData.email}`);

        // Mapear datos al formato de Brevo
        const payload = {
            email: leadData.email,
            attributes: {
                NOMBRE: leadData.nombre || '',
                TELEFONO: leadData.telefono || '',
                MENSAJE: leadData.mensaje?.substring(0, 500) || '',
                TIPO_CONTACTO: leadData.tipoContacto || 'CLIENTE',
                PROYECTO: leadData.proyecto || 'General',
                FECHA_CAPTURA: new Date().toISOString()
            },
            listIds: [2],
            updateEnabled: true
        };

        const response = await axios({
            method: 'post',
            url: 'https://api.brevo.com/v3/contacts',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            data: payload
        });

        // Guardar localmente (simulado o vía CRM Event)
        await saveToLocalStorage(leadData);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, id: response.data.id })
        };

    } catch (error) {
        console.error('❌ [BREVO SYNC] Error:', error.response?.data || error.message);
        return {
            statusCode: error.response?.status || 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: error.response?.data?.message || error.message 
            })
        };
    }
};

async function saveToLocalStorage(lead) {
    console.log('📊 Lead procesado internamente:', lead.email);
}
