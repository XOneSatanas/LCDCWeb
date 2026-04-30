$footerHtml = @"
    <!-- FOOTER GLOBALY INJECTED -->
    <footer class="py-24 px-10 border-t border-white/5 bg-[#010101]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="col-span-2">
                <h2 class="text-2xl font-bold tracking-tighter uppercase mb-6">LUZ<span class="text-[#00e5ff]">.</span></h2>
                <p class="text-white/20 text-xs uppercase tracking-widest leading-loose max-w-sm">
                    Sistemas de arquitectura textil de alta prestación. Especialistas en el control de la luz natural mediante ingeniería aplicada.
                </p>
                <div class="flex space-x-4 mt-8">
                    <a href="#" class="text-white/40 hover:text-[#00e5ff] text-2xl transition-colors"><i class='bx bxl-instagram'></i></a>
                    <a href="#" class="text-white/40 hover:text-[#ab47bc] text-2xl transition-colors"><i class='bx bxl-linkedin'></i></a>
                    <a href="#" class="text-white/40 hover:text-[#00e5ff] text-2xl transition-colors"><i class='bx bxl-youtube'></i></a>
                </div>
            </div>
            <div>
                <h5 class="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Navegación</h5>
                <ul class="space-y-4 text-[10px] uppercase tracking-widest">
                    <li><a href="index.html" class="hover:text-[#00e5ff]">Inicio</a></li>
                    <li><a href="index.html#coleccion" class="hover:text-[#00e5ff]">Colecciones</a></li>
                    <li><a href="smart-living.html" class="hover:text-[#ab47bc]">Smart X-1</a></li>
                    <li><a href="alianzas.html" class="hover:text-[#00e5ff]">Portal Partners</a></li>
                    <li><a href="profesionales.html" class="hover:text-[#00e5ff]">Profesionales</a></li>
                </ul>
            </div>
            <div>
                <h5 class="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Contacto & Legales</h5>
                <ul class="space-y-4 text-[10px] uppercase tracking-widest">
                    <li><a href="https://wa.me/5493412687230" target="_blank" class="hover:text-[#25D366] text-[#25D366]"><i class='bx bxl-whatsapp'></i> +54 9 341-2687230</a></li>
                    <li><a href="mailto:hola@lacasadelascortinas.com" class="hover:text-[#ab47bc]">Email Comercial</a></li>
                    <li class="pt-4"><a href="#" class="text-white/20 hover:text-white">Términos y Condiciones</a></li>
                    <li><a href="#" class="text-white/20 hover:text-white">Políticas de Privacidad</a></li>
                </ul>
            </div>
        </div>
        <div class="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[8px] uppercase tracking-[0.5em] text-white/10 gap-4">
            <p>© 2026 LA CASA DE LAS CORTINAS. TODOS LOS DERECHOS RESERVADOS.</p>
            <p>DESIGNED BY ARCHI / POWERED BY X-1</p>
        </div>
    </footer>
"@

$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # WhatsApp Replacements
    $content = $content -replace '(?s)<!-- CHAT CONCIERGE:.*?</div>\s*</div>\s*</div>', ''
    $content = $content -replace '(?s)<!-- FAB: CHAT TRIGGER -->.*?</button>', "<!-- FAB: WHATSAPP TRIGGER -->`n    <a href=`"https://wa.me/5493412687230`" target=`"_blank`" class=`"fab-chat hover:-translate-y-2 transition-transform`" style=`"text-decoration: none; display: flex; align-items: center; justify-content: center; background: #25D366; color: white; border: none; box-shadow: 0 0 20px rgba(37,211,102,0.4);`"><i class='bx bxl-whatsapp'></i></a>"
    $content = $content -replace '<button[^>]*onclick="toggleChat\(\)"[^>]*>Asistencia IA</button>', '<a href="https://wa.me/5493412687230" target="_blank" class="btn-contact border border-[#00e5ff] text-[#00e5ff] px-8 py-2 uppercase text-[10px] tracking-widest hover:bg-[#00e5ff] hover:text-black transition-all inline-block">WhatsApp</a>'
    $content = $content -replace '(?s)function iniciarAsesoria\(type\)\s*\{.*?\}', "function iniciarAsesoria(type) {`n            let mensaje = 'Hola, me gustaría explorar su catálogo.';`n            window.open('https://wa.me/5493412687230?text=' + encodeURIComponent(mensaje), '_blank');`n        }"
    $content = $content -replace '<script src="chat\.js"></script>', ''
    
    # Footer injection
    if ($content -match '<footer') {
        $content = $content -replace '(?s)<!-- FOOTER:.*?-->\s*', ''
        $content = $content -replace '(?s)<footer.*?</footer>', $footerHtml
    } else {
        $content = $content -replace '</body>', "`n$footerHtml`n</body>"
    }

    $content | Set-Content $file.FullName -Encoding UTF8
}

Write-Host "Updated $($files.Count) files."
