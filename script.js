// Navegação Básica entre abas
function switchPage(pageName) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(`page-${pageName}`).classList.add('active');
    
    let activeId = 'btn-simulador';
    if(pageName === 'sobre-mim') activeId = 'btn-sobre';
    if(pageName === 'concurso') activeId = 'btn-concurso';
    document.getElementById(activeId).classList.add('active');
}

// Estados Gerais do RPG
let stage = 1;
let money = 1500;
let eco = 100;
let bees = true;

// Capturas do DOM
const txtMoney = document.getElementById('val-money');
const txtEco = document.getElementById('val-eco');
const barEco = document.getElementById('bar-eco');
const storyText = document.getElementById('story-text');
const actionPanel = document.getElementById('action-panel');
const stageTxt = document.getElementById('stage-txt');

// Elementos Gráficos 2D do Cenário
const cropField = document.getElementById('crop-field');
const beeSwarm = document.getElementById('bee-swarm');
const fieldAlert = document.getElementById('field-alert');

function updateUI() {
    txtMoney.innerText = `R$ ${money}`;
    txtEco.innerText = `${eco}%`;
    barEco.style.width = `${eco}%`;

    // Atualização Gráfica do Cenário com base nos acontecimentos
    if (!bees) {
        beeSwarm.style.opacity = "0"; // Abelhas somem da tela!
    } else {
        beeSwarm.style.opacity = "1";
    }

    if (eco < 50) {
        barEco.style.backgroundColor = "var(--danger)";
    } else {
        barEco.style.backgroundColor = "var(--primary-light)";
    }
}

function processChoice(option) {
    if (stage === 1) {
        stageTxt.innerText = "Fase 2/3: Floração";
        if (option === 'quimico') {
            money += 700;
            eco -= 50;
            bees = false;
            
            fieldAlert.innerText = "⚠️ Sem Abelhas!";
            fieldAlert.className = "field-alert alert-danger";
            cropField.innerHTML = "🌿🌿🌿<br>🌿🌿🌿"; // Plantas crescem sem flores abundantes
            
            storyText.innerText = "O químico pesado erradicou as pragas e salvou a colheita inicial. Porém, a névoa tóxica dizimou as colmeias próximas (veja o cenário: as abelhas sumiram). Agora entramos no período de floração. Qual será sua tática nutricional?";
        } else {
            money += 200;
            // Eco se mantém estável
            fieldAlert.innerText = "🐝 Polinização Ativa!";
            cropField.innerHTML = "🌸🌸🌸<br>🌸🌸🌸"; // Campo floresce lindo
            
            storyText.innerText = "O controle biológico levou mais dias, mas protegeu os insetos nativos. Seu campo agora está florido e zumbindo cheio de abelhas ativas! Chegou o momento crítico de nutrir o solo para a geração dos grãos.";
        }
        stage = 2;
        updateUI();
        loadStage2();
    } 
    else if (stage === 2) {
        stageTxt.innerText = "Fase 3/3: Resultados";
        fieldAlert.style.display = "none"; // Remove alertas provisórios
        
        if (option === 'sintetico') {
            money += 300;
            eco -= 20;
            if (!bees) {
                money -= 800; // Penalidade extrema: sem abelhas a flor cai e não gera vagem
                cropField.innerHTML = "🍂 🍂 🍂<br>🍂 🍂 🍂"; // Cenário seco/morto
                storyText.innerText = "Balanço: Você aplicou fertilizantes químicos de rápida absorção. Contudo, como as abelhas foram extintas na primeira fase, não houve polinização cruzada. Suas flores caíram e a safra gerou grãos chochos e sem valor de mercado.";
            } else {
                cropField.innerHTML = "🌾🌾🌾<br>🌾🌾🌾"; // Safra mediana normal
                storyText.innerText = "Balanço: Os minerais funcionaram, mas o excesso de salinização do solo reduziu o potencial máximo. Sua safra foi mediana, comercializada a preços normais de tabela.";
            }
        } else {
            // Opção Orgânica
            if (!bees) {
                money -= 400; // Prejuízo moderado pela falta de polinizadores
                cropField.innerHTML = "🌱 🌿 🌱<br>🌿 🌱 🌿";
                storyText.innerText = "Balanço: Você optou pela adubação verde. O solo ficou rico, mas sem as abelhas para polinizar, a taxa de frutificação foi muito baixa. O ecossistema está quebrado e a colheita rendeu pouco.";
            } else {
                money += 1000; // Bônus perfeito
                eco = Math.min(eco + 20, 100);
                cropField.innerHTML = "💰🌾💰<br>🌾💰🌾"; // Campo dourado de alta produtividade
                storyText.innerText = "Balanço Perfeito! Ao somar adubação verde com o trabalho massivo das abelhas que você preservou, sua fazenda bateu recordes de produtividade sustentável, ganhando selo de Exportação Verde!";
            }
        }
        stage = 3;
        updateUI();
        showEndGame();
    }
}

