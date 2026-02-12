/**
 * Mariposa — Interactive Effects + i18n
 * React Bits-inspired: SpotlightCard, TiltCard, ScrollReveal
 */

(function () {
  'use strict';

  // ── Typewriter (ReactBits TextType inspired) ───
  (function () {
    var els = document.querySelectorAll('.mariposa-typetext');
    els.forEach(function (el) {
      var text = 'Mariposa';
      var i = 0;
      var speed = 100;
      function type() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          el.classList.add('done');
        }
      }
      setTimeout(type, 600);
    });
  })();

  // ── Smooth Scroll ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Language Dropdown: delay close on mouseleave ─
  (function () {
    var dropdown = document.querySelector('.mariposa-lang-dropdown');
    if (!dropdown) return;
    var closeTimer = null;
    dropdown.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
    });
    dropdown.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(function () {
        var menu = dropdown.querySelector('.dropdown-menu');
        if (menu && menu.classList.contains('show')) {
          // Use Bootstrap jQuery dropdown hide
          if (window.jQuery) {
            window.jQuery(dropdown).find('[data-toggle="dropdown"]').dropdown('toggle');
          } else {
            menu.classList.remove('show');
          }
        }
      }, 400);
    });
  })();

  // ── Form Handlers ───────────────────────────────
  window.handleWaitlist = function (e) {
    e.preventDefault();
    document.getElementById('waitlist-form').style.display = 'none';
    document.getElementById('waitlist-success').style.display = 'block';
    return false;
  };
  // ── Scroll-Stack (ReactBits inspired) ────────────
  (function () {
    var stacks = document.querySelectorAll('.scroll-stack');
    if (!stacks.length) return;

    function animateStack() {
      stacks.forEach(function (stack) {
        var items = stack.querySelectorAll('.scroll-stack__item');
        var stackRect = stack.getBoundingClientRect();
        var stackTop = stackRect.top;

        for (var i = 0; i < items.length; i++) {
          var cardHeight = items[i].offsetHeight;
          var scrollOffset = -stackTop - i * (cardHeight + 24);
          if (scrollOffset > 0) {
            var scale = Math.max((cardHeight - scrollOffset * 0.03) / cardHeight, 0.9);
            items[i].style.transform = 'scale(' + scale + ')';
          } else {
            items[i].style.transform = 'scale(1)';
          }
        }
      });
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          animateStack();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    animateStack();
  })();

  // ── Scroll Reveal (IntersectionObserver) ────────
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.scroll-reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Impact Card BlurText + SlideReveal ───────────
  (function () {
    // Split impact card titles into blur-word spans
    document.querySelectorAll('.impact-card-title').forEach(function (title) {
      var text = title.textContent.trim();
      var words = text.split(' ');
      title.innerHTML = words.map(function (w, i) {
        return '<span class="blur-word" style="--delay:' + i + '">' + w + '</span>';
      }).join(' ');
    });

    // Stagger the text wrapper and item spans with longer delays
    document.querySelectorAll('.impact-card').forEach(function (card) {
      var textWrap = card.querySelector('.impact-card-text');
      if (textWrap) textWrap.style.transitionDelay = '0.15s';
      var spans = card.querySelectorAll('.impact-card-items span');
      spans.forEach(function (span, i) {
        span.style.transitionDelay = (0.4 + i * 0.15) + 's';
      });
    });

    // Observe each impact card for reveal
    var impactObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('impact-revealed');
          impactObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('.impact-card').forEach(function (card) {
      impactObserver.observe(card);
    });
  })();

  // ── CircularGallery (ReactBits inspired) ──────────
  (function () {
    var gallery = document.getElementById('circular-gallery');
    if (!gallery) return;

    var track = gallery.querySelector('.circular-gallery__track');
    var items = gallery.querySelectorAll('.circular-gallery__item');
    var count = items.length;
    var angleStep = 360 / count;
    var radius = 400;
    var currentAngle = 0;
    var autoRotateSpeed = 0.15;
    var autoRotateId = null;
    var isDragging = false;
    var startX = 0;
    var dragAngle = 0;

    // Position items in a circle
    items.forEach(function (item, i) {
      var angle = i * angleStep;
      item.style.transform = 'rotateY(' + angle + 'deg) translateZ(' + radius + 'px)';
    });

    function setRotation(angle) {
      track.style.transform = 'rotateY(' + angle + 'deg)';
    }

    // Auto-rotate
    function autoRotate() {
      if (!isDragging) {
        currentAngle += autoRotateSpeed;
        setRotation(currentAngle);
      }
      autoRotateId = requestAnimationFrame(autoRotate);
    }

    // Start auto-rotate when visible
    var galleryObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!autoRotateId) autoRotate();
        } else {
          if (autoRotateId) {
            cancelAnimationFrame(autoRotateId);
            autoRotateId = null;
          }
        }
      });
    }, { threshold: 0.2 });
    galleryObserver.observe(gallery);

    // Drag to rotate
    function onPointerDown(e) {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragAngle = currentAngle;
      track.style.transition = 'none';
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      var x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      var delta = (x - startX) * 0.3;
      currentAngle = dragAngle + delta;
      setRotation(currentAngle);
    }
    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    }

    gallery.addEventListener('mousedown', onPointerDown);
    gallery.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
  })();

  // ── Card Videos: auto-play on scroll, loop ────────
  (function () {
    var videos = document.querySelectorAll('.card-video');
    if (!videos.length) return;

    // Hide placeholder when video can play
    videos.forEach(function (video) {
      video.addEventListener('canplay', function () {
        var wrap = video.closest('.card-video-wrap');
        if (wrap) wrap.classList.add('video-loaded');
      });
    });

    // Auto-play when scrolled into view
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.3 });

    videos.forEach(function (video) {
      videoObserver.observe(video);
    });
  })();

  // ── SpotlightCard: cursor-following gradient ────
  document.querySelectorAll('.spotlight-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ── TiltCard: 3D tilt + cursor shine ────────────
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    var inner = card.querySelector('.tilt-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -8;
      var rotateY = ((x - centerX) / centerX) * 8;

      inner.style.transform =
        'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });

    card.addEventListener('mouseleave', function () {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });

  // ── i18n: Language Switching ────────────────────
  var translations = {
    en: {
      nav_how: 'How it works',
      nav_impact: 'Impact',
      nav_partners: 'Partners',
      nav_waitlist: 'Join waitlist',
      hero_h1: 'The first personal AI career coach for early careers.',
      hero_subline: '<strong>Finally bringing guidance, matching and international hiring together.</strong>',
      hero_bridge: 'Today, students, schools and organizations still work separately, leaving young talent without guidance and companies struggling with inefficient recruiting.',
      hero_cta_waitlist: 'Join the waitlist',
      hero_cta_how: 'How it works',
      problem_side: 'Talent exists: Opportunities exist: The process is broken.',
      problem_label: 'The Challenge',
      problem_h2_1: 'The',
      problem_h2_2: 'broken bridge',
      problem_h2_3: 'between talent and opportunity',
      problem_desc: 'Students face life-changing decisions without guidance.<br><br>Companies receive hundreds of irrelevant applications.<br><br>International talent gets blocked by bureaucracy.',
      stat_1: 'Apprenticeship dropouts',
      stat_2: 'Open positions unfilled',
      stat_3: 'Fail to enter job market',
      stat_4: 'Annual economic damage',
      idea_w1: 'One', idea_w2: 'shared', idea_w3: 'journey.', idea_w4: 'One', idea_w5: 'AI', idea_w6: 'coach.',
      idea_para: 'Students are guided over time by a personal AI coach that helps them discover their strengths and interests step by step. On the other side, companies gain an AI-powered recruiting assistant that supports job postings, pre-selection, and interviews. For international talent, visa and documentation processes are guided by AI. Both sides only meet when they are truly prepared \u2014 creating better outcomes for everyone.',
      step_1_title: 'AI Coaching',
      step_1_desc: 'Students build meaningful profiles over time, guided by a personal AI career coach that understands their strengths and goals.',
      step_2_title: 'Smart Matching',
      step_2_desc: 'AI matches prepared student profiles with structured company roles. Both sides meet only when truly ready.',
      step_3_title: 'Guided Journey',
      step_3_desc: 'From application to contract and visa \u2014 AI supports the full journey including documentation for international talent.',
      impact_w1: 'Real', impact_w2: 'impact', impact_w3: 'for', impact_w4: 'everyone.',
      impact_students_title: 'For Students',
      impact_s1: 'Clarity about strengths',
      impact_s2: 'Step-by-step guidance',
      impact_s3: 'Real confidence',
      impact_companies_title: 'For Companies',
      impact_c1: 'Fewer but better candidates',
      impact_c2: 'Time & cost savings',
      impact_c3: 'Lower dropout rates',
      impact_both_title: 'For Both',
      impact_b1: 'Safer decisions',
      impact_b2: 'Long-term matches',
      impact_b3: 'Less friction, more trust',
      mockup_w1: 'A', mockup_w2: 'glimpse', mockup_w3: 'of', mockup_w4: 'Mariposa.',
      mockup_1: 'Student Profile',
      mockup_2: 'Company Profile',
      mockup_3: 'AI Based Job Creation',
      mockup_4: 'AI Coach for Student',
      mockup_5: 'AI Interview',
      mockup_6: 'Match Overview',
      mockup_7: 'AI Visa Assistant',
      mockup_8: 'Company Dashboard',
      trust_w1: 'Built', trust_w2: 'with', trust_w3: 'trusted', trust_w4: 'partners.',
      waitlist_h2: 'Be among the first to experience Mariposa.',
      waitlist_sub: "Sign up now and we'll let you know as soon as we launch.",
      form_name: 'Name',
      form_email: 'Email',
      form_iam: 'I am a...',
      form_select: 'Please select',
      form_student: 'Student / Parent',
      form_school: 'School',
      form_university: 'University',
      form_company: 'Company',
      form_other: 'Other',
      form_gdpr: 'I agree to the processing of my data in accordance with the privacy policy.',
      form_submit: 'Join the waitlist',
      form_thanks_title: 'Thank you!',
      form_thanks_msg: 'Thank you for your interest in Mariposa. We will contact you as soon as there are updates.',
      team_founders_label: 'Founders',
      team_founders_h2: 'Meet our founders',
      team_founders_desc: 'What started as a shared frustration became a shared mission. Four people from different backgrounds, united by one belief: talent deserves better guidance.',
      team_advisors_label: 'Advisors',
      team_advisors_h2: 'Meet our board of advisors',
      team_advisors_desc: 'An interdisciplinary advisory board that brings deep expertise in AI, data, design, and education to help shape Mariposa\u2019s vision.',
      footer_links_title: 'Links',
      footer_privacy: 'Privacy Policy',
      footer_imprint: 'Imprint'
    },
    de: {
      nav_how: 'So funktioniert\u2019s',
      nav_impact: 'Wirkung',
      nav_partners: 'Partner',
      nav_waitlist: 'Warteliste',
      hero_h1: 'Der erste pers\u00f6nliche KI Karrierecoach f\u00fcr Berufseinsteiger.',
      hero_subline: '<strong>Endlich Orientierung, Matching und internationales Recruiting vereint.</strong>',
      hero_bridge: 'Heute arbeiten Sch\u00fcler, Schulen und Unternehmen noch getrennt \u2013 junge Talente bleiben ohne Orientierung und Unternehmen k\u00e4mpfen mit ineffizientem Recruiting.',
      hero_cta_waitlist: 'Zur Warteliste',
      hero_cta_how: 'So funktioniert\u2019s',
      problem_side: 'Talente gibt es: Chancen gibt es: Der Prozess ist kaputt.',
      problem_label: 'Die Herausforderung',
      problem_h2_1: 'Die',
      problem_h2_2: 'zerbrochene Br\u00fccke',
      problem_h2_3: 'zwischen Talent und Chance',
      problem_desc: 'Sch\u00fcler treffen lebensver\u00e4ndernde Entscheidungen ohne Orientierung.<br><br>Unternehmen erhalten Hunderte irrelevanter Bewerbungen.<br><br>Internationale Talente werden durch B\u00fcrokratie blockiert.',
      stat_1: 'Ausbildungsabbr\u00fcche',
      stat_2: 'Offene Stellen unbesetzt',
      stat_3: 'Scheitern am Berufseinstieg',
      stat_4: 'J\u00e4hrlicher wirtschaftlicher Schaden',
      idea_w1: 'Eine', idea_w2: 'gemeinsame', idea_w3: 'Reise.', idea_w4: 'Ein', idea_w5: 'KI', idea_w6: 'Coach.',
      idea_para: 'Sch\u00fcler werden \u00fcber die Zeit von einem pers\u00f6nlichen KI-Coach begleitet, der ihnen hilft, ihre St\u00e4rken und Interessen Schritt f\u00fcr Schritt zu entdecken. Auf der anderen Seite erhalten Unternehmen einen KI-gest\u00fctzten Recruiting-Assistenten, der Stellenausschreibungen, Vorauswahl und Interviews unterst\u00fctzt. F\u00fcr internationale Talente werden Visum und Dokumentation durch KI begleitet. Beide Seiten treffen sich erst, wenn sie wirklich vorbereitet sind \u2013 f\u00fcr bessere Ergebnisse f\u00fcr alle.',
      step_1_title: 'KI-Coaching',
      step_1_desc: 'Sch\u00fcler erstellen \u00fcber die Zeit aussagekr\u00e4ftige Profile, begleitet von einem pers\u00f6nlichen KI-Karrierecoach.',
      step_2_title: 'Smart Matching',
      step_2_desc: 'KI bringt vorbereitete Sch\u00fclerprofile mit strukturierten Unternehmensrollen zusammen. Beide Seiten treffen sich erst, wenn sie bereit sind.',
      step_3_title: 'Begleitete Reise',
      step_3_desc: 'Von der Bewerbung bis zum Vertrag und Visum \u2013 KI unterst\u00fctzt den gesamten Weg inklusive Dokumentation f\u00fcr internationale Talente.',
      impact_w1: 'Echte', impact_w2: 'Wirkung', impact_w3: 'f\u00fcr', impact_w4: 'alle.',
      impact_students_title: 'F\u00fcr Sch\u00fcler',
      impact_s1: 'Klarheit \u00fcber St\u00e4rken',
      impact_s2: 'Schritt-f\u00fcr-Schritt Orientierung',
      impact_s3: 'Echtes Selbstvertrauen',
      impact_companies_title: 'F\u00fcr Unternehmen',
      impact_c1: 'Weniger, aber bessere Kandidaten',
      impact_c2: 'Zeit- & Kostenersparnis',
      impact_c3: 'Geringere Abbruchraten',
      impact_both_title: 'F\u00fcr beide',
      impact_b1: 'Sicherere Entscheidungen',
      impact_b2: 'Langfristige Matches',
      impact_b3: 'Weniger Reibung, mehr Vertrauen',
      mockup_w1: 'Ein', mockup_w2: 'Einblick', mockup_w3: 'in', mockup_w4: 'Mariposa.',
      mockup_1: 'Sch\u00fclerprofil',
      mockup_2: 'Unternehmensprofil',
      mockup_3: 'KI-basierte Stellenerstellung',
      mockup_4: 'KI-Coach f\u00fcr Sch\u00fcler',
      mockup_5: 'KI-Interview',
      mockup_6: 'Match-\u00dcbersicht',
      mockup_7: 'KI-Visum-Assistent',
      mockup_8: 'Unternehmens-Dashboard',
      trust_w1: 'Entwickelt', trust_w2: 'mit', trust_w3: 'starken', trust_w4: 'Partnern.',
      waitlist_h2: 'Geh\u00f6ren Sie zu den Ersten, die Mariposa erleben.',
      waitlist_sub: 'Melden Sie sich jetzt an \u2013 wir informieren Sie, sobald wir starten.',
      form_name: 'Name',
      form_email: 'E-Mail',
      form_iam: 'Ich bin...',
      form_select: 'Bitte w\u00e4hlen',
      form_student: 'Sch\u00fcler / Elternteil',
      form_school: 'Schule',
      form_university: 'Universit\u00e4t',
      form_company: 'Unternehmen',
      form_other: 'Sonstiges',
      form_gdpr: 'Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der Datenschutzerkl\u00e4rung zu.',
      form_submit: 'Zur Warteliste',
      form_thanks_title: 'Vielen Dank!',
      form_thanks_msg: 'Vielen Dank f\u00fcr Ihr Interesse an Mariposa. Wir melden uns, sobald es Neuigkeiten gibt.',
      team_founders_label: 'Gr\u00fcnder',
      team_founders_h2: 'Unser Gr\u00fcndungsteam',
      team_founders_desc: 'Was als gemeinsame Frustration begann, wurde zu einer gemeinsamen Mission. Vier Menschen mit unterschiedlichen Hintergr\u00fcnden, vereint durch eine \u00dcberzeugung: Talent verdient bessere F\u00f6rderung.',
      team_advisors_label: 'Beirat',
      team_advisors_h2: 'Unser Beirat',
      team_advisors_desc: 'Ein interdisziplin\u00e4rer Beirat, der tiefgreifende Expertise in KI, Daten, Design und Bildung einbringt, um Mariposas Vision mitzugestalten.',
      footer_links_title: 'Links',
      footer_privacy: 'Datenschutz',
      footer_imprint: 'Impressum'
    },
    es: {
      nav_how: 'C\u00f3mo funciona',
      nav_impact: 'Impacto',
      nav_partners: 'Socios',
      nav_waitlist: 'Lista de espera',
      hero_h1: 'El primer coach de carrera con IA para j\u00f3venes profesionales.',
      hero_subline: '<strong>Por fin orientaci\u00f3n, matching y contrataci\u00f3n internacional juntos.</strong>',
      hero_bridge: 'Hoy, estudiantes, escuelas y empresas trabajan por separado \u2014 los j\u00f3venes talentos quedan sin orientaci\u00f3n y las empresas luchan con un recruiting ineficiente.',
      hero_cta_waitlist: '\u00danete a la lista',
      hero_cta_how: 'C\u00f3mo funciona',
      problem_side: 'El talento existe: Las oportunidades existen: El proceso est\u00e1 roto.',
      problem_label: 'El Desaf\u00edo',
      problem_h2_1: 'El',
      problem_h2_2: 'puente roto',
      problem_h2_3: 'entre talento y oportunidad',
      problem_desc: 'Los estudiantes toman decisiones que cambian su vida sin orientaci\u00f3n.<br><br>Las empresas reciben cientos de candidaturas irrelevantes.<br><br>El talento internacional queda bloqueado por la burocracia.',
      stat_1: 'Abandonos de formaci\u00f3n',
      stat_2: 'Puestos sin cubrir',
      stat_3: 'No logran entrar al mercado',
      stat_4: 'Da\u00f1o econ\u00f3mico anual',
      idea_w1: 'Un', idea_w2: 'camino', idea_w3: 'compartido.', idea_w4: 'Un', idea_w5: 'coach', idea_w6: 'IA.',
      idea_para: 'Los estudiantes son guiados a lo largo del tiempo por un coach de IA personal que les ayuda a descubrir sus fortalezas e intereses paso a paso. Por otro lado, las empresas obtienen un asistente de recruiting impulsado por IA que apoya publicaciones de empleo, preselecci\u00f3n y entrevistas. Para el talento internacional, los procesos de visado y documentaci\u00f3n son guiados por IA. Ambas partes se encuentran solo cuando est\u00e1n verdaderamente preparadas \u2014 creando mejores resultados para todos.',
      step_1_title: 'Coaching IA',
      step_1_desc: 'Los estudiantes construyen perfiles significativos con el tiempo, guiados por un coach de carrera con IA.',
      step_2_title: 'Smart Matching',
      step_2_desc: 'La IA empareja perfiles preparados con roles estructurados. Ambas partes se conocen solo cuando est\u00e1n listas.',
      step_3_title: 'Viaje Guiado',
      step_3_desc: 'Desde la solicitud hasta el contrato y visado \u2014 la IA apoya todo el proceso incluyendo documentaci\u00f3n para talento internacional.',
      impact_w1: 'Impacto', impact_w2: 'real', impact_w3: 'para', impact_w4: 'todos.',
      impact_students_title: 'Para Estudiantes',
      impact_s1: 'Claridad sobre fortalezas',
      impact_s2: 'Orientaci\u00f3n paso a paso',
      impact_s3: 'Confianza real',
      impact_companies_title: 'Para Empresas',
      impact_c1: 'Menos pero mejores candidatos',
      impact_c2: 'Ahorro de tiempo y costes',
      impact_c3: 'Menores tasas de abandono',
      impact_both_title: 'Para Ambos',
      impact_b1: 'Decisiones m\u00e1s seguras',
      impact_b2: 'Matches a largo plazo',
      impact_b3: 'Menos fricci\u00f3n, m\u00e1s confianza',
      mockup_w1: 'Un', mockup_w2: 'vistazo', mockup_w3: 'a', mockup_w4: 'Mariposa.',
      mockup_1: 'Perfil del Estudiante',
      mockup_2: 'Perfil de Empresa',
      mockup_3: 'Creaci\u00f3n de Empleo con IA',
      mockup_4: 'Coach IA para Estudiantes',
      mockup_5: 'Entrevista IA',
      mockup_6: 'Vista de Matching',
      mockup_7: 'Asistente de Visa IA',
      mockup_8: 'Panel de Empresa',
      trust_w1: 'Creado', trust_w2: 'con', trust_w3: 'socios', trust_w4: 'de confianza.',
      waitlist_h2: 'S\u00e9 de los primeros en conocer Mariposa.',
      waitlist_sub: 'Reg\u00edstrate ahora y te avisaremos en cuanto lancemos.',
      form_name: 'Nombre',
      form_email: 'Correo',
      form_iam: 'Soy...',
      form_select: 'Seleccionar',
      form_student: 'Estudiante / Padre',
      form_school: 'Escuela',
      form_university: 'Universidad',
      form_company: 'Empresa',
      form_other: 'Otro',
      form_gdpr: 'Acepto el tratamiento de mis datos seg\u00fan la pol\u00edtica de privacidad.',
      form_submit: '\u00danete a la lista',
      form_thanks_title: '\u00a1Gracias!',
      form_thanks_msg: 'Gracias por tu inter\u00e9s en Mariposa. Te contactaremos cuando haya novedades.',
      team_founders_label: 'Fundadores',
      team_founders_h2: 'Conoce a nuestros fundadores',
      team_founders_desc: 'Lo que comenz\u00f3 como una frustraci\u00f3n compartida se convirti\u00f3 en una misi\u00f3n com\u00fan. Cuatro personas de diferentes or\u00edgenes, unidas por una creencia: el talento merece mejor orientaci\u00f3n.',
      team_advisors_label: 'Asesores',
      team_advisors_h2: 'Nuestro consejo asesor',
      team_advisors_desc: 'Un consejo asesor interdisciplinario que aporta experiencia en IA, datos, dise\u00f1o y educaci\u00f3n para dar forma a la visi\u00f3n de Mariposa.',
      footer_links_title: 'Enlaces',
      footer_privacy: 'Privacidad',
      footer_imprint: 'Aviso legal'
    }
  };

  var currentLang = 'de';

  // ── FadeWords (React Bits inspired) ─────────────
  function buildFadeWords(el, text) {
    var words = text.split(' ');
    el.innerHTML = words.map(function (w, i) {
      return '<span class="fade-word" style="--fw-i:' + i + '">' + w + '</span>';
    }).join(' ');
    // Reset animation state
    el.classList.remove('fade-words-visible');
    void el.offsetHeight;
    // Re-observe for scroll trigger
    if (window._fadeWordsObserver) {
      window._fadeWordsObserver.observe(el);
    }
  }

  // IntersectionObserver to trigger fade-words on scroll
  window._fadeWordsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-words-visible');
        window._fadeWordsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Initial build of all fade-words elements
  document.querySelectorAll('.fade-words').forEach(function (el) {
    var text = el.textContent.trim();
    buildFadeWords(el, text);
    window._fadeWordsObserver.observe(el);
  });

  function setLanguage(lang) {
    currentLang = lang;
    var t = translations[lang];
    if (!t) return;

    // Update label + flag
    var langNames = { de: 'Deutsch', en: 'English', es: 'Espa\u00f1ol' };
    var langCodes = { de: 'de', en: 'en', es: 'es' };
    var label = document.getElementById('current-lang-label');
    if (label) label.textContent = langNames[lang] || lang;
    var flag = document.getElementById('current-lang-flag');
    var activeItem = document.querySelector('.mariposa-lang-item.lang-switch[data-lang="' + lang + '"]');
    if (flag && activeItem) {
      var srcFlag = activeItem.querySelector('.mariposa-lang-flag');
      if (srcFlag) flag.innerHTML = srcFlag.innerHTML;
    }
    document.querySelectorAll('.mariposa-lang-item.lang-switch').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });

    // Update html lang
    document.documentElement.lang = langCodes[lang] || lang;

    // Update all data-i18n text
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Re-split impact card titles into blur-word spans after i18n update
    document.querySelectorAll('.impact-card-title[data-i18n]').forEach(function (title) {
      var text = title.textContent.trim();
      var words = text.split(' ');
      title.innerHTML = words.map(function (w, i) {
        return '<span class="blur-word" style="--delay:' + i + '">' + w + '</span>';
      }).join(' ');
      // Re-trigger animation
      var card = title.closest('.impact-card');
      if (card) {
        card.classList.remove('impact-revealed');
        void card.offsetHeight;
        card.classList.add('impact-revealed');
      }
    });

    // Update all data-i18n-html (innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) {
        // If element has fade-words class, rebuild word spans
        if (el.classList.contains('fade-words')) {
          buildFadeWords(el, t[key]);
        } else {
          el.innerHTML = t[key];
        }
      }
    });

    // Update hero H1 (special: has blur-word spans)
    var h1El = document.querySelector('[data-i18n="hero_h1"]');
    if (h1El && t.hero_h1) {
      var words = t.hero_h1.split(' ');
      h1El.innerHTML = words
        .map(function (w, i) {
          var extra = (w === 'AI' || w === 'KI' || w === 'IA') ? ' shiny-text' : '';
          return '<span class="blur-word' + extra + '" style="--delay:' + i + '">' + w + '</span>';
        })
        .join('\n');
      // Re-trigger animation
      h1El.querySelectorAll('.blur-word').forEach(function (w) {
        w.style.animation = 'none';
        w.offsetHeight;
        if (w.classList.contains('shiny-text')) {
          w.style.animation = 'blurReveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards, shinySlide 3s ease-in-out 1.5s infinite';
          w.style.animationDelay = 'calc(var(--delay) * 0.1s + 0.3s), 1.5s';
        } else {
          w.style.animation = '';
        }
      });
    }

    // Hero subline (has <strong>)
    var subline = document.querySelector('[data-i18n="hero_subline"]');
    if (subline && t.hero_subline) subline.innerHTML = t.hero_subline;

    // Select options
    document.querySelectorAll('option[data-i18n]').forEach(function (opt) {
      var key = opt.getAttribute('data-i18n');
      if (t[key] !== undefined) opt.textContent = t[key];
    });
  }

  // Bind language switch buttons
  document.querySelectorAll('.lang-switch').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var lang = this.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Default: German
  setLanguage('de');
})();
