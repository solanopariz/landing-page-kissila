/* ============================================================
   Paula Kissila Camata — script.js
   Personalize os valores abaixo. Tudo o que precisa de edição
   está concentrado em CONFIG.
   ============================================================ */

const CONFIG = {
  // WhatsApp no formato internacional, somente dígitos: 55 + DDD + número
  whatsapp: "5527996197221",
  // Texto exibido no site para o número
  whatsappDisplay: "(27) 99619-7221",
  // E-mail de contato
  email: "kissilacamata.adv@outlook.com",
  // OAB
  oab: "OAB/ES 41.509",
  // Horário de atendimento
  horario: "Seg a Sex · 9h às 18h",
  // Mensagem pré-preenchida no WhatsApp
  whatsappMsg: "Olá, Dra. Paula. Vim pelo site e gostaria de agendar um atendimento."
};

/* ============================================================
   Helpers
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function buildWhatsAppUrl(message = CONFIG.whatsappMsg) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* ============================================================
   Inject CONFIG values
   ============================================================ */
function applyConfig() {
  // OAB
  $$("[data-oab]").forEach(el => (el.textContent = CONFIG.oab));
  // Endereço
  $$("[data-endereco]").forEach(el => (el.textContent = CONFIG.endereco));
  // Horário
  $$("[data-horario]").forEach(el => (el.textContent = CONFIG.horario));
  // E-mail
  $$("[data-email]").forEach(el => (el.textContent = CONFIG.email));
  $$("[data-email-link]").forEach(el => (el.href = `mailto:${CONFIG.email}`));
  // WhatsApp display + links
  $$("[data-whatsapp-display]").forEach(el => (el.textContent = CONFIG.whatsappDisplay));
  $$("[data-whatsapp-link]").forEach(el => {
    el.href = buildWhatsAppUrl();
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
}

/* ============================================================
   Mobile nav toggle
   ============================================================ */
function setupNav() {
  const nav = $(".nav");
  const toggle = $(".nav-toggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  // Fechar ao clicar num link
  $$(".nav-list a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============================================================
   Phone mask — formato BR
   ============================================================ */
function setupPhoneMask() {
  const input = $("#f-telefone");
  if (!input) return;
  input.addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else if (v.length > 0) {
      v = v.replace(/^(\d{0,2}).*/, "($1");
    }
    e.target.value = v;
  });
}

/* ============================================================
   Form submit (Web3Forms) + fallback WhatsApp
   ============================================================ */
function setupForm() {
  const form = $("#contact-form");
  if (!form) return;
  const feedback = $(".form-feedback", form);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    feedback.className = "form-feedback";
    feedback.textContent = "";

    // Validação simples
    if (!form.checkValidity()) {
      feedback.classList.add("is-error");
      feedback.textContent = "Por favor, preencha os campos obrigatórios.";
      form.reportValidity();
      return;
    }

    const accessKey = form.querySelector('[name="access_key"]').value.trim();
    // Só consideramos a chave válida se tiver o formato UUID do Web3Forms.
    // Enquanto o placeholder não for substituído, o envio cai no WhatsApp.
    const keyConfigured = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(accessKey);

    // Sem chave configurada → fallback para WhatsApp
    if (!keyConfigured) {
      const data = new FormData(form);
      const msg =
        `Olá, Dra. Paula. Vim pelo site.%0A%0A` +
        `*Nome:* ${data.get("nome")}%0A` +
        `*E-mail:* ${data.get("email")}%0A` +
        `*Telefone:* ${data.get("telefone") || "—"}%0A` +
        `*Área:* ${data.get("area")}%0A%0A` +
        `${data.get("mensagem")}`;
      const url = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
      window.open(url, "_blank", "noopener");
      feedback.classList.add("is-success");
      feedback.textContent = "Abrindo WhatsApp para envio da sua mensagem…";
      return;
    }

    // Envio Web3Forms
    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      const json = await res.json();
      if (json.success) {
        form.reset();
        feedback.classList.add("is-success");
        feedback.textContent = "Mensagem enviada. Retorno em até 1 dia útil.";
      } else {
        throw new Error(json.message || "Falha no envio");
      }
    } catch (err) {
      feedback.classList.add("is-error");
      feedback.textContent =
        "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
    }
  });
}

/* ============================================================
   Reveal-on-scroll
   ============================================================ */
function setupReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

  els.forEach(el => io.observe(el));
}

/* ============================================================
   Year in footer
   ============================================================ */
function setupYear() {
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setupNav();
  setupPhoneMask();
  setupForm();
  setupReveal();
  setupYear();
});