function loadStage2() {
    actionPanel.innerHTML = `
        <button class="rpg-btn" onclick="processChoice('sintetico')">A) Adubar com NPK Sintético de Alta Concentração.</button>
        <button class="rpg-btn" onclick="processChoice('organico')">B) Adotar Adubação Verde e Cobertura Orgânica de Solo.</button>
    `;
}

function showEndGame() {
    actionPanel.innerHTML = "";
    
    const veredito = document.createElement('div');
    veredito.style.marginTop = "15px";
    veredito.style.padding = "10px";
    veredito.style.border = "2px dashed var(--dark-box)";

    if (eco >= 70 && money >= 2200) {
        veredito.innerHTML = "<h4 style='color:var(--primary)'>🏆 VEREDITO: PRODUTOR SUSTENTÁVEL SUPREMO</h4><p>Você dominou o tema do Agrinho! Mostrou que preservar a natureza traz retornos financeiros superiores.</p>";
    } else if (!bees || eco < 40) {
        veredito.innerHTML = "<h4 style='color:var(--danger)'>❌ VEREDITO: FALÊNCIA ECOLÓGICA</h4><p>Seu foco no curto prazo eliminou as abelhas, destruindo a sustentabilidade e os lucros futuros.</p>";
    } else {
        veredito.innerHTML = "<h4 style='color:var(--warning)'>⚠️ VEREDITO: PRODUTOR TRADICIONAL</h4><p>A fazenda pagou as contas, mas o solo perdeu vitalidade e o ecossistema está fragilizado.</p>";
    }

    const resetBtn = document.createElement('button');
    resetBtn.className = "rpg-btn";
    resetBtn.style.background = "var(--warning)";
    resetBtn.style.marginTop = "15px";
    resetBtn.innerText = "🔄 Reiniciar Aventura RPG";
    resetBtn.onclick = restartGame;

    actionPanel.appendChild(veredito);
    actionPanel.appendChild(resetBtn);
}

function restartGame() {
    stage = 1;
    money = 1500;
    eco = 100;
    bees = true;
    
    stageTxt.innerText = "Fase 1/3: A Ameaça";
    fieldAlert.style.display = "block";
    fieldAlert.innerText = "🐛 Praga Detectada!";
    fieldAlert.className = "field-alert alert-warning";
    cropField.innerHTML = "🌱🌱🌱<br>🌱🌱🌱";
    storyText.innerText = "Uma forte infestação de lagartas atacou o setor sul da plantação. Se não agirmos rápido, perderemos metade do faturamento da temporada!";
    
    updateUI();
    initGame();
}

function initGame() {
    actionPanel.innerHTML = `
        <button class="rpg-btn" onclick="processChoice('quimico')">A) Pulverizar Inseticida Químico Sistêmico Forte.</button>
        <button class="rpg-btn" onclick="processChoice('biologico')">B) Introduzir Inimigos Naturais (Controle Biológico).</button>
    `;
}

window.onload = () => {
    updateUI();
    initGame();
};
