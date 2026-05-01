// ============================================
// SEO AGENT - LA CASA DE LAS CORTINAS
// Administración automática de Google Ads y Analytics
// con sistema de autorización humana
// ============================================

const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURACIÓN
// ============================================
const SITE_URL = 'https://lacasadelascortinas.com.ar';
const N8N_WEBHOOK = process.env.N8N_WEBHOOK || 'http://localhost:5678/webhook/agents';
const APPROVAL_WEBHOOK = process.env.APPROVAL_WEBHOOK || 'http://localhost:5678/webhook/approvals';

// Archivos de credenciales (debes crearlos en Google Cloud Console)
const GOOGLE_ADS_CREDENTIALS = path.join(__dirname, '../credentials/google-ads.json');
const GOOGLE_ANALYTICS_CREDENTIALS = path.join(__dirname, '../credentials/google-analytics.json');
const REFRESH_TOKEN_PATH = path.join(__dirname, '../credentials/token.json');

// IDs de tus propiedades (configurar manualmente)
const CONFIG = {
    googleAds: {
        customerId: '123-456-7890',        // ← REEMPLAZAR CON TU ID
        loginCustomerId: null,              // Opcional: si usas MCC
        developerToken: process.env.GOOGLE_ADS_DEV_TOKEN
    },
    googleAnalytics: {
        propertyId: '123456789',            // ← REEMPLAZAR CON TU PROPERTY ID
        measurementId: 'G-XXXXXXXX'         // ← REEMPLAZAR CON TU MEASUREMENT ID
    }
};

// ============================================
// CLIENTES DE API (inicialización lazy)
// ============================================
let adsClient = null;
let analyticsClient = null;

async function getGoogleAdsClient() {
    if (adsClient) return adsClient;
    
    try {
        const auth = new google.auth.JWT(
            require(GOOGLE_ADS_CREDENTIALS).client_email,
            null,
            require(GOOGLE_ADS_CREDENTIALS).private_key,
            ['https://www.googleapis.com/auth/adwords']
        );
        
        await auth.authorize();
        adsClient = { auth, version: 'v15' };
        console.log('✅ Conexión a Google Ads establecida');
        return adsClient;
    } catch (error) {
        console.error('❌ Error conectando a Google Ads:', error.message);
        throw error;
    }
}

async function getAnalyticsClient() {
    if (analyticsClient) return analyticsClient;
    
    try {
        const auth = new google.auth.JWT(
            require(GOOGLE_ANALYTICS_CREDENTIALS).client_email,
            null,
            require(GOOGLE_ANALYTICS_CREDENTIALS).private_key,
            ['https://www.googleapis.com/auth/analytics.readonly']
        );
        
        await auth.authorize();
        analyticsClient = google.analyticsdata({ version: 'v1beta', auth });
        console.log('✅ Conexión a Google Analytics establecida');
        return analyticsClient;
    } catch (error) {
        console.error('❌ Error conectando a Analytics:', error.message);
        throw error;
    }
}

// ============================================
// 1. LECTURA DE DATOS DE GOOGLE ADS
// ============================================
async function getGoogleAdsData() {
    console.log('📊 Leyendo datos de Google Ads...');
    
    try {
        const client = await getGoogleAdsClient();
        
        // Consulta GAQL para obtener métricas de campañas
        const query = `
            SELECT 
                campaign.id,
                campaign.name,
                campaign.status,
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros,
                metrics.conversions,
                metrics.conversions_value,
                metrics.ctr,
                metrics.average_cpc
            FROM campaign
            WHERE segments.date DURING LAST_30_DAYS
            ORDER BY metrics.cost_micros DESC
        `;
        
        // Nota: Esta es una simulación porque google-ads-api requiere librería específica
        // Para implementación real, instalar: npm install google-ads-api
        
        // === SIMULACIÓN DE DATOS (REEMPLAZAR CON API REAL) ===
        const simulatedData = {
            campaigns: [
                {
                    id: '123456789',
                    name: 'Cortinas Rosario - Search',
                    status: 'ENABLED',
                    impressions: 15420,
                    clicks: 892,
                    cost: 245.50,
                    conversions: 28,
                    conversionValue: 2450.00,
                    ctr: 5.78,
                    avgCpc: 0.28,
                    roas: 9.98
                },
                {
                    id: '987654321',
                    name: 'Toldos Proyección - Display',
                    status: 'ENABLED',
                    impressions: 87500,
                    clicks: 1240,
                    cost: 532.00,
                    conversions: 42,
                    conversionValue: 5210.00,
                    ctr: 1.42,
                    avgCpc: 0.43,
                    roas: 9.79
                }
            ],
            totalSpend: 777.50,
            totalConversions: 70,
            totalConversionValue: 7660.00,
            averageRoas: 9.85,
            last30Days: true
        };
        
        console.log(`✅ Datos de Ads obtenidos: ${simulatedData.campaigns.length} campañas`);
        return simulatedData;
        
    } catch (error) {
        console.error('❌ Error en Google Ads:', error.message);
        return null;
    }
}

