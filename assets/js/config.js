// ============================================
// LA CASA DE LAS CORTINAS - CONFIGURACIÓN GLOBAL
// ============================================

window.CONFIG = {
    // Meta Pixel ID (REEMPLAZAR CON ID REAL DE FACEBOOK)
    PIXEL_ID: '123456789012345',
    
    // Google Ads ID
    ADS_ID: 'AW-3300140845',
    
    // WhatsApp (número real en formato internacional SIN + ni espacios)
    WHATSAPP_NUMBER: '5493412687230',
    
    // Mensajes predefinidos
    WHATSAPP_MSG_CATALOGO: 'Hola, me interesa recibir el catálogo completo de cortinas y toldos.',
    WHATSAPP_MSG_AUTOMATIZACION: 'Hola, me interesa automatizar mis cortinas/toldos.',
    WHATSAPP_MSG_CONTACTO: 'Hola, me gustaría recibir más información.',
    
    // Email comercial
    EMAIL: 'lacasadelascortinasok@gmail.com'
};

// Función global de WhatsApp
window.openWhatsApp = function(mensajePersonalizado) {
    try {
        let msg = mensajePersonalizado || CONFIG.WHATSAPP_MSG_CONTACTO;
        const numero = CONFIG.WHATSAPP_NUMBER;
        const texto = encodeURIComponent(msg);
        const url = `https://wa.me/${numero}?text=${texto}`;
        window.open(url, '_blank');
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {contact_method: 'whatsapp'});
        }
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {'send_to': CONFIG.ADS_ID + '/contact'});
        }
        return true;
    } catch(e) {
        console.error('Error WhatsApp:', e);
        alert('Contáctanos al email: ' + CONFIG.EMAIL);
        return false;
    }
};

window.iniciarAsesoria = function(tipo) {
    const mensajes = {
        'completa': CONFIG.WHATSAPP_MSG_CATALOGO,
        'automatizacion': CONFIG.WHATSAPP_MSG_AUTOMATIZACION
    };
    window.openWhatsApp(mensajes[tipo] || CONFIG.WHATSAPP_MSG_CONTACTO);
};

// Inicializar Meta Pixel (solo si hay ID válido)
if (typeof fbq !== 'undefined' && CONFIG.PIXEL_ID && CONFIG.PIXEL_ID !== 'TU_PIXEL_ID' && CONFIG.PIXEL_ID !== '123456789012345') {
    fbq('init', CONFIG.PIXEL_ID);
    fbq('track', 'PageView');
}

console.log('✅ LCDC Configuración cargada');
