export type News = {
  slug: string;
  imageSrc: string;
  tag: string;
  date: string;
  title: string;
  bodyText: string;
  cta: string;
};

export const latestNews: News[] = [
  {
    slug: "nova-legislacao-representantes-farmaceuticos",
    imageSrc: "/industry-notice.jpg",
    tag: "Notícias da indústria",
    date: "15 de Maio, 2025",
    title: "Nova legislação afeta representantes de vendas farmacêuticas",
    bodyText:
      "Mudanças legislativas recentes afetarão como os representantes de vendas farmacêuticas interagem com os prestadores de serviços de saúde. Nosso motivo é trabalhar duro para que essas mudanças aconteçam",
    cta: "Saiba mais",
  },
  {
    slug: "conferencia-anual-uniao-setembro",
    imageSrc: "/union-meeting.jpg",
    tag: "notícias da União",
    date: "10 de Maio, 2025",
    title: "Conferência Anual da União agendada para setembro",
    bodyText:
      "Marque seus calendários para nossa conferência anual, apresentando palestrantes, oficinas e oportunidades de networking para todos os membros.",
    cta: "Saiba mais",
  },
  {
    slug: "historia-sucesso-jane-smith-recordes-vendas",
    imageSrc: "/member-sale.jpg",
    tag: "Membro Spotlight",
    date: "5 de Maio, 2025",
    title: "História de sucesso de um membro - quebrando recorde de vendas",
    bodyText:
      "Leia sobre como Jane Smith, membro da União, utilizou nosso Recursos para alcançar números de vendas recorde em ela território.",
    cta: "Saiba mais",
  },
  {
    slug: "transformacao-digital-vendas-farmaceuticas",
    imageSrc: "/marketing-digital.jpg",
    tag: "Notícias da indústria",
    date: "1 de Maio, 2025",
    title: "Transformação digital em vendas farmacêuticas",
    bodyText:
      "Explore como ferramentas digitais podem mudar o mercado de vendas farmacêuticas e como podemos nos adaptar",
    cta: "Saiba mais",
  },
];
