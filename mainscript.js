
const spreadsheetID = '14VokMI9naR-pcZZMVkNyOhLhS4LQW6JyvdhnbaHApEs';

const urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1120078857`;


const urlmeta = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1037073560`;


const USUARIO = "avon";
const SENHA = "avon@2024";
const ATIVADO = true;

let dadosNPS = {};

async function obterDados(link){

    let data = await fetch(link);
    let texto1 = await data.text()
    let texto2 = texto1.replaceAll(
        "/*O_o*/\ngoogle.visualization.Query.setResponse(",
        ""
    );    
    let texto3 = texto2.replace(
        ");",
        ""
    );

    return JSON.parse(texto3);
}



function pesquisar(pesquisaCPF){
    let carregando = document.getElementById("carregando");
    carregando.style = "display: block;";

    obterDados(urldados).then(
        value => {

            let CPF = removerPontosEHifens(pesquisaCPF.toString().toLowerCase().trim());
            
            if ((CPF.length != 11) || !(possuiApenasNumeros(CPF)) || (CPF == "00000000000")) {
                resultadoIncorreto("Nenhum NPS foi encontrado");
            }else{

                let tabela = value.table.rows;
                
                let filtro = tabela.map((k) =>{
                    return k['c'];
                });

                
                let filtro2 = filtro.filter((k) =>{
                    let r1 = -1;
                    let r2 = -1;
                    if(k['0'] != null) {
                        r1 = k['0'].v.toString().trim().search(CPF.toString().trim())
                        r2 = k['0'].f.toString().trim().search(CPF.toString().trim())
                    }
                    return ((r1 > -1) ||( r2 > -1) );
                });

            
                dadosNPS = filtro2;
                automatizarNPS();

            }

           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            resultadoIncorreto("Erro Interno");
            carregando.style = "display: none;";
        }
    )
}

function possuiApenasNumeros(str) {
    return /^\d+$/.test(str);
}

function removerPontosEHifens(texto) {
    var textoSemPontosEHifens = texto.replace(/\./g, '').replace(/-/g, '');
    return textoSemPontosEHifens.toString();
}

function calcularNPS(detrator, neutro, promotor) {
    let nps_detratores = document.getElementById("nps_detratores");
    let nps_neutros = document.getElementById("nps_neutros");
    let nps_promotores = document.getElementById("nps_promotores");
    let nps_resultado = document.getElementById("nps_resultado");

    let d = parseInt(detrator);
    let n = parseInt(neutro);
    let p = parseInt(promotor);

    d = isNaN(d) ? 0 : d;
    n = isNaN(n) ? 0 : n;
    p = isNaN(p) ? 0 : p;

    nps_detratores.value = d;
    nps_neutros.value = n;
    nps_promotores.value =  p;

    let soma = (d+n+p)
    let por_p = p/soma;
    let por_d = d/soma;
    if(soma == 0){
        nps_resultado.innerHTML = "---"
    }else{
        nps_resultado.innerHTML = parseFloat((por_p-por_d)*100).toFixed(2);
    }


}


function automatizarNPS() {
    let selectElement = document.getElementById("select_meses");
    selectElement.textContent = "";

    let listaOpcoes =  dadosNPS;

    let listaMeses = [];

    for (let i = 0; i < listaOpcoes.length; i++) {

        if (listaOpcoes[i][2] != null){
            let data = obterData(listaOpcoes[i][2].f);
            listaMeses.push(data);
        }
        
    }

    listaMeses = listaMeses.filter(function(item, index, array) {
        return array.indexOf(item) === index;
    });

    listaMeses = listaMeses.reverse();

    for (let i = 0; i < listaMeses.length; i++) {

      let optionElement = document.createElement("option");
      optionElement.value = listaMeses[i];
      optionElement.text = listaMeses[i];
      selectElement.appendChild(optionElement);
    }

    selectElement.addEventListener("click",function (){

        let pesquisaCPF = document.getElementById("input_cpf");
        let detrator = 0;
        let neutro = 0;
        let promotor = 0;

        let CPF = removerPontosEHifens(pesquisaCPF.value.toString().toLowerCase().trim());

        for (let i = 0; i < dadosNPS.length; i++) {
            let dataObtida = "";
            if (dadosNPS[i][2] != null){
                dataObtida = obterData(dadosNPS[i][2].f).toString().trim();
            }

            let dataAtual = this.value.toString().trim();
            
            
            if (dataObtida == dataAtual) {

                let valor = parseInt(dadosNPS[i][11].v);

                if (valor >= 9){
                    promotor++;
                } else if((valor >= 7) && (valor < 9)) {
                    neutro++;
                }else {
                    detrator++;
                }
            }
        }
        calcularNPS(detrator, neutro, promotor);

        if ((CPF.length == 11) && (possuiApenasNumeros(CPF)) && (CPF != "00000000000")) {
            criarTabelaHTML();
        }
    });

    selectElement.addEventListener("change",function (){
        selectElement.click();
    });

    selectElement.click();
}

