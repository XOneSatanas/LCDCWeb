$files = Get-ChildItem -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 1. Terminología: Arquitectura -> Soluciones Textiles / etc.
    $content = $content -replace '(?i)Ecosistema de Arquitectura Textil', 'Ecosistema de Control Solar'
    $content = $content -replace '(?i)Arquitectura de la Luz', 'Dominio de la Luz'
    $content = $content -replace '(?i)Arquitectura flexible', 'Soluciones flexibles'
    $content = $content -replace '(?i)Sistemas de arquitectura textil', 'Sistemas textiles de control solar'
    $content = $content -replace '(?i)Ingeniería Lumínica', 'Tecnología Lumínica'
    $content = $content -replace '(?i)ideales para arquitectura', 'ideales para decoración e interiorismo'
    $content = $content -replace '(?i)Arquitectura Textil', 'Control Solar Premium'
    $content = $content -replace '(?i)asistente de arquitectura textil', 'asistente técnico'
    $content = $content -replace '(?i)ARQUITECTURA \s*<br>\s* DE LA LUZ', 'TECNOLOGÍA <br> DE LA LUZ'
    $content = $content -replace '(?i)estudios de arquitectura y', 'estudios de diseño y'
    $content = $content -replace '(?i)arquitectos e interioristas', 'interioristas y decoradores'
    $content = $content -replace '(?i)Ingeniería aplicada', 'tecnología aplicada'
    $content = $content -replace '(?i)Arquitectura \s*<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">de Negocios', 'Programa <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">de Negocios'
    $content = $content -replace '(?i)Arquitectura Blueprint', 'Diseño Blueprint'
    $content = $content -replace '(?i)estilo arquitectónico', 'estilo proyectual'
    $content = $content -replace '(?i)Ingeniería</h4>', 'Especificación</h4>'
    
    if ($file.Name -eq 'alianzas.html') {
        # Replace image src
        $content = $content -replace 'alianzas_architecture_blueprint.png', 'alianzas_designer_samples.png'
        
        # Replace Comisiones Text blocks instead of displaying % or A MEDIDA.
        # En vez de 10%, 15%, 20%, el usuario quiere más descripción y sin porcentajes.
        $content = $content -replace '<div class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200 mb-6">10%</div>', '<div class="text-[0.65rem] uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200 mb-6 font-bold">Comisiones preferenciales para obras iniciales.</div>'
        $content = $content -replace '<div class="text-5xl font-black text-\[#00e5ff\] mb-6">15%</div>', '<div class="text-[0.65rem] uppercase tracking-widest text-[#00e5ff] mb-6 font-bold">Mayor rentabilidad, envíos rápidos y soporte en cotización.</div>'
        $content = $content -replace '<div class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-\[#ab47bc\] to-purple-400 mb-6">20%</div>', '<div class="text-[0.65rem] uppercase tracking-widest text-[#ab47bc] mb-6 font-bold">Beneficio máximo para proyectos a gran escala y llave en mano.</div>'
        
        # In case my previous A MEDIDA replacement survived:
        $content = $content -replace '<div class="text-\[1\.5rem\] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200 mb-6">A MEDIDA</div>', '<div class="text-[0.65rem] uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200 mb-6 font-bold">Comisiones preferenciales para obras iniciales.</div>'
        $content = $content -replace '<div class="text-\[1\.5rem\] font-black text-\[#00e5ff\] mb-6">A MEDIDA</div>', '<div class="text-[0.65rem] uppercase tracking-widest text-[#00e5ff] mb-6 font-bold">Mayor rentabilidad, envíos rápidos y soporte en cotización.</div>'
        $content = $content -replace '<div class="text-\[1\.5rem\] font-black text-transparent bg-clip-text bg-gradient-to-r from-\[#ab47bc\] to-purple-400 mb-6">A MEDIDA</div>', '<div class="text-[0.65rem] uppercase tracking-widest text-[#ab47bc] mb-6 font-bold">Beneficio máximo para proyectos a gran escala y llave en mano.</div>'
    }

    $content | Set-Content $file.FullName -Encoding UTF8
}
Write-Host "Legal fixes applied successfully."
