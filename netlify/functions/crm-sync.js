// ============================================
// CRM SYNC FUNCTION - LA CASA DE LAS CORTINAS
// Proxi seguro para Brevo API v3
// ============================================

const axios = require('axios');

exports.handler = async (event) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const payload = JSON.parse(event.body);
        const BREVO_API_KEY = process.env.BREVO_API_KEY;

        if (!BREVO_API_KEY) {
            console.error('❌ Error: BREVO_API_KEY no configurada en Netlify');
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, error: 'CRM configuration missing' })
            };
        }

        console.log(`📊 [CRM SYNC] Sincronizando lead: ${payload.email}`);

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

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, id: response.data.id })
        };

    } catch (error) {
        console.error('❌ [CRM SYNC] Error:', error.response?.data || error.message);
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({
                success: false,
                error: error.response?.data?.message || error.message
            })
        };
    }
};
