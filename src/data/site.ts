export const site = {
  nome: "CCLM Transportes",
  nomeCompleto: "CCLM Transportes – Fretes e Mudanças em Curitiba e Região",
  sigla: "CCLM",
  slogan: "Fretes e mudanças · caminhão HR",
  url: "https://frete-rapido-curitiba.netlify.app",
  titulo: "CCLM Transportes | Fretes e Mudanças em Curitiba e Região | Orçamento no WhatsApp",
  descricao:
    "Fretes e pequenas mudanças em Curitiba e Região Metropolitana com caminhão HR. Atendimento rápido para fretes residenciais, comerciais e cargas leves. Orçamento pelo WhatsApp.",
  whatsapp: "5541995445675",
  telefone: "+55 41 99544-5675",
  telefoneVisivel: "(41) 99544-5675",
  regiao: "Curitiba - PR · Região Metropolitana",
};

export const avaliacao = {
  nota: "5,0",
  total: 15,
  link: "https://www.google.com/search?q=CCLM+Transportes+%E2%80%93+Fretes+e+Mudan%C3%A7as+em+Curitiba+e+Regi%C3%A3o",
};

export const horarios = [
  { dias: "Segunda a sábado", horas: "07h às 19h", abre: "07:00", fecha: "19:00", schema: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { dias: "Domingo", horas: "09h às 14h", abre: "09:00", fecha: "14:00", schema: ["Sunday"] },
];

export const abertura = {
  selo: "Curitiba e Região Metropolitana",
  titulo: "Fretes em Curitiba e Região",
  destaque: "com segurança e pontualidade.",
  texto: "Caminhão HR para fretes rápidos, pequenas mudanças e transporte comercial. Orçamento em minutos pelo WhatsApp.",
};

export const selos = ["Pontualidade", "Cuidado com itens", "Preço justo"];

export type Icone = "casa" | "raio" | "caixa";

export const servicos: { titulo: string; texto: string; icone: Icone }[] = [
  { titulo: "Mudanças", texto: "Pequenas mudanças com cuidado e organização, para apartamentos e casas.", icone: "casa" },
  { titulo: "Cargas rápidas", texto: "Retirou, levou. Entrega ágil e pontual para urgências e rotas curtas.", icone: "raio" },
  { titulo: "Fretes comerciais", texto: "Coletas e entregas para lojas e empresas: caixas, materiais e estoque.", icone: "caixa" },
];

export const cidades = ["Curitiba", "São José dos Pinhais", "Pinhais", "Araucária"];

export const bairros = ["Cajuru", "Capão da Imbuia", "Tarumã", "Batel", "CIC", "Santa Felicidade", "Água Verde", "Centro"];

export const tiposServico = ["Pequena mudança", "Frete residencial", "Frete comercial", "Carga rápida / Entrega"];

export const dicas = [
  { titulo: "Origem e destino", texto: "bairro ou cidade" },
  { titulo: "O que vai levar", texto: "sofá, geladeira, caixas" },
  { titulo: "Data e horário", texto: "avise se for urgente" },
  { titulo: "Acesso", texto: "escadas, elevador, portaria" },
];
