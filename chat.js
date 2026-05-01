/**
 * LUZ CHAT WIDGET - LUXURY EDITION
 * Handles interactions and animations
 */

let sessionId = localStorage.getItem('luz_session_id');
if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('luz_session_id', sessionId);
}

const chatWidget = document.getElementById('chat-widget');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const renderingIndicator = document.getElementById('rendering-indicator');

function toggleChat() {
    chatWidget.classList.toggle('closed');
    if (!chatWidget.classList.contains('closed')) {
        chatInput.focus();
        scrollToBottom();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessageToChat(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    // Parse Markdown-like bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\n/g, '<br>');

    msgDiv.innerHTML = formattedText;
    msgDiv.style.opacity = '0';
    msgDiv.style.transform = 'translateY(10px) scale(0.98)';
    msgDiv.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

    chatMessages.appendChild(msgDiv);

    // Trigger animation
    requestAnimationFrame(() => {
        msgDiv.style.opacity = '1';
        msgDiv.style.transform = 'translateY(0) scale(1)';
    });

    scrollToBottom();
}

let chatHistory = [];

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message to UI
    addMessageToChat('user', text);
    chatInput.value = '';

    showTyping(true);

    try {
        // Llamada real a la función de Netlify
        const response = await fetch('/.netlify/functions/chat-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: text,
                history: chatHistory 
            })
        });

        const data = await response.json();

        showTyping(false);
        
        if (data.reply) {
            addMessageToChat('assistant', data.reply);
            
            // Guardar en el historial para mantener el contexto (máximo 10 mensajes)
            chatHistory.push({ role: "user", parts: [{ text: text }] });
            chatHistory.push({ role: "model", parts: [{ text: data.reply }] });
            if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
        } else {
            throw new Error("Respuesta vacía");
        }

    } catch (error) {
        console.error('Error:', error);
        showTyping(false);
        addMessageToChat('assistant', 'Disculpa, hubo un error de conexión. ¿Podrías intentar de nuevo?');
    }
}


function showTyping(show) {
    if (!renderingIndicator) return;

    if (show) {
        renderingIndicator.classList.remove('hidden');
        renderingIndicator.querySelector('.rendering-text').textContent = 'Luz está escribiendo...';
    } else {
        renderingIndicator.classList.add('hidden');
    }
}

function showRendering(show) {
    if (!renderingIndicator) return;

    if (show) {
        renderingIndicator.classList.remove('hidden');
        renderingIndicator.querySelector('.rendering-text').textContent = 'Calculando presupuesto...';
    } else {
        renderingIndicator.classList.add('hidden');
    }
}

// Initial Greeting if empty
setTimeout(() => {
    if (chatMessages && chatMessages.children.length === 0) {
        // Optional initial greeting logic can go here
    }
}, 1000);

