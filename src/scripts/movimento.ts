import { animate, inView } from "motion";
import { linkWhatsApp, mensagemPedido } from "../lib/whatsapp";
import { iniciarShader } from "./shader";

const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const toque = window.matchMedia("(hover: none)").matches;
const SUAVE = [0.22, 1, 0.36, 1] as const;

function revelar() {
  const elementos = document.querySelectorAll<HTMLElement>("[data-revelar]");
  if (reduzir) {
    elementos.forEach((el) => (el.style.opacity = "1"));
    return;
  }
  inView(
    elementos,
    (el) => {
      animate(
        el,
        { opacity: [0, 1], y: [28, 0], filter: ["blur(8px)", "blur(0px)"] },
        { duration: 0.9, delay: Number((el as HTMLElement).dataset.atraso ?? 0), ease: SUAVE },
      );
    },
    { margin: "0px 0px -12% 0px" },
  );
}

function caminhao() {
  const el = document.querySelector<HTMLElement>("[data-caminhao]");
  if (!el) return;
  if (reduzir) {
    el.style.opacity = "1";
    return;
  }
  animate(el, { opacity: [0, 1], x: ["-75vw", "0vw"] }, { duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] });
}

function inclinarCartoes() {
  if (reduzir || toque) return;
  document.querySelectorAll<HTMLElement>("[data-cartao]").forEach((cartao) => {
    let quadro = 0;
    cartao.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const caixa = cartao.getBoundingClientRect();
        const x = (e.clientX - caixa.left) / caixa.width;
        const y = (e.clientY - caixa.top) / caixa.height;
        cartao.dataset.ativo = "";
        cartao.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
        cartao.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
        cartao.style.setProperty("--mx", `${x * 100}%`);
        cartao.style.setProperty("--my", `${y * 100}%`);
      });
    });
    cartao.addEventListener("pointerleave", () => {
      cancelAnimationFrame(quadro);
      delete cartao.dataset.ativo;
      cartao.style.setProperty("--rx", "0deg");
      cartao.style.setProperty("--ry", "0deg");
    });
  });
}

function botaoFixo() {
  const botao = document.querySelector<HTMLElement>("[data-botao-fixo]");
  const abertura = document.querySelector<HTMLElement>("section");
  const orcamento = document.querySelector<HTMLElement>("#orcamento");
  if (!botao || !abertura || !orcamento) return;
  const estado = { naAbertura: true, noOrcamento: false };
  const atualizar = () => {
    if (!estado.naAbertura && !estado.noOrcamento) botao.dataset.visivel = "";
    else delete botao.dataset.visivel;
  };
  new IntersectionObserver(([e]) => {
    estado.naAbertura = e.isIntersecting;
    atualizar();
  }).observe(abertura);
  new IntersectionObserver(([e]) => {
    estado.noOrcamento = e.isIntersecting;
    atualizar();
  }).observe(orcamento);
}

function formulario() {
  const form = document.querySelector<HTMLFormElement>("[data-formulario]");
  const erro = form?.querySelector<HTMLElement>("[data-erro]");
  if (!form || !erro) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = new FormData(form);
    const valor = (campo: string) => String(dados.get(campo) ?? "").trim();
    const pedido = { nome: valor("nome"), tipo: valor("tipo"), origem: valor("origem"), destino: valor("destino"), detalhes: valor("detalhes") };
    if (!pedido.nome || !pedido.tipo || !pedido.origem || !pedido.destino) {
      erro.classList.remove("hidden");
      if (!reduzir) animate(form, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
      return;
    }
    erro.classList.add("hidden");
    window.location.href = linkWhatsApp(mensagemPedido(pedido));
  });
}

function mapa() {
  if (!reduzir) return;
  document.querySelectorAll<SVGSVGElement>("[data-mapa]").forEach((svg) => svg.pauseAnimations());
}

function ano() {
  document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
}

const canvas = document.querySelector<HTMLCanvasElement>("[data-shader]");
if (canvas) iniciarShader(canvas);
revelar();
caminhao();
inclinarCartoes();
botaoFixo();
formulario();
mapa();
ano();
