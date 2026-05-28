// Gerenciador de Abas / Páginas
function switchPage(pageName) {
    // Esconde todas as páginas
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    // Remove classe ativa de todos os botões do menu
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativa a página e o botão correspondente
    document.getElementById(`page-${pageName}`).classList.add('active');
    
    let btnId = 'btn-simulador';
    if(pageName === 'sobre-mim') btnId = 'btn-sobre';
    if(pageName === 'concurso') btnId = 'btn-concurso';
    document.getElementById(btnId).classList.add('active');
}

// ESTADOS DO JOGO (Variáveis de Controle)
let currentStage = 1;
let stats = {
    money: 1500,
    eco: 100,
    beesAlive: true
};

// Elementos do DOM mapeados
const valMoney = document.getElementById('val-money');
const valEco = document.getElementById('val-eco');
const barEco = document.getElementById('bar-eco');
const valBees = document.getElementById('val-bees');
const beeIcon = document.getElementById('bee-icon');
const beeCard = document.getElementById('bee-card');
const storyText = document.getElementById('story-text');
const actionPanel = document.getElementById('action-panel');

// Atualiza a interface gráfica com os valores numéricos atuais
function renderDashboard() {
    valMoney.innerText = `R$ ${stats.money}`;
    valEco.innerText = `${stats.eco}%`;
    barEco.style.width = `${stats.eco}%`;

    // Aplica cores de aviso na barra de sustentabilidade
    if(stats.eco <= 40) {
        barEco.style.backgroundColor = 'var(--danger)';
    } else if (stats.eco <= 70) {
        barEco.style.backgroundColor = 'var(--warning)';
    } else {
        barEco.style.backgroundColor = 'var(--primary-light)';
    }

    // Regra de negócio das abelhas pedida na sua ideia!
    if (!stats.beesAlive) {
        valBees.innerText = "Abelhas Extintas";
        beeIcon.innerText = "❌";
        beeCard.style.borderColor = "var(--danger)";
        beeCard.style.background = "#fdf2f2";
    } else {
        valBees.innerText = "Abelhas Ativas";
        beeIcon.innerText = "🐝";
        beeCard.style.borderColor = "#e1eae1";
        beeCard.style.background = "#f9fbf9";
    }
}

// Estrutura de roteiro e ramificações das fases
function playTurn(choice) {
    if (currentStage === 1) {
        if (choice === 'A') {
            // Escolha insustentável
            stats.money += 800; // Lucro rápido imediato
            stats.eco -= 50;    // Dano severo à ecologia
            stats.beesAlive = false; // AS ABELHAS DESAPARECEM AQUI!
            
            storyText.innerText = "⚠️ IMPACTO SEVERO: Você aplicou o inseticida químico pesado. As lagartas sumiram e o lucro inicial subiu. Contudo, o veneno residual afetou as colmeias da região. As abelhas sumiram da sua fazenda. Agora é época de floração e formação dos grãos de soja. O que fará?";
        } else {
            // Escolha ecológica
            stats.money += 300; 
            stats.eco += 0; // Mantém estável
            
            storyText.innerText = "🌱 BOA PRÁTICA: Você utilizou vespas biológicas (controle biológico). O processo foi um pouco mais lento e custou mais caro de início, mas preservou a integridade da terra. As abelhas continuam polinizando em massa. Agora os grãos começaram a se formar. Qual o próximo passo?";
        }
        
        currentStage = 2;
        renderDashboard();
        setStageChoices();
        
    } else if (currentStage === 2) {
        if (choice === 'A') {
            // Segunda decisão
            stats.money += 400;
            stats.eco -= 20;
            
            // Consequência acumulada se não tiver abelhas
            if(!stats.beesAlive) {
                stats.money -= 700; // Penalidade financeira pesada por falta de polinização
                storyText.innerText = "📉 CONSEQUÊNCIA: Você investiu em adubação pesada. Mas, como as abelhas haviam sumido na etapa anterior, a taxa de polinização despencou! Suas plantas produziram pouquíssimos grãos (vagens vazias). O investimento químico virou prejuízo.";
            } else {
                storyText.innerText = "🌾 SAFRA NORMAL: Sem polinizadores adicionais mas com solo adubado, sua produção manteve a média histórica de rendimento mercantil.";
            }
        } else {
            // Escolha integrada / sustentável
            if(!stats.beesAlive) {
                stats.money -= 300; // Mesmo tentando mitigar, o sumiço das abelhas causa perda irremediável
                storyText.innerText = "⚠️ TENTATIVA DE MITIGAÇÃO: Você tentou usar adubação orgânica, mas a ausência de abelhas devido ao químico da Fase 1 comprometeu tragicamente o volume da colheita.";
            } else {
                stats.money += 900; // Bônus máximo: Abelhas vivas + adubo orgânico
                stats.eco = Math.min(stats.eco + 20, 100);
                storyText.innerText = "🚀 SUCESSO TOTAL: Casando o adubo orgânico com a polinização perfeita das abelhas que você salvou, suas plantas explodiram em produtividade e qualidade comercial premium!";
            }
        }
        
        currentStage = 3;
        renderDashboard();
        showFinalResult();
    }
}

