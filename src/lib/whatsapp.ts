import { site } from "../data/site";

export type Pedido = {
  nome: string;
  tipo: string;
  origem: string;
  destino: string;
  detalhes: string;
};

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemPadrao() {
  return [
    "Olá! Quero um orçamento de frete/mudança em Curitiba e região.",
    "• Tipo: (frete / mudança / comercial)",
    "• Origem:",
    "• Destino:",
    "• Itens:",
    "• Data/Horário:",
  ].join("\n");
}

export function mensagemPedido(pedido: Pedido) {
  const linhas = [
    `Olá! Me chamo ${pedido.nome} e gostaria de um orçamento.`,
    `• Tipo: ${pedido.tipo}`,
    `• Origem: ${pedido.origem}`,
    `• Destino: ${pedido.destino}`,
  ];
  if (pedido.detalhes) linhas.push(`• Detalhes: ${pedido.detalhes}`);
  linhas.push("\nPode me informar o valor e disponibilidade? Obrigado!");
  return linhas.join("\n");
}
