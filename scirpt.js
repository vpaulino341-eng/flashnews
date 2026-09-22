// =========================
// FLASH NEWS - SISTEMA DE CONTA E NOTÍCIAS
// =========================

function getUsuario() {
    try { return JSON.parse(localStorage.getItem("usuarioLogado")); }
    catch (e) { return null; }
}

function cadastro(event) {
    event.preventDefault();
    var nome = document.getElementById("nome").value.trim();
    var email = document.getElementById("email").value.trim().toLowerCase();
    var senha = document.getElementById("senha").value;
    var confirmarSenha = document.getElementById("confirmarSenha").value;

    if (!nome || !email || !senha) return alert("Preencha todos os campos.");
    if (senha.length < 6) return alert("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirmarSenha) return alert("As senhas não são iguais.");

    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.some(function(u) { return u.email === email; })) {
        return alert("Este e-mail já está cadastrado.");
    }

    usuarios.push({ nome: nome, email: email, senha: senha, dataCriacao: new Date().toISOString() });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Conta criada com sucesso!");
    window.location.href = "login.html";
}

function login(event) {
    event.preventDefault();
    var email = document.getElementById("emailLogin").value.trim().toLowerCase();
    var senha = document.getElementById("senhaLogin").value;
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    var usuario = usuarios.find(function(u) { return u.email === email && u.senha === senha; });

    if (!usuario) return alert("E-mail ou senha incorretos.");
    if (!usuario.dataCriacao) usuario.dataCriacao = new Date().toISOString();
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
}

function atualizarMenu() {
    var areas = document.querySelectorAll(".conta");
    if (!areas.length) return;
    var usuario = getUsuario();

    areas.forEach(function(areaConta) {
        areaConta.innerHTML = "";
        if (usuario) {
            var perfil = document.createElement("a");
            perfil.href = "perfil.html";
            perfil.className = "usuario-menu";
            perfil.textContent = "👤 " + usuario.nome;

            var meuPerfil = document.createElement("a");
            meuPerfil.href = "perfil.html";
            meuPerfil.textContent = "Meu Perfil";

            var sairLink = document.createElement("a");
            sairLink.href = "#";
            sairLink.textContent = "Sair";
            sairLink.className = "sair-menu";
            sairLink.onclick = function(e) { e.preventDefault(); sair(); };

            areaConta.append(perfil, meuPerfil, sairLink);
        } else {
            var entrar = document.createElement("a");
            entrar.href = "login.html"; entrar.textContent = "Entrar"; entrar.className = "entrar";
            var criar = document.createElement("a");
            criar.href = "cadastro.html"; criar.textContent = "Criar conta"; criar.className = "criar";
            areaConta.append(entrar, criar);
        }
    });
}

function carregarPerfil() {
    var usuario = getUsuario();
    var nome = document.getElementById("nomeUsuario");
    if (!nome) return;
    if (!usuario) {
        alert("Você precisa fazer login.");
        window.location.href = "login.html";
        return;
    }
    document.getElementById("nomeUsuario").textContent = usuario.nome;
    document.getElementById("emailUsuario").textContent = usuario.email;
    var data = document.getElementById("dataUsuario");
    if (data) data.textContent = usuario.dataCriacao ? new Date(usuario.dataCriacao).toLocaleDateString("pt-BR") : "Não disponível";
    var inicial = document.getElementById("avatarInicial");
    if (inicial) inicial.textContent = (usuario.nome || "U").charAt(0).toUpperCase();
    carregarSalvos();
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "menu.html";
}

function salvarNoticia(dados) {
    var usuario = getUsuario();
    if (!usuario) {
        alert("Entre na sua conta para salvar notícias.");
        window.location.href = "login.html";
        return false;
    }
    var chave = "noticiasSalvas_" + usuario.email;
    var salvas = JSON.parse(localStorage.getItem(chave)) || [];
    if (!salvas.some(function(n) { return n.title === dados.title; })) {
        salvas.unshift(dados);
        localStorage.setItem(chave, JSON.stringify(salvas));
    }
    return true;
}

function carregarSalvos() {
    var lista = document.getElementById("noticiasSalvas");
    if (!lista) return;
    var usuario = getUsuario();
    if (!usuario) return;
    var salvas = JSON.parse(localStorage.getItem("noticiasSalvas_" + usuario.email)) || [];
    lista.innerHTML = "";
    if (!salvas.length) {
        lista.innerHTML = '<p class="sem-salvos">Você ainda não salvou nenhuma notícia.</p>';
        return;
    }
    salvas.forEach(function(n, i) {
        var item = document.createElement("div");
        item.className = "salvo-item";
        item.innerHTML = '<div><span>' + escapeHtml(n.category) + '</span><h3>' + escapeHtml(n.title) + '</h3></div><button type="button">Remover</button>';
        item.querySelector("h3").onclick = function() { abrirNoticia(n); };
        item.querySelector("button").onclick = function() {
            salvas.splice(i, 1);
            localStorage.setItem("noticiasSalvas_" + usuario.email, JSON.stringify(salvas));
            carregarSalvos();
        };
        lista.appendChild(item);
    });
}

