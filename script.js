// Usuário fixo para login
function inicializarUsuarioPadrao() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuariosPadrao = [
        { 
            usuario: "admin", 
            senha: "admin123", 
            email: "admin@pizzaria.com"
        },
        {
            usuario: "user",
            senha: "user123",
            email: "user@pizzaria.com"
        }
    ];
    
    usuariosPadrao.forEach(usuarioPadrao => {
        if (!usuarios.some(u => u.usuario === usuarioPadrao.usuario)) {
            usuarios.push(usuarioPadrao);
        }
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Chama a função para garantir que o usuário padrão exista
inicializarUsuarioPadrao();

// Função para exibir mensagens
function exibirMensagem(texto, tipo) {
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.classList.remove("hidden");

    setTimeout(() => {
        mensagem.classList.add("hidden");
    }, 3000);
}

// Função para redirecionar para a página de login
function irParaLogin() {
    window.location.href = "login.html";
}


// Função para redirecionar para a página de login do cliente
function irParaLoginCliente() {
    window.location.href = "login-cliente.html";
}

// Função para validar login do cliente (já existe no seu script.js)
function validarLoginCliente() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if (buscarUsuario(usuario, senha)) {
        exibirMensagem("Login realizado com sucesso!", "sucesso");
        setTimeout(() => {
            window.location.href = "pagina-principal-cliente.html";
        }, 1000);
    } else {
        exibirMensagem("Usuário ou senha incorretos.", "erro");
    }
}

// Funções de usuário
function cadastrarUsuario() {
    const novoUsuario = document.getElementById("usuario").value;
    const novaSenha = document.getElementById("senha").value;
    const novoEmail = document.getElementById("email").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    if (usuarios.some(u => u.usuario === novoUsuario)) {
        exibirMensagem("Usuário já existe!", "erro");
        return false;
    }
    
    if (!novoUsuario || !novaSenha || !novoEmail) {
        exibirMensagem("Preencha todos os campos!", "erro");
        return false;
    }

    usuarios.push({ usuario: novoUsuario, senha: novaSenha, email: novoEmail });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    exibirMensagem("Usuário cadastrado com sucesso!", "sucesso");
    
    // Limpa os campos após cadastro
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("email").value = "";
    
    return true;
}

function buscarUsuario(usuario, senha) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    return usuarios.find(u => u.usuario === usuario && u.senha === senha);
}

function validarLogin() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if (buscarUsuario(usuario, senha)) {
        exibirMensagem("Login realizado com sucesso!", "sucesso");
        setTimeout(() => {
            // Redireciona para a página principal do admin
            window.location.href = "pagina-principal.html";
        }, 1000);
    } else {
        exibirMensagem("Usuário ou senha incorretos.", "erro");
    }
}

function validarLoginCliente() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if (buscarUsuario(usuario, senha)) {
        exibirMensagem("Login realizado com sucesso!", "sucesso");
        setTimeout(() => {
            // Redireciona para a página principal do cliente
            window.location.href = "pagina-principal-cliente.html";
        }, 1000);
    } else {
        exibirMensagem("Usuário ou senha incorretos.", "erro");
    }
}


// Restante do código para o sistema da pizzaria permanece o mesmo...
function esqueceuSenha() {
  const usuario = prompt("Digite seu usuário:");
  const user = buscarUsuarioPorNome(usuario);
  if (user) {
    exibirMensagem(`Sua senha é: ${user.senha}`, "sucesso");
  } else {
    exibirMensagem("Usuário não encontrado.", "erro");
  }
}

function exibirMensagem(texto, tipo) {
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.classList.remove("hidden");

  setTimeout(() => {
    mensagem.classList.add("hidden");
  }, 3000);
}

