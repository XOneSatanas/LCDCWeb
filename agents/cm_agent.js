// ============================================
// CM AGENT - LA CASA DE LAS CORTINAS
// Community Manager Automatizado con Autorización
// ============================================

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
    // Meta Business (Facebook/Instagram)
    meta: {
        accessToken: process.env.META_ACCESS_TOKEN || '',
        pageId: process.env.META_PAGE_ID || '',
        instagramBusinessId: process.env.INSTAGRAM_BUSINESS_ID || '',
        apiVersion: 'v18.0'
    },
    
    // WhatsApp Business (opcional)
    whatsapp: {
        phoneNumberId: process.env.WA_PHONE_NUMBER_ID || '',
        accessToken: process.env.WA_ACCESS_TOKEN || '',
        businessId: process.env.WA_BUSINESS_ID || ''
    },
    
    // Webhooks para autorizaciones
    approvalWebhook: process.env.CM_APPROVAL_WEBHOOK || 'http://localhost:5678/webhook/cm-approvals',
    
    // Business DNA
    brand: {
        name: "La Casa de las Cortinas",
        tone: "Exclusivo, profesional, orientado a soluciones y de alta gama.",
        hashtags: ["#CortinasRoller", "#DiseñoDeInteriores", "#SmartHome", "#ArquitecturaRosario", "#Interiorismo"],
        products: ["Roller", "Onda Perfecta", "Automatización X-1", "Toldos Proyección"],
        whatsappNumber: "5493412687230",
        whatsappLink: "https://wa.me/5493412687230"
    }
};

// ============================================
// 1. GENERACIÓN DE CONTENIDO INTELIGENTE
// ============================================
class ContentGenerator {
    static generatePostContent(theme = null) {
        const templates = {
            roller: {
                platform: "Instagram",
                format: "CAROUSEL",
                copy: `✨ Transforma tus espacios con nuestras Cortinas Roller de Alta Gama.\n\n☀️ Filtrado solar milimétrico\n🏠 Diseño minimalista\n⚡ Instalación en 24hs\n\n📲 Agendá tu asesoría sin cargo por WhatsApp: ${CONFIG.brand.whatsappLink}\n\n${CONFIG.brand.hashtags.join(' ')}`,
                link: CONFIG.brand.whatsappLink
            },
            perfectWave: {
                platform: "Facebook",
                format: "IMAGE",
                copy: `La máxima expresión del lujo textil. ✨\n\nNuestro sistema Onda Perfecta ofrece caída uniforme y calidez incomparable para tus ambientes.\n\n🎯 Calidad premium\n🎯 Garantía 1 año\n🎯 Instalación profesional\n\n👉 Consultanos por WhatsApp: ${CONFIG.brand.whatsappLink}\n\n${CONFIG.brand.hashtags.join(' ')}`,
                link: CONFIG.brand.whatsappLink
            },
            automation: {
                platform: "Instagram",
                format: "REELS",
                copy: `🏠 Tu hogar inteligente empieza aquí.\n\nControl total de tus cortinas y toldos desde tu celular o asistente de voz con la tecnología X-1 Powered.\n\n✅ Compatible con Alexa, Google Home y Siri\n✅ Escenas programables\n✅ Ahorro energético garantizado\n\n📲 Descubrí el futuro: ${CONFIG.brand.whatsappLink}\n\n${CONFIG.brand.hashtags.join(' ')}`,
                link: CONFIG.brand.whatsappLink
            },
            testimonials: {
                platform: "Facebook",
                format: "CAROUSEL",
                copy: `🏆 Clientes satisfechos que confían en La Casa de las Cortinas.\n\n"Excelente atención y calidad. Mi living nunca se vio tan bien" - Laura G.\n"La automatización cambió mi rutina. Súper recomendable" - Martín R.\n\n📲 Viví la experiencia vos también: ${CONFIG.brand.whatsappLink}\n\n${CONFIG.brand.hashtags.join(' ')}`,
                link: CONFIG.brand.whatsappLink
            }
        };
        
        const selectedTheme = theme || Object.keys(templates)[Math.floor(Math.random() * Object.keys(templates).length)];
        return templates[selectedTheme];
    }
    
