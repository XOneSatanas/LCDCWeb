/**
 * LCDC GLOBAL CONFIGURATION
 * Centralizes functional constants to improve maintainability.
 */
const CONFIG = {
    WHATSAPP_NUMBER: "5493412687230",
    WHATSAPP_MSG_CATALOGO: "Hola, me gustaría explorar su catálogo.",
    WHATSAPP_MSG_PARTNER: "Hola, quiero solicitar acceso al Club Profesional.",
    SUPABASE_URL: "https://nzjsjohxlswdroljoknc.supabase.co",
    SUPABASE_KEY: "sb_publishable_omv5VUGbV9mIcUnwGXK6Ww_RcZ39J3m",
    PIXEL_ID: "TU_PIXEL_ID" // REEMPLAZAR CON ID REAL
};

// Global helper for WhatsApp
function openWhatsApp(text = CONFIG.WHATSAPP_MSG_CATALOGO) {
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
