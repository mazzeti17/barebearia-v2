(function () {
  const C = window.BARBEARIA;
  if (!C) return;

  const money = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const fullAddress = `${C.address.line1}, ${C.address.line2}, CEP ${C.address.cep}`;
  const mapsQuery = encodeURIComponent(fullAddress);
  const waBase = `https://wa.me/${C.phoneWhatsApp}`;

  function waLink(message) {
    const q = message ? `?text=${encodeURIComponent(message)}` : "";
    return `${waBase}${q}`;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  /* Meta & schema */
  document.getElementById("docTitle").textContent = `${C.name} · ${C.cityLabel}`;
  document.getElementById("metaDescription").content =
    `${C.name} — ${C.tagline} ${C.address.line2}.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: C.name,
    telephone: `+${C.phoneWhatsApp.replace(/\D/g, "")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: C.address.line1,
      addressLocality: C.address.line2.split("—")[0]?.trim(),
      addressRegion: C.state || "PR",
      postalCode: C.address.cep,
      addressCountry: "BR",
    },
  };
  document.getElementById("schemaJson").textContent = JSON.stringify(schema);

  /* Brand & hero */
  setText("brandMark", C.initials);
  setText("brandName", C.name);
  setText("heroPlace", C.cityLabel);
  setText("heroTitle", C.name);
  setText("heroTagline", C.tagline);
  setText("aboutText", C.about);
  setText("footerName", C.name);
  setText("footerYear", new Date().getFullYear());

  const heroBg = document.getElementById("heroBg");
  if (C.heroImage) {
    heroBg.style.backgroundImage = `linear-gradient(160deg, rgba(17, 17, 16, 0.88) 0%, rgba(17, 17, 16, 0.5) 50%, rgba(17, 17, 16, 0.92) 100%), url("${C.heroImage}")`;
    heroBg.classList.add("has-photo");
  }

  ["headerWhats", "heroWhats", "contactWhats", "dockWhats"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.href = waLink(`Olá! Gostaria de agendar na ${C.name}.`);
      if (id !== "headerWhats") el.textContent = id === "dockWhats" ? "WhatsApp" : "Chamar no WhatsApp";
    }
  });

  const phoneLink = document.getElementById("phoneLink");
  phoneLink.textContent = C.phoneDisplay;
  phoneLink.href = `tel:+${C.phoneWhatsApp.replace(/\D/g, "")}`;
  document.getElementById("dockPhone").href = phoneLink.href;

  setHtml(
    "addressBlock",
    `${C.address.line1}<br />${C.address.line2}<br />CEP ${C.address.cep}`
  );

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  document.getElementById("mapsLink").href = mapsUrl;
  document.getElementById("mapFrame").src =
    `https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`;

  if (C.bookingUrl) {
    document.getElementById("bookOnlineWrap").hidden = false;
    const link = document.getElementById("bookOnlineLink");
    link.href = C.bookingUrl;
  }

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
  const servicesList = document.getElementById("servicesList");
  const serviceSelect = document.getElementById("serviceSelect");
  const emptyOpt = document.createElement("option");
  emptyOpt.value = "";
  emptyOpt.textContent = "Selecione…";
  serviceSelect.append(emptyOpt);

  C.services.forEach((s) => {
    const card = document.createElement("article");
    card.className = "service-card" + (s.highlight ? " service-card--highlight" : "");
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      ${s.highlight ? '<span class="service-badge">Destaque</span>' : ""}
      <h3>${s.name}</h3>
      <p class="service-meta">${s.durationMin} min</p>
      <p class="service-price">${money(s.price)}</p>
      <button type="button" class="service-book">Agendar este serviço</button>
    `;
    card.querySelector(".service-book").addEventListener("click", () => {
      serviceSelect.value = `${s.name} — ${money(s.price)}`;
      document.getElementById("agendar").scrollIntoView({ behavior: "smooth" });
    });
    servicesList.append(card);

    const opt = document.createElement("option");
    opt.value = `${s.name} — ${money(s.price)}`;
    opt.textContent = opt.value;
    serviceSelect.append(opt);
  });

  /* Reviews */
  if (C.reviews?.length) {
    document.getElementById("reviewsBlock").hidden = false;
    const list = document.getElementById("reviewsList");
    C.reviews.forEach((r) => {
      const block = document.createElement("blockquote");
      block.className = "review-card";
      block.innerHTML = `<p>${r.text}</p><footer>— ${r.author}${r.date ? ` · ${r.date}` : ""}</footer>`;
      list.append(block);
    });
  }

  /* Social */
  const social = [];
  if (C.instagram) social.push(`<a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  if (C.facebook) social.push(`<a href="${C.facebook}" target="_blank" rel="noopener">Facebook</a>`);
  if (social.length) {
    const socialEl = document.getElementById("socialLinks");
    socialEl.hidden = false;
    socialEl.innerHTML = social.join(" · ");
  }

  /* Booking form */
  document.getElementById("bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const service = fd.get("service");
    const date = fd.get("date");
    const name = fd.get("name");
    let msg = `Olá! Quero agendar na ${C.name}.\n\nServiço: ${service}`;
    if (date) msg += `\nDia preferido: ${date}`;
    if (name) msg += `\nNome: ${name}`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* Mobile nav */
  const toggle = document.querySelector(".nav-toggle");
  const navMobile = document.getElementById("navMobile");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    navMobile.hidden = open;
  });
  navMobile?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMobile.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();