    static generateCompleteCalendar(weeks = 1) {
        const calendar = [];
        const themes = ['roller', 'perfectWave', 'automation', 'testimonials'];
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const bestTimes = {
            Instagram: ['18:00', '20:00', '12:00'],
            Facebook: ['12:00', '15:00', '19:00']
        };
        
        for (let week = 0; week < weeks; week++) {
            for (let day = 0; day < days.length; day++) {
                // Publicar 3-4 veces por semana (no todos los días)
                if (Math.random() > 0.5) continue;
                
                const theme = themes[Math.floor(Math.random() * themes.length)];
                const content = this.generatePostContent(theme);
                const timeSlot = bestTimes[content.platform][Math.floor(Math.random() * bestTimes[content.platform].length)];
                
                calendar.push({
                    id: `post_${Date.now()}_${week}_${day}`,
                    ...content,
                    scheduledDate: this.getFutureDate(week, day, timeSlot),
                    status: 'PENDING_APPROVAL'
                });
            }
        }
        
        return calendar;
    }
    
    static getFutureDate(week, dayIndex, time) {
        const date = new Date();
        date.setDate(date.getDate() + (week * 7) + dayIndex);
        const [hours, minutes] = time.split(':');
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return date.toISOString();
    }
}

// ============================================
// 2. INTEGRACIÓN CON META GRAPH API
// ============================================
class MetaPublisher {
    constructor(accessToken, pageId, apiVersion = 'v18.0') {
        this.accessToken = accessToken;
        this.pageId = pageId;
        this.baseUrl = `https://graph.facebook.com/${apiVersion}`;
    }
    
    async publishToFacebook(post) {
        try {
            const url = `${this.baseUrl}/${this.pageId}/feed`;
            const payload = {
                message: post.copy,
                access_token: this.accessToken
            };
            
            if (post.link) payload.link = post.link;
            
            const response = await axios.post(url, payload);
            console.log(`✅ Publicado en Facebook: ${response.data.id}`);
            return { success: true, postId: response.data.id, platform: 'facebook' };
            
        } catch (error) {
            console.error('❌ Error publicando en Facebook:', error.response?.data || error.message);
            return { success: false, error: error.message };
        }
    }
    
    async publishToInstagram(post, imageUrl = null) {
        try {
            if (!CONFIG.meta.instagramBusinessId) {
                throw new Error('Instagram Business ID no configurado');
            }
            
            // Paso 1: Crear contenedor de medios
            const createUrl = `${this.baseUrl}/${CONFIG.meta.instagramBusinessId}/media`;
            const mediaPayload = {
                image_url: imageUrl || 'https://lacasadelascortinas.com.ar/assets/images/hero.png',
                caption: post.copy,
                access_token: this.accessToken
            };
            
            const mediaResponse = await axios.post(createUrl, mediaPayload);
            const containerId = mediaResponse.data.id;
            
            // Paso 2: Publicar el contenedor
            const publishUrl = `${this.baseUrl}/${CONFIG.meta.instagramBusinessId}/media_publish`;
            const publishPayload = {
                creation_id: containerId,
                access_token: this.accessToken
            };
            
            const publishResponse = await axios.post(publishUrl, publishPayload);
            console.log(`✅ Publicado en Instagram: ${publishResponse.data.id}`);
            
            return { success: true, postId: publishResponse.data.id, platform: 'instagram' };
            
        } catch (error) {
            console.error('❌ Error publicando en Instagram:', error.response?.data || error.message);
            return { success: false, error: error.message };
        }
    }
    
    async publishToBoth(post, imageUrl = null) {
        const results = [];
        
        // Publicar en Facebook
        const fbResult = await this.publishToFacebook(post);
        results.push(fbResult);
        
        // Publicar en Instagram si está configurado
        if (CONFIG.meta.instagramBusinessId && post.platform === 'Instagram') {
            const igResult = await this.publishToInstagram(post, imageUrl);
            results.push(igResult);
        }
        
        return results;
    }
}

