(function () {
  const C = window.BARBEARIA;
  if (!C) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  const money = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const fullAddress = `${C.address.line1}, ${C.address.line2}, CEP ${C.address.cep}`;
  const mapsQuery = encodeURIComponent(fullAddress);

  function waLink(message) {
    const base = `https://wa.me/${C.phoneWhatsApp}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  document.body.classList.add("is-loading");

  /* Images */
  const logo = C.logoImage || "";
  const barber = C.barberImage || "";
  ["loaderLogo", "brandLogo", "heroBadge", "footerLogo"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && logo) {
      el.src = logo;
      el.alt = C.name;
    }
  });
  ["heroPhoto", "sobrePhoto"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && barber) el.src = barber;
  });

  /* Text & meta */
  const parts = C.name.split(/\s+Do\s+/i);
  document.getElementById("heroTitleLine1").textContent = parts[0] || C.name;
  document.getElementById("heroTitleLine2").textContent = parts[1] ? `Do ${parts[1]}` : "";

  document.getElementById("docTitle").textContent = `${C.name} · ${C.cityLabel}`;
  document.getElementById("metaDescription").content = `${C.name} — ${C.tagline}`;
  document.getElementById("brandName").textContent = C.name;
  document.getElementById("heroPlace").textContent = C.cityLabel;
  document.getElementById("heroTagline").textContent = C.tagline;
  document.getElementById("aboutText").textContent = C.about;
  document.getElementById("footerName").textContent = C.name;
  document.getElementById("footerYear").textContent = new Date().getFullYear();

  document.getElementById("schemaJson").textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: C.name,
    telephone: `+${C.phoneWhatsApp.replace(/\D/g, "")}`,
    image: logo ? [new URL(logo, location.href).href] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: C.address.line1,
      addressLocality: "Ribeirão do Pinhal",
      addressRegion: "PR",
      postalCode: C.address.cep,
      addressCountry: "BR",
    },
  });

  const waMsg = `Olá! Quero agendar na ${C.name}.`;
  ["headerWhats", "heroWhats", "contactWhats", "dockWhats"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = waLink(waMsg);
  });

  const phone = document.getElementById("phoneLink");
  phone.textContent = C.phoneDisplay;
  phone.href = `tel:+${C.phoneWhatsApp.replace(/\D/g, "")}`;
  document.getElementById("dockPhone").href = phone.href;

  document.getElementById("addressBlock").innerHTML =
    `${C.address.line1}<br />${C.address.line2}<br />CEP ${C.address.cep}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  document.getElementById("mapsLink").href = mapsUrl;
  document.getElementById("mapFrame").src =
    `https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`;

  if (C.bookingUrl) {
    document.getElementById("bookOnlineWrap").hidden = false;
    document.getElementById("bookOnlineLink").href = C.bookingUrl;
  }

  /* Marquee */
  const track = document.getElementById("marqueeTrack");
  const chunk = `<span>${C.name} · ${C.cityLabel} · </span>`.repeat(8);
  track.innerHTML = chunk + chunk;

  /* Hours */
  const hoursList = document.getElementById("hoursList");
  if (C.hours?.length) {
    C.hours.forEach(({ days, time }) => {
      const dt = document.createElement("dt");
      dt.textContent = days;
      const dd = document.createElement("dd");
      dd.textContent = time;
      hoursList.append(dt, dd);
    });
  } else {
    document.getElementById("hoursPanel").hidden = true;
  }

  /* Services */
  const list = document.getElementById("servicesList");
  const select = document.getElementById("serviceSelect");
  select.append(new Option("Selecione…", ""));

  C.services.forEach((s) => {
    const card = document.createElement("article");
    card.className = "service-card" + (s.highlight ? " is-featured" : "");
    card.innerHTML = `
      ${s.highlight ? '<span class="service-tag">Mais pedido</span>' : ""}
      <h3>${s.name}</h3>
      <p class="service-meta">${s.durationMin} min</p>
      <p class="service-price">${money(s.price)}</p>
      <span class="service-cta">Agendar →</span>
    `;
    card.addEventListener("click", () => {
      select.value = `${s.name} — ${money(s.price)}`;
      document.getElementById("agendar").scrollIntoView({ behavior: "smooth" });
    });
    list.append(card);
    select.append(new Option(`${s.name} — ${money(s.price)}`, `${s.name} — ${money(s.price)}`));
  });

  /* Reviews */
  if (C.reviews?.length) {
    document.getElementById("reviewsBlock").hidden = false;
    const grid = document.getElementById("reviewsList");
    C.reviews.forEach((r) => {
      const b = document.createElement("blockquote");
      b.innerHTML = `<p>${r.text}</p><footer>— ${r.author}</footer>`;
      grid.append(b);
    });
  }

  /* Social */
  const links = [];
  if (C.instagram) links.push(`<a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  if (C.facebook) links.push(`<a href="${C.facebook}" target="_blank" rel="noopener">Facebook</a>`);
  if (links.length) {
    const s = document.getElementById("socialLinks");
    s.hidden = false;
    s.innerHTML = links.join(" · ");
  }

  document.getElementById("bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    let msg = `Olá! Quero agendar na ${C.name}.\n\nServiço: ${fd.get("service")}`;
    if (fd.get("date")) msg += `\nDia preferido: ${fd.get("date")}`;
    if (fd.get("name")) msg += `\nNome: ${fd.get("name")}`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* Loader */
  window.addEventListener("load", () => {
    setTimeout(() => document.body.classList.remove("is-loading"), reduced ? 0 : 900);
  });

  /* Scroll progress + header */
  const bar = document.getElementById("progressBar");
  const header = document.getElementById("header");
  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${p}%`;
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  /* Reveal on scroll */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  /* Tilt on hero / sobre */
  if (!reduced && !coarse) {
    document.querySelectorAll("[data-tilt]").forEach((wrap) => {
      const inner = wrap.querySelector(".hero-frame") || wrap.querySelector("img");
      if (!inner) return;
      wrap.addEventListener("mousemove", (e) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const target = wrap.querySelector(".hero-frame") || inner;
        target.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      });
      wrap.addEventListener("mouseleave", () => {
        const target = wrap.querySelector(".hero-frame") || inner;
        target.style.transform = "";
      });
    });
  }

  /* Custom cursor */
  if (!coarse) {
    const wrap = document.getElementById("cursorWrap");
    const dot = wrap.querySelector(".cursor-dot");
    const ring = wrap.querySelector(".cursor-ring");
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    function loop() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll("a, button, .service-card, select, input").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  /* Magnetic buttons */
  if (!reduced && !coarse) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Mobile menu */
  const menuBtn = document.querySelector(".menu-btn");
  const navMobile = document.getElementById("navMobile");
  menuBtn?.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    navMobile.hidden = open;
  });
  navMobile?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMobile.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
})();