// Sistema da Pizzaria (mantido igual)
let cardapio = JSON.parse(localStorage.getItem("cardapio")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let pedidoAtual = {
  cliente: "",
  itens: [],
  total: 0
};

// Funções para mostrar/selecionar seções - MODIFICADA
function mostrarSecao(secao) {
  // Esconde todas as seções de conteúdo (exceto a mensagem)
  document.querySelectorAll(".container > div").forEach(div => {
    if (div.id !== "mensagem" && !div.classList.contains("menu")) {
      div.classList.add("hidden");
    }
  });

  // Mostra a seção selecionada
  document.getElementById(secao).classList.remove("hidden");
  
  // Atualiza listas quando necessário
  if (secao === "consulta") atualizarCardapio();
  if (secao === "pedidos") atualizarListaPizzasPedido();
  if (secao === "relatorio") gerarRelatorioPedidos();
}

// Cadastro de Pizzas (mantido igual)
function adicionarPizza() {
  const nome = document.getElementById("nome-pizza").value;
  const ingredientes = document.getElementById("ingredientes").value;
  const preco = parseFloat(document.getElementById("preco").value);

  if (nome && ingredientes && preco) {
    cardapio.push({ nome, ingredientes, preco });
    localStorage.setItem("cardapio", JSON.stringify(cardapio));
    document.getElementById("nome-pizza").value = "";
    document.getElementById("ingredientes").value = "";
    document.getElementById("preco").value = "";
    exibirMensagem("Pizza adicionada ao cardápio!", "sucesso");
    atualizarCardapio();
  } else {
    exibirMensagem("Preencha todos os campos!", "erro");
  }
}

// Consulta de Pizzas (mantido igual)
function buscarPizza() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const resultados = cardapio.filter(pizza => 
    pizza.nome.toLowerCase().includes(busca)
  );
  atualizarCardapio(resultados);
}

function atualizarCardapio(lista = cardapio) {
  const tabela = document.getElementById("tabela-pizzas");
  tabela.innerHTML = "";

  lista.forEach(pizza => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${pizza.nome}</td>
      <td>${pizza.ingredientes}</td>
      <td>R$ ${pizza.preco.toFixed(2)}</td>
    `;
    tabela.appendChild(linha);
  });
}

// Alteração de Pizzas - MODIFICADA
let pizzaSelecionadaParaAlterar = null;

function buscarPizzaParaAlterar() {
  const busca = document.getElementById("busca-alterar").value.toLowerCase();
  pizzaSelecionadaParaAlterar = cardapio.find(pizza => 
    pizza.nome.toLowerCase().includes(busca)
  );

  if (pizzaSelecionadaParaAlterar) {
    document.getElementById("novo-nome").value = pizzaSelecionadaParaAlterar.nome;
    document.getElementById("novos-ingredientes").value = pizzaSelecionadaParaAlterar.ingredientes;
    document.getElementById("novo-preco").value = pizzaSelecionadaParaAlterar.preco;
    document.getElementById("form-alterar").classList.remove("hidden");
    exibirMensagem("Pizza encontrada! Faça as alterações necessárias.", "sucesso");
  } else {
    document.getElementById("form-alterar").classList.add("hidden");
    exibirMensagem("Pizza não encontrada no cardápio.", "erro");
  }
}

function alterarPizza() {
  if (!pizzaSelecionadaParaAlterar) {
    exibirMensagem("Nenhuma pizza selecionada para alteração.", "erro");
    return;
  }

  const novoNome = document.getElementById("novo-nome").value;
  const novosIngredientes = document.getElementById("novos-ingredientes").value;
  const novoPreco = parseFloat(document.getElementById("novo-preco").value);

  if (!novoNome || !novosIngredientes || !novoPreco) {
    exibirMensagem("Preencha todos os campos!", "erro");
    return;
  }

  // Atualiza a pizza no cardápio
  pizzaSelecionadaParaAlterar.nome = novoNome;
  pizzaSelecionadaParaAlterar.ingredientes = novosIngredientes;
  pizzaSelecionadaParaAlterar.preco = novoPreco;

  // Atualiza o localStorage
  localStorage.setItem("cardapio", JSON.stringify(cardapio));

  exibirMensagem("Pizza alterada com sucesso!", "sucesso");
  
  // Atualiza a busca para mostrar a pizza alterada
  document.getElementById("busca-alterar").value = novoNome;
  buscarPizzaParaAlterar();
  atualizarCardapio();
}

// Sistema de Pedidos (mantido igual)
function atualizarListaPizzasPedido() {
  const datalist = document.getElementById("lista-pizzas");
  datalist.innerHTML = "";
  
  cardapio.forEach(pizza => {
    const option = document.createElement("option");
    option.value = pizza.nome;
    datalist.appendChild(option);
  });
}

function adicionarItemPedido() {
  const cliente = document.getElementById("cliente").value;
  const nomePizza = document.getElementById("pizza-pedido").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!cliente || !nomePizza || !quantidade) {
    exibirMensagem("Preencha todos os campos!", "erro");
    return;
  }
  
  pedidoAtual.cliente = cliente;
  
  const pizza = cardapio.find(p => p.nome.toLowerCase() === nomePizza.toLowerCase());
  
  if (!pizza) {
    exibirMensagem("Pizza não encontrada no cardápio!", "erro");
    return;
  }
  
  const subtotal = pizza.preco * quantidade;
  
  // Verifica se a pizza já está no pedido
  const itemExistente = pedidoAtual.itens.find(item => item.pizza.toLowerCase() === pizza.nome.toLowerCase());
  
  if (itemExistente) {
    itemExistente.quantidade += quantidade;
    itemExistente.subtotal += subtotal;
  } else {
    pedidoAtual.itens.push({
      pizza: pizza.nome,
      quantidade,
      precoUnitario: pizza.preco,
      subtotal
    });
  }
  
  pedidoAtual.total += subtotal;
  
  atualizarPedido();
  exibirMensagem("Item adicionado ao pedido!", "sucesso");
  document.getElementById("pizza-pedido").value = "";
  document.getElementById("quantidade").value = "1";
}

function atualizarPedido() {
  const tabela = document.getElementById("itens-pedido");
  tabela.innerHTML = "";
  
  pedidoAtual.itens.forEach((item, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${item.pizza}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${item.precoUnitario.toFixed(2)}</td>
      <td>R$ ${item.subtotal.toFixed(2)}</td>
      <td><button onclick="removerItemPedido(${index})">Remover</button></td>
    `;
    tabela.appendChild(linha);
  });
  
  document.getElementById("total").textContent = pedidoAtual.total.toFixed(2);
}

