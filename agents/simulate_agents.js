const sreAgent = require('./sre_agent');
const seoAgent = require('./seo_agent');
const securityAgent = require('./security_agent');

async function orchestrateAgents() {
    console.log('🏁 [ORCHESTRATOR] Starting global maintenance sequence...\n');
    
    try {
        await sreAgent();
        await seoAgent();
        await securityAgent();
        
        console.log('\n✨ [ORCHESTRATOR] All agents have completed their tasks.');
    } catch (error) {
        console.error('💥 [ORCHESTRATOR] Critical failure in orchestration:', error.message);
    }
}

if (require.main === module) {
    orchestrateAgents();
}

module.exports = orchestrateAgents;