function obterData(data) {
    let d = data.toString().trim().split(/[\s/,:]+/);
    let mes = d[1];
    let ano = d[2];

    return `${mes}/${ano}`;
}

function criarTabelaHTML() {

    let dados = dadosNPS;

    let selectElement = document.getElementById("select_meses");
    let dataAtual = selectElement.value.toString().trim();
    let divResultados = document.getElementById("resultados");
    divResultados.textContent = '';

    var cabecalhos = ["Data/Hora do Disparo", "Data/Hora da Opinião", "Nome", "Meio de Contato", "Motivo 1", "Motivo 2", "Motivo 3", "Usuário (Usuário Proprietário)", "Protocolo de Atendimento", "Canal", "Nota", "Comentário"];

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var trCabecalho = document.createElement("tr");

    cabecalhos.forEach(function(cabecalho) {
        var th = document.createElement("th");
        th.textContent = cabecalho;
        trCabecalho.appendChild(th);
    });

    thead.appendChild(trCabecalho);

    if (dados.length > 0){
       
        let tabela = document.createElement("table");
        tabela.setAttribute("id","tabela");

        tabela.appendChild(thead);
        
        for (let y = 0; y < dados.length;y++) {
            let data = "";
            if (dados[y][2] != null){
                data = obterData(dados[y][2].f).toString().trim();
            }

            if (data == dataAtual){

                var linhaTabela = tbody.insertRow();
                for (let x = 0; x < dados[y].length;x++) {
                    if(x == 0){
                        continue;
                    }else{
                        var celulaTabela = linhaTabela.insertCell();
                        let valor;
                        if (x == 1 || x == 2){
 
                            if(dados[y][x] == null ) {
                                valor = "";
                            }else{
                                valor = dados[y][x].f != null ? dados[y][x].f : "";
                            }

                        }else{
                            if(dados[y][x] == null ) {
                                valor = "";
                            }else{
                                valor = dados[y][x].v != null ? dados[y][x].v : "";
                            }
                        }

                        if (x == 11){
                            if (valor >= 9){
                                celulaTabela.classList.add("nota_boa");
                            } else if((valor >= 7) && (valor < 9)) {
                                celulaTabela.classList.add("nota_neutra");
                            }else {
                                celulaTabela.classList.add("nota_ruim");
                            }
                        }

                        if (valor == null) {
                            valor = "";
                        }else{
                            valor = valor.toString();
                        }

                        celulaTabela.textContent = valor;

                    }
                }
            }

        }


        tabela.appendChild(tbody);
        divResultados.appendChild(tabela);
    }else{
        resultadoIncorreto("Nenhum NPS foi encontrado");
    }
    
}

function resultadoIncorreto(mensagem){
    let nps_detratores = document.getElementById("nps_detratores");
    let nps_neutros = document.getElementById("nps_neutros");
    let nps_promotores = document.getElementById("nps_promotores");
    let nps_resultado = document.getElementById("nps_resultado");
    let selectElement = document.getElementById("select_meses");
    let divResultados = document.getElementById("resultados");
    let frase = document.createElement("p");


    frase.innerHTML = mensagem.toString();
    frase.style = "text-align: center;font-size: 1.3em;color: brown;font-weight: 900;";
    divResultados.textContent = '';
    divResultados.appendChild(frase);

    nps_detratores.value = 0;
    nps_neutros.value = 0; 
    nps_promotores.value = 0; 
    nps_resultado.innerHTML = "---";
    selectElement.textContent = "";


}

