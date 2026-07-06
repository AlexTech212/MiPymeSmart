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

    // Navegación precisa v3:
    // Corrige el desfase causado por el header fijo y por el padding interno de las secciones.
    // En vez de apuntar al inicio del <section>, apunta al primer contenido visible.
    const siteHeader = document.querySelector(".site-header");

    function getHeaderHeight() {
      return siteHeader ? Math.ceil(siteHeader.getBoundingClientRect().height) : 76;
    }

    function getVisualGap() {
      return window.innerWidth <= 660 ? 18 : 28;
    }

    function updateScrollOffset() {
      const offset = getHeaderHeight() + getVisualGap();
      document.documentElement.style.setProperty("--scroll-offset", `${offset}px`);
    }

    function getReadableAnchor(section) {
      if (!section) return null;

      return section.querySelector(
        ".section-head, .split-feature > div:first-child, .hero-grid > div:first-child, .cta, .about-shell, .portfolio-grid, .social-grid, .diagnostic, .eyebrow, h2, h1"
      ) || section;
    }

    function closeMobileMenu() {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.textContent = "☰";
    }

    function scrollToSection(hash) {
      const section = document.querySelector(hash);
      if (!section) return;

      updateScrollOffset();

      const anchorTarget = getReadableAnchor(section);
      const top = anchorTarget.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = top - getHeaderHeight() - getVisualGap();

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

        const section = document.querySelector(hash);
        if (!section) return;

        event.preventDefault();
        closeMobileMenu();
        scrollToSection(hash);
      });
    });

    window.addEventListener("resize", updateScrollOffset);

    window.addEventListener("load", () => {
      updateScrollOffset();

      if (window.location.hash) {
        setTimeout(() => scrollToSection(window.location.hash), 180);
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

    // Viñetas hero-only v10:
    // Se mueven solo dentro de la página principal (#inicio).
    // No siguen al usuario hacia Soluciones u otras secciones.
    // Al cambiar de sección vuelven a reposo en Inicio.
    function initHeroOnlyFloatingCards() {
      const hero = document.querySelector("#inicio");
      const originalPanel = document.querySelector(".hero-panel");
      const systemWindow = document.querySelector(".hero-panel .system-window");

      if (!hero || !originalPanel || !systemWindow) return;

      const cards = [
        originalPanel.querySelector(".floating-metric"),
        originalPanel.querySelector(".chat-preview")
      ].filter(Boolean);

      if (cards.length < 2) return;

      const layer = document.createElement("div");
      layer.className = "hero-game-layer";
      hero.appendChild(layer);

      const states = new Map();
      let frame = null;
      let resetTimer = null;
      const margin = 18;

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function getHeroRectPage() {
        const rect = hero.getBoundingClientRect();
        return {
          left: rect.left + window.pageXOffset,
          top: rect.top + window.pageYOffset,
          width: rect.width,
          height: rect.height
        };
      }

      function getBounds(card) {
        const heroBox = getHeroRectPage();

        // Coordenadas relativas al hero.
        const minX = margin;
        const maxX = Math.max(margin, heroBox.width - card.offsetWidth - margin);
        const minY = margin;
        const maxY = Math.max(minY, heroBox.height - card.offsetHeight - margin);

        return { minX, maxX, minY, maxY };
      }

      function getHomePositions() {
        const heroBox = getHeroRectPage();
        const systemRect = systemWindow.getBoundingClientRect();
        const systemLeft = systemRect.left + window.pageXOffset - heroBox.left;
        const systemRight = systemRect.right + window.pageXOffset - heroBox.left;
        const systemBottom = systemRect.bottom + window.pageYOffset - heroBox.top;

        const baseY = systemBottom + 24;

        return cards.map((card, index) => {
          const bounds = getBounds(card);
          const isMobile = window.innerWidth <= 760;

          let x;
          let y;

          if (isMobile) {
            x = clamp((heroBox.width - card.offsetWidth) / 2, bounds.minX, bounds.maxX);
            y = baseY + index * (card.offsetHeight + 14);
          } else {
            // Reposo: bajo el recuadro Sistema, una a cada lado.
            x = index === 0
              ? clamp(systemLeft + 8, bounds.minX, bounds.maxX)
              : clamp(systemRight - card.offsetWidth - 8, bounds.minX, bounds.maxX);

            y = baseY;
          }

          return {
            x: clamp(x, bounds.minX, bounds.maxX),
            y: clamp(y, bounds.minY, bounds.maxY)
          };
        });
      }

      function setPosition(card, x, y) {
        const state = states.get(card);
        if (state) {
          state.x = x;
          state.y = y;
        }

        card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      function ensureHeroHasRoom() {
        const homes = getHomePositions();
        const neededBottom = Math.max(
          ...homes.map((home, index) => home.y + cards[index].offsetHeight)
        ) + 34;

        if (neededBottom > hero.clientHeight) {
          hero.style.minHeight = `${neededBottom}px`;
        }
      }

      function moveToHome(animated = true) {
        ensureHeroHasRoom();
        const homes = getHomePositions();

        cards.forEach((card, index) => {
          let state = states.get(card);

          if (!state) {
            state = {
              x: 0,
              y: 0,
              vx: 0,
              vy: 0,
              dragging: false,
              pointerId: null,
              grabX: 0,
              grabY: 0,
              lastX: 0,
              lastY: 0,
              lastT: 0,
              homeX: homes[index].x,
              homeY: homes[index].y
            };
            states.set(card, state);
          }

          state.homeX = homes[index].x;
          state.homeY = homes[index].y;
          state.vx = 0;
          state.vy = 0;
          state.dragging = false;

          if (animated) {
            card.style.transition = "transform .55s cubic-bezier(.22, 1, .36, 1), box-shadow .18s ease, border-color .18s ease, filter .18s ease";
            setPosition(card, state.homeX, state.homeY);
            setTimeout(() => {
              card.style.transition = "box-shadow .18s ease, border-color .18s ease, filter .18s ease";
            }, 580);
          } else {
            setPosition(card, state.homeX, state.homeY);
          }
        });
      }

      function placeInitialCards() {
        cards.forEach(card => {
          layer.appendChild(card);
        });

        requestAnimationFrame(() => moveToHome(false));
      }

      function showImpact(card, x, y) {
        card.classList.remove("corner-hit");
        void card.offsetWidth;
        card.classList.add("corner-hit");

        const dot = document.createElement("span");
        dot.className = "hero-impact-dot";
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        layer.appendChild(dot);

        setTimeout(() => dot.remove(), 650);
      }

      function animate() {
        let moving = false;

        cards.forEach(card => {
          const state = states.get(card);
          if (!state || state.dragging) return;

          if (Math.abs(state.vx) < 0.05 && Math.abs(state.vy) < 0.05) {
            state.vx = 0;
            state.vy = 0;
            return;
          }

          const bounds = getBounds(card);

          state.x += state.vx;
          state.y += state.vy;

          let hit = false;
          let hitX = state.x + card.offsetWidth / 2;
          let hitY = state.y + card.offsetHeight / 2;

          if (state.x <= bounds.minX) {
            state.x = bounds.minX;
            state.vx = Math.abs(state.vx) * 0.72;
            hit = true;
            hitX = bounds.minX;
          } else if (state.x >= bounds.maxX) {
            state.x = bounds.maxX;
            state.vx = -Math.abs(state.vx) * 0.72;
            hit = true;
            hitX = bounds.maxX + card.offsetWidth;
          }

          if (state.y <= bounds.minY) {
            state.y = bounds.minY;
            state.vy = Math.abs(state.vy) * 0.72;
            hit = true;
            hitY = bounds.minY;
          } else if (state.y >= bounds.maxY) {
            state.y = bounds.maxY;
            state.vy = -Math.abs(state.vy) * 0.72;
            hit = true;
            hitY = bounds.maxY + card.offsetHeight;
          }

          if (hit) showImpact(card, hitX, hitY);

          state.vx *= 0.985;
          state.vy *= 0.985;

          setPosition(card, state.x, state.y);
          moving = true;
        });

        frame = moving ? requestAnimationFrame(animate) : null;
      }

      function startAnimation() {
        if (!frame) frame = requestAnimationFrame(animate);
      }

      cards.forEach(card => {
        card.addEventListener("pointerdown", event => {
          if (event.button !== undefined && event.button !== 0) return;

          const state = states.get(card);
          if (!state) return;

          card.style.transition = "box-shadow .18s ease, border-color .18s ease, filter .18s ease";

          const heroBox = getHeroRectPage();

          state.dragging = true;
          state.pointerId = event.pointerId;
          state.grabX = event.clientX + window.pageXOffset - heroBox.left - state.x;
          state.grabY = event.clientY + window.pageYOffset - heroBox.top - state.y;
          state.lastX = event.clientX;
          state.lastY = event.clientY;
          state.lastT = performance.now();
          state.vx = 0;
          state.vy = 0;

          card.classList.add("is-dragging");
          card.setPointerCapture(event.pointerId);
        });

        card.addEventListener("pointermove", event => {
          const state = states.get(card);
          if (!state || !state.dragging || state.pointerId !== event.pointerId) return;

          const heroBox = getHeroRectPage();
          const bounds = getBounds(card);
          const now = performance.now();
          const dt = Math.max(now - state.lastT, 16);

          let nextX = event.clientX + window.pageXOffset - heroBox.left - state.grabX;
          let nextY = event.clientY + window.pageYOffset - heroBox.top - state.grabY;

          nextX = clamp(nextX, bounds.minX, bounds.maxX);
          nextY = clamp(nextY, bounds.minY, bounds.maxY);

          state.vx = ((event.clientX - state.lastX) / dt) * 16;
          state.vy = ((event.clientY - state.lastY) / dt) * 16;
          state.lastX = event.clientX;
          state.lastY = event.clientY;
          state.lastT = now;

          setPosition(card, nextX, nextY);
        });

        function releaseCard(event) {
          const state = states.get(card);
          if (!state || state.pointerId !== event.pointerId) return;

          state.dragging = false;
          state.pointerId = null;
          state.vx = clamp(state.vx, -22, 22);
          state.vy = clamp(state.vy, -22, 22);

          card.classList.remove("is-dragging");

          try {
            card.releasePointerCapture(event.pointerId);
          } catch (error) {}

          startAnimation();
        }

        card.addEventListener("pointerup", releaseCard);
        card.addEventListener("pointercancel", releaseCard);

        // Doble clic: volver al reposo.
        card.addEventListener("dblclick", () => moveToHome(true));
      });

      function resetCardsWhenLeavingHero() {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => moveToHome(true), 500);
      }

      // Al cambiar a Soluciones, Portafolio o cualquier sección, vuelven al Inicio/reposo.
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", () => resetCardsWhenLeavingHero());
      });

      window.addEventListener("hashchange", resetCardsWhenLeavingHero);

      window.addEventListener("resize", () => {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => moveToHome(true), 250);
      });

      setTimeout(placeInitialCards, 120);
    }

    window.addEventListener("DOMContentLoaded", initHeroOnlyFloatingCards);




    // Ajuste v14 fallback: clic en pills del hero centra directamente las tarjetas de Soluciones.
    document.querySelectorAll(".hero-solution-pill").forEach(pill => {
      pill.addEventListener("click", event => {
        const target = document.querySelector("#soluciones-cards");
        const header = document.querySelector(".site-header");
        if (!target) return;

        event.preventDefault();

        const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 76;
        const rect = target.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const availableHeight = window.innerHeight - headerHeight;
        const centerGap = Math.max(18, (availableHeight - rect.height) / 2);
        const targetPosition = absoluteTop - headerHeight - centerGap;

        window.scrollTo({
          top: Math.max(targetPosition, 0),
          behavior: "smooth"
        });

        history.pushState(null, "", "#soluciones-cards");
      });
    });

    document.getElementById("year").textContent = new Date().getFullYear();
