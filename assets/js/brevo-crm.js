// ============================================
// BREVO CRM - La Casa de las Cortinas
// Captura de leads y sincronización real
// ============================================

const BREVO_SYNC_URL = '/.netlify/functions/brevo-sync';

document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 [BREVO CRM] Inicializado');
    
    // Interceptar formularios
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            // Capturar datos antes del submit original
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const email = data.email || data.user_email || data.correo;
            
            if (email) {
                // Clasificar contacto
                const message = data.mensaje || data.message || '';
                const tipoContacto = detectContactType(form, data);
                const esLeadCalificado = isQualifiedLead(message, tipoContacto);
                
                console.log('📊 [BREVO CRM] Procesando lead:', { email, tipoContacto, esLeadCalificado });
                
                // Enviar a Brevo (async)
                await syncToBrevo({
                    email,
                    nombre: data.nombre || data.full_name || '',
                    telefono: data.telefono || data.phone || '',
                    mensaje: message,
                    tipoContacto: tipoContacto,
                    proyecto: data.proyecto || detectProject(form)
                });
                
                // Notificar al dashboard
                await notifyDashboard({ email, tipoContacto, esLeadCalificado });
            }
        });
    });
});

async function syncToBrevo(leadData) {
    try {
        const response = await fetch(BREVO_SYNC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ [BREVO CRM] Lead sincronizado:', leadData.email);
            showNotification('✅ ¡Gracias! Te contactaremos pronto.');
        } else {
            console.error('❌ [BREVO CRM] Error:', result.error);
        }
        
        return result;
    } catch (error) {
        console.error('❌ [BREVO CRM] Network error:', error);
        return { success: false, error: error.message };
    }
}

// Funciones auxiliares
function detectContactType(form, data) {
    if (data.tipo_usuario) return data.tipo_usuario.toUpperCase();
    if (data.tipo) return data.tipo.toUpperCase();
    
    const path = window.location.pathname;
    if (path.includes('alianzas')) return 'PARTNER';
    if (path.includes('profesionales')) return 'PROFESIONAL';
    
    return 'CLIENTE';
}

function detectProject(form) {
    const projectSelect = form.querySelector('select[name="proyecto"]');
    if (projectSelect && projectSelect.value) return projectSelect.value;
    return 'General';
}

function isQualifiedLead(mensaje, tipoContacto) {
    if (tipoContacto === 'PARTNER' || tipoContacto === 'PROFESIONAL') return true;
    
    const keywords = ['presupuesto', 'cotizacion', 'precio', 'costo', 'quiero comprar', 'necesito'];
    return keywords.some(kw => (mensaje || '').toLowerCase().includes(kw));
}

async function notifyDashboard(lead) {
    try {
        await fetch('/.netlify/functions/crm-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'CRM_LEAD',
                source: 'form',
                data: lead,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        // Silencioso - no crítico
    }
}

function showNotification(message) {
    // Crear notificación temporal
    const notification = document.getElementById('crm-notification') || document.createElement('div');
    notification.id = 'crm-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        z-index: 9999;
        transition: opacity 0.3s ease;
        opacity: 1;
    `;
    if (!document.getElementById('crm-notification')) {
        document.body.appendChild(notification);
    }
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
