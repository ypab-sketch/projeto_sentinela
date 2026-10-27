/* =========================================
   SENTINELA
   Sistema Inteligente de Prevenção
   e Resiliência Escolar
========================================= */


/* -----------------------------------------
   NAVEGAÇÃO
----------------------------------------- */

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");


const titles = {
  dashboard: "Visão geral",
  monitoramento: "Monitoramento",
  mapa: "Mapa da escola",
  simulador: "E se...?",
  resposta: "Central de Resposta",
  educacao: "Continuidade da aprendizagem",
  evolucao: "Evolução"
};


function showSection(sectionId) {

  sections.forEach(section => {
    section.classList.remove("active");
  });

  navItems.forEach(item => {
    item.classList.remove("active");
  });

  const section = document.getElementById(sectionId);
  const nav = document.querySelector(
    `.nav-item[data-section="${sectionId}"]`
  );

  if (section) {
    section.classList.add("active");
  }

  if (nav) {
    nav.classList.add("active");
  }

  pageTitle.textContent = titles[sectionId] || "SENTINELA";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


navItems.forEach(item => {

  item.addEventListener("click", () => {

    const sectionId = item.dataset.section;

    showSection(sectionId);

  });

});


/* -----------------------------------------
   BOTÕES DE NAVEGAÇÃO INTERNOS
----------------------------------------- */

document.querySelectorAll("[data-go]").forEach(button => {

  button.addEventListener("click", () => {

    showSection(button.dataset.go);

  });

});


/* -----------------------------------------
   TOAST
----------------------------------------- */

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


function showToast(message) {

  toastMessage.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}


/* -----------------------------------------
   MONITORAMENTO
----------------------------------------- */

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const noise = document.getElementById("noise");
const water = document.getElementById("water");


const temperatureOutput =
  document.getElementById("temperatureOutput");

const humidityOutput =
  document.getElementById("humidityOutput");

const noiseOutput =
  document.getElementById("noiseOutput");

const waterOutput =
  document.getElementById("waterOutput");


function updateSliderValues() {

  temperatureOutput.textContent = temperature.value;

  humidityOutput.textContent = humidity.value;

  noiseOutput.textContent = noise.value;

  waterOutput.textContent = water.value;

}


temperature.addEventListener("input", updateSliderValues);
humidity.addEventListener("input", updateSliderValues);
noise.addEventListener("input", updateSliderValues);
water.addEventListener("input", updateSliderValues);


/* -----------------------------------------
   CÁLCULO DO IRE
----------------------------------------- */

function calculateRisk() {

  const temp = Number(temperature.value);
  const hum = Number(humidity.value);
  const noiseValue = Number(noise.value);
  const waterValue = Number(water.value);


  let environment = 95;
  let health = 93;
  let education = 94;


  /*
    TEMPERATURA
  */

  if (temp >= 32) {

    environment -= 18;
    health -= 25;
    education -= 16;

  } else if (temp >= 29) {

    environment -= 8;
    health -= 12;
    education -= 7;

  }


  /*
    UMIDADE
  */

  if (hum < 35) {

    environment -= 8;
    health -= 10;

  }


  /*
    RUÍDO
  */

  if (noiseValue >= 80) {

    health -= 8;
    education -= 15;

  } else if (noiseValue >= 70) {

    health -= 4;
    education -= 8;

  }


  /*
    CONSUMO DE ÁGUA
  */

  if (waterValue >= 80) {

    environment -= 15;
    health -= 5;

  } else if (waterValue >= 65) {

    environment -= 7;

  }


  environment = Math.max(0, Math.min(100, environment));
  health = Math.max(0, Math.min(100, health));
  education = Math.max(0, Math.min(100, education));


  const ire = Math.round(
    (environment + health + education) / 3
  );


  return {
    environment,
    health,
    education,
    ire
  };

}


/* -----------------------------------------
   ATUALIZA DASHBOARD
----------------------------------------- */

function updateDashboard(result) {

  document.getElementById("ireValue").textContent =
    result.ire;

  document.getElementById("environmentValue").textContent =
    result.environment;

  document.getElementById("healthValue").textContent =
    result.health;

  document.getElementById("educationValue").textContent =
    result.education;


  document.getElementById("environmentBar").style.width =
    `${result.environment}%`;

  document.getElementById("healthBar").style.width =
    `${result.health}%`;

  document.getElementById("educationBar").style.width =
    `${result.education}%`;


  document.getElementById("monitorEnvironment").textContent =
    result.environment;

  document.getElementById("monitorHealth").textContent =
    result.health;

  document.getElementById("monitorEducation").textContent =
    result.education;


  const circle = document.querySelector(".ire-circle");

  circle.style.background =
    `conic-gradient(
      var(--green) ${result.ire}%,
      #e4ebe6 0
    )`;

}


/* -----------------------------------------
   BOTÃO ANALISAR
----------------------------------------- */

const analyzeBtn = document.getElementById("analyzeBtn");

analyzeBtn.addEventListener("click", () => {

  const result = calculateRisk();

  updateDashboard(result);


  const analysis =
    document.getElementById("analysisResult");


  let title = "";
  let message = "";
  let type = "normal";


  if (result.ire >= 80) {

    title = "Condições dentro do esperado";

    message =
      "Os indicadores analisados apresentam baixo nível de risco.";

    type = "normal";

  } else if (result.ire >= 60) {

    title = "Atenção necessária";

    message =
      "Alguns indicadores mostram sinais que merecem acompanhamento.";

    type = "warning";

  } else {

    title = "Risco elevado identificado";

    message =
      "O cenário apresenta condições que exigem medidas preventivas.";

    type = "danger";

  }


  analysis.className =
    `analysis-result ${type}`;


  analysis.innerHTML = `

    <div class="result-icon">
      ${type === "normal" ? "✓" : "!"}
    </div>

    <div>

      <strong>${title}</strong>

      <p>${message}</p>

    </div>

  `;


  showToast(
    `Análise concluída. IRE estimado: ${result.ire}/100`
  );

});


/* -----------------------------------------
   MAPA DA ESCOLA
----------------------------------------- */

const rooms = document.querySelectorAll(".room");

const selectedRoom =
  document.getElementById("selectedRoom");

const roomDescription =
  document.getElementById("roomDescription");


const roomDescriptions = {

  "Sala 01":
    "Condições normais no momento. Continuar acompanhamento periódico.",

  "Sala 02":
    "Condições normais no momento. Nenhum sinal relevante identificado.",

  "Sala 03":
    "Atenção necessária. Alguns indicadores ambientais merecem acompanhamento.",

  "Sala 04":
    "Temperatura acima da condição recomendada. Verificar ventilação e condições de permanência.",

  "Banheiros":
    "Ponto de atenção relacionado à higiene, disponibilidade de água e condições de uso.",

  "Reservatório":
    "Ponto de atenção. Verificar nível, consumo e possíveis alterações no abastecimento.",

  "Biblioteca":
    "Condições normais. Espaço disponível para utilização."
};


rooms.forEach(room => {

  room.addEventListener("click", () => {

    const roomName = room.dataset.room;

    selectedRoom.textContent = roomName;

    roomDescription.textContent =
      roomDescriptions[roomName] ||
      "Nenhuma informação adicional disponível.";

    showToast(`${roomName} selecionada.`);

  });

});


/* -----------------------------------------
   SIMULADOR
----------------------------------------- */

const scenarios =
  document.querySelectorAll(".scenario");

const scenarioTitle =
  document.getElementById("scenarioTitle");

const simulateBtn =
  document.getElementById("simulateBtn");


let selectedScenario = "heat";


const scenarioData = {

  heat: {

    title: "Calor extremo",

    impact: "Alto",

    description:
      "Temperatura elevada pode afetar o conforto, o uso de água e as condições de aprendizagem.",

    dimensions:
      ["Ambiente", "Saúde", "Educação"]

  },

  rain: {

    title: "Chuva intensa",

    impact: "Alto",

    description:
      "Chuvas intensas podem afetar áreas da escola, acesso, infraestrutura e continuidade das aulas.",

    dimensions:
      ["Ambiente", "Saúde", "Educação"]

  },

  water: {

    title: "Falta de água",

    impact: "Alto",

    description:
      "A interrupção do abastecimento pode comprometer higiene, funcionamento e permanência dos estudantes.",

    dimensions:
      ["Ambiente", "Saúde"]

  },

  energy: {

    title: "Falta de energia",

    impact: "Médio",

    description:
      "A interrupção de energia pode afetar equipamentos, iluminação, comunicação e atividades pedagógicas.",

    dimensions:
      ["Educação", "Ambiente"]

  },

  room: {

    title: "Sala indisponível",

    impact: "Médio",

    description:
      "A perda de um espaço pode exigir reorganização das turmas e das atividades escolares.",

    dimensions:
      ["Educação", "Saúde"]

  }

};


scenarios.forEach(scenario => {

  scenario.addEventListener("click", () => {

    scenarios.forEach(item => {
      item.classList.remove("active");
    });

    scenario.classList.add("active");

    selectedScenario =
      scenario.dataset.scenario;

    scenarioTitle.textContent =
      scenarioData[selectedScenario].title;

  });

});


/* -----------------------------------------
   SIMULAR CENÁRIO
----------------------------------------- */

simulateBtn.addEventListener("click", () => {

  const data =
    scenarioData[selectedScenario];


  const content =
    document.getElementById("simulationContent");


  let meterWidth = "78%";


  if (data.impact === "Médio") {
    meterWidth = "55%";
  }


  content.innerHTML = `

    <div class="simulation-alert">

      <span>!</span>

      <div>

        <strong>
          ${data.title}: impacto estimado ${data.impact.toLowerCase()}
        </strong>

        <p>
          ${data.description}
        </p>

      </div>

    </div>


    <div class="simulation-columns">

      <div>

        <span class="label">
          IMPACTO
        </span>

        <div class="impact-meter">

          <div
            class="meter-value"
            style="width:${meterWidth}"
          ></div>

        </div>

        <strong>
          ${data.impact}
        </strong>

      </div>


      <div>

        <span class="label">
          DIMENSÕES AFETADAS
        </span>

        <div class="tags">

          ${data.dimensions
            .map(
              dimension =>
                `<span>${dimension}</span>`
            )
            .join("")}

        </div>

      </div>

    </div>

  `;


  showToast(
    `Simulação concluída: ${data.title}`
  );

});


/* -----------------------------------------
   INICIALIZAÇÃO
----------------------------------------- */

updateSliderValues();

updateDashboard({
  environment: 91,
  health: 84,
  education: 86,
  ire: 87
});


console.log(
  "SENTINELA iniciado com sucesso."
);


/* =========================================
   BEM-ESTAR EMOCIONAL
   Acolhimento e reflexão do estudante
========================================= */

// Adiciona o nome da nova página ao menu do SENTINELA.
titles.bemestar = "Bem-estar Emocional";


/* -----------------------------------------
   QUESTIONÁRIO DE BEM-ESTAR
----------------------------------------- */

const wellbeingForm = document.getElementById("wellbeingForm");

const wellbeingFeedback =
  document.getElementById("wellbeingFeedback");


if (wellbeingForm && wellbeingFeedback) {

  wellbeingForm.addEventListener("submit", function(event) {

    // Evita que a página recarregue ao concluir o formulário.
    event.preventDefault();

    const feeling =
      document.getElementById("feeling").value;

    const workload =
      document.getElementById("workload").value;

    const belonging =
      document.getElementById("belonging").value;

    const respect =
      document.getElementById("respect").value;


    // A mensagem muda conforme as respostas escolhidas.
    // Nenhuma resposta é enviada ou guardada pelo protótipo.

    let message =
      "Obrigado por reservar um momento para pensar em como você está. " +
      "Continue respeitando seu ritmo e lembre-se de que você merece " +
      "ser ouvido e tratado com respeito.";


    const sinaisDeSobrecarga =
      feeling === "cansado" ||
      feeling === "preocupado" ||
      feeling === "desanimado" ||
      workload === "alta";


    const dificuldadeDeConvivencia =
      belonging === "nao" ||
      respect === "nao";


    const precisaDeMaisAtencao =
      feeling === "mais-ou-menos" ||
      workload === "moderada" ||
      belonging === "as-vezes" ||
      respect === "as-vezes";


    if (sinaisDeSobrecarga && dificuldadeDeConvivencia) {

      message =
        "Parece que algumas coisas na rotina escolar podem estar " +
        "pesando para você. Você não precisa lidar com tudo sozinho. " +
        "Se puder, converse com um adulto de confiança ou com alguém " +
        "da equipe escolar que possa ouvir você e ajudar a pensar " +
        "em possíveis mudanças.";

    } else if (sinaisDeSobrecarga) {

      message =
        "Se a rotina estiver cansativa ou as preocupações estiverem " +
        "ocupando muito espaço, tente conversar com alguém em quem " +
        "confia. A escola também pode ajudar a avaliar a carga de " +
        "atividades e buscar formas mais equilibradas de organização.";

    } else if (dificuldadeDeConvivencia) {

      message =
        "Sentir que não pertence ao ambiente ou que nem sempre " +
        "recebe respeito pode ser difícil. O que você sente merece " +
        "ser levado a sério. Se se sentir à vontade, procure um " +
        "professor, a coordenação ou outro adulto de confiança para conversar.";

    } else if (precisaDeMaisAtencao) {

      message =
        "Talvez existam pontos da rotina escolar que poderiam melhorar. " +
        "Vale prestar atenção ao que está sendo mais difícil e, se " +
        "quiser, conversar com alguém de confiança sobre isso. " +
        "Você não precisa esperar que uma situação fique muito difícil " +
        "para pedir apoio.";

    }


    // Mostra o resultado somente na tela atual.
    // O protótipo não transmite respostas para outras pessoas.

    wellbeingFeedback.textContent = message;

    wellbeingFeedback.hidden = false;

    wellbeingFeedback.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

    showToast("Reflexão concluída.");

  });

}


console.log(
  "Módulo de Bem-estar Emocional carregado."
);