// Configura dinamicamente os botões de ação para a rodada atual
function setStageChoices() {
    actionPanel.innerHTML = ""; // Limpa os botões antigos

    if (currentStage === 2) {
        const btn1 = document.createElement('button');
        btn1.className = "choice-btn";
        btn1.innerText = "Opção A: Utilizar fertilizantes minerais sintéticos de alta solubilidade.";
        btn1.onclick = () => playTurn('A');

        const btn2 = document.createElement('button');
        btn2.className = "choice-btn";
        btn2.innerText = "Opção B: Implantar adubação verde e composto orgânico biológico.";
        btn2.onclick = () => playTurn('B');

        actionPanel.appendChild(btn1);
        actionPanel.appendChild(btn2);
    }
}

// Mostra a tela de balanço final com o veredito
function showFinalResult() {
    actionPanel.innerHTML = "";
    
    const titleResult = document.createElement('h3');
    titleResult.style.margin = "15px 0 5px 0";
    titleResult.innerText = "📊 Relatório de Sustentabilidade & Governança:";
    
    const textResult = document.createElement('p');
    textResult.style.marginBottom = "15px";

    // Avaliação das métricas finais alcançadas
    if (stats.eco >= 70 && stats.money >= 2000) {
        textResult.innerHTML = `🏆 <strong>FAZENDA NOTA 10!</strong> Você provou o tema do Agrinho 2026: Produção robusta andou de mãos dadas com o Meio Ambiente! Saldo final: R$ ${stats.money}.`;
        textResult.style.color = "var(--primary)";
    } else if (!stats.beesAlive || stats.eco < 50) {
        textResult.innerHTML = `❌ <strong>COLAPSO ECOLÓGICO:</strong> Embora tenha focado em dinheiro no começo, a destruição das abelhas destruiu sua produtividade a longo prazo. Saldo final: R$ ${stats.money}.`;
        textResult.style.color = "var(--danger)";
    } else {
        textResult.innerHTML = `⚠️ <strong>PRODUÇÃO MODERADA:</strong> Sua fazenda sobreviveu, mas faltou equilíbrio ou investimento técnico para prosperar ao máximo. Saldo final: R$ ${stats.money}.`;
        textResult.style.color = "var(--warning)";
    }

    const resetBtn = document.createElement('button');
    resetBtn.className = "reset-btn";
    resetBtn.innerText = "🔄 Reiniciar Simulação (Tentar Outro Caminho)";
    resetBtn.onclick = resetGame;

    actionPanel.appendChild(titleResult);
    actionPanel.appendChild(textResult);
    actionPanel.appendChild(resetBtn);
}

// Reinicia as variáveis para o estado inicial
function resetGame() {
    currentStage = 1;
    stats.money = 1500;
    stats.eco = 100;
    stats.beesAlive = true;
    
    storyText.innerText = "Bem-vindo ao comando da Fazenda Modelo! É o início da safra e uma forte infestação de lagartas ameaça destruir metade da sua plantação de soja. Os compradores estão pressionando por resultados. Qual será sua primeira medida?";
    
    renderDashboard();
    initGame();
}

// Inicializa o painel na primeira execução
function initGame() {
    actionPanel.innerHTML = "";
    
    const btn1 = document.createElement('button');
    btn1.className = "choice-btn";
    btn1.innerText = "Opção A: Pulverizar defensivo químico altamente tóxico de amplo espectro.";
    btn1.onclick = () => playTurn('A');

    const btn2 = document.createElement('button');
    btn2.className = "choice-btn";
    btn2.innerText = "Opção B: Aplicar Manejo Integrado de Pragas (MIP) e controle biológico.";
    btn2.onclick = () => playTurn('B');

    actionPanel.appendChild(btn1);
    actionPanel.appendChild(btn2);
}

// Dispara o jogo assim que a página carrega
window.onload = () => {
    renderDashboard();
    initGame();
};
