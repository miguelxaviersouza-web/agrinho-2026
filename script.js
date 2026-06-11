// Gerenciador de Abas / Páginas
function switchPage(pageName) {
    document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`page-${pageName}`).classList.add('active');
    
    let btnId = 'btn-simulador';
    if(pageName === 'sobre-mim') btnId = 'btn-sobre';
    if(pageName === 'concurso') btnId = 'btn-concurso';
    document.getElementById(btnId).classList.add('active');
}

// ESTADOS DO RPG (Mecânicas Ativas)
let currentStage = 1;
let stats = {
    money: 1500,
    eco: 100,
    beesAlive: true
};

// Elementos Gráficos e de Texto do Sistema
const valMoney = document.getElementById('val-money');
const valEco = document.getElementById('val-eco');
const barEco = document.getElementById('bar-eco');
const valBees = document.getElementById('val-bees');
const storyText = document.getElementById('story-text');
const actionPanel = document.getElementById('action-panel');
const questStage = document.getElementById('quest-stage');

// Elementos da Tela Visual 2D
const cropField = document.getElementById('crop-field');
const beeSwarm = document.getElementById('bee-swarm');
const mapAlert = document.getElementById('map-alert');

// Renderiza os painéis numéricos e atualiza o cenário visual 2D
function renderDashboard() {
    valMoney.innerText = `R$ ${stats.money}`;
    valEco.innerText = `${stats.eco}%`;
    barEco.style.width = `${stats.eco}%`;

    // Atualiza a barra de ECO-HP com cores de jogos clássicos
    if(stats.eco <= 40) {
        barEco.style.backgroundColor = 'var(--pixel-red)';
    } else if (stats.eco <= 70) {
        barEco.style.backgroundColor = 'var(--pixel-gold)';
    } else {
        barEco.style.backgroundColor = 'var(--pixel-green)';
    }

    // CONTROLE VISUAL 2D: Reação imediata no cenário
    if (!stats.beesAlive) {
        valBees.innerText = "❌ Extintas";
        valBees.style.color = "var(--pixel-red)";
        beeSwarm.style.opacity = "0"; // AS ABELHAS SOMEM DA TELA DO JOGO!
    } else {
        valBees.innerText = "🐝 Ativas";
        valBees.style.color = "var(--pixel-green)";
        beeSwarm.style.opacity = "1";
    }
}

// Sistema de Turnos do RPG
function playTurn(choice) {
    if (currentStage === 1) {
        questStage.innerText = "MISSÃO: Fase 2 de 3";
        mapAlert.style.display = "none"; // Remove o aviso de praga antiga

        if (choice === 'A') {
            stats.money += 800; // Ouro imediato
            stats.eco -= 50;    // Dano massivo na barra de vida do solo
            stats.beesAlive = false; // Morte das polinizadoras
            
            cropField.innerHTML = "🌿🌿🌿<br>🌿🌿🌿"; // Folhagem sem flor devido à toxicidade
            storyText.innerText = "⚠️ CONSEQÜÊNCIA: O veneno químico pesado dizimou as pragas rapidamente e garantiu lucro rápido, mas causou um desastre biológico nas redondezas. Note a tela: as abelhas sumiram da sua propriedade! Agora é época de floração. Como nutrirá a lavoura?";
        } else {
            stats.money += 300; 
            // Eco mantido estável
            cropField.innerHTML = "🌸🌸🌸<br>🌸🌸🌸"; // Campo floresce de forma saudável
            storyText.innerText = "🌱 CONSEQÜÊNCIA: Excelente! O uso de vespas predadoras realizou o controle biológico natural. Demorou um pouco mais e lucrou menos de início, mas a fauna nativa foi poupada. Veja na tela: seu campo floresceu e está cercado de abelhas. Como nutrirá a lavoura agora?";
        }
        
        currentStage = 2;
        renderDashboard();
        setStageChoices();
        
    } else if (currentStage === 2) {
        questStage.innerText = "MISSÃO: Fim de Jogo";
        
        if (choice === 'A') {
            stats.money += 400;
            stats.eco -= 20;
            
            if(!stats.beesAlive) {
                stats.money -= 700; // Penalidade fatal
                cropField.innerHTML = "🍂 🍂 🍂<br>🍂 🍂 🍂"; // Plantas murcham sem fruto
                storyText.innerText = "💔 DERROTA: Você aplicou fertilizantes solúveis artificiais agressivos. Porém, como suas abelhas foram extintas na Fase 1, as flores não foram polinizadas! A lavoura secou produzindo vagens sem sementes. O ouro investido virou prejuízo crítico.";
            } else {
                cropField.innerHTML = "🌾🌾🌾<br>🌾🌾🌾"; // Colheita padrão
                storyText.innerText = "⚖️ BALANÇO: Os minerais funcionaram, mas a alta salinização do solo causou perda parcial de vitalidade da terra. Suas abelhas remanescentes ajudaram a salvar o faturamento, garantindo uma safra comercial regular padrão.";
            }
        } else {
            // Opção orgânica e integrada
            if(!stats.beesAlive) {
                stats.money -= 300; 
                cropField.innerHTML = "🌱 🌿 🌱<br>🌿 🌱 🌿";
                storyText.innerText = "⚠️ MITIGAÇÃO INCOMPLETA: Você escolheu adubação verde orgânica para salvar a terra, mas sem as abelhas para fecundar as flores, a produtividade final despencou. O ecossistema desequilibrado quebrou a colheita.";
            } else {
                stats.money += 1000; // Bônus secreto lendário
                stats.eco = Math.min(stats.eco + 20, 100);
                cropField.innerHTML = "🌾💰🌾<br>💰🌾💰"; // Plantação brilha com ouro!
                storyText.innerText = "👑 VITÓRIA LENDÁRIA! Perfeito, fazendeiro sustentável! Combinando a rica adubação verde com o trabalho incansável de polinização das abelhas vivas que você protegeu, sua produtividade quebrou recordes, gerando grãos premium e lucro máximo!";
            }
        }
        
        currentStage = 3;
        renderDashboard();
        showFinalResult();
    }
}

