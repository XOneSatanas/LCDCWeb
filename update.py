import os

files = [
    "index.html",
    "admin.html",
    "alianzas.html",
    "profesionales.html",
    "privacidad.html",
    "terminos.html"
]

old_head = """    <!-- Brevo Conversations {literal} -->
    <script>
        (function(d, w, c) {
            w.BrevoConversationsID = '69f4cfd8ecdb886dba08cde5';
            w[c] = w[c] || function() {
                (w[c].q = w[c].q || []).push(arguments);
            };
            var s = d.createElement('script');
            s.async = true;
            s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
            if (d.head) d.head.appendChild(s);
        })(document, window, 'BrevoConversations');
    </script>
    <!-- /Brevo Conversations {/literal} -->"""

new_head = """    <!-- Brevo Conversations Widget - Versión Corregida -->
    <script type="text/javascript">
        (function() {
            // Configuración directa
            window.BrevoConversationsID = '69f4cfd8ecdb886dba08cde5';
            window.BrevoConversations = window.BrevoConversations || [];
            
            // Configurar el widget ANTES de cargar el script
            window.BrevoConversations.push(['config', {
                color: '#00e5ff',
                position: 'right',
                greeting: '¡Hola! 👋 ¿En qué podemos ayudarte con cortinas y toldos?',
                businessName: 'La Casa de las Cortinas',
                loadDelay: 0
            }]);
            
            // Cargar el script de Brevo
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
            s.onload = function() {
                console.log('✅ Brevo Conversations cargado exitosamente');
                // Forzar la apertura después de cargar
                setTimeout(function() {
                    if (window.BrevoConversations) {
                        window.BrevoConversations.push('open');
                    }
                }, 2000);
            };
            s.onerror = function() {
                console.error('❌ Error cargando Brevo Conversations');
            };
            document.head.appendChild(s);
        })();
    </script>"""

fallback_code = """
<!-- Forzar inicialización de Brevo (fallback) -->
<script>
    (function() {
        var maxAttempts = 30;
        var attempts = 0;
        
        function checkAndInitBrevo() {
            attempts++;
            
            // Método 1: Si existe la función global
            if (typeof BrevoConversations !== 'undefined' && BrevoConversations && typeof BrevoConversations === 'function') {
                console.log('✅ Brevo detectado (método 1), inicializando...');
                try {
                    BrevoConversations('config', {
                        color: '#00e5ff',
                        position: 'right',
                        greeting: '¡Hola! 👋 ¿En qué podemos ayudarte?'
                    });
                    BrevoConversations('open');
                } catch(e) { console.log('Error config:', e); }
                return true;
            }
            
            // Método 2: Si existe el array window.BrevoConversations
            if (window.BrevoConversations && Array.isArray(window.BrevoConversations) && window.BrevoConversations.push !== Array.prototype.push) {
                console.log('✅ Brevo detectado (método 2), configurando...');
                try {
                    window.BrevoConversations('config', {
                        color: '#00e5ff',
                        position: 'right',
                        greeting: '¡Hola! 👋 ¿En qué podemos ayudarte?'
                    });
                    return true;
                } catch(e) {}
            }
            
            // Método 3: Buscar el iframe ya cargado
            var iframe = document.querySelector('iframe[src*="brevo"], iframe[src*="conversations"]');
            if (iframe) {
                console.log('✅ Iframe de Brevo ya existe');
                return true;
            }
            
            if (attempts < maxAttempts) {
                console.log('⏳ Esperando Brevo... intento ' + attempts);
                setTimeout(checkAndInitBrevo, 500);
            } else {
                console.error('❌ Brevo no cargó después de ' + maxAttempts + ' intentos');
                // Mostrar botón de respaldo
                showFallbackChatButton();
            }
            return false;
        }
        
        function showFallbackChatButton() {
            if (document.getElementById('brevo-fallback-btn')) return;
            var btn = document.createElement('div');
            btn.id = 'brevo-fallback-btn';
            btn.innerHTML = '💬';
            btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:56px;height:56px;background:linear-gradient(135deg,#00e5ff,#ab47bc);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
            btn.onclick = function() {
                window.openWhatsApp('Hola, necesito ayuda con sus productos.');
            };
            document.body.appendChild(btn);
            console.log('⚠️ Fallback: botón de WhatsApp');
        }
        
        // Iniciar verificación después de 1 segundo
        setTimeout(checkAndInitBrevo, 1000);
        
        // También verificar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(checkAndInitBrevo, 500);
            });
        }
    })();
</script>

<!-- Estilos para asegurar que el botón sea visible -->
<style>
    /* Asegurar visibilidad del widget de Brevo */
    .brevo-conversations-button {
        z-index: 9999 !important;
        bottom: 80px !important;
        right: 20px !important;
        position: fixed !important;
        background: linear-gradient(135deg, #00e5ff, #ab47bc) !important;
    }
    .brevo-conversations-iframe {
        z-index: 9998 !important;
    }
    /* Ocultar cualquier otro widget flotante de WhatsApp */
    .sticky-wa, .floating-wa, .custom-chat-btn, #custom-chat-btn,
    [class*="floating"], [id*="floating"] {
        display: none !important;
    }
</style>
</body>"""

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Reemplazar old_head
    content = content.replace(old_head, new_head)
    
    # Reemplazar body final
    content = content.replace("</body>", fallback_code)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
