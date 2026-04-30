$files = Get-ChildItem -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Update email link
    $content = $content -replace 'mailto:hola@lacasadelascortinas\.com', 'mailto:lacasadelascortinasok@gmail.com'
    
    # Update IG link (it was a bare # link in the footer usually)
    # The ig link usually looks like: <a href="#" class="..."><i class='bx bxl-instagram'></i></a>
    $content = $content -replace '<a href="#"([^>]*?)><i class=''bx bxl-instagram''></i></a>', '<a href="https://www.instagram.com/lacasadelascortinasok/" target="_blank"$1><i class=''bx bxl-instagram''></i></a>'

    # Using Logo Image instead of Text
    # Footer Title: <h2 class="text-2xl font-bold tracking-tighter uppercase mb-6">LUZ<span class="text-[#00e5ff]">.</span></h2>
    $content = $content -replace '(?i)<h2 class="text-2xl font-bold tracking-tighter uppercase mb-6">\s*LUZ.*?</h2\s*>', '<img src="assets/images/logo-main.jpg" alt="La Casa de las Cortinas" class="h-auto w-32 object-contain mb-6 invert">'
    # Wait, the newly uploaded jpgs have black backgrounds. "invert" on tailwind makes a black bg white and white text black. Is that what we want? The site is dark mode, so we want black bg to merge or use mix-blend-screen. Or we invert if it's black text on a white logo? Let's check the images:
    # Actually the user uploaded a black background with white text logo. So standard rendering is fine since the site is dark.
    # So I'll remove `invert`.
    $content = $content -replace '<img src="assets/images/logo-main.jpg" alt="La Casa de las Cortinas" class="h-auto w-32 object-contain mb-6 invert">', '<img src="assets/images/logo-main.jpg" alt="La Casa de las Cortinas" class="h-auto w-32 object-contain mb-6 rounded-md">'
    
    # Navigation logo in index.html and headers:
    # <a href="index.html" class="text-2xl font-black tracking-tighter uppercase">LUZ<span class="text-[#00e5ff]">.</span></a>
    $content = $content -replace '<a href="index\.html" class="text-2xl font-black tracking-tighter uppercase">\s*LUZ.*?</a\s*>', '<a href="index.html" class="text-2xl font-black tracking-tighter uppercase flex items-center"><img src="assets/images/logo-main.jpg" alt="Logo" class="h-8"></a>'

    # Title Tags
    $content = $content -replace '(?i)LUZ Architecture', 'La Casa de las Cortinas'
    
    # Any other mention of 'LUZ' in text, except when discussing natural light (luz natural).
    $content = $content -replace 'Bienvenido a LUZ', 'Bienvenido a La Casa de las Cortinas'
    
    $content | Set-Content $file.FullName -Encoding UTF8
}
Write-Host "Branding updated successfully."
