const { handler } = require('../netlify/functions/chat-agent');


async function testLuz() {
    console.log("🚀 Probando a Luz con DeepSeek...");
    
    const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
            message: "Hola Luz, necesito una cortina roller blackout para mi dormitorio de 2x2 metros. ¿Cuánto me saldría?",
            history: []
        })
    };

    try {
        const response = await handler(event);
        const body = JSON.parse(response.body);
        console.log("\n--- RESPUESTA DE LUZ ---");
        console.log(body.reply);
        console.log("------------------------");
    } catch (error) {
        console.error("❌ Error en la prueba:", error);
    }
}

testLuz();