// ============================================
// 3. GESTIÓN DE COMENTARIOS Y DMS
// ============================================
class CommunityManager {
    constructor(metaPublisher) {
        this.publisher = metaPublisher;
        this.responseTemplates = {
            price_request: `¡Hola! Gracias por tu interés. Para darte un presupuesto preciso necesitamos algunos datos:
📏 Medidas del espacio
🎨 Tipo de tela preferida (opaco/screen)
⚙️ Sistema (manual/automatizado)

¿Me compartís esta info por acá? Así te armamos un presupuesto personalizado sin cargo. ¡Quedamos atentos! 🏠✨`,
            
            shipping_request: `¡Hola! Sí, hacemos envíos a todo el país. 📦 El costo y tiempo varía según la ubicación. ¿Podrías indicarnos tu código postal? Así te calculamos el envío exacto. ¡Gracias por tu interés! 🚚`,
            
            catalog_request: `¡Hola! Te comparto nuestro catálogo completo con todos los sistemas y telas disponibles: 📚

[CATÁLOGO DIGITAL]

¿Hay algún producto que te llame especialmente la atención? Podemos agendar una videollamada para mostrarte muestras físicas. ¡Saludos! 👋`,
            
            default: `¡Hola! Gracias por escribirnos. 🏠 Soy el asistente virtual de La Casa de las Cortinas. ¿En qué puedo ayudarte hoy? Te recordamos que también podés contactarnos directamente por WhatsApp al ${CONFIG.brand.whatsappLink} para atención personalizada. ¡Estamos para ayudarte! ✨`
        };
    }
    
    async fetchComments(postId) {
        try {
            const url = `${this.publisher.baseUrl}/${postId}/comments?access_token=${this.publisher.accessToken}`;
            const response = await axios.get(url);
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching comments:', error.message);
            return [];
        }
    }
    
    async replyToComment(commentId, message) {
        try {
            const url = `${this.publisher.baseUrl}/${commentId}/replies`;
            const payload = {
                message: message,
                access_token: this.publisher.accessToken
            };
            const response = await axios.post(url, payload);
            console.log(`✅ Respondido comentario ${commentId}`);
            return { success: true, replyId: response.data.id };
        } catch (error) {
            console.error('❌ Error respondiendo comentario:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async handleIncomingMessage(senderId, message, platform) {
        console.log(`📨 Mensaje recibido de ${senderId}: "${message}"`);
        
        // Detectar intención
        let intent = 'default';
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('presupuesto')) {
            intent = 'price_request';
        } else if (lowerMsg.includes('envío') || lowerMsg.includes('envio') || lowerMsg.includes('córdoba') || lowerMsg.includes('bs as')) {
            intent = 'shipping_request';
        } else if (lowerMsg.includes('catálogo') || lowerMsg.includes('catalogo') || lowerMsg.includes('catálogo')) {
            intent = 'catalog_request';
        }
        
        const response = this.responseTemplates[intent];
        
        // En un entorno real, aquí se enviaría la respuesta vía API
        console.log(`🤖 Respuesta generada: "${response.substring(0, 100)}..."`);
        
        // Registrar interacción para análisis
        this.logInteraction(senderId, message, intent, response);
        
        return { intent, response };
    }
    
    logInteraction(userId, message, intent, response) {
        const logFile = path.join(__dirname, '../logs/cm-interactions.json');
        const interaction = {
            userId,
            message,
            intent,
            response: response.substring(0, 200),
            timestamp: new Date().toISOString()
        };
        
        let logs = [];
        if (fs.existsSync(logFile)) {
            logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
        }
        logs.push(interaction);
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    }
    
    async getEngagementMetrics(postId) {
        try {
            const url = `${this.publisher.baseUrl}/${postId}?fields=insights.metric(likes,comments,shares)&access_token=${this.publisher.accessToken}`;
            const response = await axios.get(url);
            return response.data.insights || {};
        } catch (error) {
            console.error('Error obteniendo métricas:', error.message);
            return {};
        }
    }
}

// ============================================
// 4. SOLICITUD DE AUTORIZACIÓN HUMANA
// ============================================
class ApprovalSystem {
    static async requestApproval(content) {
        console.log('\n✉️ Solicitando aprobación para publicar contenido...');
        
        const approvalRequest = {
            id: `cm_approval_${Date.now()}`,
            type: 'SOCIAL_MEDIA_POST',
            content: content,
            timestamp: new Date().toISOString(),
            status: 'PENDING'
        };
        
        // Guardar localmente
        const pendingFile = path.join(__dirname, '../pending-cm-approvals.json');
        let pending = [];
        if (fs.existsSync(pendingFile)) {
            pending = JSON.parse(fs.readFileSync(pendingFile, 'utf-8'));
        }
        pending.push(approvalRequest);
        fs.writeFileSync(pendingFile, JSON.stringify(pending, null, 2));
        
        // Enviar a webhook (Slack, Discord, Telegram, etc.)
        try {
            await axios.post(CONFIG.approvalWebhook, approvalRequest, { timeout: 5000 });
            console.log('📨 Solicitud enviada al canal de aprobaciones');
        } catch (error) {
            console.log('⚠️ Webhook no disponible, revisar archivo local');
        }
        
        // Mostrar en consola
        console.log('\n' + '='.repeat(60));
        console.log('📝 CONTENIDO PENDIENTE DE APROBACIÓN:');
        console.log('='.repeat(60));
        console.log(`Plataforma: ${content.platform}`);
        console.log(`Formato: ${content.format}`);
        console.log(`Copy:\n${content.copy}\n`);
        console.log(`Programado para: ${new Date(content.scheduledDate).toLocaleString()}`);
        console.log('='.repeat(60));
        console.log(`💾 Para aprobar, editar: ${pendingFile}`);
        console.log(`   Cambiar "status": "APPROVED" en el objeto correspondiente`);
        console.log('='.repeat(60) + '\n');
        
        return approvalRequest;
    }
    
