const sreAgent = require('./sre_agent');
const seoAgent = require('./seo_agent');
const securityAgent = require('./security_agent');
const cmAgent = require('./cm_agent');
const gscAgent = require('./gsc_agent');

async function orchestrateAgents() {
    console.log('🏁 [ORCHESTRATOR] Starting global maintenance sequence...\n');
    
    try {
        await sreAgent();
        await seoAgent();
        await securityAgent();
        await cmAgent();
        await gscAgent();
        
        console.log('\n✨ [ORCHESTRATOR] All agents have completed their tasks.');
    } catch (error) {
        if (error?.code === 'insufficient_quota') {
            console.warn('⚠️ [ORCHESTRATOR] Saldo insuficiente en API, usando modo offline');
            return "Lo siento, el asistente está temporalmente en mantenimiento. Escríbenos por WhatsApp.";
        }
        console.error('💥 [ORCHESTRATOR] Critical failure in orchestration:', error.message);
    }
}

if (require.main === module) {
    orchestrateAgents();
}

module.exports = orchestrateAgents;
