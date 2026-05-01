// Brevo Conversations Widget - Real
(function() {
    window.BrevoConversations = window.BrevoConversations || [];
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://conversations-widget.brevo.com/brevo-conversations.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "brevo-conversations"));
    
    // Configuración del chat
    window.BrevoConversations.push(['config', {
        color: '#00e5ff',
        position: 'right',
        greeting: '¡Hola! 👋 ¿En qué podemos ayudarte con cortinas y toldos?'
    }]);
    
    // Capturar leads desde el chat
    window.BrevoConversations.push(['on', 'message:received', (msg) => {
        if (msg.text && msg.text.includes('presupuesto')) {
            console.log('💬 Lead detectado en chat');
            // Aquí se podría disparar un evento al dashboard si se desea
        }
    }]);
    
    console.log('💬 Brevo Chat inicializado');
})();
