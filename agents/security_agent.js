// ============================================
// SECURITY AGENT - LA CASA DE LAS CORTINAS
// Auditoría de seguridad: SSL, headers, vulnerabilidades
// ============================================

const axios = require('axios');
const https = require('https');

const SITE_URL = 'https://lacasadelascortinas.com.ar';

async function runSecurityAgent() {
    console.log('🔒 [SECURITY AGENT] Iniciando auditoría de seguridad...');
    
    const issues = [];
    let score = 100;
    
    try {
        // 1. Verificar SSL/TLS
        const sslCheck = await checkSSL(SITE_URL);
        if (!sslCheck.valid) {
            issues.push({ severity: 'HIGH', issue: 'SSL/TLS inválido o expirado' });
            score -= 30;
        }
        
        // 2. Verificar headers de seguridad
        const response = await axios.get(SITE_URL, { timeout: 10000 });
        const headers = response.headers;
        
        const securityHeaders = {
            'X-Frame-Options': 'previene clickjacking',
            'X-Content-Type-Options': 'previene MIME sniffing',
            'Referrer-Policy': 'controla información de referer',
            'Content-Security-Policy': 'previene XSS'
        };
        
        for (const [header, description] of Object.entries(securityHeaders)) {
            if (!headers[header.toLowerCase()]) {
                issues.push({ severity: 'MEDIUM', issue: `Falta header: ${header} - ${description}` });
                score -= 10;
            }
        }
        
        // 3. Verificar si el sitio es HTTP (inseguro)
        if (SITE_URL.startsWith('http://')) {
            issues.push({ severity: 'CRITICAL', issue: 'Sitio en HTTP, migrar a HTTPS' });
            score -= 50;
        }
        
        // Asegurar que score no sea negativo
        score = Math.max(0, score);
        
        const result = {
            status: issues.length === 0 ? 'SUCCESS' : 'WARNING',
            score: score,
            issues: issues,
            issuesCount: issues.length,
            securityHeadersPresent: Object.keys(securityHeaders).filter(h => headers[h.toLowerCase()]).length,
            timestamp: new Date().toISOString()
        };
        
        console.log(`✅ [SECURITY AGENT] Score: ${score}/100 (${issues.length} issues encontrados)`);
        return result;
        
    } catch (error) {
        console.error('❌ [SECURITY AGENT] Error:', error.message);
        return {
            status: 'ERROR',
            error: error.message,
            score: 0,
            issues: [{ severity: 'CRITICAL', issue: error.message }]
        };
    }
}

async function checkSSL(url) {
    // Simplificado: para producción usar `ssl-checker` u otra librería
    return { valid: url.startsWith('https://'), expiresIn: '365 days' };
}

if (require.main === module) {
    runSecurityAgent().then(console.log).catch(console.error);
}

module.exports = { runSecurityAgent };
