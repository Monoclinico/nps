
const spreadsheetID = '14VokMI9naR-pcZZMVkNyOhLhS4LQW6JyvdhnbaHApEs';

const urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1120078857`;


const urlmeta = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1037073560`;


const USUARIO = "avon";
const SENHA = "avon@2024";
const ATIVADO = true;

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
    let divResultados = document.getElementById("resultados");
    let carregando = document.getElementById("carregando");
    divResultados.textContent = '';
    carregando.style = "display: block;";

    obterDados(urldados).then(
        value => {

            let CPF = pesquisaCPF.toString().toLowerCase().trim()
    
            if ((CPF.length != 11) || !(possuiApenasNumeros(CPF)) || (CPF == "00000000000")) {
                divResultados.textContent = "Nenhum NPS encontrado";
            }else{

                let tabela = value.table.rows;
                
                let filtro = tabela.map((k) =>{
                    return k['c'];
                });

                
                let filtro2 = filtro.filter((k) =>{
                    let r1 = -1;
                    let r2 = -1;
                    r1 = k['0'].v.toString().trim().search(CPF.toString().trim())
                    r2 = k['0'].f.toString().trim().search(CPF.toString().trim())
                
                    return ((r1 > -1) ||( r2 > -1) );
                });

            
                criarTabelaHTML(filtro2);
                //calcularNPS(filtro2);
            }


           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            let divResultados = document.getElementById("resultados");
            divResultados.textContent = '';
            divResultados.textContent = "ERRO";
            console.log(value);
            carregando.style = "display: none;";
        }
    )
}

function possuiApenasNumeros(str) {
    return /^\d+$/.test(str);
}

function calcularNPS() {
    let nps_detratores = document.getElementById("nps_detratores");
    let nps_neutros = document.getElementById("nps_neutros");
    let nps_promotores = document.getElementById("nps_promotores");
    let nps_resultado = document.getElementById("nps_resultado");
    
    
    let d = parseInt(nps_detratores.value.toString().trim(), 10);
    let n = parseInt(nps_neutros.value.toString().trim(), 10);
    let p = parseInt(nps_promotores.value.toString().trim(), 10);
    d = isNaN(d) ? 0 : d;
    n = isNaN(n) ? 0 : n;
    p = isNaN(p) ? 0 : p;

    let soma = (d+n+p)
    let por_p = p/soma;
    let por_d = d/soma;
    if(soma == 0){
        nps_resultado.innerHTML = "---"
    }else{
        nps_resultado.innerHTML = parseFloat((por_p-por_d)*100).toFixed(2);
    }


}

function criarTabelaHTML(dados) {

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
        
        console.log(dados);
        dados.forEach(function (linha) {
            var linhaTabela = tbody.insertRow();

            for (let x = 0; x < linha.length;x++) {
                if(x == 0){//remove o CPF
                    continue;
                }else{
                    var celulaTabela = linhaTabela.insertCell();
                    let valor;

                    if (x == 1 || x == 2){
                        valor = linha[x].f;
                    }else{
                        valor = linha[x].v;
                    }

                    if (x == 11){
                        if (valor >= 9){
                            celulaTabela.style = "background-color: #7bff7b";
                        } else if((valor >= 7) && (valor < 9)) {
                            celulaTabela.style = "background-color: #fffc75";
                        }else {
                            celulaTabela.style = "background-color: #fc7979";
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

        });
        tabela.appendChild(tbody);
        divResultados.appendChild(tabela);
    }else{
        divResultados.textContent = "Nenhum NPS encontrado";
    }
    
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

        sessionStorage.setItem("usuario", USUARIO);
        sessionStorage.setItem("senha", SENHA);
        inserirPesquisa();
        inserirAtualizacao();
        inserirNPS();

    }else {
       let acesso = document.getElementById("acesso");
       acesso.style = " display: block;";
    }
    

}


function inserirPesquisa() {

    let pesquisaBotao = document.getElementById("pesquisa");
    let pesquisaCPF = document.getElementById("input_cpf");
    pesquisaBotao.addEventListener("click", function () {
        pesquisar(pesquisaCPF.value);
    })
}



function inserirNPS(){
    let calcular_nps = document.getElementById("calcular_nps");
    calcular_nps.addEventListener("click", calcularNPS);
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