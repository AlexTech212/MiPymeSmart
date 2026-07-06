const themes = {
      "smart-green": {
        brand: "#19f3b6",
        brand2: "#37d6ff",
        brand3: "#8b5cf6",
        bg: `
          radial-gradient(circle at 8% -6%, rgba(25, 243, 182, .28), transparent 32%),
          radial-gradient(circle at 92% 0%, rgba(55, 214, 255, .18), transparent 30%),
          radial-gradient(circle at 52% 46%, rgba(12, 125, 95, .22), transparent 38%),
          linear-gradient(180deg, #04110d 0%, #071b18 46%, #05070b 100%)
        `
      },
      "soft-green": {
        brand: "#67e8a5",
        brand2: "#37d6ff",
        brand3: "#19b68a",
        bg: `
          radial-gradient(circle at 6% -4%, rgba(103, 232, 165, .32), transparent 32%),
          radial-gradient(circle at 88% 6%, rgba(55, 214, 255, .20), transparent 30%),
          radial-gradient(circle at 52% 48%, rgba(185, 251, 192, .10), transparent 38%),
          linear-gradient(180deg, #10221c 0%, #0c1c1f 48%, #06100d 100%)
        `
      },
      "tech-blue": {
        brand: "#37d6ff",
        brand2: "#19f3b6",
        brand3: "#8b5cf6",
        bg: `
          radial-gradient(circle at 6% -4%, rgba(55, 214, 255, .24), transparent 32%),
          radial-gradient(circle at 92% 2%, rgba(139, 92, 246, .22), transparent 31%),
          radial-gradient(circle at 50% 42%, rgba(25, 243, 182, .08), transparent 34%),
          linear-gradient(180deg, #060a10 0%, #0b1320 46%, #05070b 100%)
        `
      },
      "premium-dark": {
        brand: "#8b5cf6",
        brand2: "#19f3b6",
        brand3: "#37d6ff",
        bg: `
          radial-gradient(circle at 8% -5%, rgba(139, 92, 246, .26), transparent 32%),
          radial-gradient(circle at 90% 4%, rgba(25, 243, 182, .16), transparent 30%),
          radial-gradient(circle at 52% 46%, rgba(55, 214, 255, .08), transparent 38%),
          linear-gradient(180deg, #070812 0%, #111225 46%, #05070b 100%)
        `
      }
    };

    const ambientLayerA = document.getElementById("ambientLayerA");
    const ambientLayerB = document.getElementById("ambientLayerB");
    const themeButtons = Array.from(document.querySelectorAll(".theme-dot"));
    let activeLayer = ambientLayerA;
    let inactiveLayer = ambientLayerB;
    let currentThemeIndex = 0;
    let userChangedTheme = false;
    const themeOrder = ["smart-green", "soft-green", "tech-blue", "premium-dark"];

    function applyTheme(themeName, manual = false) {
      const theme = themes[themeName] || themes["smart-green"];
      const root = document.documentElement;

      root.style.setProperty("--brand", theme.brand);
      root.style.setProperty("--brand-2", theme.brand2);
      root.style.setProperty("--brand-3", theme.brand3);

      inactiveLayer.style.background = theme.bg;
      inactiveLayer.classList.add("active");
      activeLayer.classList.remove("active");

      const temp = activeLayer;
      activeLayer = inactiveLayer;
      inactiveLayer = temp;

      themeButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === themeName);
      });

      currentThemeIndex = themeOrder.indexOf(themeName);
      if (manual) userChangedTheme = true;
    }

    themeButtons.forEach(btn => {
      btn.addEventListener("click", () => applyTheme(btn.dataset.theme, true));
    });

    // 45 segundos es un punto equilibrado: la página se siente viva sin distraer.
    setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      currentThemeIndex = (currentThemeIndex + 1) % themeOrder.length;
      applyTheme(themeOrder[currentThemeIndex], false);
    }, 45000);


    const menu = document.getElementById("menu");
    const hamburger = document.getElementById("hamburger");
    const scrollProgress = document.getElementById("scrollProgress");
    const toTop = document.getElementById("toTop");

    hamburger.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.textContent = isOpen ? "×" : "☰";
    });

    document.querySelectorAll(".menu a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        document.body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.textContent = "☰";
      });
    });

    

    // Navegación precisa: corrige el desfase causado por el header fijo.
    // Ajusta automáticamente el alto del header y deja un pequeño margen visual.
    const siteHeader = document.querySelector(".site-header");

    function updateScrollOffset() {
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 76;
      const visualGap = window.innerWidth <= 660 ? 14 : 22;
      document.documentElement.style.setProperty("--scroll-offset", `${headerHeight + visualGap}px`);
    }

    function scrollToSection(hash) {
      const target = document.querySelector(hash);
      if (!target) return;

      updateScrollOffset();

      const headerHeight = siteHeader ? siteHeader.offsetHeight : 76;
      const visualGap = window.innerWidth <= 660 ? 14 : 22;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - visualGap;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: "smooth"
      });

      history.pushState(null, "", hash);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", (event) => {
        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();

        menu.classList.remove("open");
        document.body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.textContent = "☰";

        scrollToSection(hash);
      });
    });

    window.addEventListener("resize", updateScrollOffset);
    window.addEventListener("load", () => {
      updateScrollOffset();
      if (window.location.hash) {
        setTimeout(() => scrollToSection(window.location.hash), 120);
      }
    });

    updateScrollOffset();