    static async checkApprovals() {
        const pendingFile = path.join(__dirname, '../pending-cm-approvals.json');
        const approvedFile = path.join(__dirname, '../approved-cm-posts.json');
        
        if (!fs.existsSync(pendingFile)) return [];
        
        const pending = JSON.parse(fs.readFileSync(pendingFile, 'utf-8'));
        const approved = pending.filter(p => p.status === 'APPROVED');
        const rejected = pending.filter(p => p.status === 'REJECTED');
        
        if (approved.length > 0) {
            let existingApproved = [];
            if (fs.existsSync(approvedFile)) {
                existingApproved = JSON.parse(fs.readFileSync(approvedFile, 'utf-8'));
            }
            existingApproved.push(...approved);
            fs.writeFileSync(approvedFile, JSON.stringify(existingApproved, null, 2));
            
            // Eliminar los aprobados del pending
            const remaining = pending.filter(p => p.status !== 'APPROVED');
            fs.writeFileSync(pendingFile, JSON.stringify(remaining, null, 2));
            
            console.log(`✅ ${approved.length} publicaciones aprobadas listas para publicar`);
        }
        
        if (rejected.length > 0) {
            console.log(`❌ ${rejected.length} publicaciones rechazadas`);
            const remaining = pending.filter(p => p.status !== 'REJECTED');
            fs.writeFileSync(pendingFile, JSON.stringify(remaining, null, 2));
        }
        
        return approved;
    }
}

// ============================================
// 5. EJECUCIÓN PRINCIPAL
// ============================================
async function runCMAgent() {
    console.log('\n📱 INICIANDO CM AGENT - COMMUNITY MANAGER AUTOMATIZADO');
    console.log('='.repeat(60));
    
    // Verificar configuración
    if (!CONFIG.meta.accessToken || CONFIG.meta.accessToken === '') {
        console.log('⚠️ Meta Access Token no configurado. Modo simulación activado.');
        console.log('Para publicar realmente, configurar:');
        console.log('  - META_ACCESS_TOKEN');
        console.log('  - META_PAGE_ID');
        console.log('  - INSTAGRAM_BUSINESS_ID (opcional)\n');
    }
    
    // Paso 1: Generar calendario de contenido
    console.log('📅 [1/5] Generando calendario de contenido...');
    const calendar = ContentGenerator.generateCompleteCalendar(1);
    console.log(`✅ Generadas ${calendar.length} publicaciones para esta semana`);
    
    // Paso 2: Solicitar aprobación para cada publicación
    console.log('\n✉️ [2/5] Solicitando aprobaciones...');
    const approvedPosts = [];
    
    for (const post of calendar) {
        const approval = await ApprovalSystem.requestApproval(post);
        if (approval) approvedPosts.push(post);
    }
    
    // Paso 3: Verificar aprobaciones pendientes
    console.log('\n🔍 [3/5] Verificando aprobaciones previas...');
    const newApproved = await ApprovalSystem.checkApprovals();
    
    // Paso 4: Publicar contenido aprobado
    console.log('\n🚀 [4/5] Publicando contenido aprobado...');
    const publisher = new MetaPublisher(CONFIG.meta.accessToken, CONFIG.meta.pageId, CONFIG.meta.apiVersion);
    const communityManager = new CommunityManager(publisher);
    
    const postsToPublish = [...newApproved];
    
    for (const post of postsToPublish) {
        const postData = post.content || post;
        
        if (CONFIG.meta.accessToken && CONFIG.meta.accessToken !== '') {
            // Publicación real
            const result = await publisher.publishToBoth(postData);
            console.log(`📤 Publicación ${postData.id}: ${result.map(r => r.platform).join(', ')}`);
        } else {
            // Simulación
            console.log(`📤 [SIMULACIÓN] Publicación en ${postData.platform}:`);
            console.log(`   Copy: ${postData.copy.substring(0, 100)}...`);
        }
    }
    
    // Paso 5: Simular gestión de interacciones
    console.log('\n💬 [5/5] Gestionando interacciones...');
    
    // Simular comentarios/DMs entrantes
    const simulatedMessages = [
        { user: "@arq_martinez", text: "¡Excelente! ¿Hacen envíos a Córdoba?" },
        { user: "@marcos_design", text: "Necesito presupuesto para un ventanal blackout" },
        { user: "@laura_arq", text: "¿Tienen catálogo digital?" }
    ];
    
    for (const msg of simulatedMessages) {
        const result = await communityManager.handleIncomingMessage(msg.user, msg.text, 'instagram');
        console.log(`\n👤 ${msg.user}: "${msg.text}"`);
        console.log(`🎯 Intención detectada: ${result.intent}`);
        console.log(`🤖 Respuesta: "${result.response.substring(0, 150)}..."`);
    }
    
    // Reporte final
    console.log('\n' + '='.repeat(60));
    console.log('✅ CM AGENT - EJECUCIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log(`📊 Resumen:`);
    console.log(`   - Contenido generado: ${calendar.length} publicaciones`);
    console.log(`   - Pendientes aprobación: ${calendar.length - postsToPublish.length}`);
    console.log(`   - Publicaciones ejecutadas: ${postsToPublish.length}`);
    console.log(`   - Interacciones simuladas: ${simulatedMessages.length}`);
    console.log('='.repeat(60) + '\n');
    
    return {
        calendar,
        approvedPosts: postsToPublish,
        interactions: simulatedMessages
    };
}

// ============================================
// COMANDOS CLI
// ============================================
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'approve-all':
            // Aprobar todas las publicaciones pendientes automáticamente
            const pendingFile = path.join(__dirname, '../pending-cm-approvals.json');
            if (fs.existsSync(pendingFile)) {
                const pending = JSON.parse(fs.readFileSync(pendingFile, 'utf-8'));
                pending.forEach(p => p.status = 'APPROVED');
                fs.writeFileSync(pendingFile, JSON.stringify(pending, null, 2));
                console.log(`✅ Aprobadas automáticamente ${pending.length} publicaciones`);
            }
            break;
        case 'publish':
            runCMAgent();
            break;
        case 'check':
            ApprovalSystem.checkApprovals().then(approved => {
                console.log(`${approved.length} publicaciones aprobadas listas`);
            });
            break;
        default:
            console.log(`
🔧 CM AGENT - COMANDOS DISPONIBLES:
  node cm_agent.js publish     - Generar calendario, solicitar aprobación y publicar
  node cm_agent.js approve-all - Aprobar TODAS las publicaciones pendientes
  node cm_agent.js check       - Verificar aprobaciones y ejecutar publicaciones
            `);
            break;
    }
}

module.exports = {
    runCMAgent,
    ContentGenerator,
    MetaPublisher,
    CommunityManager,
    ApprovalSystem
};
