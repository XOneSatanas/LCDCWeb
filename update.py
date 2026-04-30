import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

footer_html = """
    <!-- FOOTER GLOBALY INJECTED -->
    <footer class="py-24 px-10 border-t border-white/5 bg-[#010101]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="col-span-2">
                <div class="flex items-center gap-4 mb-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <path d="M20 5 L5 20 L8 20 L8 35 L32 35 L32 20 L35 20 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
                        <path d="M17 35 L17 27 L23 27 L23 35" fill="none" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                    <div class="flex flex-col leading-[0.8]">
                        <span class="text-[8px] font-bold tracking-[0.4em] uppercase mb-1">La Casa de las</span>
                        <span class="text-2xl font-black tracking-tighter uppercase">CORTINAS</span>
                    </div>
                </div>
                <p class="text-white/20 text-xs uppercase tracking-widest leading-loose max-w-sm">
                    Sistemas de arquitectura textil de alta prestación. Especialistas en el control de la luz natural mediante ingeniería aplicada.
                </p>
                <div class="flex space-x-4 mt-8">
                    <a href="https://www.instagram.com/lacasadelascortinasok/" target="_blank" class="text-white/40 hover:text-[#00e5ff] text-2xl transition-colors"><i class='bx bxl-instagram'></i></a>
                </div>
            </div>
            <div>
                <h5 class="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Navegación</h5>
                <ul class="space-y-4 text-[10px] uppercase tracking-widest">
                    <li><a href="index.html" class="hover:text-[#00e5ff]">Inicio</a></li>
                    <li><a href="index.html#coleccion" class="hover:text-[#00e5ff]">Colecciones</a></li>
                    <li><a href="alianzas.html" class="hover:text-[#00e5ff]">Portal Partners</a></li>
                    <li><a href="profesionales.html" class="hover:text-[#00e5ff]">Profesionales</a></li>
                </ul>
            </div>
            <div>
                <h5 class="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Contacto & Legales</h5>
                <ul class="space-y-4 text-[10px] uppercase tracking-widest">
                    <li><a href="javascript:void(0)" onclick="openWhatsApp()" class="hover:text-[#25D366] text-[#25D366]"><i class='bx bxl-whatsapp'></i> WhatsApp</a></li>
                    <li><a href="mailto:lacasadelascortinasok@gmail.com" class="hover:text-[#ab47bc]">Email Comercial</a></li>
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
"""

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # --- 1. Ensure Config.js is linked ---
    if 'assets/js/config.js' not in content:
        content = content.replace('</head>', '    <script src="assets/js/config.js"></script>\n</head>')

    # --- 2. Fix WhatsApp ---
    # Replace FAB Chat
    content = re.sub(r'<!-- FAB:.*? -->\s*<a href="https://wa.me/.*?".*?</a>', '<!-- FAB: WHATSAPP TRIGGER -->\n    <a href="javascript:void(0)" onclick="openWhatsApp()" class="fab-chat hover:-translate-y-2 transition-transform" style="text-decoration: none; display: flex; align-items: center; justify-content: center; background: #25D366; color: white; border: none; box-shadow: 0 0 20px rgba(37,211,102,0.4);"><i class=\'bx bxl-whatsapp\'></i></a>', content, flags=re.DOTALL)
    
    # Update Navbar button
    content = re.sub(r'class="btn-contact.*?WhatsApp</a>', 'class="btn-contact border border-[#00e5ff] text-[#00e5ff] px-8 py-2 uppercase text-[10px] tracking-widest hover:bg-[#00e5ff] hover:text-black transition-all inline-block" onclick="openWhatsApp()">WhatsApp</a>', content)
    
    # --- 3. Fix Footer ---
    if '<footer' in content:
        content = re.sub(r'<footer.*?</footer>', footer_html.strip(), content, count=1, flags=re.DOTALL)
    else:
        content = content.replace('</body>', f"{footer_html}\n</body>")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print(f"Mantenimiento completado en {len(html_files)} archivos.")
