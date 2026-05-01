// ============================================
// BREVO CRM AGENT - LA CASA DE LAS CORTINAS
// Integración con Brevo API v3 + Dashboard
// ============================================

const BREVO_CONFIG = {
    API_KEY: window.CONFIG?.BREVO_API_KEY || 'YOUR_BREVO_API_KEY',
    LIST_ID: 2,
    ENDPOINT: 'https://api.brevo.com/v3/contacts',
    DOUBLE_OPTIN: false
};

// Dashboard webhook (para mostrar eventos en tiempo real)
const DASHBOARD_WEBHOOK = '/.netlify/functions/crm-event';

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 [BREVO CRM] Agent initialized');
    
    // Verificar configuración
    if (BREVO_CONFIG.API_KEY === 'YOUR_BREVO_API_KEY') {
        console.warn('⚠️ [BREVO CRM] API Key no configurada. Usar variable de entorno BREVO_API_KEY');
    }
    
    // Interceptar todos los formularios
    const forms = document.querySelectorAll('form');
    console.log(`📊 [BREVO CRM] Escuchando ${forms.length} formulario(s)`);
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            await handleFormSubmit(e, form);
        });
    });
});

// ============================================
// MANEJADOR DE FORMULARIOS
// ============================================
async function handleFormSubmit(event, form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Extraer email (campo flexible)
    const email = data.email || data.user_email || data.correo;
    
    if (!email) {
        console.warn('⚠️ [BREVO CRM] No email found in form, skipping CRM sync');
        return; // No impedimos el envío normal del form
    }
    
    // Clasificar el lead
    const message = (data.mensaje || data.message || data.comentario || '').toLowerCase();
    const nombre = data.nombre || data.full_name || data.name || '';
    const telefono = data.telefono || data.phone || data.whatsapp || '';
    const tipoContacto = detectContactType(form, data);
    const esLeadCalificado = isQualifiedLead(message, tipoContacto);
    
    // Construir payload para Brevo
    const payload = {
        email: email,
        attributes: {
            NOMBRE: nombre,
            TELEFONO: telefono,
            MENSAJE: message.substring(0, 500),
            CLIENTE_POTENCIAL: esLeadCalificado,
            TIPO_CONTACTO: tipoContacto,
            PROYECTO: data.proyecto || detectProject(form),
            FUENTE: window.location.pathname,
            FECHA_CAPTURA: new Date().toISOString()
        },
        listIds: [BREVO_CONFIG.LIST_ID],
        updateEnabled: true
    };
    
    console.log('📊 [BREVO CRM] Procesando lead:', { email, tipoContacto, esLeadCalificado });
    
    // Enviar a Brevo (async, no bloquea el form)
    const result = await syncToBrevo(payload);
    
    // Notificar al dashboard
    await notifyDashboard({ email, nombre, tipoContacto, esLeadCalificado, success: result.success });
    
    // Mostrar feedback al usuario (opcional, no intrusivo)
    if (result.success) {
        showSubtleNotification('✅ ¡Gracias! Te contactaremos pronto.');
    }
    
    // No prevenimos el submit original para no romper otras funcionalidades
}

// ============================================
// DETECCIÓN DE TIPO DE CONTACTO
// ============================================
function detectContactType(form, data) {
    // Prioridad: campo explícito
    if (data.tipo_usuario) return data.tipo_usuario.toUpperCase();
    if (data.tipo) return data.tipo.toUpperCase();
    if (data.rol) return data.rol.toUpperCase();
    
    // Detectar por URL de la página
    const path = window.location.pathname;
    if (path.includes('alianzas')) return 'PARTNER';
    if (path.includes('profesionales')) return 'PROFESIONAL';
    
    // Detectar por campos ocultos
    const hiddenTipo = form.querySelector('input[name="tipo"][type="hidden"]');
    if (hiddenTipo && hiddenTipo.value) return hiddenTipo.value.toUpperCase();
    
    return 'CLIENTE';
}

// ============================================
// DETECCIÓN DE PROYECTO
// ============================================
function detectProject(form) {
    // Buscar select o radio de proyectos
    const projectSelect = form.querySelector('select[name="proyecto"], select[name="project"]');
    if (projectSelect && projectSelect.value) return projectSelect.value;
    
    const projectRadio = form.querySelector('input[name="proyecto"]:checked, input[name="project"]:checked');
    if (projectRadio && projectRadio.value) return projectRadio.value;
    
    return 'General';
}

// ============================================
// CALIFICACIÓN DE LEAD
// ============================================
function isQualifiedLead(message, tipoContacto) {
    // Partners y profesionales son leads calificados por defecto
    if (tipoContacto === 'PARTNER' || tipoContacto === 'PROFESIONAL') return true;
    
    // Palabras clave que indican intención de compra
    const keywords = [
        'presupuesto', 'cotizacion', 'cotización', 'precio', 'costo',
        'quiero comprar', 'necesito', 'instalar', 'medida', 'ventana',
        'roller', 'toldo', 'cortina', 'blackout', 'screen', 'automatizacion'
    ];
    
    return keywords.some(keyword => message.includes(keyword));
}

// ============================================
// SINCRONIZACIÓN CON BREVO API
// ============================================
async function syncToBrevo(payload) {
    if (!payload.email) {
        return { success: false, error: 'No email provided' };
    }
    
    try {
        const response = await fetch('/.netlify/functions/crm-sync', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            console.log('✅ [BREVO CRM] Contacto sincronizado vía Proxy');
            return { success: true, id: result.id };
        } else {
            console.error('❌ [BREVO CRM] Error Proxy:', result.error);
            return { success: false, error: result.error || 'Proxy Error' };
        }
        
    } catch (error) {
        console.error('❌ [BREVO CRM] Network error:', error.message);
        return { success: false, error: error.message };
    }
}

// ============================================
// NOTIFICACIÓN AL DASHBOARD
// ============================================
async function notifyDashboard(crmEvent) {
    try {
        const response = await fetch(DASHBOARD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'CRM_LEAD',
                timestamp: new Date().toISOString(),
                data: crmEvent
            })
        });
        
        if (response.ok) {
            console.log('📊 [BREVO CRM] Evento enviado al dashboard');
        }
    } catch (error) {
        console.debug('Dashboard notification not available:', error.message);
    }
}

// ============================================
// FEEDBACK VISUAL AL USUARIO
// ============================================
function showSubtleNotification(message) {
    let container = document.getElementById('crm-notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'crm-notification-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = 'crm-notification';
    notification.style.cssText = `
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        margin-top: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        cursor: pointer;
    `;
    notification.innerText = message;
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
    
    notification.onclick = () => notification.remove();
    container.appendChild(notification);
}

// ============================================
// FUNCIÓN EXPUESTA GLOBALMENTE (para debug)
// ============================================
window.BrevoCRM = {
    config: BREVO_CONFIG,
    testConnection: async () => {
        if (BREVO_CONFIG.API_KEY === 'YOUR_BREVO_API_KEY') {
            return { status: 'simulation', apiKeyConfigured: false };
        }
        try {
            const response = await fetch('https://api.brevo.com/v3/account', {
                headers: { 'api-key': BREVO_CONFIG.API_KEY }
            });
            return { status: response.ok ? 'connected' : 'error', apiKeyConfigured: true };
        } catch {
            return { status: 'error', apiKeyConfigured: true };
        }
    }
};
