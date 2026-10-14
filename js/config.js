/**
 * ═══════════════════════════════════════════════════════════════
 *  CONFIGURAÇÃO DA BARBEARIA — edite só este arquivo
 * ═══════════════════════════════════════════════════════════════
 *  Troque nome, telefone, endereço, serviços e textos.
 *  Fotos: coloque em /img/ e preencha heroImage (ex: "img/fachada.jpg").
 *  Avaliações: só coloque depoimentos REAIS (nome + texto).
 * ═══════════════════════════════════════════════════════════════
 */
window.BARBEARIA = {
  name: "Barberia Do Alemão",
  initials: "BA",
  cityLabel: "Ribeirão do Pinhal · PR",

  tagline: "Corte, barba e acabamento com horário marcado.",
  about:
    "Barbearia em Ribeirão do Pinhal. Atendimento por agendamento para respeitar seu tempo na cadeira. Valores abaixo são os praticados na unidade — confirme disponibilidade pelo WhatsApp.",

  phoneDisplay: "(43) 99614-7594",
  phoneWhatsApp: "5543996147594",

  address: {
    line1: "Avenida Silveira Pinto, 1111",
    line2: "Ribeirão do Pinhal — PR",
    cep: "86490-000",
  },

  /** Link de agendamento online (Trimmar, Fresha, etc.) — deixe "" se não usar */
  bookingUrl: "https://trimmar.com.br/p/barberia-do-alemao",

  /** Caminho local da foto da barbearia — deixe "" para fundo só com cor */
  heroImage: "",

  /** Horário — ajuste conforme a loja; remova itens se não quiser a seção */
  hours: [
    { days: "Terça a sexta", time: "Consulte pelo WhatsApp" },
    { days: "Sábado", time: "Consulte pelo WhatsApp" },
    { days: "Domingo e segunda", time: "Consulte disponibilidade" },
  ],

  services: [
    { name: "Corte", durationMin: 30, price: 30, highlight: false },
    { name: "Barba", durationMin: 20, price: 20, highlight: false },
    { name: "Sobrancelha", durationMin: 5, price: 10, highlight: false },
    { name: "Pézinho", durationMin: 5, price: 10, highlight: false },
    { name: "Corte navalhado", durationMin: 40, price: 35, highlight: false },
    { name: "Corte e barba", durationMin: 60, price: 50, highlight: true },
    {
      name: "Corte, barba e sobrancelha",
      durationMin: 60,
      price: 50,
      highlight: false,
    },
  ],

  /** Depoimentos reais — deixe [] se ainda não tiver */
  reviews: [],

  instagram: "",
  facebook: "",
};
