const axios = require('axios');

async function listModels() {
    const API_KEY = 'AIzaSyB5BdSBtYYwSr_d25L8aMOHx56K9KaU9mI';
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        console.log("--- MODELOS DISPONIBLES ---");
        response.data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log(m.name);
            }
        });
    } catch (error) {
        console.error("Error al listar modelos:", error.response?.data || error.message);
    }
}

listModels();