// ============================================
// 2. LECTURA DE DATOS DE GOOGLE ANALYTICS
// ============================================
async function getGoogleAnalyticsData() {
    console.log('📈 Leyendo datos de Google Analytics...');
    
    try {
        const client = await getAnalyticsClient();
        
        // Nota: Implementación real requiere runReport
        // const response = await client.properties.runReport({
        //     property: `properties/${CONFIG.googleAnalytics.propertyId}`,
        //     requestBody: { ... }
        // });
        
        // === SIMULACIÓN DE DATOS ===
        const simulatedData = {
            activeUsers: 3240,
            newUsers: 2850,
            sessions: 4150,
            bounceRate: 42.5,
            avgSessionDuration: 185,
            topPages: [
                { path: '/', views: 1850 },
                { path: '/#coleccion', views: 920 },
                { path: '/#automatizaciones', views: 480 }
            ],
            trafficSources: [
                { source: 'google', sessions: 2150, percentage: 51.8 },
                { source: 'direct', sessions: 980, percentage: 23.6 },
                { source: 'social', sessions: 620, percentage: 14.9 },
                { source: 'referral', sessions: 400, percentage: 9.7 }
            ],
            conversions: 70,
            conversionRate: 1.69
        };
        
        console.log(`✅ Datos de Analytics obtenidos: ${simulatedData.activeUsers} usuarios activos`);
        return simulatedData;
        
    } catch (error) {
        console.error('❌ Error en Analytics:', error.message);
        return null;
    }
}

// ============================================
// 3. ANÁLISIS Y RECOMENDACIONES AUTOMÁTICAS
// ============================================
async function analyzeAndRecommend(adsData, analyticsData) {
    console.log('🧠 Analizando datos y generando recomendaciones...');
    
    const recommendations = [];
    
    // Análisis de Google Ads
    if (adsData && adsData.campaigns) {
        for (const campaign of adsData.campaigns) {
            // Campañas con bajo CTR
            if (campaign.ctr < 2) {
                recommendations.push({
                    type: 'ADS_OPTIMIZATION',
                    campaignId: campaign.id,
                    campaignName: campaign.name,
                    action: 'PAUSE_CAMPAIGN',
                    reason: `CTR bajo (${campaign.ctr}%) - Por debajo del promedio de la industria (2-3%)`,
                    urgency: 'HIGH',
                    suggestion: `Pausar campaña "${campaign.name}" y revisar creatividades`,
                    estimatedImpact: `Ahorro de ~$${campaign.cost}/mes`
                });
            }
            
            // Campañas con alto ROAS (buenas para aumentar presupuesto)
            if (campaign.roas > 10) {
                recommendations.push({
                    type: 'ADS_OPTIMIZATION',
                    campaignId: campaign.id,
                    campaignName: campaign.name,
                    action: 'INCREASE_BUDGET',
                    reason: `ROAS excelente (${campaign.roas}x) - Inversión altamente rentable`,
                    urgency: 'MEDIUM',
                    suggestion: `Aumentar presupuesto de "${campaign.name}" en un 20%`,
                    estimatedImpact: `Potencial aumento de conversiones del 15-25%`,
                    suggestedChange: 20 // porcentaje
                });
            }
            
            // Campañas con bajo ROAS
            if (campaign.roas < 5 && campaign.cost > 100) {
                recommendations.push({
                    type: 'ADS_OPTIMIZATION',
                    campaignId: campaign.id,
                    campaignName: campaign.name,
                    action: 'OPTIMIZE_KEYWORDS',
                    reason: `ROAS bajo (${campaign.roas}x) - Palabras clave poco efectivas`,
                    urgency: 'HIGH',
                    suggestion: `Revisar y negativizar keywords no rentables en "${campaign.name}"`
                });
            }
        }
        
        // Análisis general
        if (adsData.averageRoas < 8) {
            recommendations.push({
                type: 'ADS_STRATEGY',
                action: 'REVIEW_STRATEGY',
                reason: `ROAS general bajo (${adsData.averageRoas}x) por debajo del objetivo (10x)`,
                urgency: 'CRITICAL',
                suggestion: 'Revisar segmentación y copias de todos los anuncios'
            });
        }
    }
    
    // Análisis de Analytics
    if (analyticsData) {
        // Bounce rate alto
        if (analyticsData.bounceRate > 60) {
            recommendations.push({
                type: 'SEO_OPTIMIZATION',
                action: 'IMPROVE_BOUNCE_RATE',
                reason: `Bounce rate alto (${analyticsData.bounceRate}%) - Usuarios abandonan rápido`,
                urgency: 'HIGH',
                suggestion: 'Optimizar tiempo de carga y relevancia del contenido'
            });
        }
        
        // Bajo tiempo de sesión
        if (analyticsData.avgSessionDuration < 120) {
            recommendations.push({
                type: 'CONTENT_OPTIMIZATION',
                action: 'IMPROVE_ENGAGEMENT',
                reason: `Sesiones cortas (${analyticsData.avgSessionDuration}s) - Bajo engagement`,
                urgency: 'MEDIUM',
                suggestion: 'Añadir más contenido relevante y calls-to-action claros'
            });
        }
        
        // Tráfico de Social bajo
        const socialTraffic = analyticsData.trafficSources.find(s => s.source === 'social');
        if (socialTraffic && socialTraffic.percentage < 10) {
            recommendations.push({
                type: 'SOCIAL_STRATEGY',
                action: 'INCREASE_SOCIAL',
                reason: `Tráfico social bajo (${socialTraffic.percentage}% del total)`,
                urgency: 'LOW',
                suggestion: 'Aumentar presencia en Instagram y Facebook con contenido orgánico'
            });
        }
    }
    
    console.log(`📋 Generadas ${recommendations.length} recomendaciones`);
    return recommendations;
}