function removerItemPedido(index) {
  const itemRemovido = pedidoAtual.itens.splice(index, 1)[0];
  pedidoAtual.total -= itemRemovido.subtotal;
  atualizarPedido();
  exibirMensagem("Item removido do pedido!", "sucesso");
}

function finalizarPedido() {
  if (pedidoAtual.itens.length === 0) {
    exibirMensagem("Adicione itens ao pedido!", "erro");
    return;
  }
  
  const pedido = {
    cliente: pedidoAtual.cliente,
    itens: [...pedidoAtual.itens],
    total: pedidoAtual.total,
    data: new Date().toLocaleString(),
    status: "Em preparo"
  };
  
  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  
  exibirMensagem(`Pedido de ${pedido.cliente} finalizado! Total: R$ ${pedido.total.toFixed(2)}`, "sucesso");
  
  // Limpa o pedido atual
  pedidoAtual = {
    cliente: "",
    itens: [],
    total: 0
  };
  
  document.getElementById("cliente").value = "";
  document.getElementById("itens-pedido").innerHTML = "";
  document.getElementById("total").textContent = "0.00";
}

// Relatórios - MODIFICADA
function gerarRelatorioPedidos() {
  const conteudo = document.getElementById("conteudo-relatorio");
  conteudo.innerHTML = "<h3>Relatório de Pedidos</h3>";
  
  const hoje = new Date().toLocaleDateString();
  const pedidosDoDia = pedidos.filter(pedido => {
    const dataPedido = new Date(pedido.data).toLocaleDateString();
    return dataPedido === hoje;
  });

  const tabela = document.createElement("table");
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Cliente</th>
        <th>Itens</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody id="tabela-relatorio-pedidos"></tbody>
  `;
  
  conteudo.appendChild(tabela);
  
  const corpoTabela = document.getElementById("tabela-relatorio-pedidos");
  corpoTabela.innerHTML = "";
  
  if (pedidosDoDia.length === 0) {
    corpoTabela.innerHTML = "<tr><td colspan='6'>Nenhum pedido registrado hoje</td></tr>";
    return;
  }
  
  let totalGeral = 0;
  
  pedidosDoDia.forEach((pedido, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${index + 1}</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.itens.map(item => `${item.quantidade}x ${item.pizza}`).join(", ")}</td>
      <td>R$ ${pedido.total.toFixed(2)}</td>
    `;
    corpoTabela.appendChild(linha);
    totalGeral += pedido.total;
  });
  
  // Linha do total geral
  const linhaTotal = document.createElement("tr");
  linhaTotal.innerHTML = `
    <td colspan="3"><strong>Total Geral</strong></td>
    <td><strong>R$ ${totalGeral.toFixed(2)}</strong></td>
    <td colspan="2"></td>
  `;
  corpoTabela.appendChild(linhaTotal);
}

