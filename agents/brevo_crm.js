/**
 * BREVO CRM INTEGRATION MODULE
 * Intercepts form submissions and syncs with Brevo API v3.
 */

const BREVO_CONFIG = {
    // Note: API Key should be managed via Environment Variables in production
    API_KEY: 'YOUR_BREVO_API_KEY', 
    LIST_ID: 2, // Default list ID
    ENDPOINT: 'https://api.brevo.com/v3/contacts'
};

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            // We don't preventDefault() to allow other listeners (like WhatsApp redirect) to work
            // but we capture the data first.
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Logic for lead classification
            const message = (data.mensaje || data.message || '').toLowerCase();
            const isLead = message.includes('presupuesto') || message.includes('cotización');
            const type = data.tipo_usuario || 'Cliente'; // Capture from select if exists
            
            console.log('📊 [BREVO CRM] Intercepting submission...', data);

            const payload = {
                email: data.email || data.user_email,
                attributes: {
                    NOMBRE: data.nombre || data.full_name,
                    MENSAJE: message,
                    CLIENTE_POTENCIAL: isLead,
                    TIPO_CONTACTO: type.toUpperCase(),
                    PROYECTO: data.proyecto || 'General'
                },
                listIds: [BREVO_CONFIG.LIST_ID],
                updateEnabled: true
            };

            // Async sync to CRM
            syncToBrevo(payload);
        });
    });
});

async function syncToBrevo(payload) {
    if (!payload.email) {
        console.warn('⚠️ [BREVO CRM] No email found, skipping sync.');
        return;
    }

    try {
        const response = await fetch(BREVO_CONFIG.ENDPOINT, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_CONFIG.API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ [BREVO CRM] Contact synced successfully.');
        } else {
            const errData = await response.json();
            console.error('❌ [BREVO CRM] Sync failed:', errData);
        }
    } catch (error) {
        console.error('❌ [BREVO CRM] Error connecting to Brevo:', error.message);
    }
}
