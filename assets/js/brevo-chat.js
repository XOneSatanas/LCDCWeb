// ============================================
// BREVO CHAT WIDGET - La Casa de las Cortinas
// Versión Ultra-Robusta con BrevoConversationsSetup
// ============================================

(function() {
    console.log('💬 Configurando Agente de IA (BrevoConversationsSetup)...');

    // 1. Definir el Setup Global ANTES de cargar nada
    window.BrevoConversationsID = '69f4cfd8ecdb886dba08cde5';
    
    window.BrevoConversationsSetup = {
        // Estilos y comportamiento
        color: '#00e5ff',
        position: 'right',
        greeting: '¡Hola! 👋 ¿En qué podemos ayudarte con cortinas y toldos?',
        businessName: 'La Casa de las Cortinas',
        
        // EVENTO CRÍTICO: Captura de mensajes nuevos
        onNewMessage: function(message) {
            console.log('📩 Nuevo mensaje detectado:', message);
            
            // Solo responder si el mensaje viene del visitante
            // Verificamos tanto autor como tipo para máxima compatibilidad
            const isVisitor = message.type === 'visitor' || 
                            message.authorType === 'visitor' || 
                            (!message.agentId && !message.botId);

            if (isVisitor) {
                const text = message.text || message.content;
                if (text) {
                    console.log('🤖 Consultando IA para el mensaje:', text);
                    handleAIChatResponse(text);
                }
            }
        },
        
        // Evento cuando el widget está listo
        onReady: function() {
            console.log('✅ Widget de Brevo totalmente listo');
        }
    };

    // 2. Función de respuesta de IA
    async function handleAIChatResponse(userMessage) {
        try {
            // Delay natural para simular escritura
            setTimeout(async () => {
                const response = await fetch('/.netlify/functions/chat-agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage })
                });
                
                const data = await response.json();
                
                if (data.reply) {
                    // Usar la cola de comandos para enviar la respuesta
                    // Importante: Brevo usa un array de comandos si no ha cargado, 
                    // o una función si ya cargó.
                    if (typeof window.BrevoConversations === 'function') {
                        window.BrevoConversations('send', data.reply);
                    } else {
                        window.BrevoConversations = window.BrevoConversations || [];
                        window.BrevoConversations.push(['send', data.reply]);
                    }
                    console.log('🤖 Respuesta de IA enviada al chat');
                }
            }, 1500);
        } catch (error) {
            console.error('❌ Error en el flujo de IA:', error);
        }
    }

    // 3. Estilos de seguridad para asegurar visibilidad
    const style = document.createElement('style');
    style.textContent = `
        .brevo-conversations-button { z-index: 9999 !important; bottom: 80px !important; right: 20px !important; }
        .brevo-conversations-iframe { z-index: 9998 !important; }
        .floating-wa, .sticky-wa, .custom-chat-btn { display: none !important; }
    `;
    document.head.appendChild(style);

    console.log('🚀 Configuración de Chat Agent completada.');
})();
