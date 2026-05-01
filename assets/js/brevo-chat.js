// ============================================
// BREVO CHAT WIDGET - La Casa de las Cortinas
// Versión corregida - sin conflicto con WhatsApp
// ============================================

(function() {
    // 1. Eliminar cualquier botón de chat previo que pueda existir
    const cleanup = () => {
        const existingButtons = document.querySelectorAll('.custom-chat-btn, #custom-chat-btn, .floating-chat, .sticky-wa, [onclick*="openWhatsApp"]');
        existingButtons.forEach(btn => {
            // Solo eliminar si es un botón flotante (no los del menú o footer)
            const style = window.getComputedStyle(btn);
            if (style.position === 'fixed' || btn.classList.contains('sticky-wa') || btn.classList.contains('custom-chat-btn')) {
                btn.remove();
            }
        });
    };
    
    // Ejecutar limpieza inicial y tras un pequeño delay
    cleanup();
    setTimeout(cleanup, 2000);
    
    // 2. Configurar Brevo Conversations
    window.BrevoConversations = window.BrevoConversations || [];
    
    // 3. Cargar el script de Brevo
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://conversations-widget.brevo.com/brevo-conversations.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "brevo-conversations"));
    
    // 4. Configurar el widget (después de que cargue)
    setTimeout(() => {
        if (window.BrevoConversations) {
            window.BrevoConversations.push(['config', {
                color: '#00e5ff',
                position: 'right',
                greeting: '¡Hola! 👋 ¿En qué podemos ayudarte con cortinas y toldos?'
            }]);
            console.log('✅ Brevo Chat inicializado correctamente');
        }
    }, 1500);
    
    // 5. Opcional: remover también estilos que puedan bloquear
    const style = document.createElement('style');
    style.textContent = `
        /* Asegurar que el botón de Brevo sea visible */
        .brevo-conversations-button {
            z-index: 9999 !important;
            bottom: 20px !important;
            right: 20px !important;
        }
        /* Ocultar cualquier otro botón flotante */
        .floating-chat-btn, .custom-chat-btn, #custom-chat-btn, .sticky-wa {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('💬 Brevo Chat Widget listo (sin conflicto con WhatsApp)');
})();