function escapeHtml(text) {
    return String(text || "").replace(/[&<>'"]/g, function(c) { return ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]; });
}

// Todas as notícias do site ficam aqui. Cada card possui um ID próprio,
// então cada clique abre um conteúdo diferente.
var NEWS_DATA = [{"id": "brasil_1", "category": "BRASIL", "title": "Chuvas intensas exigem atenção redobrada em diferentes regiões", "description": "Defesas civis reforçam orientações para moradores de áreas com risco de alagamentos e deslizamentos.", "image": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80", "body": ["Defesas civis reforçam orientações para moradores de áreas com risco de alagamentos e deslizamentos.", "As autoridades e equipes locais acompanham a situação e orientam a população sobre os cuidados necessários. A recomendação é buscar informações em canais oficiais e evitar áreas de risco."]}, {"id": "brasil_2", "category": "BRASIL", "title": "Pequenos negócios ampliam presença no comércio digital", "description": "Empreendedores brasileiros estão usando redes sociais e marketplaces para alcançar novos clientes.", "image": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80", "body": ["Empreendedores brasileiros estão usando redes sociais e marketplaces para alcançar novos clientes.", "O movimento mostra como mudanças no cotidiano estão criando novas oportunidades. Especialistas destacam que planejamento e informação são importantes para aproveitar os recursos disponíveis."]}, {"id": "brasil_3", "category": "BRASIL", "title": "Cidades apostam em espaços públicos para incentivar atividades ao ar livre", "description": "Novas iniciativas municipais buscam transformar praças e áreas de convivência em pontos de encontro.", "image": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80", "body": ["Novas iniciativas municipais buscam transformar praças e áreas de convivência em pontos de encontro.", "As iniciativas fazem parte de um movimento para melhorar a qualidade de vida e aproximar os moradores dos espaços públicos. A expectativa é ampliar a participação da comunidade."]}, {"id": "brasil_4", "category": "BRASIL", "title": "Educação financeira ganha espaço em projetos para jovens", "description": "Escolas e instituições ampliam ações que ensinam planejamento, orçamento e consumo consciente.", "image": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80", "body": ["Escolas e instituições ampliam ações que ensinam planejamento, orçamento e consumo consciente.", "Os projetos apresentam conceitos básicos que podem ajudar na tomada de decisões desde cedo. A proposta é transformar conhecimento financeiro em hábitos práticos para o cotidiano."]}, {"id": "brasil_5", "category": "BRASIL", "title": "Produção de alimentos ganha novas soluções para reduzir desperdícios", "description": "Tecnologias e mudanças na logística ajudam produtores e comerciantes a aproveitar melhor os alimentos.", "image": "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80", "body": ["Tecnologias e mudanças na logística ajudam produtores e comerciantes a aproveitar melhor os alimentos.", "As soluções incluem mudanças no armazenamento, transporte e planejamento da produção. Além de reduzir perdas, as medidas podem melhorar a eficiência de toda a cadeia."]}, {"id": "brasil_6", "category": "BRASIL", "title": "Eventos culturais movimentam a programação de várias cidades", "description": "Feiras, apresentações e atividades gratuitas aproximam o público de artistas e produtores locais.", "image": "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=800&q=80", "body": ["Feiras, apresentações e atividades gratuitas aproximam o público de artistas e produtores locais.", "A agenda reúne atividades para diferentes públicos e deve movimentar a economia criativa local. A programação varia de acordo com cada cidade e evento."]}, {"id": "politica_1", "category": "POLITICA", "title": "Congresso debate propostas para modernizar serviços públicos", "description": "Parlamentares analisam medidas que buscam tornar processos mais simples e ampliar o atendimento ao cidadão.", "image": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80", "body": ["Parlamentares analisam medidas que buscam tornar processos mais simples e ampliar o atendimento ao cidadão.", "As propostas ainda estão em discussão e podem sofrer mudanças antes de qualquer votação. O objetivo dos debates é avaliar impactos, custos e formas de execução."]}, {"id": "politica_2", "category": "POLITICA", "title": "Comissões discutem novas regras para projetos em análise", "description": "Debates internos reúnem diferentes posições antes da votação das propostas.", "image": "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80", "body": ["Debates internos reúnem diferentes posições antes da votação das propostas.", "As comissões analisam os textos antes que eles avancem para as próximas etapas. Parlamentares podem apresentar emendas e novas sugestões durante o processo."]}, {"id": "politica_3", "category": "POLITICA", "title": "Governos estaduais apresentam prioridades para os próximos meses", "description": "Entre os temas estão infraestrutura, educação, saúde e melhoria dos serviços.", "image": "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80", "body": ["Entre os temas estão infraestrutura, educação, saúde e melhoria dos serviços.", "Os governos apresentaram metas e prioridades para orientar as próximas ações. A execução dependerá de planejamento e dos recursos disponíveis em cada área."]}, {"id": "politica_4", "category": "POLITICA", "title": "Câmara retoma discussões sobre mudanças na legislação", "description": "As propostas ainda passam por análise e podem receber alterações durante a tramitação.", "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80", "body": ["As propostas ainda passam por análise e podem receber alterações durante a tramitação.", "O debate reúne diferentes posições e deve continuar nas próximas sessões. Alterações no texto podem ocorrer antes da análise final."]}, {"id": "politica_5", "category": "POLITICA", "title": "Senado amplia debate sobre transparência e gastos públicos", "description": "A discussão destaca mecanismos de acompanhamento e divulgação de informações.", "image": "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80", "body": ["A discussão destaca mecanismos de acompanhamento e divulgação de informações.", "A proposta busca ampliar o acesso da população a informações sobre a administração pública. O tema deve continuar sendo discutido pelos parlamentares."]}, {"id": "politica_6", "category": "POLITICA", "title": "Líderes partidários definem agenda de votações da semana", "description": "As bancadas negociam os temas que devem entrar na pauta do plenário.", "image": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80", "body": ["As bancadas negociam os temas que devem entrar na pauta do plenário.", "A definição da pauta depende de acordos entre as bancadas e da prioridade dada a cada projeto. O calendário pode ser ajustado ao longo da semana."]}, {"id": "mundo_1", "category": "MUNDO", "title": "Países anunciam novas medidas de cooperação internacional", "description": "Representantes discutem ações conjuntas em áreas como comércio, ciência e meio ambiente.", "image": "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80", "body": ["Representantes discutem ações conjuntas em áreas como comércio, ciência e meio ambiente.", "As negociações buscam criar ações coordenadas e ampliar a colaboração entre os países. Os próximos encontros devem detalhar os compromissos."]}, {"id": "mundo_2", "category": "MUNDO", "title": "Mercados internacionais acompanham decisões econômicas", "description": "Investidores avaliam os impactos de novas medidas sobre inflação, juros e crescimento.", "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", "body": ["Investidores avaliam os impactos de novas medidas sobre inflação, juros e crescimento.", "As decisões são acompanhadas de perto por empresas e investidores. Mudanças nas expectativas econômicas podem influenciar mercados e estratégias de negócios."]}, {"id": "mundo_3", "category": "MUNDO", "title": "Cidades estrangeiras investem em transporte mais sustentável", "description": "Projetos de mobilidade buscam reduzir congestionamentos e ampliar alternativas ao carro.", "image": "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=800&q=80", "body": ["Projetos de mobilidade buscam reduzir congestionamentos e ampliar alternativas ao carro.", "Os projetos incluem melhorias em transporte coletivo, ciclovias e integração entre diferentes meios. A intenção é oferecer alternativas mais eficientes aos moradores."]}, {"id": "mundo_4", "category": "MUNDO", "title": "Universidades internacionais ampliam pesquisas sobre inteligência artificial", "description": "Grupos acadêmicos trabalham em aplicações da tecnologia para ciência, educação e indústria.", "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80", "body": ["Grupos acadêmicos trabalham em aplicações da tecnologia para ciência, educação e indústria.", "Os pesquisadores estudam formas de tornar a tecnologia mais segura e útil em diferentes áreas. Os resultados podem gerar novas aplicações nos próximos anos."]}, {"id": "mundo_5", "category": "MUNDO", "title": "Países acompanham novas negociações ambientais", "description": "Delegações discutem metas e formas de ampliar ações de preservação.", "image": "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80", "body": ["Delegações discutem metas e formas de ampliar ações de preservação.", "As delegações avaliam propostas para reduzir impactos ambientais e ampliar a cooperação. O consenso depende das negociações entre os participantes."]}, {"id": "mundo_6", "category": "MUNDO", "title": "Turismo internacional ganha novas tendências entre viajantes", "description": "Experiências culturais, viagens curtas e roteiros sustentáveis aparecem entre as preferências.", "image": "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80", "body": ["Experiências culturais, viagens curtas e roteiros sustentáveis aparecem entre as preferências.", "Os viajantes demonstram interesse por experiências mais personalizadas e roteiros que valorizam a cultura local. O setor adapta seus serviços a essas novas preferências."]}, {"id": "esportes_1", "category": "ESPORTES", "title": "Clubes ajustam preparação para a sequência de partidas", "description": "Comissões técnicas aproveitam os treinamentos para corrigir erros e melhorar o desempenho das equipes.", "image": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80", "body": ["Comissões técnicas aproveitam os treinamentos para corrigir erros e melhorar o desempenho das equipes.", "Os treinamentos também servem para avaliar a condição física dos jogadores e testar diferentes estratégias. A expectativa é chegar aos próximos jogos com maior consistência."]}, {"id": "esportes_2", "category": "ESPORTES", "title": "Times reforçam elenco antes de novos desafios da temporada", "description": "Dirigentes avaliam opções no mercado e buscam peças para diferentes posições.", "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80", "body": ["Dirigentes avaliam opções no mercado e buscam peças para diferentes posições.", "As negociações envolvem diferentes posições e dependem de avaliações técnicas e financeiras. Os clubes também estudam alternativas dentro do próprio elenco."]}, {"id": "esportes_3", "category": "ESPORTES", "title": "Atletas brasileiros se destacam em competições internacionais", "description": "Resultados recentes colocam nomes do país entre os destaques de diferentes modalidades.", "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80", "body": ["Resultados recentes colocam nomes do país entre os destaques de diferentes modalidades.", "Os resultados mostram a evolução de atletas que vêm ganhando espaço em suas modalidades. O desempenho também aumenta a expectativa para as próximas competições."]}, {"id": "esportes_4", "category": "ESPORTES", "title": "Rodada é marcada por disputas equilibradas e grandes atuações", "description": "Partidas movimentadas aumentaram a disputa pelas primeiras posições nos campeonatos.", "image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80", "body": ["Partidas movimentadas aumentaram a disputa pelas primeiras posições nos campeonatos.", "As disputas foram definidas por detalhes e mantiveram os torcedores atentos até o fim. O equilíbrio promete continuar nas próximas rodadas."]}, {"id": "esportes_5", "category": "ESPORTES", "title": "Clubes apresentam novidades para a próxima fase da temporada", "description": "Novos uniformes, mudanças nos elencos e planos de treinamento foram divulgados.", "image": "https://images.unsplash.com/photo-1518600506278-4e8ef466b810?auto=format&fit=crop&w=800&q=80", "body": ["Novos uniformes, mudanças nos elencos e planos de treinamento foram divulgados.", "As novidades fazem parte do planejamento para a sequência da temporada. Clubes também avaliam mudanças para melhorar a experiência dos torcedores."]}, {"id": "esportes_6", "category": "ESPORTES", "title": "Jovens talentos ganham espaço nas principais competições", "description": "Atletas em início de carreira aproveitam oportunidades e chamam a atenção de torcedores.", "image": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80", "body": ["Atletas em início de carreira aproveitam oportunidades e chamam a atenção de torcedores.", "As oportunidades ajudam atletas mais jovens a adquirir experiência em competições de alto nível. O desempenho pode abrir espaço para novos desafios."]}, {"id": "tecnologia_1", "category": "TECNOLOGIA", "title": "Celulares mais eficientes apostam em bateria e inteligência artificial", "description": "Fabricantes buscam combinar maior autonomia com recursos que personalizam tarefas do usuário.", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", "body": ["Fabricantes buscam combinar maior autonomia com recursos que personalizam tarefas do usuário.", "Além de melhorar a autonomia, os fabricantes estudam maneiras de tornar os aparelhos mais úteis no dia a dia. Recursos de software têm papel importante nessa evolução."]}, {"id": "tecnologia_2", "category": "TECNOLOGIA", "title": "Novos dispositivos inteligentes chegam com foco em praticidade", "description": "Equipamentos conectados prometem facilitar atividades domésticas, profissionais e de entretenimento.", "image": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80", "body": ["Equipamentos conectados prometem facilitar atividades domésticas, profissionais e de entretenimento.", "Os novos equipamentos apostam em integração e automação para simplificar tarefas. A tendência é que diferentes dispositivos trabalhem cada vez mais conectados."]}, {"id": "tecnologia_3", "category": "TECNOLOGIA", "title": "Ferramentas de IA ganham espaço em estudos e trabalho", "description": "Assistentes digitais passaram a apoiar pesquisas, organização de tarefas e produção de conteúdo.", "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80", "body": ["Assistentes digitais passaram a apoiar pesquisas, organização de tarefas e produção de conteúdo.", "As ferramentas podem ajudar a resumir informações, organizar tarefas e apoiar pesquisas. Especialistas, porém, reforçam a importância de conferir as informações produzidas pela tecnologia."]}, {"id": "tecnologia_4", "category": "TECNOLOGIA", "title": "Mercado de games prepara novidades para os próximos meses", "description": "Jogadores aguardam novos títulos, atualizações e recursos para diferentes plataformas.", "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", "body": ["Jogadores aguardam novos títulos, atualizações e recursos para diferentes plataformas.", "Os lançamentos prometem variedade para diferentes estilos de jogadores. Entre as novidades estão experiências single-player, multiplayer e atualizações para títulos já conhecidos."]}, {"id": "tecnologia_5", "category": "TECNOLOGIA", "title": "Computadores mais compactos buscam combinar desempenho e mobilidade", "description": "Novos modelos apostam em componentes eficientes para atender estudantes e profissionais.", "image": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80", "body": ["Novos modelos apostam em componentes eficientes para atender estudantes e profissionais.", "Os modelos compactos buscam entregar bom desempenho sem ocupar muito espaço. Essa combinação atende especialmente quem precisa alternar entre estudo, trabalho e lazer."]}, {"id": "tecnologia_6", "category": "TECNOLOGIA", "title": "Segurança digital vira prioridade com crescimento dos serviços online", "description": "Especialistas recomendam senhas fortes, autenticação em duas etapas e atenção a links suspeitos.", "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", "body": ["Especialistas recomendam senhas fortes, autenticação em duas etapas e atenção a links suspeitos.", "Com mais serviços conectados, proteger contas e dados pessoais se tornou essencial. Medidas simples de segurança podem reduzir o risco de golpes e acessos indevidos."]}, {"id": "entretenimento_1", "category": "ENTRETENIMENTO", "title": "Novas produções chegam aos cinemas e renovam a programação", "description": "Filmes de diferentes gêneros disputam a atenção do público nas próximas semanas.", "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80", "body": ["Filmes de diferentes gêneros disputam a atenção do público nas próximas semanas.", "A programação reúne produções de diferentes estilos e públicos. A expectativa dos estúdios é atrair espectadores com histórias originais e grandes franquias."]}, {"id": "entretenimento_2", "category": "ENTRETENIMENTO", "title": "Estúdios anunciam novidades para a temporada de lançamentos", "description": "Projetos de cinema e televisão começam a ganhar datas e informações de produção.", "image": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80", "body": ["Projetos de cinema e televisão começam a ganhar datas e informações de produção.", "Os anúncios aumentam a expectativa do público e revelam parte dos projetos que chegarão às telas. Mais detalhes devem ser divulgados durante as próximas etapas de produção."]}, {"id": "entretenimento_3", "category": "ENTRETENIMENTO", "title": "Festivais reúnem música, cinema e cultura em novos eventos", "description": "A programação mistura artistas conhecidos e novos nomes em experiências para o público.", "image": "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80", "body": ["A programação mistura artistas conhecidos e novos nomes em experiências para o público.", "Os eventos aproximam o público de artistas e criadores. A programação também valoriza produções independentes e novos talentos."]}, {"id": "entretenimento_4", "category": "ENTRETENIMENTO", "title": "Filmes mais aguardados movimentam as redes sociais", "description": "Trailers e anúncios aumentam a expectativa dos fãs por grandes estreias.", "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80", "body": ["Trailers e anúncios aumentam a expectativa dos fãs por grandes estreias.", "Os materiais divulgados pelos estúdios provocaram grande repercussão entre os fãs. Novas informações devem aparecer conforme as estreias se aproximarem."]}, {"id": "entretenimento_5", "category": "ENTRETENIMENTO", "title": "Artistas preparam novos trabalhos para os próximos meses", "description": "Cantores e bandas divulgam projetos que devem ampliar suas agendas de lançamentos.", "image": "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=800&q=80", "body": ["Cantores e bandas divulgam projetos que devem ampliar suas agendas de lançamentos.", "Os projetos incluem trabalhos solo, colaborações e novas produções. Os lançamentos devem movimentar plataformas digitais e apresentações ao vivo."]}, {"id": "entretenimento_6", "category": "ENTRETENIMENTO", "title": "Séries ganham destaque com histórias de diferentes gêneros", "description": "Produções de drama, comédia e suspense aparecem entre as opções mais comentadas.", "image": "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80", "body": ["Produções de drama, comédia e suspense aparecem entre as opções mais comentadas.", "A variedade de gêneros ajuda a manter o público interessado em novas histórias. Plataformas continuam apostando em produções nacionais e internacionais."]}, {"id": "menu_1", "category": "DESTAQUE", "title": "Flash News reúne os principais assuntos em um só lugar", "description": "Um panorama rápido para acompanhar as notícias que estão ganhando espaço no dia.", "image": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80", "body": ["Um panorama rápido para acompanhar as notícias que estão ganhando espaço no dia.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_2", "category": "BRASIL", "title": "Chuvas intensas exigem atenção redobrada em diferentes regiões", "description": "Defesas civis reforçam orientações para moradores de áreas com risco de alagamentos e deslizamentos.", "image": "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80", "body": ["Defesas civis reforçam orientações para moradores de áreas com risco de alagamentos e deslizamentos.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_3", "category": "MUNDO", "title": "Países anunciam novas medidas de cooperação internacional", "description": "Representantes discutem ações conjuntas em áreas como comércio, ciência e meio ambiente.", "image": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80", "body": ["Representantes discutem ações conjuntas em áreas como comércio, ciência e meio ambiente.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_4", "category": "TECNOLOGIA", "title": "Celulares mais eficientes apostam em bateria e inteligência artificial", "description": "Fabricantes buscam combinar maior autonomia com recursos que personalizam tarefas do usuário.", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", "body": ["Fabricantes buscam combinar maior autonomia com recursos que personalizam tarefas do usuário.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_5", "category": "ESPORTES", "title": "Clubes ajustam preparação para a sequência de partidas", "description": "Comissões técnicas aproveitam os treinamentos para corrigir erros e melhorar o desempenho das equipes.", "image": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80", "body": ["Comissões técnicas aproveitam os treinamentos para corrigir erros e melhorar o desempenho das equipes.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_6", "category": "ENTRETENIMENTO", "title": "Novas produções chegam aos cinemas e renovam a programação", "description": "Filmes de diferentes gêneros disputam a atenção do público nas próximas semanas.", "image": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80", "body": ["Filmes de diferentes gêneros disputam a atenção do público nas próximas semanas.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_7", "category": "POLÍTICA", "title": "Congresso debate propostas para modernizar serviços públicos", "description": "Parlamentares analisam medidas que buscam tornar processos mais simples e ampliar o atendimento ao cidadão.", "image": "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80", "body": ["Parlamentares analisam medidas que buscam tornar processos mais simples e ampliar o atendimento ao cidadão.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_8", "category": "BRASIL", "title": "Pequenos negócios ampliam presença no comércio digital", "description": "Empreendedores brasileiros estão usando redes sociais e marketplaces para alcançar novos clientes.", "image": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80", "body": ["Empreendedores brasileiros estão usando redes sociais e marketplaces para alcançar novos clientes.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_9", "category": "TECNOLOGIA", "title": "Ferramentas de IA ganham espaço em estudos e trabalho", "description": "Assistentes digitais passaram a apoiar pesquisas, organização de tarefas e produção de conteúdo.", "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", "body": ["Assistentes digitais passaram a apoiar pesquisas, organização de tarefas e produção de conteúdo.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_10", "category": "MUNDO", "title": "Mercados internacionais acompanham decisões econômicas", "description": "Investidores avaliam os impactos de novas medidas sobre inflação, juros e crescimento.", "image": "", "body": ["Investidores avaliam os impactos de novas medidas sobre inflação, juros e crescimento.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_11", "category": "BRASIL", "title": "Educação financeira ganha espaço em projetos para jovens", "description": "Escolas e instituições ampliam ações que ensinam planejamento, orçamento e consumo consciente.", "image": "", "body": ["Escolas e instituições ampliam ações que ensinam planejamento, orçamento e consumo consciente.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_12", "category": "ESPORTES", "title": "Atletas brasileiros se destacam em competições internacionais", "description": "Resultados recentes colocam nomes do país entre os destaques de diferentes modalidades.", "image": "", "body": ["Resultados recentes colocam nomes do país entre os destaques de diferentes modalidades.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_13", "category": "ENTRETENIMENTO", "title": "Artistas preparam novos trabalhos para os próximos meses", "description": "Cantores e bandas divulgam projetos que devem ampliar suas agendas de lançamentos.", "image": "", "body": ["Cantores e bandas divulgam projetos que devem ampliar suas agendas de lançamentos.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}, {"id": "menu_14", "category": "POLÍTICA", "title": "Senado amplia debate sobre transparência e gastos públicos", "description": "A discussão destaca mecanismos de acompanhamento e divulgação de informações.", "image": "", "body": ["A discussão destaca mecanismos de acompanhamento e divulgação de informações.", "Este conteúdo foi preparado para o projeto escolar Flash News e apresenta as informações de forma resumida e objetiva. Acompanhe as categorias do site para encontrar outras notícias."]}];

function abrirNoticia(n) {
    var id = typeof n === "string" ? n : n.id;
    window.location.href = "noticia.html?id=" + encodeURIComponent(id);
}

function prepararNoticias() {
    document.querySelectorAll("main article[data-news-id]").forEach(function(el) {
        if (el.dataset.noticiaPreparada) return;
        var id = el.dataset.newsId;
        var dados = NEWS_DATA.find(function(n) { return n.id === id; });
        if (!dados) return;
        el.dataset.noticiaPreparada = "1";
        el.style.cursor = "pointer";
        el.onclick = function(e) {
            if (e.target.closest("a, button")) return;
            abrirNoticia(dados);
        };
        var botao = el.querySelector("a.botao");
        if (botao) {
            botao.href = "#";
            botao.onclick = function(e) { e.preventDefault(); abrirNoticia(dados); };
        }
    });
}

function carregarNoticia() {
    var titulo = document.getElementById("noticiaTitulo");
    if (!titulo) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var dados = NEWS_DATA.find(function(n) { return n.id === id; });
    if (!dados) {
        titulo.textContent = "Notícia não encontrada";
        document.getElementById("noticiaDescricao").textContent = "Essa notícia não está disponível.";
        return;
    }
    document.getElementById("noticiaCategoria").textContent = dados.category;
    titulo.textContent = dados.title;
    document.getElementById("noticiaDescricao").textContent = dados.description;
    var img = document.getElementById("noticiaImagem");
    if (dados.image) img.src = dados.image;
    var corpo = document.getElementById("noticiaCorpo");
    if (corpo) {
        corpo.innerHTML = dados.body.map(function(p) { return "<p>" + escapeHtml(p) + "</p>"; }).join("");
    }
    var btn = document.getElementById("salvarNoticia");
    if (btn) {
        btn.onclick = function() {
            if (salvarNoticia(dados)) {
                btn.textContent = "✓ Notícia salva";
                btn.disabled = true;
            }
        };
    }
}


// =========================
// ACESSIBILIDADE E IDIOMAS
// =========================

var IDIOMAS = {
    "pt-BR": {
        nome: "Português (Brasil)",
        inicio: "Início", brasil: "Brasil", politica: "Política", mundo: "Mundo",
        esportes: "Esportes", tecnologia: "Tecnologia", entretenimento: "Entretenimento",
        entrar: "Entrar", criar: "Criar conta", perfil: "Meu Perfil", sair: "Sair",
        acessibilidade: "Acessibilidade", tamanho: "Tamanho da fonte", tema: "Tema",
        normal: "Normal", grande: "Grande", muitoGrande: "Muito grande",
        claro: "Claro", escuro: "Escuro", contraste: "Alto contraste",
        idioma: "Idioma", fechar: "Fechar", restaurar: "Restaurar padrão",
        descricao: "Personalize o Flash News para deixar a leitura mais confortável.",
        idiomaDesc: "O idioma altera os textos da interface. As notícias permanecem no idioma em que foram publicadas.",
        fonteDesc: "Escolha o tamanho que fica mais confortável para você.",
        temaDesc: "Escolha entre o tema claro, escuro ou alto contraste."
    },
    "en": {
        nome: "English",
        inicio: "Home", brasil: "Brazil", politica: "Politics", mundo: "World",
        esportes: "Sports", tecnologia: "Technology", entretenimento: "Entertainment",
        entrar: "Log in", criar: "Create account", perfil: "My Profile", sair: "Log out",
        acessibilidade: "Accessibility", tamanho: "Font size", tema: "Theme",
        normal: "Normal", grande: "Large", muitoGrande: "Very large",
        claro: "Light", escuro: "Dark", contraste: "High contrast",
        idioma: "Language", fechar: "Close", restaurar: "Restore default",
        descricao: "Customize Flash News to make reading more comfortable.",
        idiomaDesc: "The language changes interface text. News remains in its original language.",
        fonteDesc: "Choose the size that is most comfortable for you.",
        temaDesc: "Choose light, dark, or high-contrast mode."
    },
    "es": {
        nome: "Español",
        inicio: "Inicio", brasil: "Brasil", politica: "Política", mundo: "Mundo",
        esportes: "Deportes", tecnologia: "Tecnología", entretenimento: "Entretenimiento",
        entrar: "Iniciar sesión", criar: "Crear cuenta", perfil: "Mi Perfil", sair: "Salir",
        acessibilidade: "Accesibilidad", tamanho: "Tamaño de fuente", tema: "Tema",
        normal: "Normal", grande: "Grande", muitoGrande: "Muy grande",
        claro: "Claro", escuro: "Oscuro", contraste: "Alto contraste",
        idioma: "Idioma", fechar: "Cerrar", restaurar: "Restaurar predeterminado",
        descricao: "Personaliza Flash News para que la lectura sea más cómoda.",
        idiomaDesc: "El idioma cambia los textos de la interfaz. Las noticias permanecen en su idioma original.",
        fonteDesc: "Elige el tamaño más cómodo para ti.",
        temaDesc: "Elige el tema claro, oscuro o de alto contraste."
    }
};

function getAcessibilidade() {
    try {
        return JSON.parse(localStorage.getItem("flashNewsAcessibilidade")) || {
            fonte: "media", tema: "claro", idioma: "pt-BR"
        };
    } catch (e) {
        return { fonte: "media", tema: "claro", idioma: "pt-BR" };
    }
}

function salvarAcessibilidade(config) {
    localStorage.setItem("flashNewsAcessibilidade", JSON.stringify(config));
}

function aplicarAcessibilidade() {
    var c = getAcessibilidade();
    document.body.classList.remove("fonte-pequena","fonte-media","fonte-grande","fonte-muito-grande");
    document.body.classList.add("fonte-" + c.fonte);
    document.body.classList.toggle("tema-escuro", c.tema === "escuro");
    document.body.classList.toggle("alto-contraste", c.tema === "contraste");
    document.documentElement.lang = c.idioma === "pt-BR" ? "pt-BR" : c.idioma;
    atualizarTextosInterface(c.idioma);
    atualizarBotoesAcessibilidade();
}

function traduzirTexto(texto, idioma) {
    var t = IDIOMAS[idioma];
    var mapa = {
        "Início": t.inicio, "Home": t.inicio,
        "Brasil": t.brasil,
        "Política": t.politica, "Politics": t.politica,
        "Mundo": t.mundo, "World": t.mundo,
        "Esportes": t.esportes, "Sports": t.esportes,
        "Tecnologia": t.tecnologia, "Technology": t.tecnologia,
        "Entretenimento": t.entretenimento, "Entertainment": t.entretenimento,
        "Entrar": t.entrar, "Login": t.entrar,
        "Criar conta": t.criar, "Create account": t.criar,
        "Meu Perfil": t.perfil, "My Profile": t.perfil,
        "Sair": t.sair, "Logout": t.sair
    };
    return mapa[texto] || texto;
}

function atualizarTextosInterface(idioma) {
    var t = IDIOMAS[idioma] || IDIOMAS["pt-BR"];

    document.querySelectorAll(".menu a").forEach(function(a) {
        a.textContent = traduzirTexto(a.textContent.trim(), idioma);
    });

    document.querySelectorAll(".conta a").forEach(function(a) {
        if (!a.classList.contains("usuario-menu")) {
            a.textContent = traduzirTexto(a.textContent.trim(), idioma);
        }
    });

    var botaoAcess = document.getElementById("abrirAcessibilidade");
    if (botaoAcess) {
        botaoAcess.setAttribute("aria-label", t.acessibilidade);
        var acessTexto = botaoAcess.querySelector(".acessibilidade-texto");
        if (acessTexto) acessTexto.textContent = t.acessibilidade;
    }

    var titulo = document.getElementById("acessibilidadeTitulo");
    var descricao = document.getElementById("acessibilidadeDescricao");
    var tamanho = document.getElementById("acessibilidadeTamanho");
    var tamanhoDesc = document.getElementById("acessibilidadeTamanhoDesc");
    var tema = document.getElementById("acessibilidadeTema");
    var temaDesc = document.getElementById("acessibilidadeTemaDesc");
    var idioma = document.getElementById("acessibilidadeIdioma");
    var idiomaDesc = document.getElementById("acessibilidadeIdiomaDesc");
    var fechar = document.getElementById("fecharAcessibilidade");
    var restaurar = document.getElementById("restaurarAcessibilidade");

    if (titulo) titulo.textContent = t.acessibilidade;
    if (descricao) descricao.textContent = t.descricao;
    if (tamanho) tamanho.textContent = t.tamanho;
    if (tamanhoDesc) tamanhoDesc.textContent = t.fonteDesc;
    if (tema) tema.textContent = t.tema;
    if (temaDesc) temaDesc.textContent = t.temaDesc;
    if (idioma) idioma.textContent = t.idioma;
    if (idiomaDesc) idiomaDesc.textContent = t.idiomaDesc;
    if (fechar) fechar.setAttribute("aria-label", t.fechar);
    if (restaurar) restaurar.textContent = t.restaurar;

    var botoesFonte = document.querySelectorAll("[data-fonte]");
    if (botoesFonte.length >= 4) {
        botoesFonte[0].textContent = "A− " + (idioma === "en" ? "Small" : idioma === "es" ? "Pequeña" : "Pequena");
        botoesFonte[1].textContent = "A " + "Normal";
        botoesFonte[2].textContent = "A+ " + (idioma === "en" ? "Large" : "Grande");
        botoesFonte[3].textContent = "A++ " + (idioma === "en" ? "Very large" : idioma === "es" ? "Muy grande" : "Muito grande");
    }

    document.querySelectorAll("[data-tema]").forEach(function(b) {
        var temaTexto = b.dataset.tema === "claro" ? t.claro : b.dataset.tema === "escuro" ? t.escuro : t.contraste;
        b.textContent = temaTexto;
    });

    document.querySelectorAll("[data-idioma]").forEach(function(b) {
        if (b.dataset.idioma === "pt-BR") b.textContent = "Português (Brasil)";
        if (b.dataset.idioma === "en") b.textContent = "English";
        if (b.dataset.idioma === "es") b.textContent = "Español";
    });
}

function atualizarBotoesAcessibilidade() {
    var c = getAcessibilidade();
    document.querySelectorAll("[data-fonte]").forEach(function(b) {
        b.classList.toggle("selecionado", b.dataset.fonte === c.fonte);
    });
    document.querySelectorAll("[data-tema]").forEach(function(b) {
        b.classList.toggle("selecionado", b.dataset.tema === c.tema);
    });
    document.querySelectorAll("[data-idioma]").forEach(function(b) {
        b.classList.toggle("selecionado", b.dataset.idioma === c.idioma);
    });
}

function criarPainelAcessibilidade() {
    if (document.getElementById("acessibilidadeModal")) return;

    var c = getAcessibilidade();
    var t = IDIOMAS[c.idioma] || IDIOMAS["pt-BR"];

    var modal = document.createElement("div");
    modal.id = "acessibilidadeModal";
    modal.className = "acessibilidade-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML =
        '<div class="acessibilidade-painel">' +
            '<div class="acessibilidade-topo">' +
                '<div><h2 id="acessibilidadeTitulo">' + t.acessibilidade + '</h2><p id="acessibilidadeDescricao" class="acessibilidade-descricao">' + t.descricao + '</p></div>' +
                '<button id="fecharAcessibilidade" class="acessibilidade-fechar" type="button" aria-label="' + t.fechar + '">×</button>' +
            '</div>' +

            '<div class="acessibilidade-grupo">' +
                '<h3 id="acessibilidadeTamanho">' + t.tamanho + '</h3>' +
                '<p id="acessibilidadeTamanhoDesc" class="acessibilidade-descricao">' + t.fonteDesc + '</p>' +
                '<div class="acessibilidade-opcoes">' +
                    '<button type="button" data-fonte="pequena">A− Pequena</button>' +
                    '<button type="button" data-fonte="media">A Normal</button>' +
                    '<button type="button" data-fonte="grande">A+ Grande</button>' +
                    '<button type="button" data-fonte="muito-grande">A++ Muito grande</button>' +
                '</div>' +
            '</div>' +

            '<div class="acessibilidade-grupo">' +
                '<h3 id="acessibilidadeTema">' + t.tema + '</h3>' +
                '<p id="acessibilidadeTemaDesc" class="acessibilidade-descricao">' + t.temaDesc + '</p>' +
                '<div class="acessibilidade-opcoes">' +
                    '<button type="button" data-tema="claro">' + t.claro + '</button>' +
                    '<button type="button" data-tema="escuro">' + t.escuro + '</button>' +
                    '<button type="button" data-tema="contraste">' + t.contraste + '</button>' +
                '</div>' +
            '</div>' +

            '<div class="acessibilidade-grupo">' +
                '<h3 id="acessibilidadeIdioma">' + t.idioma + '</h3>' +
                '<p id="acessibilidadeIdiomaDesc" class="acessibilidade-descricao">' + t.idiomaDesc + '</p>' +
                '<div class="acessibilidade-opcoes">' +
                    '<button type="button" data-idioma="pt-BR">Português (Brasil)</button>' +
                    '<button type="button" data-idioma="en">🇺🇸 English</button>' +
                    '<button type="button" data-idioma="es">🇪🇸 Español</button>' +
                '</div>' +
            '</div>' +

            '<button id="restaurarAcessibilidade" class="acessibilidade-resetar" type="button">' + t.restaurar + '</button>' +
        '</div>';

    document.body.appendChild(modal);

    document.getElementById("abrirAcessibilidade").onclick = function() {
        modal.classList.add("aberto");
    };

    document.getElementById("fecharAcessibilidade").onclick = function() {
        modal.classList.remove("aberto");
    };

    modal.addEventListener("click", function(e) {
        if (e.target === modal) modal.classList.remove("aberto");
    });

    modal.querySelectorAll("[data-fonte]").forEach(function(btn) {
        btn.onclick = function() {
            var novo = getAcessibilidade();
            novo.fonte = btn.dataset.fonte;
            salvarAcessibilidade(novo);
            aplicarAcessibilidade();
        };
    });

    modal.querySelectorAll("[data-tema]").forEach(function(btn) {
        btn.onclick = function() {
            var novo = getAcessibilidade();
            novo.tema = btn.dataset.tema;
            salvarAcessibilidade(novo);
            aplicarAcessibilidade();
        };
    });

    modal.querySelectorAll("[data-idioma]").forEach(function(btn) {
        btn.onclick = function() {
            var novo = getAcessibilidade();
            novo.idioma = btn.dataset.idioma;
            salvarAcessibilidade(novo);
            aplicarAcessibilidade();
        };
    });

    document.getElementById("restaurarAcessibilidade").onclick = function() {
        salvarAcessibilidade({ fonte: "media", tema: "claro", idioma: "pt-BR" });
        aplicarAcessibilidade();
    };
}

function adicionarAcessibilidade() {
    if (document.getElementById("abrirAcessibilidade")) return;

    var header = document.querySelector(".cabecalho");
    if (!header) return;

    var botao = document.createElement("button");
    botao.id = "abrirAcessibilidade";
    botao.className = "acessibilidade-btn";
    botao.type = "button";
    botao.innerHTML = '<span class="acessibilidade-icone" aria-hidden="true">A</span><span class="acessibilidade-texto">Acessibilidade</span>';
    botao.title = "Acessibilidade";
    botao.setAttribute("aria-label", "Acessibilidade");

    var conta = header.querySelector(".conta");
    if (conta) header.insertBefore(botao, conta);
    else header.appendChild(botao);

    criarPainelAcessibilidade();
}

function inicializarAcessibilidade() {
    aplicarAcessibilidade();
    adicionarAcessibilidade();
}


document.addEventListener("DOMContentLoaded", function() {
    inicializarAcessibilidade();
    atualizarMenu();
    carregarPerfil();
    prepararNoticias();
    carregarNoticia();
});
