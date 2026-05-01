// ============================================
// AGENT ORCHESTRATOR - LA CASA DE LAS CORTINAS
// Versión compatible con Netlify (sin escritura local)
// ============================================

const { runFullSEOAutomation } = require('./seo_agent');
const { runCMAgent } = require('./cm_agent');
const { runSREAgent } = require('./sre_agent');
const { runSecurityAgent } = require('./security_agent');

async function runAllAgents({ returnResults = true } = {}) {
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
            status: seoResult?.status === 'ERROR' ? 'WARNING' : 'SUCCESS',
            data: seoResult?.summary || seoResult,
            score: seoResult?.summary?.recommendationsGenerated ? 
                   100 - (seoResult.summary.recommendationsGenerated * 5) : 
                   (seoResult?.healthScore || 85)
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
            status: sreResult?.status || 'SUCCESS',
            data: sreResult,
            score: sreResult?.performanceScore || (sreResult?.score || 85)
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
            status: securityResult?.status || (securityResult?.issues?.length > 0 ? 'WARNING' : 'SUCCESS'),
            data: securityResult,
            score: securityResult?.score || 85,
            issuesCount: securityResult?.issuesCount || 0
        };
        console.log('✅ Security Agent completado');
    } catch (error) {
        results.agents.security = { status: 'ERROR', error: error.message, score: 0 };
        console.error('❌ Security Agent falló:', error.message);
    }
    
    // Calcular Health Score global (solo agentes con éxito o advertencia)
    const validScores = Object.values(results.agents)
        .filter(a => a.status !== 'ERROR' && typeof a.score === 'number')
        .map(a => a.score);
    
    const globalHealth = validScores.length > 0 
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
        : 0;
        
    results.healthScore = Math.round(globalHealth);
    results.executionTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Contar agentes con warning/error
    const warningAgents = Object.values(results.agents).filter(a => a.status === 'WARNING').length;
    const errorAgents = Object.values(results.agents).filter(a => a.status === 'ERROR').length;
    results.summary = {
        totalAgents: 4,
        successCount: 4 - warningAgents - errorAgents,
        warningCount: warningAgents,
        errorCount: errorAgents
    };
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ORQUESTADOR COMPLETADO en ${results.executionTimeSeconds}s`);
    console.log(`   Health Score Global: ${results.healthScore}%`);
    console.log(`   Success: ${results.summary.successCount}, Warnings: ${warningAgents}, Errors: ${errorAgents}`);
    console.log('='.repeat(60));
    
    return results;
}

// CLI - solo para pruebas locales
if (require.main === module) {
    runAllAgents().then(results => {
        console.log('\n📊 RESULTADOS COMPLETOS:');
        console.log(JSON.stringify(results, null, 2));
    }).catch(console.error);
}

module.exports = { runAllAgents };
