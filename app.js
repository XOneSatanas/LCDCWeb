document.addEventListener('DOMContentLoaded', () => {

    // 1. Asistente Virtual de Lujo
    const botTrigger = document.getElementById('bot-trigger');
    const botWindow = document.getElementById('bot-window');
    const botCalc = document.getElementById('bot-calc');
    const botResult = document.getElementById('bot-result');
    const botText = document.getElementById('bot-text');

    const toggleBot = (product = null) => {
        botWindow.classList.toggle('active');
        if (botWindow.classList.contains('active')) {
            if (product) {
                botText.innerText = `Ha seleccionado la colección ${product.toUpperCase()}. ¿Cuáles son las dimensiones para proyectar su inversión?`;
            } else {
                botText.innerText = 'Es un privilegio asistirle. ¿Cuáles son las dimensiones de su ventanal?';
            }
        }
    };

    botTrigger.addEventListener('click', () => toggleBot());

    // Exponer función para clics en productos
    // Product Metadata
    const productData = {
        'Roller': {
            title: 'Colección Roller',
            description: 'La síntesis perfecta de minimalismo y tecnología. Nuestras cortinas Roller ofrecen una gestión precisa de la luz mediante tejidos técnicos de alta fidelidad (Blackout y Screen). Disponibles con accionamiento manual o motorización silenciosa integrable a sistemas de hogar inteligente.'
        },
        'Bandas': {
            title: 'Bandas Verticales',
            description: 'Arquitectura textil para grandes superficies vidriadas. Sus láminas orientables permiten un control dinámico de la privacidad y el flujo lumínico, creando efectos de relieve y profundidad en el espacio contemporáneo.'
        },
        'Venecianas': {
            title: 'Colección Veneciana',
            description: 'La calidez de los materiales nobles unida a la precisión técnica. Disponibles en madera seleccionada o aluminio de alto impacto. Una pieza clásica que se integra perfectamente en ambientes de diseño purista.'
        },
        'Confeccionadas': {
            title: 'Sastrería de Autor',
            description: 'Confección artesanal de cortinas tradicionales sobre rieles o barrales. Tejidos de alta densidad y caídas fluidas que aportan una materialidad orgánica y suave a la arquitectura interior.'
        },
        'Toldos': {
            title: 'Protección Exterior PRO',
            description: 'Sistemas de protección solar exterior diseñados para resistir el clima sin sacrificar la estética. Brazos invisibles, tejidos screen de alta resistencia y automatización para el confort al aire libre.'
        }
    };

    // Modal Logic
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    function openProductModal(id) {
        const data = productData[id];
        if (!data) return;

        modalBody.innerHTML = `
        <h2 class="modal-title">${data.title}</h2>
        <p class="modal-desc">${data.description}</p>
        <button class="btn-luxe" style="margin-top: 40px;" onclick="window.closeProductModal()">Cerrar Detalles</button>
    `;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }

    window.closeProductModal = closeProductModal;

    // Event Listeners for Products
    document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', () => {
            const productId = item.getAttribute('data-product');
            openProductModal(productId);
        });
    });

    modalClose.addEventListener('click', closeProductModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProductModal();
    });

    // Asistente LUZ logic (remains for standalone triggers)
    window.openContextBot = function (context) {
        const window = document.getElementById('bot-window');
        const text = document.getElementById('bot-text');

        if (context) {
            text.innerText = `Es un privilegio asistirle con su proyecto de ${context}. ¿Cuáles son las dimensiones?`;
        }

        window.classList.add('active');
    };

    botCalc.addEventListener('click', () => {
        const w = parseFloat(document.getElementById('bot-ancho').value);
        const h = parseFloat(document.getElementById('bot-alto').value) + 0.10;

        if (isNaN(w) || isNaN(h)) {
            botResult.innerText = "DIMENSIONES REQUERIDAS";
            return;
        }

        let s = w * h;
        if (s < 1.5) s = 1.5;
        const total = s * 65; // Simulación de precio elite
        botResult.innerText = `INVERSIÓN: $${total.toLocaleString()}`;
    });

    // 2. Scroll Reveal: "Zero Noise" Animation
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 50);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));

    // 3. Navbar Scrolled Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
});