// ============================================
// 4. SOLICITAR AUTORIZACIÓN HUMANA
// ============================================
async function requestHumanApproval(recommendations) {
    if (!recommendations || recommendations.length === 0) {
        console.log('✅ No hay recomendaciones que requieran aprobación');
        return [];
    }
    
    console.log('✉️ Solicitando aprobación humana para cambios...');
    
    const approvalRequest = {
        id: `approval_${Date.now()}`,
        timestamp: new Date().toISOString(),
        site: SITE_URL,
        agent: 'SEO_AGENT',
        recommendations: recommendations.map(rec => ({
            ...rec,
            requiresApproval: true,
            expiresIn: '48 hours'
        })),
        urgentCount: recommendations.filter(r => r.urgency === 'CRITICAL' || r.urgency === 'HIGH').length
    };
    
    // 1. Enviar a webhook (Slack, Teams, n8n, etc.)
    try {
        await axios.post(APPROVAL_WEBHOOK, approvalRequest, { timeout: 10000 });
        console.log('📨 Solicitud de aprobación enviada a webhook');
    } catch (error) {
        console.warn('⚠️ Webhook de aprobación no disponible:', error.message);
    }
    
    // 2. Guardar localmente para consulta
    const approvalsFile = path.join(__dirname, '../pending-approvals.json');
    let pendingApprovals = [];
    
    if (fs.existsSync(approvalsFile)) {
        pendingApprovals = JSON.parse(fs.readFileSync(approvalsFile, 'utf-8'));
    }
    
    pendingApprovals.push(approvalRequest);
    fs.writeFileSync(approvalsFile, JSON.stringify(pendingApprovals, null, 2));
    
    console.log(`💾 Solicitud guardada en ${approvalsFile}`);
    console.log(`📊 Resumen: ${recommendations.length} cambios requieren tu autorización`);
    
    // 3. Mostrar en consola las recomendaciones
    console.log('\n' + '='.repeat(60));
    console.log('🔔 RECOMENDACIONES PENDIENTES DE APROBACIÓN:');
    console.log('='.repeat(60));
    
    recommendations.forEach((rec, idx) => {
        console.log(`\n[${idx + 1}] ${rec.type} - URGENCIA: ${rec.urgency}`);
        console.log(`   Campaña: ${rec.campaignName || 'N/A'}`);
        console.log(`   Acción sugerida: ${rec.action}`);
        console.log(`   Razón: ${rec.reason}`);
        console.log(`   Sugerencia: ${rec.suggestion}`);
        if (rec.estimatedImpact) console.log(`   Impacto estimado: ${rec.estimatedImpact}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('⏳ Esperando aprobación en:', approvalsFile);
    console.log('Para aprobar/rechazar, edita el archivo o responde al webhook');
    console.log('='.repeat(60) + '\n');
    
    return approvalRequest;
}

// ============================================
// 5. EJECUTAR CAMBIOS APROBADOS
// ============================================
async function executeApprovedChanges() {
    const approvalsFile = path.join(__dirname, '../approved-changes.json');
    
    if (!fs.existsSync(approvalsFile)) {
        console.log('📭 No hay cambios aprobados pendientes');
        return [];
    }
    
    const approvedChanges = JSON.parse(fs.readFileSync(approvalsFile, 'utf-8'));
    const executed = [];
    
    for (const change of approvedChanges) {
        console.log(`⚙️ Ejecutando cambio aprobado: ${change.action} en ${change.campaignName}`);
        
        try {
            // Simular ejecución (aquí iría la API real)
            // await executeGoogleAdsChange(change);
            
            // Registro de ejecución
            executed.push({
                ...change,
                executedAt: new Date().toISOString(),
                status: 'SUCCESS'
            });
            
            console.log(`✅ Cambio ejecutado correctamente`);
            
            // Enviar notificación de ejecución
            await axios.post(N8N_WEBHOOK, {
                type: 'CHANGE_EXECUTED',
                change: change,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error(`❌ Error ejecutando cambio:`, error.message);
            executed.push({
                ...change,
                executedAt: new Date().toISOString(),
                status: 'FAILED',
                error: error.message
            });
        }
    }
    
    // Limpiar archivo después de ejecutar
    fs.writeFileSync(approvalsFile, JSON.stringify([]));
    
    return executed;
}

// ============================================
// 6. CHECK DE CAMBIOS APROBADOS (para ejecutar periódicamente)
// ============================================
async function checkForApprovals() {
    const pendingFile = path.join(__dirname, '../pending-approvals.json');
    const approvedFile = path.join(__dirname, '../approved-changes.json');
    
    if (!fs.existsSync(pendingFile)) return;
    
    const pending = JSON.parse(fs.readFileSync(pendingFile, 'utf-8'));
    const newApprovals = [];
    
    // Buscar si el usuario ha aprobado algo
    // El usuario edita manualmente el archivo y cambia 'status' a 'APPROVED'
    for (const request of pending) {
        const userResponse = await checkUserApproval(request.id);
        if (userResponse && userResponse.status === 'APPROVED') {
            newApprovals.push(...userResponse.approvedChanges);
        }
    }
    
    if (newApprovals.length > 0) {
        let existing = [];
        if (fs.existsSync(approvedFile)) {
            existing = JSON.parse(fs.readFileSync(approvedFile, 'utf-8'));
        }
        existing.push(...newApprovals);
        fs.writeFileSync(approvedFile, JSON.stringify(existing, null, 2));
        console.log(`✅ ${newApprovals.length} cambios aprobados listos para ejecutar`);
    }
}

// ============================================
// 7. FUNCIÓN PRINCIPAL (ORQUESTACIÓN)
// ============================================
async function runFullSEOAutomation() {
    console.log('\n🚀 INICIANDO SEO AGENT - MODO AUTOMATIZACIÓN TOTAL');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    
    try {
        // Paso 1: Obtener datos
        console.log('\n📡 [1/5] Obteniendo datos de Google Ads y Analytics...');
        const [adsData, analyticsData] = await Promise.all([
            getGoogleAdsData(),
            getGoogleAnalyticsData()
        ]);
        
        if (!adsData && !analyticsData) {
            throw new Error('No se pudieron obtener datos de Google');
        }
        
        // Paso 2: Analizar y generar recomendaciones
        console.log('\n🤖 [2/5] Analizando datos y generando recomendaciones...');
        const recommendations = await analyzeAndRecommend(adsData, analyticsData);
        
        // Paso 3: Solicitar aprobación humana
        console.log('\n✉️ [3/5] Solicitando aprobación para cambios...');
        const approvalRequest = await requestHumanApproval(recommendations);
        
        // Paso 4: Verificar si hay cambios aprobados pendientes
        console.log('\n🔍 [4/5] Verificando cambios aprobados pendientes...');
        await checkForApprovals();
        
        // Paso 5: Ejecutar cambios aprobados
        console.log('\n⚙️ [5/5] Ejecutando cambios aprobados...');
        const executed = await executeApprovedChanges();
        
        // Reporte final
        const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        const finalReport = {
            agent: 'SEO_AGENT',
            mode: 'FULL_AUTOMATION',
            status: 'COMPLETED',
            timestamp: new Date().toISOString(),
            executionTimeSeconds: executionTime,
            summary: {
                recommendationsGenerated: recommendations.length,
                pendingApprovals: approvalRequest.recommendations.length,
                changesExecuted: executed.length,
                changesFailed: executed.filter(e => e.status === 'FAILED').length
            },
            data: {
                googleAds: adsData,
                googleAnalytics: analyticsData,
                recommendations: recommendations,
                executedChanges: executed
            }
        };
        
        // Enviar reporte final
        await axios.post(N8N_WEBHOOK, finalReport, { timeout: 5000 });
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ PROGRAMA COMPLETADO');
        console.log(`   Tiempo total: ${executionTime} segundos`);
        console.log(`   Recomendaciones: ${recommendations.length}`);
        console.log(`   Pendientes aprobación: ${approvalRequest.recommendations.length}`);
        console.log(`   Cambios ejecutados: ${executed.length}`);
        console.log('='.repeat(60) + '\n');
        
        return finalReport;
        
    } catch (error) {
        console.error('\n❌ ERROR FATAL:', error.message);
        const errorReport = {
            agent: 'SEO_AGENT',
            status: 'ERROR',
            error: error.message,
            timestamp: new Date().toISOString()
        };
        
        await axios.post(N8N_WEBHOOK, errorReport).catch(() => {});
        return errorReport;
    }
}

// ============================================
// FUNCIÓN SIMULADA DE VERIFICACIÓN DE APROBACIÓN
// ============================================
async function checkUserApproval(requestId) {
    // Método 1: Archivo de respuestas
    const responsesFile = path.join(__dirname, '../user-responses.json');
    if (fs.existsSync(responsesFile)) {
        const responses = JSON.parse(fs.readFileSync(responsesFile, 'utf-8'));
        const response = responses.find(r => r.requestId === requestId);
        if (response) return response;
    }
    
    // Método 2: Variable de entorno o archivo simple
    const singleApproval = path.join(__dirname, '../approve-now.json');
    if (fs.existsSync(singleApproval)) {
        const approval = JSON.parse(fs.readFileSync(singleApproval, 'utf-8'));
        if (approval.requestId === requestId) {
            return { status: 'APPROVED', approvedChanges: approval.changes };
        }
    }
    
    return null;
}

// ============================================
// FUNCIÓN DE EJEMPLO PARA APROBACIÓN MANUAL RÁPIDA
// ============================================
function quickApproveAll() {
    const pendingFile = path.join(__dirname, '../pending-approvals.json');
    const approvedFile = path.join(__dirname, '../approved-changes.json');
    
    if (!fs.existsSync(pendingFile)) {
        console.log('No hay solicitudes pendientes');
        return;
    }
    
    const pending = JSON.parse(fs.readFileSync(pendingFile, 'utf-8'));
    const allChanges = [];
    
    for (const request of pending) {
        allChanges.push(...request.recommendations);
    }
    
    fs.writeFileSync(approvedFile, JSON.stringify(allChanges, null, 2));
    console.log(`✅ Aprobados ${allChanges.length} cambios automáticamente`);
}

// ============================================
// CLI: SOPORTE PARA COMANDOS
// ============================================
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'approve-all':
            quickApproveAll();
            break;
        case 'execute':
            runFullSEOAutomation();
            break;
        case 'check':
            checkForApprovals().then(() => executeApprovedChanges());
            break;
        default:
            console.log(`
🔧 SEO AGENT - COMANDOS DISPONIBLES:
  node seo_agent.js execute   - Ejecutar análisis completo y solicitar aprobaciones
  node seo_agent.js approve-all - Aprobar TODOS los cambios pendientes (usar con cuidado)
  node seo_agent.js check     - Verificar y ejecutar cambios ya aprobados
            `);
            break;
    }
}

module.exports = {
    runFullSEOAutomation,
    getGoogleAdsData,
    getGoogleAnalyticsData,
    analyzeAndRecommend,
    requestHumanApproval,
    executeApprovedChanges,
    quickApproveAll
};
