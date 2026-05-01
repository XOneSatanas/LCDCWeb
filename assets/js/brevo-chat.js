// ============================================
// BREVO CHAT WIDGET - La Casa de las Cortinas
// Versión Robusta con Patrón de Cola de Comandos
// ============================================

(function() {
    console.log('💬 Iniciando Agente de Chat...');
    
    // Configuración Inicial
    window.BrevoConversationsID = '69f4cfd8ecdb886dba08cde5';
    window.BrevoConversations = window.BrevoConversations || [];
    
    // Comando de Configuración (vía Push para asegurar compatibilidad)
    window.BrevoConversations.push(['config', {
        color: '#00e5ff',
        position: 'right',
        greeting: '¡Hola! 👋 ¿En qué podemos ayudarte con cortinas y toldos?',
        businessName: 'La Casa de las Cortinas'
    }]);

    // Función para manejar la respuesta de la IA
    async function handleAIChatResponse(userMessage) {
        if (!userMessage) return;
        console.log('🤖 Consultando Agente de IA para:', userMessage);
        
        try {
            const response = await fetch('/.netlify/functions/chat-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });
            
            const data = await response.json();
            
            if (data.reply) {
                // Usar PUSH para enviar el mensaje de vuelta
                window.BrevoConversations.push(['send', data.reply]);
                console.log('✅ Respuesta enviada al widget');
            }
        } catch (error) {
            console.error('❌ Error llamando al agente:', error);
        }
    }

    // Suscribirse a eventos (intentar ambos métodos por si acaso)
    function setupSubscriptions() {
        console.log('📡 Configurando escucha de mensajes...');
        
        const onMessage = function(payload) {
            // payload.type 0 suele ser el visitante
            if (payload && !payload.agentId && payload.content) {
                console.log('📩 Mensaje del usuario:', payload.content);
                setTimeout(() => handleAIChatResponse(payload.content), 1000);
            }
        };

        // Intentar método estándar
        window.BrevoConversations.push(['subscribe', 'message:received', onMessage]);
        
        // Backup: intentar método alternativo
        window.BrevoConversations.push(['on', 'message:received', onMessage]);
    }

    // Inicialización
    let attempts = 0;
    function checkReady() {
        // Si ya es una función, configuramos las suscripciones
        if (typeof window.BrevoConversations === 'function') {
            setupSubscriptions();
        } else if (attempts < 10) {
            attempts++;
            setTimeout(checkReady, 1000);
        } else {
            // Si sigue siendo un array tras 10s, intentamos suscribir igual vía push
            setupSubscriptions();
        }
    }

    // Eliminar botones viejos y asegurar estilos
    const style = document.createElement('style');
    style.textContent = `
        .brevo-conversations-button { z-index: 9999 !important; bottom: 80px !important; right: 20px !important; }
        .brevo-conversations-iframe { z-index: 9998 !important; }
        .floating-wa, .sticky-wa, .custom-chat-btn { display: none !important; }
    `;
    document.head.appendChild(style);

    checkReady();
})();
