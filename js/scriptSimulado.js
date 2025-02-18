document.addEventListener("DOMContentLoaded", function () {
    // As questões a serem utilizadas, definir todas as respostas com B
    const perguntas = [
        { pergunta: "O que é a AWS?", respostas: { a: "Um serviço de armazenamento na nuvem", b: "Uma plataforma de computação em nuvem", c: "Um sistema operacional", d: "Nenhuma das anteriores" }, correta: "b" },
        { pergunta: "Qual é o serviço usado para armazenamento de objetos na AWS?", respostas: { a: "Amazon EC2", b: "Amazon S3", c: "Amazon RDS", d: "Amazon Lambda" }, correta: "b" },
        { pergunta: "O que é o Amazon EC2?", respostas: { a: "Um serviço de banco de dados relacional", b: "Um serviço de máquinas virtuais", c: "Um serviço de monitoramento", d: "Um serviço de mensagens" }, correta: "b" },
        { pergunta: "Qual serviço da AWS é ideal para hospedar um banco de dados relacional escalável?", respostas: { a: "Amazon DynamoDB", b: "Amazon RDS", c: "Amazon Redshift", d: "AWS Lambda" }, correta: "b" },
        { pergunta: "Qual recurso do Amazon S3 permite armazenar diferentes versões do mesmo objeto?", respostas: { a: "Bucket Policies", b: "Versionamento", c: "Logging", d: "Replicação" }, correta: "b" },
        { pergunta: "O que é necessário para que um bucket S3 seja acessível publicamente?", respostas: { a: "Um nome de bucket único globalmente", b: "Uma política de bucket ou configuração de ACL adequada", c: "Criação de uma função IAM específica", d: "Habilitar o recurso de replicação cruzada" }, correta: "b" },
        { pergunta: "Qual é a finalidade do Amazon CloudFront?", respostas: { a: "Realizar backups de dados", b: "Servir conteúdo estático e dinâmico com baixa latência por meio de uma CDN", c: "Gerenciar máquinas virtuais", d: "Monitorar recursos na nuvem" }, correta: "b" },
        { pergunta: "Qual serviço AWS permite configurar instâncias de máquinas virtuais baseadas em contêineres?", respostas: { a: "AWS ECS", b: "Amazon S3", c: "AWS CodePipeline", d: "Amazon CloudWatch" }, correta: "b" },
        { pergunta: "Qual tipo de armazenamento do Amazon EBS é ideal para cargas de trabalho que exigem alta taxa de transferência sequencial?", respostas: { a: "SSD de uso geral", b: "HDD Cold", c: "HDD Throughput Optimized", d: "SSD provisionado com IOPS" }, correta: "b" },
        { pergunta: "O que é o AWS IAM?", respostas: { a: "Um serviço para criar e gerenciar identidades e permissões na nuvem AWS", b: "Um recurso para configurar backups automáticos", c: "Uma ferramenta de análise de dados na AWS", d: "Uma solução para gerenciar infraestrutura com contêineres" }, correta: "b" }
    ];

    let currentQuestionIndex = -1;
    let pontuacao = 0;
    let rankingData = [];
    
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    // criação do main
    const mainContainer = document.createElement("div");
    mainContainer.id = "quiz-section";
    mainContainer.style.textAlign = "center";

    mainContainer.style.marginTop = "2rem";
    mainContainer.style.marginBottom = "2rem";
    mainContainer.style.height = "calc(80vh - 100px)"; 
    mainContainer.style.display = "flex";
    mainContainer.style.flexDirection = "column";
    document.body.insertBefore(mainContainer, footer);
    
    // Botão para iniciar o simulado
    const startButton = document.createElement("button");
    startButton.textContent = "Iniciar Simulado";
    startButton.classList.add("btn");
    startButton.style.margin = "20px auto";
    startButton.addEventListener("click", function () {
        startButton.style.display = "none";
        rankingContainer.style.display = "none";
        quizContainer.style.display = "block";
        nextQuestion();
    });
    mainContainer.appendChild(startButton);

    // Ajusto das perguntas em tela
    const quizContainer = document.createElement("div");
    quizContainer.id = "quiz-container";
    quizContainer.classList.add("question");
    quizContainer.style.display = "none";
    quizContainer.style.maxWidth = "600px";
    quizContainer.style.padding = "2rem";
    quizContainer.style.margin = "2rem auto";
    quizContainer.style.flexGrow = "1"; 
    mainContainer.appendChild(quizContainer);

    // criação do rank
    const rankingContainer = document.createElement("div");
    rankingContainer.id = "ranking-container";
    rankingContainer.style.display = "none";
    rankingContainer.innerHTML = `
        <h2 id="tituloRank">Ranking</h2>
        <table id="rankingTable" border="1">
            <thead>
                <tr>
                    <th>Posição</th>
                    <th>Nome</th>
                    <th>Pontuação</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <button id="restart-button" class="btn">Fazer Novamente</button>
    `;
    mainContainer.appendChild(rankingContainer);

    // Reiniciar o quiz sem alterar a tela importante para que tenha um rank pessoal
    document.getElementById("restart-button").addEventListener("click", function () {
        currentQuestionIndex = -1;
        pontuacao = 0;
        quizContainer.style.display = "none";
        rankingContainer.style.display = "none";
        startButton.style.display = "block";
    });
    // Verifica se as respost
    function nextQuestion() {
        if (currentQuestionIndex >= 0 && !getSelectedAnswer()) {
            alert("Selecione uma resposta antes de continuar.");
            return;
        }
        if (currentQuestionIndex >= 0 && getSelectedAnswer() === perguntas[currentQuestionIndex].correta) {
            pontuacao += 10;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex >= perguntas.length) {
            finalizarQuiz();
            return;
        }
        mostrarPergunta();
    }

    // mostra as perguntas 
    function mostrarPergunta() {
        quizContainer.innerHTML = "";
        const questao = perguntas[currentQuestionIndex];
        const perguntaElem = document.createElement("h3");
        perguntaElem.textContent = questao.pergunta;
        quizContainer.appendChild(perguntaElem);

        Object.keys(questao.respostas).forEach(letra => {
            const label = document.createElement("label");
            label.classList.add("answers");
            label.innerHTML = `<input type="radio" name="q${currentQuestionIndex}" value="${letra}"> ${questao.respostas[letra]}`;
            quizContainer.appendChild(label);
            quizContainer.appendChild(document.createElement("br"));
        });
        // Botão de Anterior, aparece somente depois da segunda pergunta
        if (currentQuestionIndex > 0) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Anterior";
            prevButton.classList.add("btn");
            prevButton.addEventListener("click", prevQuestion);
            prevButton.style.marginRight = "10px";
            prevButton.style.marginTop = "10px";
            quizContainer.appendChild(prevButton);
        }

        const nextButton = document.createElement("button");
        nextButton.textContent = "Próximo";
        nextButton.classList.add("btn");
        nextButton.style.marginTop = "10px";
        nextButton.addEventListener("click", nextQuestion);
        quizContainer.appendChild(nextButton);
    }

    function prevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            mostrarPergunta();
        }
    }

    function getSelectedAnswer() {
        const selected = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        return selected ? selected.value : null;
    }

    function finalizarQuiz() {
        quizContainer.innerHTML = "<h2>Fim do Quiz!</h2>";
        mostrarRanking();
    }

    function mostrarRanking() {
        const nomeJogador = prompt("Digite seu nome para o ranking:");
        if (nomeJogador) {
            rankingData.push({ nome: nomeJogador, pontuacao: pontuacao });
            rankingContainer.style.display = "block";
            atualizarRanking();
        }
    }
    // Atualiza o rank pessoal
    function atualizarRanking() {
        const tabela = document.querySelector("#rankingTable tbody");
        tabela.innerHTML = "";
        rankingData.forEach((jogador, index) => {
            const novaLinha = tabela.insertRow();
            novaLinha.insertCell(0).textContent = index + 1;
            novaLinha.insertCell(1).textContent = jogador.nome;
            novaLinha.insertCell(2).textContent = jogador.pontuacao;
        });
    }
});
