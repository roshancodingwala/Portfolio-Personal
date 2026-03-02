/* ============================
   PORTFOLIO — Interactive JS
   ============================ */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 0. THEME TOGGLE (Light/Dark Mode)
    // =========================================
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme on load
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    // (light is default via CSS, no attribute needed)

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            // Update particle color
            updateParticleColor();
        });
    }

    function getParticleColor() {
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue('--particle-color').trim() || '0, 119, 255';
    }

    function updateParticleColor() {
        // particles will read the color each frame
    }

  // =========================================
  // 1. PARTICLE CANVAS BACKGROUND (HERO)
  // =========================================
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        const pColor = getParticleColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pColor}, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(
        80,
        Math.floor((canvas.width * canvas.height) / 12000),
      );
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawLines() {
      const pColor = getParticleColor();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${pColor}, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      animId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 200);
    });
  }

  // =========================================
  // 2. NAVBAR SCROLL BEHAVIOR
  // =========================================
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = currentScroll;
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });

  // =========================================
  // 3. ACTIVE NAV LINK HIGHLIGHT
  // =========================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });

  // =========================================
  // 4. MOBILE MENU TOGGLE
  // =========================================
  const navToggle = document.getElementById("navToggle");
  const navLinksEl = document.getElementById("navLinks");

  if (navToggle && navLinksEl) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinksEl.classList.toggle("open");
      document.body.style.overflow = navLinksEl.classList.contains("open")
        ? "hidden"
        : "";
    });

    // Close menu when clicking a link
    navLinksEl.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navLinksEl.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // =========================================
  // 5. SCROLL REVEAL (Intersection Observer)
  // =========================================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // =========================================
  // 6. SKILL BAR ANIMATION
  // =========================================
  const skillFills = document.querySelectorAll(".skill-fill");

  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.getAttribute("data-width");
            fill.style.width = width + "%";
            fill.classList.add("animated");
            skillObserver.unobserve(fill);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    skillFills.forEach((fill) => skillObserver.observe(fill));
  } else {
    skillFills.forEach((fill) => {
      fill.style.width = fill.getAttribute("data-width") + "%";
    });
  }

  // =========================================
  // 7. SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = 80;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  // =========================================
  // 8. BACK TO TOP
  // =========================================
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
