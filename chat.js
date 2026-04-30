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

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    addMessageToChat('user', text);
    chatInput.value = '';

    // Check if we expect a budget calculation
    const isBudgetRequest = text.match(/\d+/) || text.toLowerCase().includes('medida');

    if (isBudgetRequest) {
        showRendering(true);
    } else {
        showTyping(true);
    }

    try {
        // Mock response for frontend demo
        await new Promise(r => setTimeout(r, 1500));
        let mockResponse = "Gracias por su consulta. Un especialista técnico se pondrá en contacto pronto.";
        if (text.toLowerCase().includes('domotica') || text.toLowerCase().includes('automatizacion') || text.toLowerCase().includes('smart')) {
            mockResponse = "X-1 Smart Solution permite integrar sus cortinas con los principales sistemas domóticos. ¿Le gustaría agendar una demostración técnica?";
        } else if (isBudgetRequest) {
            mockResponse = "He registrado los datos. Generando factibilidad técnica... \n\n**Estimación preliminar: Lista**. Un asesor le brindará los valores exactos. ¿Desea continuar por WhatsApp?";
        } else if (text.toLowerCase().includes('catálogo') || text.toLowerCase().includes('completa')) {
            mockResponse = "Nuestra colección incluye sistemas Roller, Onda Perfecta, Verticales y Venecianas de alta precisión. ¿Qué estilo proyectual busca para su proyecto?";
        }

        const data = { message: mockResponse, presupuesto: isBudgetRequest };

        // Simulate "Rendering" delay for premium feel if it's a budget
        if (data.presupuesto) {
            await new Promise(r => setTimeout(r, 2000)); // 2s delay
        }

        showRendering(false);
        showTyping(false);
        addMessageToChat('assistant', data.message);

    } catch (error) {
        console.error('Error:', error);
        showRendering(false);
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

