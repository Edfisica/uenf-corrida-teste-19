const zonas = [
  { zona: "Z1", percentual: 60 },
  { zona: "Z1", percentual: 65 },
  { zona: "Z2", percentual: 70 },
  { zona: "Z2", percentual: 75 },
  { zona: "Z3", percentual: 80 },
  { zona: "Z3", percentual: 85 },
  { zona: "Z4", percentual: 90 },
  { zona: "Z4", percentual: 95 },
  { zona: "Z4", percentual: 100 }
];

document.getElementById("btnCalcular").addEventListener("click", calcular);

function calcular() {
  const metodo = document.querySelector('input[name="metodoVo2"]:checked')?.value || "cooper";
  const nome = document.getElementById("nome").value.trim();
  const erro = document.getElementById("erro");
  erro.hidden = true;

  let vo2;
  let idade = 0;
  let sexo = "";

  if (metodo === "direto") {
    idade = Number(document.getElementById("idade").value);
    sexo = document.getElementById("sexo").value;
    vo2 = Number(document.getElementById("vo2Direto").value);

    if (!idade || !sexo || !vo2) {
      erro.textContent = "Para classificar seu VO₂máx, informe nome, idade, sexo e VO₂máx.";
      erro.hidden = false;
      return;
    }

    if (vo2 < 10 || vo2 > 100) {
      erro.textContent = "Informe um VO₂máx entre 10 e 100 ml/kg/min.";
      erro.hidden = false;
      return;
    }
  } else {
    idade = Number(document.getElementById("idade").value);
    sexo = document.getElementById("sexo").value;
    const peso = Number(document.getElementById("peso").value);
    const distancia = Number(document.getElementById("distancia").value);

    if (!nome || !idade || !sexo || !peso || !distancia) {
      erro.textContent = "Preencha nome, idade, sexo, peso e distância do teste.";
      erro.hidden = false;
      return;
    }

    vo2 = (distancia - 504.9) / 44.73;

    if (vo2 <= 0) {
      erro.textContent = "A distância informada não produz um VO₂máx válido.";
      erro.hidden = false;
      return;
    }
  }

  window.vo2Base = vo2;
  salvarPerfilAtual();

  document.getElementById("saudacao").textContent =
    nome ? `${nome}, seu resultado` : "Seu resultado";

  document.getElementById("vo2Valor").textContent =
    vo2.toFixed(1).replace(".", ",");

  document.getElementById("classificacao").textContent =
    classificarVo2(vo2, idade, sexo);

  document.getElementById("origemVo2").textContent =
    metodo === "direto" ? "VO₂máx informado" : "Teste de Cooper";

  preencherZonas(vo2);

  const referencia = calcularPace(vo2, 0.75);
  document.getElementById("velocidadeReferencia").textContent =
    `${referencia.kmh.toFixed(1).replace(".", ",")} km/h`;

  document.getElementById("paceReferencia").textContent =
    `${referencia.pace} min/km`;

  document.getElementById("resultado").hidden = false;
  document.getElementById("resultado").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function calcularPace(vo2Max, percentual) {
  const vo2Treino = vo2Max * percentual;
  const velocidade = (vo2Treino - 3.5) / 0.2;
  const kmh = velocidade * 0.06;

  if (kmh <= 0) {
    return { kmh: 0, pace: "--:--" };
  }

  const paceMinutos = 60 / kmh;
  const minutos = Math.floor(paceMinutos);
  const segundos = Math.floor((paceMinutos - minutos) * 60);

  return {
    kmh,
    pace: `${minutos}:${String(segundos).padStart(2, "0")}`
  };
}

function preencherZonas(vo2Max) {
  const tabela = document.getElementById("tabelaZonas");
  tabela.innerHTML = "";

  zonas.forEach(item => {
    const resultado = calcularPace(vo2Max, item.percentual / 100);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><strong>${item.zona}</strong></td>
      <td>${item.percentual}%</td>
      <td>${resultado.pace} min/km</td>
      <td>${resultado.kmh.toFixed(1).replace(".", ",")} km/h</td>
    `;

    tabela.appendChild(tr);
  });
}

function classificarVo2(vo2, idade, sexo) {
  // Critérios mantidos conforme a estrutura existente no aplicativo.
  if (sexo === "masculino") {
    if (idade <= 29) {
      if (vo2 >= 55) return "Excelente";
      if (vo2 >= 48) return "Muito bom";
      if (vo2 >= 43) return "Bom";
      if (vo2 >= 38) return "Regular";
      return "Abaixo da média";
    }

    if (idade <= 39) {
      if (vo2 >= 52) return "Excelente";
      if (vo2 >= 45) return "Muito bom";
      if (vo2 >= 40) return "Bom";
      if (vo2 >= 35) return "Regular";
      return "Abaixo da média";
    }

    if (idade <= 49) {
      if (vo2 >= 49) return "Excelente";
      if (vo2 >= 42) return "Muito bom";
      if (vo2 >= 37) return "Bom";
      if (vo2 >= 32) return "Regular";
      return "Abaixo da média";
    }

    if (idade <= 59) {
      if (vo2 >= 45) return "Excelente";
      if (vo2 >= 39) return "Muito bom";
      if (vo2 >= 34) return "Bom";
      if (vo2 >= 29) return "Regular";
      return "Abaixo da média";
    }

    if (vo2 >= 42) return "Excelente";
    if (vo2 >= 36) return "Muito bom";
    if (vo2 >= 31) return "Bom";
    if (vo2 >= 26) return "Regular";
    return "Abaixo da média";
  }

  if (sexo === "feminino") {
    if (idade <= 29) {
      if (vo2 >= 49) return "Excelente";
      if (vo2 >= 43) return "Muito bom";
      if (vo2 >= 38) return "Bom";
      if (vo2 >= 33) return "Regular";
      return "Abaixo da média";
    }

    if (idade <= 39) {
      if (vo2 >= 45) return "Excelente";
      if (vo2 >= 39) return "Muito bom";
      if (vo2 >= 34) return "Bom";
      if (vo2 >= 29) return "Regular";
      return "Abaixo da média";
    }

    if (idade <= 49) {
      if (vo2 >= 42) return "Excelente";
      if (vo2 >= 36) return "Muito bom";
      if (vo2 >= 31) return "Bom";
      if (vo2 >= 27) return "Regular";
      return "Abaixo da média";
    }

    if (idade <= 59) {
      if (vo2 >= 39) return "Excelente";
      if (vo2 >= 33) return "Muito bom";
      if (vo2 >= 28) return "Bom";
      if (vo2 >= 24) return "Regular";
      return "Abaixo da média";
    }

    if (vo2 >= 36) return "Excelente";
    if (vo2 >= 30) return "Muito bom";
    if (vo2 >= 26) return "Bom";
    if (vo2 >= 22) return "Regular";
    return "Abaixo da média";
  }

  return "Não informado";
}


// ============================================================
// MÓDULO DE TREINAMENTOS
// ============================================================

const treinoConfig = {
  "1x1": {
    titulo: "1×1",
    etapas: [
      { nome: "🔥 Aquecimento", intensidade: 0.70, duracao: 600, tipo: "aquecimento" },
      { nome: "⚡ Esforço", intensidade: 1.05, duracao: 60, tipo: "esforco" },
      { nome: "💨 Recuperação", intensidade: 0.75, duracao: 60, tipo: "recuperacao" },
      { nome: "🏁 Volta à calma", intensidade: 0.70, duracao: 300, tipo: "desaquecimento" }
    ],
    repeticoes: 10
  },
  "4x4": {
    titulo: "4×4",
    etapas: [
      { nome: "🔥 Aquecimento", intensidade: 0.70, duracao: 600, tipo: "aquecimento" },
      { nome: "⚡ Esforço", intensidade: 0.90, duracao: 240, tipo: "esforco" },
      { nome: "💨 Recuperação", intensidade: 0.75, duracao: 240, tipo: "recuperacao" },
      { nome: "🏁 Volta à calma", intensidade: 0.70, duracao: 300, tipo: "desaquecimento" }
    ],
    repeticoes: 4
  },
  "fartlek": {
    titulo: "Fartlek",
    etapas: [
      { nome: "🔥 Aquecimento", intensidade: 0.75, duracao: 600, tipo: "aquecimento" },
      { nome: "⚡ 1º Estímulo", intensidade: 1.05, duracao: 60, tipo: "esforco" },
      { nome: "💨 1º Recuperação", intensidade: 0.75, duracao: 60, tipo: "recuperacao" },
      { nome: "⚡ 2º Estímulo", intensidade: 0.95, duracao: 120, tipo: "esforco" },
      { nome: "💨 2º Recuperação", intensidade: 0.75, duracao: 120, tipo: "recuperacao" },
      { nome: "⚡ 3º Estímulo", intensidade: 0.90, duracao: 180, tipo: "esforco" },
      { nome: "💨 3º Recuperação", intensidade: 0.75, duracao: 180, tipo: "recuperacao" },
      { nome: "⚡ 4º Estímulo", intensidade: 0.90, duracao: 240, tipo: "esforco" },
      { nome: "💨 4º Recuperação", intensidade: 0.75, duracao: 240, tipo: "recuperacao" },
      { nome: "🏁 Desaquecimento", intensidade: 0.70, duracao: 300, tipo: "desaquecimento" }
    ]
  },
  "limiar": {
    titulo: "Limiar",
    etapas: [
      { nome: "🏃 Aquecimento", intensidade: 0.70, duracao: 600, tipo: "aquecimento" },
      { nome: "⚡ Limiar", intensidade: 0.85, duracao: 1200, tipo: "esforco" },
      { nome: "🏁 Desaquecimento", intensidade: 0.70, duracao: 300, tipo: "desaquecimento" }
    ]
  },
  "continuo": {
    titulo: "Contínuo",
    etapas: [
      { nome: "🏃 Treino Contínuo", intensidade: 0.75, duracao: 1800, tipo: "continuo" }
    ]
  }
};

let treinoAtual = null;
let treinoEtapas = [];
let treinoIndice = 0;
let treinoRepeticao = 0;
let treinoTimer = null;
let treinoRestante = 0;
let treinoExecutando = false;
let treinoPausado = false;
let treinoInicio = null;
let treinoDeadline = null;
let wakeLock = null;
let treinoAudioContext = null;
let treinoAudioEventos = [];

document.querySelectorAll(".training-btn").forEach(btn => {
  btn.addEventListener("click", () => prepararTreino(btn.dataset.treino));
});

document.getElementById("btnIrTreinos").addEventListener("click", () => {
  document.getElementById("treinamentos").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

document.getElementById("btnIniciarTreino").addEventListener("click", iniciarTreino);
document.getElementById("btnPausarTreino").addEventListener("click", pausarTreino);
document.getElementById("btnEncerrarTreino").addEventListener("click", encerrarTreino);

function obterVo2Atual() {
  const texto = document.getElementById("vo2Valor").textContent;
  return Number(texto.replace(",", "."));
}

function obterQuantidadeEstimulos(tipo) {
  if (tipo !== "1x1" && tipo !== "4x4") return 0;
  const minutosSemana = Number(document.getElementById("minutosSemana")?.value);
  if (!Number.isFinite(minutosSemana) || minutosSemana <= 0) return 0;
  const duracaoEstimulo = tipo === "1x1" ? 1 : 4;
  return Math.max(1, Math.round((minutosSemana * 0.10) / duracaoEstimulo));
}

function prepararTreino(tipo) {
  const vo2 = obterVo2Atual();

  if (!vo2) {
    alert("Calcule seu VO₂máx primeiro.");
    return;
  }

  pararTimerTreino();
  cancelarAvisosAudio();

  treinoAtual = treinoConfig[tipo];
  // O cronômetro usa a mesma quantidade calculada para o volume semanal.
  if (tipo === "1x1" || tipo === "4x4") {
    treinoAtual = { ...treinoAtual, repeticoes: obterQuantidadeEstimulos(tipo) };
  }
  treinoIndice = 0;
  treinoRepeticao = 0;
  treinoExecutando = false;
  treinoPausado = false;
  treinoInicio = null;

  treinoEtapas = criarEtapasDoTreino(treinoAtual);
  treinoRestante = treinoEtapas[0].duracao;

  document.getElementById("treinoPainel").hidden = false;
  atualizarTempoTotalTreino();
  document.getElementById("treinoTitulo").textContent = `TREINO ${treinoAtual.titulo}`;
  mostrarDescricaoTreino(tipo);
  atualizarTreinoTela();

  document.getElementById("treinoPainel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function criarEtapasDoTreino(config) {
  if (!config.repeticoes) return [...config.etapas];

  const aquecimento = config.etapas[0];
  const esforco = config.etapas[1];
  const recuperacao = config.etapas[2];
  const desaquecimento = config.etapas[3];

  const resultado = [aquecimento];

  for (let i = 1; i <= config.repeticoes; i++) {
    resultado.push({
      ...esforco,
      nome: `⚡ Esforço ${i}`
    });

    if (i < config.repeticoes) {
      resultado.push({
        ...recuperacao,
        nome: `💨 Recuperação ${i}`
      });
    }
  }

  // Os intervalados terminam sempre com 5 min de volta à calma.
  if (desaquecimento) resultado.push({ ...desaquecimento });

  return resultado;
}

function iniciarTreino() {
  if (!treinoAtual) return;

  if (!treinoExecutando) {
    prepararAudioTreino();
    treinoExecutando = true;
    treinoPausado = false;
    treinoInicio = treinoInicio || Date.now();
    treinoDeadline = Date.now() + treinoRestante * 1000;
    agendarAvisosAudioEtapa();
    iniciarContagemTreino();
    return;
  }

  if (treinoPausado) {
    treinoPausado = false;
    treinoDeadline = Date.now() + treinoRestante * 1000;
    agendarAvisosAudioEtapa();
    iniciarContagemTreino();
  }
}

function pausarTreino() {
  if (!treinoExecutando) return;

  treinoPausado = true;
  treinoRestante = Math.max(0, Math.ceil((treinoDeadline - Date.now()) / 1000));
  cancelarAvisosAudio();
  pararTimerTreino();
  document.getElementById("treinoStatus").textContent = "Treino pausado.";
}

function encerrarTreino() {
  pararTimerTreino();
  treinoExecutando = false;
  treinoPausado = false;
  treinoInicio = null;
  treinoAtual = null;
  treinoEtapas = [];
  treinoIndice = 0;
  treinoRepeticao = 0;

  document.getElementById("treinoStatus").textContent = "Treino encerrado.";
  document.getElementById("treinoEtapa").textContent = "Preparado";
  document.getElementById("treinoSerie").textContent = "0 / 0";
  document.getElementById("treinoTempo").textContent = "00:00";
  document.getElementById("treinoTempo").className = "training-timer timer-aquecimento";
  document.getElementById("treinoTempoTotal").textContent = "Tempo total: 00:00";
  document.getElementById("treinoIntensidade").textContent = "0%";
  document.getElementById("treinoVelocidade").textContent = "0,0 km/h";
  document.getElementById("treinoPace").textContent = "0:00 min/km";
  const descricao = document.getElementById("treinoDescricao");
  if (descricao) descricao.hidden = true;
}

function iniciarContagemTreino() {
  pararTimerTreino();
  atualizarTreinoTempo();

  treinoTimer = setInterval(() => {
    if (treinoPausado || !treinoDeadline) return;
    treinoRestante = Math.max(0, Math.ceil((treinoDeadline - Date.now()) / 1000));
    if (treinoRestante <= 0) avancarEtapa();
    else atualizarTreinoTempo();
  }, 250);
}

function avancarEtapa() {
  treinoIndice++;

  if (treinoIndice >= treinoEtapas.length) {
    finalizarTreino();
    return;
  }

  treinoRestante = treinoEtapas[treinoIndice].duracao;
  treinoDeadline = Date.now() + treinoRestante * 1000;
  agendarAvisosAudioEtapa();
  atualizarTreinoTela();
  atualizarTreinoTempo();
}

function finalizarTreino() {
  pararTimerTreino();
  cancelarAvisosAudio();
  treinoExecutando = false;
  treinoPausado = false;

  const nome = treinoAtual ? treinoAtual.titulo : "Treino";

  document.getElementById("treinoEtapa").textContent = "✅ Treino finalizado";
  document.getElementById("treinoTempo").textContent = "00:00";
  document.getElementById("treinoTempo").className = "training-timer timer-finalizado";
  document.getElementById("treinoStatus").textContent = `${nome} concluído.`;
  emitirSinal();
}

function atualizarTreinoTela() {
  const etapa = treinoEtapas[treinoIndice];
  if (!etapa) return;

  const vo2 = obterVo2Atual();
  const resultado = calcularPace(vo2, etapa.intensidade);

  document.getElementById("treinoEtapa").textContent = etapa.nome;
  aplicarCorCronometro(etapa.tipo);

  const totalRepeticoes = treinoAtual.repeticoes || 0;
  if (totalRepeticoes) {
    const repeticao = etapa.tipo === "aquecimento"
      ? 0
      : Math.min(Math.ceil((treinoIndice) / 2), totalRepeticoes);

    document.getElementById("treinoSerie").textContent =
      `${repeticao} / ${totalRepeticoes}`;
  } else {
    document.getElementById("treinoSerie").textContent = "—";
  }

  document.getElementById("treinoIntensidade").textContent =
    `${Math.round(etapa.intensidade * 100)}%`;

  document.getElementById("treinoVelocidade").textContent =
    `${resultado.kmh.toFixed(1).replace(".", ",")} km/h`;

  document.getElementById("treinoPace").textContent =
    `${resultado.pace} min/km`;

  const minutos = Math.floor(etapa.duracao / 60);
  const segundos = etapa.duracao % 60;
  const duracao = `${minutos}:${String(segundos).padStart(2, "0")}`;

  document.getElementById("treinoStatus").textContent =
    `${duracao} nesta etapa.`;
}

function atualizarTreinoTempo() {
  document.getElementById("treinoTempo").textContent =
    formatarTempoTreino(treinoRestante);
}

function calcularDuracaoTotalTreino() {
  return treinoEtapas.reduce((total, etapa) => total + (etapa.duracao || 0), 0);
}

function atualizarTempoTotalTreino() {
  const total = calcularDuracaoTotalTreino();
  document.getElementById("treinoTempoTotal").textContent =
    `Tempo total: ${formatarTempoTreino(total)}`;
}

function aplicarCorCronometro(tipo) {
  const timer = document.getElementById("treinoTempo");
  timer.classList.remove(
    "timer-aquecimento",
    "timer-esforco",
    "timer-recuperacao",
    "timer-desaquecimento",
    "timer-finalizado",
    "timer-continuo"
  );
  timer.classList.add(`timer-${tipo}`);
}

function formatarTempoTreino(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

function pararTimerTreino() {
  if (treinoTimer) {
    clearInterval(treinoTimer);
    treinoTimer = null;
  }
}

function prepararAudioTreino() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!treinoAudioContext) treinoAudioContext = new AudioContext();
    if (treinoAudioContext.state === "suspended") treinoAudioContext.resume();
    return treinoAudioContext;
  } catch (_) {
    return null;
  }
}

function tocarBuzina(contexto, quando, forte = false) {
  const osc = contexto.createOscillator();
  const ganho = contexto.createGain();
  const agora = quando;

  osc.type = forte ? "sawtooth" : "sine";
  osc.frequency.setValueAtTime(forte ? 220 : 660, agora);
  if (forte) osc.frequency.exponentialRampToValueAtTime(130, agora + 0.45);

  const volume = forte ? 0.16 : 0.045;
  ganho.gain.setValueAtTime(0.0001, agora);
  ganho.gain.exponentialRampToValueAtTime(volume, agora + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + (forte ? 0.55 : 0.12));

  osc.connect(ganho);
  ganho.connect(contexto.destination);
  osc.start(agora);
  osc.stop(agora + (forte ? 0.6 : 0.14));
}

function cancelarAvisosAudio() {
  treinoAudioEventos.forEach(id => clearTimeout(id));
  treinoAudioEventos = [];
}

function treinoUsaAvisoSonoro() {
  if (!treinoAtual) return false;
  return ["1×1", "4×4", "Fartlek"].includes(treinoAtual.titulo);
}

function agendarAvisosAudioEtapa() {
  cancelarAvisosAudio();
  if (!treinoUsaAvisoSonoro()) return;

  const etapa = treinoEtapas[treinoIndice];
  if (!etapa || !["esforco", "recuperacao"].includes(etapa.tipo)) return;

  const contexto = prepararAudioTreino();
  if (!contexto || !treinoDeadline) return;

  const restanteMs = Math.max(0, treinoDeadline - Date.now());
  const inicioAudio = contexto.currentTime + restanteMs / 1000;

  // Três buzinas suaves nos 3 segundos que antecedem a mudança.
  if (restanteMs > 3000) {
    tocarBuzina(contexto, inicioAudio - 3.0, false);
    tocarBuzina(contexto, inicioAudio - 2.6, false);
    tocarBuzina(contexto, inicioAudio - 2.2, false);
  }

  // Buzina forte exatamente no início da próxima etapa.
  tocarBuzina(contexto, inicioAudio, true);
}

function emitirSinal() {
  const contexto = prepararAudioTreino();
  if (contexto) tocarBuzina(contexto, contexto.currentTime, true);
}



// ============================================================
// DESCRIÇÃO ESCRITA DOS TREINAMENTOS
// ============================================================

function obterDescricaoTreino(tipo) {
  const minutosSemana = Number(document.getElementById("minutosSemana").value) || 120;

  if (tipo === "1x1") {
    const qtd = obterQuantidadeEstimulos(tipo) || Math.max(1, Math.round((minutosSemana * 0.10) / 1));
    return `10 min de aquecimento a 70% do VO₂. Depois, ${qtd} estímulos de 1 minuto a 105% do VO₂, com 1 minuto de recuperação a 75% do VO₂ entre os estímulos. Ao final, 5 min de desaquecimento a 70% do VO₂.`;
  }

  if (tipo === "4x4") {
    const qtd = obterQuantidadeEstimulos(tipo) || Math.max(1, Math.round((minutosSemana * 0.10) / 4));
    return `10 min de aquecimento a 70% do VO₂. Depois, ${qtd} estímulos de 4 minutos a 90% do VO₂, com 4 minutos de recuperação a 75% do VO₂ entre os estímulos. Ao final, 5 min de desaquecimento a 70% do VO₂.`;
  }

  if (tipo === "fartlek") {
    return "10 min de aquecimento a 75% do VO₂; 1º estímulo de 1 min a 105%, seguido de 1 min de recuperação a 75%; 2º estímulo de 2 min a 95%, seguido de 2 min de recuperação a 75%; 3º estímulo de 3 min a 90%, seguido de 3 min de recuperação a 75%; 4º estímulo de 4 min a 90%, seguido de 4 min de recuperação a 75%; e 5 min de desaquecimento a 70% do VO₂.";
  }

  if (tipo === "limiar") {
    return "10 min de aquecimento a 70% do VO₂; 20 min de treino no limiar a 85% do VO₂; e 4 min de desaquecimento a 70% do VO₂.";
  }

  if (tipo === "continuo") {
    return "30 min de treino contínuo a 75% do VO₂.";
  }

  return "";
}

function mostrarDescricaoTreino(tipo) {
  let descricao = document.getElementById("treinoDescricao");

  if (!descricao) {
    descricao = document.createElement("div");
    descricao.id = "treinoDescricao";
    descricao.className = "training-description";

    const painel = document.getElementById("treinoPainel");
    painel.parentNode.insertBefore(descricao, painel);
  }

  descricao.innerHTML =
    `<strong>Como será o treino:</strong><br>${obterDescricaoTreino(tipo)}`;
  descricao.hidden = false;
}

// Atualiza a descrição dos intervalados quando o volume semanal muda.
document.getElementById("minutosSemana").addEventListener("input", () => {
  if (!treinoAtual) return;
  mostrarDescricaoTreino(
    Object.keys(treinoConfig).find(
      chave => treinoConfig[chave] === treinoAtual
    )
  );
});

document.getElementById("tipoIntervalado").addEventListener("change", () => {
  const tipo = document.getElementById("tipoIntervalado").value;
  const descricaoTipo = tipo === "1x1" ? "1x1" : "4x4";
  mostrarDescricaoTreino(descricaoTipo);
});

document.getElementById("btnCalcularEstimulos").addEventListener(
  "click",
  calcularEstimulosIntervalado
);

function calcularEstimulosIntervalado() {
  const minutosSemana = Number(document.getElementById("minutosSemana").value);
  const tipo = document.getElementById("tipoIntervalado").value;

  if (!minutosSemana || minutosSemana <= 0) {
    alert("Informe o volume semanal de treinamento em minutos.");
    return;
  }

  const minutosFortes = minutosSemana * 0.10;
  const quantidade = obterQuantidadeEstimulos(tipo);

  document.getElementById("tempoEstimulo").textContent =
    formatarMinutosNumericos(minutosFortes);

  document.getElementById("qtdEstimulos").textContent = quantidade;
  document.getElementById("tempoSemanal").textContent =
    `${minutosSemana} min`;

  const duracaoTexto = tipo === "1x1" ? "1 minuto" : "4 minutos";

  document.getElementById("estimuloObservacao").textContent =
    `${minutosSemana} min × 10% = ${formatarMinutosNumericos(minutosFortes)} ` +
    `de estímulo forte. Com estímulos de ${duracaoTexto}, ` +
    `a recomendação aproximada é de ${quantidade} estímulo(s).`;

  document.getElementById("estimuloResultado").hidden = false;

  if (treinoAtual && (tipo === "1x1" || tipo === "4x4") &&
      treinoAtual.titulo === treinoConfig[tipo].titulo && !treinoExecutando) {
    treinoAtual = { ...treinoConfig[tipo], repeticoes: quantidade };
    treinoEtapas = criarEtapasDoTreino(treinoAtual);
    treinoIndice = 0;
    treinoRestante = treinoEtapas[0].duracao;
    atualizarTreinoTela();
    mostrarDescricaoTreino(tipo);
  }
}

function formatarMinutosNumericos(minutos) {
  const arredondado = Math.round(minutos * 10) / 10;

  if (Number.isInteger(arredondado)) {
    return `${arredondado} min`;
  }

  return `${arredondado.toFixed(1).replace(".", ",")} min`;
}


function atualizarMetodoVo2() {
  const metodo = document.querySelector('input[name="metodoVo2"]:checked')?.value || "cooper";
  const cooper = document.getElementById("dadosCooper");
  const direto = document.getElementById("dadosVo2Direto");
  const distancia = document.getElementById("distancia");
  const peso = document.getElementById("peso");

  const ehDireto = metodo === "direto";
  const labelPeso = document.getElementById("peso").closest("label");
  const labelDistancia = document.getElementById("distancia").closest("label");
  labelPeso.hidden = false;
  labelDistancia.hidden = ehDireto;
  direto.classList.toggle("hidden", !ehDireto);
  distancia.required = !ehDireto;
  peso.required = false;
}

document.querySelectorAll('input[name="metodoVo2"]').forEach(radio => {
  radio.addEventListener("change", atualizarMetodoVo2);
});
atualizarMetodoVo2();

// ============================================================
// DADOS DO USUÁRIO - persistência local
// ============================================================
const CHAVE_PERFIL = "uenf_corrida_perfil";

function obterPerfilAtual() {
  const nome = document.getElementById("nome")?.value.trim() || "";
  const idade = Number(document.getElementById("idade")?.value || 0);
  const sexo = document.getElementById("sexo")?.value || "";
  const peso = Number(document.getElementById("peso")?.value || 0);
  const vo2Direto = Number(document.getElementById("vo2Direto")?.value || 0);
  const vo2 = Number(window.vo2Base || vo2Direto || 0);
  const origem = document.getElementById("origemVo2")?.textContent || "";
  return { nome, idade, sexo, peso, vo2, origem };
}

function salvarPerfilAtual() {
  const p = obterPerfilAtual();
  if (p.nome || p.idade || p.sexo || p.peso || p.vo2) {
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(p));
  }
  atualizarPerfilAcompanhamento();
}

function atualizarPerfilAcompanhamento() {
  let p = {};
  try { p = JSON.parse(localStorage.getItem(CHAVE_PERFIL) || "{}"); } catch (_) {}
  const valores = {
    acompNome: p.nome || "--",
    acompIdade: p.idade ? `${p.idade} anos` : "--",
    acompSexo: p.sexo === "masculino" ? "Masculino" : p.sexo === "feminino" ? "Feminino" : "--",
    acompPeso: p.peso ? `${p.peso} kg` : "--",
    acompVo2: p.vo2 ? `${Number(p.vo2).toFixed(1).replace(".", ",")} ml/kg/min` : "--",
    acompOrigem: p.origem || "--"
  };
  Object.entries(valores).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  });
}

function limparDadosUsuario() {
  if (!confirm("Deseja realmente limpar os dados do usuário? O histórico de treinos e avaliações não será apagado.")) return;
  localStorage.removeItem(CHAVE_PERFIL);
  ["nome", "idade", "peso", "vo2Direto"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const sexo = document.getElementById("sexo");
  if (sexo) sexo.value = "";
  window.vo2Base = null;
  const resultado = document.getElementById("resultado");
  if (resultado) resultado.hidden = true;
  atualizarPerfilAcompanhamento();
}

// ============================================================
// MÓDULO DE ACOMPANHAMENTO - v10
// ============================================================

const CHAVE_TREINOS = "uenf_corrida_treinos_v10";
const CHAVE_AVALIACOES = "uenf_corrida_avaliacoes_v10";

function carregarDadosAcompanhamento(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave) || "[]");
  } catch (_) {
    return [];
  }
}

function salvarDadosAcompanhamento(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function dataHojeISO() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
  if (!data) return "--";
  const partes = data.split("-");
  if (partes.length !== 3) return data;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function escapeHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatarPaceRegistro(valor) {
  const texto = String(valor || "").trim().replace(",", ".");
  if (!texto) return "--";
  if (/^\d{1,2}:\d{2}$/.test(texto)) return texto;
  const numero = Number(texto);
  if (!Number.isFinite(numero) || numero <= 0) return "--";
  const minutos = Math.floor(numero);
  const segundos = Math.round((numero - minutos) * 60);
  return `${minutos}:${String(segundos).padStart(2, "0")}`;
}

function restaurarPerfilSalvo() {
  let p = {};
  try {
    p = JSON.parse(localStorage.getItem(CHAVE_PERFIL) || "{}");
  } catch (_) {
    p = {};
  }

  if (!p || !p.vo2) return;

  const nome = document.getElementById("nome");
  const idade = document.getElementById("idade");
  const sexo = document.getElementById("sexo");
  const peso = document.getElementById("peso");
  const vo2Direto = document.getElementById("vo2Direto");

  if (nome) nome.value = p.nome || "";
  if (idade && p.idade) idade.value = p.idade;
  if (sexo) sexo.value = p.sexo || "";
  if (peso && p.peso) peso.value = p.peso;

  // Restaura também o método usado para obter o VO₂máx.
  const radioDireto = document.querySelector('input[name="metodoVo2"][value="direto"]');
  const radioCooper = document.querySelector('input[name="metodoVo2"][value="cooper"]');

  if ((p.origem || "").toLowerCase().includes("informado")) {
    if (radioDireto) radioDireto.checked = true;
    if (vo2Direto) vo2Direto.value = p.vo2;
  } else {
    if (radioCooper) radioCooper.checked = true;
  }

  atualizarMetodoVo2();

  // O VO₂ salvo passa a estar disponível imediatamente para os treinos,
  // sem exigir novo cálculo.
  window.vo2Base = Number(p.vo2);

  // Reconstrói o resultado visual já calculado.
  const vo2 = Number(p.vo2);
  if (vo2 > 0) {
    document.getElementById("saudacao").textContent =
      p.nome ? `${p.nome}, seu resultado` : "Seu resultado";
    document.getElementById("vo2Valor").textContent =
      vo2.toFixed(1).replace(".", ",");
    document.getElementById("classificacao").textContent =
      classificarVo2(vo2, Number(p.idade || 0), p.sexo || "");
    document.getElementById("origemVo2").textContent =
      p.origem || "VO₂máx salvo";
    preencherZonas(vo2);

    const referencia = calcularPace(vo2, 0.75);
    document.getElementById("velocidadeReferencia").textContent =
      `${referencia.kmh.toFixed(1).replace(".", ",")} km/h`;
    document.getElementById("paceReferencia").textContent =
      `${referencia.pace} min/km`;

    document.getElementById("resultado").hidden = false;
  }
}

function inicializarAcompanhamento() {
  restaurarPerfilSalvo();
  atualizarPerfilAcompanhamento();
  const dataHoje = dataHojeISO();
  document.getElementById("registroData").value = dataHoje;
  document.getElementById("avaliacaoData").value = dataHoje;
  atualizarAcompanhamento();
}

function calcularDuracaoTreinoRegistro(tipo) {
  // Para 1×1 e 4×4, a quantidade de estímulos segue a regra já usada no app:
  // 10% do volume semanal, em minutos, dividido pela duração do estímulo.
  const minutosSemana = Number(document.getElementById("minutosSemana")?.value) || 120;

  if (tipo === "1x1") {
    const qtd = obterQuantidadeEstimulos(tipo) || Math.max(1, Math.round((minutosSemana * 0.10) / 1));
    return 10 + (qtd * 1) + ((qtd - 1) * 1) + 5;
  }

  if (tipo === "4x4") {
    const qtd = obterQuantidadeEstimulos(tipo) || Math.max(1, Math.round((minutosSemana * 0.10) / 4));
    return 10 + (qtd * 4) + ((qtd - 1) * 4) + 5;
  }

  if (tipo === "fartlek") return 35;
  if (tipo === "limiar") return 34;
  if (tipo === "continuo") return 30;

  return 0;
}

function atualizarDuracaoRegistro() {
  const tipo = document.getElementById("registroTipo")?.value;
  const campo = document.getElementById("registroDuracao");
  if (!campo) return;

  const duracao = calcularDuracaoTreinoRegistro(tipo);
  campo.value = duracao ? `${duracao} min` : "";
}

function registrarTreino() {
  const data = document.getElementById("registroData").value || dataHojeISO();
  const tipo = document.getElementById("registroTipo").value;
  const duracao = calcularDuracaoTreinoRegistro(tipo);

  if (!data || !tipo || !duracao) {
    alert("Informe a data e o tipo de treino.");
    return;
  }

  const treinos = carregarDadosAcompanhamento(CHAVE_TREINOS);
  treinos.push({
    id: Date.now(),
    data,
    tipo,
    duracao,
    intensidade: 0,
    pace: "--",
    observacao: ""
  });
  salvarDadosAcompanhamento(CHAVE_TREINOS, treinos);

  const mensagem = document.getElementById("registroMensagem");
  mensagem.textContent = `Treino registrado com sucesso. Duração: ${duracao} min.`;
  mensagem.hidden = false;
  setTimeout(() => { mensagem.hidden = true; }, 3500);

  atualizarDuracaoRegistro();
  atualizarAcompanhamento();
}
function registrarAvaliacao() {
  const data = document.getElementById("avaliacaoData").value || dataHojeISO();
  const vo2 = Number(document.getElementById("avaliacaoVo2").value);

  if (!data || !vo2 || vo2 < 10 || vo2 > 100) {
    alert("Informe uma data e um VO₂máx entre 10 e 100 ml/kg/min.");
    return;
  }

  const idade = Number(document.getElementById("idade").value) || 0;
  const sexo = document.getElementById("sexo").value || "";
  const classificacao = idade && sexo ? classificarVo2(vo2, idade, sexo) : "Não classificado";
  const avaliacoes = carregarDadosAcompanhamento(CHAVE_AVALIACOES);

  avaliacoes.push({
    id: Date.now(),
    data,
    vo2,
    classificacao,
    origem: "Registro manual"
  });

  salvarDadosAcompanhamento(CHAVE_AVALIACOES, avaliacoes);

  document.getElementById("avaliacaoVo2").value = "";
  const mensagem = document.getElementById("avaliacaoMensagem");
  mensagem.textContent = "Avaliação de VO₂máx registrada com sucesso.";
  mensagem.hidden = false;
  setTimeout(() => { mensagem.hidden = true; }, 3500);
  atualizarAcompanhamento();
}

function atualizarAcompanhamento() {
  const treinos = carregarDadosAcompanhamento(CHAVE_TREINOS)
    .sort((a, b) => String(b.data).localeCompare(String(a.data)) || b.id - a.id);
  const avaliacoes = carregarDadosAcompanhamento(CHAVE_AVALIACOES)
    .sort((a, b) => String(a.data).localeCompare(String(b.data)) || a.id - b.id);

  const totalMinutos = treinos.reduce((soma, treino) => soma + Number(treino.duracao || 0), 0);
  const totalFortes = treinos.filter(treino => Number(treino.intensidade || 0) >= 85).length;

  document.getElementById("totalTreinos").textContent = treinos.length;
  document.getElementById("totalMinutos").textContent = `${totalMinutos} min`;
  document.getElementById("totalFortes").textContent = totalFortes;

  const recente = avaliacoes.length ? avaliacoes[avaliacoes.length - 1] : null;
  document.getElementById("vo2Recente").textContent = recente
    ? `${Number(recente.vo2).toFixed(1).replace(".", ",")}`
    : "--";

  const tabela = document.getElementById("historicoTreinos");
  if (!treinos.length) {
    tabela.innerHTML = `<tr><td colspan="5" class="muted">Nenhum treino registrado ainda.</td></tr>`;
  } else {
    tabela.innerHTML = treinos.slice(0, 20).map(treino => `
      <tr title="${escapeHtml(treino.observacao || "")}">
        <td>${formatarData(treino.data)}</td>
        <td>${escapeHtml(treino.tipo)}</td>
        <td>${Number(treino.duracao)} min</td>
        <td>${treino.intensidade ? `${Number(treino.intensidade)}%` : "--"}</td>
        <td>${escapeHtml(treino.pace)}</td>
      </tr>
    `).join("");
  }

  const evolucao = document.getElementById("evolucaoVo2");
  if (!avaliacoes.length) {
    evolucao.innerHTML = `<p class="muted">Registre uma avaliação para acompanhar a evolução do VO₂máx.</p>`;
    return;
  }

  const ultimas = avaliacoes.slice(-8);
  const maiorVo2 = Math.max(...ultimas.map(item => Number(item.vo2)), 1);
  evolucao.innerHTML = ultimas.map(item => {
    const valor = Number(item.vo2);
    const largura = Math.max(8, Math.min(100, (valor / maiorVo2) * 100));
    return `
      <div class="vo2-history-item">
        <span class="vo2-history-date">${formatarData(item.data)}</span>
        <div class="vo2-history-bar" aria-label="VO₂máx ${valor.toFixed(1)}">
          <span style="width:${largura}%"></span>
        </div>
        <span class="vo2-history-value">${valor.toFixed(1).replace(".", ",")}</span>
      </div>
    `;
  }).join("");
}

document.getElementById("btnRegistrarTreino").addEventListener("click", registrarTreino);
document.getElementById("btnRegistrarAvaliacao").addEventListener("click", registrarAvaliacao);
const btnLimparPerfil = document.getElementById("btnLimparDadosUsuario");
if (btnLimparPerfil) btnLimparPerfil.addEventListener("click", limparDadosUsuario);
document.getElementById("btnLimparAcompanhamento").addEventListener("click", () => {
  if (!confirm("Deseja realmente apagar todo o histórico de treinos e avaliações deste dispositivo?")) return;
  localStorage.removeItem(CHAVE_TREINOS);
  localStorage.removeItem(CHAVE_AVALIACOES);
  atualizarAcompanhamento();
});

inicializarAcompanhamento();


// Tutorial: abre e fecha sem interferir nos dados do treino.
const tutorialEl = document.getElementById("tutorial");
document.getElementById("btnComoFunciona").addEventListener("click", () => { tutorialEl.hidden = !tutorialEl.hidden; if (!tutorialEl.hidden) tutorialEl.scrollIntoView({behavior:"smooth",block:"start"}); });
document.getElementById("btnFecharTutorial").addEventListener("click", () => { tutorialEl.hidden = true; window.scrollTo({top:0,behavior:"smooth"}); });

// Screen Wake Lock: browsers compatíveis mantêm o visor ativo enquanto solicitado.
const manterTela = document.getElementById("manterTelaLigada");
const telaEscura = document.getElementById("telaEscura");
async function atualizarWakeLock() {
  if (!manterTela.checked || document.visibilityState !== "visible" || !("wakeLock" in navigator)) {
    if (wakeLock) { try { await wakeLock.release(); } catch (_) {} wakeLock = null; }
    return;
  }
  try { if (!wakeLock) wakeLock = await navigator.wakeLock.request("screen"); } catch (_) {
    document.getElementById("treinoStatus").textContent = "Este navegador não permitiu manter a tela ligada.";
  }
}
manterTela.addEventListener("change", atualizarWakeLock);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") atualizarWakeLock(); });
telaEscura.addEventListener("change", () => document.body.classList.toggle("training-dim", telaEscura.checked));
