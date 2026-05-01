// ============================================
// BREVO CHAT WIDGET - La Casa de las Cortinas
// Versión corregida con inicialización forzada
// ============================================

(function() {
    console.log('💬 Iniciando Brevo Chat Widget...');
    
    // Asegurar que el ID esté definido (triple respaldo)
    window.BrevoConversationsID = window.BrevoConversationsID || '69f4cfd8ecdb886dba08cde5';
    
    // El ID ya debería estar en el head, pero si falla lo definimos arriba
    let attempts = 0;
    const maxAttempts = 30;
    
    function initBrevoChat() {
        if (typeof window.BrevoConversations !== 'undefined' && window.BrevoConversations) {
            console.log('✅ Brevo Conversations detectado');
            
            // Configurar el widget
            window.BrevoConversations('config', {
                color: '#00e5ff',
                position: 'right',
                greeting: '¡Hola! 👋 ¿En qué podemos ayudarte con cortinas y toldos?',
                businessName: 'La Casa de las Cortinas',
                businessLogo: 'https://lacasadelascortinas.com.ar/assets/images/logo-main.webp'
            });
            
            // Opcional: abrir automáticamente después de 3 segundos (solo en desktop)
            if (window.innerWidth > 768) {
                setTimeout(() => {
                    try {
                        window.BrevoConversations('open');
                        console.log('💬 Chat abierto automáticamente');
                    } catch(e) { /* silencioso */ }
                }, 5000);
            }
            
            return true;
        } else if (attempts < maxAttempts) {
            attempts++;
            console.log(`⏳ Esperando Brevo Conversations... intento ${attempts}/${maxAttempts}`);
            setTimeout(initBrevoChat, 500);
        } else {
            console.error('❌ Brevo Conversations no cargó. Verifica el ID y la red.');
            // Fallback: mostrar mensaje
            showFallbackButton();
        }
        return false;
    }
    
    function showFallbackButton() {
        const btn = document.createElement('div');
        btn.innerHTML = '💬';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #00e5ff, #ab47bc);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        btn.onclick = () => {
            window.openWhatsApp('Hola, vi el chat pero no funcionaba. Necesito ayuda.');
        };
        document.body.appendChild(btn);
        console.log('⚠️ Fallback: botón de WhatsApp activado');
    }
    
    // Eliminar cualquier botón flotante previo
    function cleanupOldButtons() {
        const oldButtons = document.querySelectorAll('.floating-wa, .sticky-wa, .custom-chat-btn, #custom-chat-btn, [onclick*="openWhatsApp"].floating');
        oldButtons.forEach(btn => {
            if (btn && btn.remove) {
                btn.remove();
                console.log('🧹 Botón antiguo eliminado');
            }
        });
    }
    
    // Estilos para asegurar visibilidad
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .brevo-conversations-button {
                z-index: 9999 !important;
                bottom: 80px !important;
                right: 20px !important;
                position: fixed !important;
            }
            .brevo-conversations-iframe {
                z-index: 9998 !important;
            }
            .floating-wa, .sticky-wa, .custom-chat-btn, #custom-chat-btn {
                display: none !important;
            }
            /* Ajustar navbar para que no opaque el chat */
            header {
                z-index: 100 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ejecutar
    cleanupOldButtons();
    addStyles();
    setTimeout(initBrevoChat, 1000);
    
    // También intentar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initBrevoChat, 500));
    }
})();