function gerarRelatorioMaisVendidas() {
  const conteudo = document.getElementById("conteudo-relatorio");
  conteudo.innerHTML = "<h3>Pizzas Mais Vendidas</h3>";
  
  if (pedidos.length === 0) {
    conteudo.innerHTML += "<p>Nenhum pedido registrado ainda</p>";
    return;
  }
  
  // Contabiliza as vendas por pizza
  const vendas = {};
  
  pedidos.forEach(pedido => {
    pedido.itens.forEach(item => {
      if (!vendas[item.pizza]) {
        vendas[item.pizza] = 0;
      }
      vendas[item.pizza] += item.quantidade;
    });
  });
  
  // Converte para array e ordena
  const pizzasMaisVendidas = Object.entries(vendas)
    .map(([pizza, quantidade]) => ({ pizza, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
  
  const tabela = document.createElement("table");
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>Pizza</th>
        <th>Quantidade Vendida</th>
      </tr>
    </thead>
  `;
  
  conteudo.appendChild(tabela);
  
  const corpoTabela = document.getElementById("tabela-mais-vendidas");
  corpoTabela.innerHTML = "";
  
  pizzasMaisVendidas.forEach(item => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${item.pizza}</td>
      <td>${item.quantidade}</td>
    `;
    corpoTabela.appendChild(linha);
  });
}

function gerarRelatorioVendas() {
  mostrarSecao("relatorio-vendas");
  const tabela = document.getElementById("tabela-relatorio-vendas");
  tabela.innerHTML = "";
  
  if (pedidos.length === 0) {
    tabela.innerHTML = "<tr><td colspan='4'>Nenhuma venda registrada hoje</td></tr>";
    return;
  }
  
  // Filtra apenas os pedidos de hoje
  const hoje = new Date().toLocaleDateString();
  const pedidosDoDia = pedidos.filter(pedido => {
    const dataPedido = new Date(pedido.data).toLocaleDateString();
    return dataPedido === hoje;
  });
  
  if (pedidosDoDia.length === 0) {
    tabela.innerHTML = "<tr><td colspan='4'>Nenhuma venda registrada hoje</td></tr>";
    return;
  }
  
  pedidosDoDia.forEach(pedido => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${pedido.cliente}</td>
      <td>${pedido.itens.map(item => `${item.quantidade}x ${item.pizza}`).join(", ")}</td>
      <td>R$ ${pedido.total.toFixed(2)}</td>
    `;
    tabela.appendChild(linha);
  });
  // Remover qualquer linha extra de total ou colunas a mais
}

// Inicialização (mantido igual)
document.addEventListener("DOMContentLoaded", function() {
  // Carrega dados do localStorage se existirem
  if (localStorage.getItem("cardapio")) {
    cardapio = JSON.parse(localStorage.getItem("cardapio"));
  }
  if (localStorage.getItem("pedidos")) {
    pedidos = JSON.parse(localStorage.getItem("pedidos"));
  }
  
  // Atualiza o cardápio inicial
  atualizarCardapio();
});

// Salva dados no localStorage antes de sair (mantido igual)
window.addEventListener("beforeunload", function() {
  localStorage.setItem("cardapio", JSON.stringify(cardapio));
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
});