function inserirAtualizacao(){
    let data_inicio = document.getElementById("data_atualizacao_inicio");

    let data_fim = document.getElementById("data_atualizacao_fim");

    obterDados(urlmeta).then(
        value => {
            let tabela = value.table.rows;
         
            data_inicio.innerHTML = (tabela['1']['c'][0].v);
            data_fim.innerHTML = (tabela['1']['c'][1].v);
            
        }
    ).catch(
        value => {
           
            data_inicio.innerHTML = "---";
            data_fim.innerHTML = "---";
        }
    )
}

function login() {
    let bloco_login = document.getElementById("id_bloco_login");
    let input_usuario = document.getElementById("usuario");
    let input_senha = document.getElementById("senha");
    let blocoPesquisa = document.getElementById("id_bloco_pesquisa");
    let resumo_nps = document.getElementById("resumo_nps");
    let bloco_principal_menu = document.getElementById("bloco_principal_menu");
    let resultados = document.getElementById("resultados");

    let u = sessionStorage.getItem("usuario");
    let s = sessionStorage.getItem("senha");

    if((u == USUARIO) && (s == SENHA)){
        input_usuario.value =  sessionStorage.getItem("usuario");
        input_senha.value = sessionStorage.getItem("senha");
    }
    
    if ((SENHA == input_senha.value.toString()) && (USUARIO == input_usuario.value.toString())){
        bloco_login.style = "display: none;";
        blocoPesquisa.style = "display: block;";
        resumo_nps.style = "display: flex;";
        resultados.style = "display: flex;";
        bloco_principal_menu.style = "display: flex;";

        sessionStorage.setItem("usuario", USUARIO);
        sessionStorage.setItem("senha", SENHA);
        inserirPesquisa();
        inserirAtualizacao();

        botoesMenu();

    }else {
       let acesso = document.getElementById("acesso");
       acesso.style = " display: block;";
    }
    

}


async function enviarUrlViaPOST(CPF) {
    let cpf = CPF.toString();
    let url = `https://docs.google.com/forms/d/e/1FAIpQLScRmjFnuLLUmPn13VR3Aw9MDDR6psqY05AKNkzYkIpU2PB4ig/formResponse?&submit=Submit?usp=pp_url&entry.1358987799=${cpf}`;
    
    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': '',
        },
        body: '',
      });

  
      const resultado = await resposta.json();
      
    } catch (erro) {

    }
  }


function inserirPesquisa() {

    let pesquisaBotao = document.getElementById("pesquisa");
    let pesquisaCPF = document.getElementById("input_cpf");
    pesquisaBotao.addEventListener("click", function () {
        pesquisar(pesquisaCPF.value);
        enviarUrlViaPOST(pesquisaCPF.value);
    
    })
}


function botoesMenu(){
    let extremidade = "/nps/"; // colocar / se for local host
    let caminho = "indicadores.html";
    let urlBase = `http://${window.location.hostname}:${window.location.port}${extremidade}${caminho}`;

    let botao_sair = document.getElementById("sair");
    let botao_indicadores = document.getElementById("pagina_indicadores");

    botao_indicadores.addEventListener("click", function () {
        window.open(urlBase.toString(), "_self");
    });

    botao_sair.addEventListener("click", function () {
        sessionStorage.clear();
        location.reload();
    });

}


let botao_logar = document.getElementById("btn_logar");

if (ATIVADO){
    botao_logar.addEventListener("click",login);
    let u = sessionStorage.getItem("usuario");
    let s = sessionStorage.getItem("senha");

    if((u == USUARIO) && (s == SENHA)){
        login();
    }

}else{
    document.getElementById("fora").style.display = "block";

}