function updateScrollUI() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      scrollProgress.style.width = progress + "%";
      toTop.classList.toggle("show", scrollTop > 700);
    }

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.querySelectorAll(".progress span").forEach(span => {
            span.style.width = span.dataset.width || "80%";
          });
        }
      });
    }, { threshold: 0.14 });

    document.querySelectorAll(".reveal, .hero-panel").forEach(el => observer.observe(el));

    setTimeout(() => {
      document.querySelectorAll(".progress span").forEach(span => {
        span.style.width = span.dataset.width || "80%";
      });
    }, 400);

    function animateCounter(element, target, duration) {
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        element.textContent = "+" + value;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    animateCounter(document.getElementById("counterLeads"), 120, 1300);

    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".menu a"));

    function setActiveNav() {
      const position = window.scrollY + 130;
      let current = sections[0]?.id;

      sections.forEach(section => {
        if (section.offsetTop <= position) current = section.id;
      });

      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
      });
    }

    window.addEventListener("scroll", setActiveNav, { passive: true });
    setActiveNav();

    document.querySelectorAll(".faq-question").forEach(button => {
      button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        const icon = button.querySelector(".faq-icon");
        item.classList.toggle("open");
        icon.textContent = item.classList.contains("open") ? "−" : "+";
      });
    });

    const servicioSelect = document.getElementById("servicio");
    const diagnosticScore = document.getElementById("diagnosticScore");
    const diagnosticText = document.getElementById("diagnosticText");

    const diagnosticCopy = {
      "Diseño web": ["Web", "Recomendado partir por una página profesional, WhatsApp, textos comerciales y posicionamiento local."],
      "Web + IA": ["Web + IA", "Ideal para captar consultas, responder preguntas frecuentes y ordenar prospectos desde el primer contacto."],
      "Electricidad": ["Técnico", "Conviene revisar seguridad, tablero, protecciones, puntos eléctricos, iluminación y capacidad para crecer."],
      "Climatización": ["Confort", "Recomendado evaluar espacio, carga térmica, uso del local, mantenimiento y control eficiente."],
      "Domótica / automatización": ["Smart", "Se puede evaluar iluminación, climatización, sensores, horarios, monitoreo y automatizaciones simples."],
      "Proyecto fotovoltaico": ["Energía", "Primero conviene ordenar consumo, facturación, espacio disponible y objetivos de ahorro."],
      "Diagnóstico integral": ["360°", "Para negocios que quieren crecer, lo ideal es revisar presencia digital, operación técnica y oportunidades de automatización."]
    };

    servicioSelect.addEventListener("change", () => {
      const value = servicioSelect.value;
      const copy = diagnosticCopy[value] || diagnosticCopy["Diagnóstico integral"];
      diagnosticScore.textContent = copy[0];
      diagnosticText.textContent = copy[1];
    });

    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = {
        nombre: document.getElementById("nombre").value.trim(),
        negocio: document.getElementById("negocio").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        servicio: document.getElementById("servicio").value,
        urgencia: document.getElementById("urgencia").value,
        tamano: document.getElementById("tamano").value,
        mensaje: document.getElementById("mensaje").value.trim()
      };

      const texto = [
        "Hola, quiero solicitar un diagnóstico con MiPymeSmart.",
        "",
        "Nombre: " + data.nombre,
        "Negocio: " + data.negocio,
        "Teléfono: " + data.telefono,
        "Necesidad: " + data.servicio,
        "Urgencia: " + data.urgencia,
        "Tipo de negocio: " + data.tamano,
        "Mensaje: " + data.mensaje
      ].join("\n");

      window.open("https://wa.me/56977532697?text=" + encodeURIComponent(texto), "_blank");
    });

    const chatToggle = document.getElementById("chatToggle");
    const chatWindow = document.getElementById("chatWindow");
    const chatClose = document.getElementById("chatClose");
    const chatBody = document.getElementById("chatBody");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");

    function openChat() {
      chatWindow.classList.add("open");
      chatInput.focus();
    }

    function closeChat() {
      chatWindow.classList.remove("open");
    }

    chatToggle.addEventListener("click", () => {
      if (chatWindow.classList.contains("open")) closeChat();
      else openChat();
    });

    chatClose.addEventListener("click", closeChat);

    function addMessage(text, type = "bot") {
      const div = document.createElement("div");
      div.className = "msg " + type;
      div.textContent = text;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function botReply(message) {
      const text = message.toLowerCase();

      if (text.includes("web") || text.includes("página") || text.includes("pagina") || text.includes("sitio")) {
        return "Para web recomiendo partir con una landing profesional: servicios claros, WhatsApp, portafolio, formulario y SEO local. Luego se puede sumar IA.";
      }

      if (text.includes("ia") || text.includes("chatbot") || text.includes("bot")) {
        return "Podemos implementar un asistente IA para preguntas frecuentes, captación de datos y derivación a WhatsApp. Esta demo es frontal; para IA real se conecta una API segura.";
      }

      if (text.includes("electric") || text.includes("tablero") || text.includes("enchufe") || text.includes("proteccion")) {
        return "Para electricidad conviene hacer diagnóstico: tablero, protecciones, capacidad disponible, puntos críticos, iluminación y seguridad del local.";
      }

      if (text.includes("clima") || text.includes("aire") || text.includes("calef") || text.includes("frio") || text.includes("calor")) {
        return "Para climatización se evalúa tamaño del espacio, uso del local, equipo existente, mantenimiento, consumo y posibilidad de control inteligente.";
      }

      if (text.includes("automat") || text.includes("domot") || text.includes("sensor") || text.includes("control")) {
        return "La automatización puede incluir iluminación, climatización, horarios, sensores, monitoreo, alertas y flujos digitales para atención de clientes.";
      }

      if (text.includes("precio") || text.includes("valor") || text.includes("cuánto") || text.includes("cuanto")) {
        return "Los valores dependen del alcance. Web desde $249.000 CLP, Web + IA desde $499.000 CLP, y soluciones técnicas se evalúan según visita o diagnóstico.";
      }

      if (text.includes("contacto") || text.includes("whatsapp") || text.includes("agendar")) {
        return "Puedes escribir directo por WhatsApp al +56 9 7753 2697 o completar el formulario de diagnóstico de esta página.";
      }

      return "Te puedo orientar mejor si me indicas qué necesitas: diseño web, IA, electricidad, climatización, domótica o diagnóstico integral.";
    }

    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      addMessage(message, "user");
      chatInput.value = "";

      setTimeout(() => {
        addMessage(botReply(message), "bot");
      }, 450);
    });

    document.querySelectorAll(".quick-replies button").forEach(button => {
      button.addEventListener("click", () => {
        const message = button.dataset.reply;
        addMessage(message, "user");
        setTimeout(() => addMessage(botReply(message), "bot"), 380);
      });
    });


    const copyPhone = document.getElementById("copyPhone");
    const phoneStatus = document.getElementById("phoneStatus");
    if (copyPhone) {
      copyPhone.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText("+56 9 7753 2697");
          phoneStatus.textContent = "Número copiado: +56 9 7753 2697";
        } catch (error) {
          phoneStatus.textContent = "Número: +56 9 7753 2697";
        }
      });
    }

    const copyInstagram = document.getElementById("copyInstagram");
    const instagramStatus = document.getElementById("instagramStatus");
    if (copyInstagram) {
      copyInstagram.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText("@4lexis_volt_electricidad");
          instagramStatus.textContent = "Instagram copiado: @4lexis_volt_electricidad";
        } catch (error) {
          instagramStatus.textContent = "Instagram: @4lexis_volt_electricidad";
        }
      });
    }

    document.getElementById("year").textContent = new Date().getFullYear();