// Configura botões dinâmicos com design de escolhas de RPG
function setStageChoices() {
    actionPanel.innerHTML = "";

    if (currentStage === 2) {
        const btn1 = document.createElement('button');
        btn1.className = "pixel-btn";
        btn1.innerText = "> Opção A: Injetar adubo sintético mineral industrial.";
        btn1.onclick = () => playTurn('A');

        const btn2 = document.createElement('button');
        btn2.className = "pixel-btn";
        btn2.innerText = "> Opção B: Implantar adubação verde com plantas de cobertura.";
        btn2.onclick = () => playTurn('B');

        actionPanel.appendChild(btn1);
        actionPanel.appendChild(btn2);
    }
}

// Mostra o encerramento da jornada e o botão de reinício
function showFinalResult() {
    actionPanel.innerHTML = "";
    
    const divResult = document.createElement('div');
    divResult.style.margin = "10px 0";
    divResult.style.padding = "10px";
    divResult.style.border = "3px dashed var(--border-color)";

    if (stats.eco >= 70 && stats.money >= 2200) {
        divResult.innerHTML = "<h3 style='color:var(--pixel-green)'>[ RANK: S - HERÓI DA TERRA ]</h3><p>Parabéns! Você provou a tese do Agrinho 2026: Produção de ponta andou perfeitamente alinhada ao Meio Ambiente preservado!</p>";
    } else if (!stats.beesAlive || stats.eco < 50) {
        divResult.innerHTML = "<h3 style='color:var(--pixel-red)'>[ RANK: F - COLAPSO ECOLÓGICO ]</h3><p>Fim de Jogo. O foco ganancioso em dinheiro rápido erradicou as abelhas e sabotou sua própria capacidade de colheita futura.</p>";
    } else {
        divResult.innerHTML = "<h3 style='color:var(--pixel-gold)'>[ RANK: C - PRODUTOR COMUM ]</h3><p>Você sobreviveu às despesas, mas sua fazenda opera no limite ecológico, com solo empobrecido e sem bônus biológicos.</p>";
    }

    const resetBtn = document.createElement('button');
    resetBtn.className = "pixel-btn";
    resetBtn.style.borderColor = "var(--pixel-gold)";
    resetBtn.style.color = "var(--pixel-gold)";
    resetBtn.innerText = "[ VOLTAR AO INÍCIO DA JORNADA ]";
    resetBtn.onclick = resetGame;

    actionPanel.appendChild(divResult);
    actionPanel.appendChild(resetBtn);
}

// Reseta o jogo para o Turno Inicial
function resetGame() {
    currentStage = 1;
    stats.money = 1500;
    stats.eco = 100;
    stats.beesAlive = true;
    
    questStage.innerText = "MISSÃO: Fase 1 de 3";
    mapAlert.style.display = "block";
    cropField.innerHTML = "🌱🌱🌱<br>🌱🌱🌱";
    storyText.innerText = "Bem-vindo ao comando da Fazenda Modelo, herói! É o início da safra e uma feroz infestação de lagartas invadiu o mapa e ameaça destruir nossa plantação de soja. Os mercados estão exigindo resultados urgentes. Qual será sua ação?";
    
    renderDashboard();
    initGame();
}

function initGame() {
    actionPanel.innerHTML = "";
    
    const btn1 = document.createElement('button');
    btn1.className = "pixel-btn";
    btn1.innerText = "> Opção A: Aplicar inseticida químico pesado em toda a área.";
    btn1.onclick = () => playTurn('A');

    const btn2 = document.createElement('button');
    btn2.className = "pixel-btn";
    btn2.innerText = "> Opção B: Introduzir controle biológico com vespas predadoras.";
    btn2.onclick = () => playTurn('B');

    actionPanel.appendChild(btn1);
    actionPanel.appendChild(btn2);
}

window.onload = () => {
    renderDashboard();
    initGame();
};
