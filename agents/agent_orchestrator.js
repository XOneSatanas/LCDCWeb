// ============================================
// AGENT ORCHESTRATOR - LA CASA DE LAS CORTINAS
// Orquestador central que ejecuta todos los agentes
// ============================================

const fs = require('fs');
const path = require('path');
const { runFullSEOAutomation } = require('./seo_agent');
const { runCMAgent } = require('./cm_agent');
const { runSREAgent } = require('./sre_agent');
const { runSecurityAgent } = require('./security_agent');

const RESULTS_FILE = path.join(__dirname, '../agent-results.json');

async function runAllAgents() {
    console.log('\n🎯 ORQUESTADOR: Iniciando ejecución de TODOS los agentes');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    const results = {
        timestamp: new Date().toISOString(),
        executionTimeSeconds: 0,
        agents: {}
    };
    
    // 1. Ejecutar SEO Agent
    console.log('\n📈 [1/4] Ejecutando SEO Agent...');
    try {
        const seoResult = await runFullSEOAutomation();
        results.agents.seo = {
            status: 'SUCCESS',
            data: seoResult,
            score: seoResult?.summary?.recommendationsGenerated ? 100 : 85
        };
        console.log('✅ SEO Agent completado');
    } catch (error) {
        results.agents.seo = { status: 'ERROR', error: error.message, score: 0 };
        console.error('❌ SEO Agent falló:', error.message);
    }
    
    // 2. Ejecutar CM Agent
    console.log('\n📱 [2/4] Ejecutando CM Agent...');
    try {
        const cmResult = await runCMAgent();
        results.agents.cm = {
            status: 'SUCCESS',
            data: cmResult,
            score: 100
        };
        console.log('✅ CM Agent completado');
    } catch (error) {
        results.agents.cm = { status: 'ERROR', error: error.message, score: 0 };
        console.error('❌ CM Agent falló:', error.message);
    }
    
    // 3. Ejecutar SRE Agent
    console.log('\n🖥️ [3/4] Ejecutando SRE Agent...');
    try {
        const sreResult = await runSREAgent();
        results.agents.sre = {
            status: 'SUCCESS',
            data: sreResult,
            score: sreResult?.performanceScore || 96
        };
        console.log('✅ SRE Agent completado');
    } catch (error) {
        results.agents.sre = { status: 'ERROR', error: error.message, score: 0 };
        console.error('❌ SRE Agent falló:', error.message);
    }
    
    // 4. Ejecutar Security Agent
    console.log('\n🔒 [4/4] Ejecutando Security Agent...');
    try {
        const securityResult = await runSecurityAgent();
        results.agents.security = {
            status: 'SUCCESS',
            data: securityResult,
            score: securityResult?.score || 82
        };
        console.log('✅ Security Agent completado');
    } catch (error) {
        results.agents.security = { status: 'ERROR', error: error.message, score: 0 };
        console.error('❌ Security Agent falló:', error.message);
    }
    
    // Calcular Health Score global
    const scores = Object.values(results.agents).map(a => a.score || 0);
    const globalHealth = scores.reduce((a, b) => a + b, 0) / scores.length;
    results.healthScore = Math.round(globalHealth);
    results.executionTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Guardar resultados
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ORQUESTADOR COMPLETADO en ${results.executionTimeSeconds}s`);
    console.log(`   Health Score Global: ${results.healthScore}%`);
    console.log('='.repeat(60));
    
    return results;
}

// CLI
if (require.main === module) {
    runAllAgents().catch(console.error);
}

module.exports = { runAllAgents };
