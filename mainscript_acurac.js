

const nomecpfID = "14VokMI9naR-pcZZMVkNyOhLhS4LQW6JyvdhnbaHApEs";
const urlNomeCPF = `https://docs.google.com/spreadsheets/d/${nomecpfID}/gviz/tq?tqx=out:json&tq&gid=1925747377`;

const spreadsheetID = '1pORUAqUrp-8Kj6k1-C8u2KdOCIZ5LN9NsqyjaC3EZiI';
const urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1914081637`;

const urlmeta = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=131297266`;


const ATIVADO = true;

let dadosNPS = {};

let objColunas = {};

let dadosCPF = {};

let CPF = "";

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



function pesquisarNome(pesquisaCPF){
    let carregando = document.getElementById("carregando");
    carregando.style = "display: block;";

    obterDados(urlNomeCPF).then(
        value => {

            CPF = removerPontosEHifens(pesquisaCPF.toString().toLowerCase().trim());
            
            if (validarCPF(CPF)) {

                let tabela = value.table.rows;
                let colunas1 = value.table.cols;

                let filtro = tabela.map((k) =>{
                    return k['c'];
                });

                let listaC = colunas1.map((coluna) => {
                    return coluna.label;
                });

                objColunas = criarObjetoDeLista(listaC);

                let iCPF = parseInt(encontrarChavePorValor(objColunas, "CPF"));
                let iNome1 = parseInt(encontrarChavePorValor(objColunas, "NOME1"));
                let iNome2 = parseInt(encontrarChavePorValor(objColunas, "NOME2"));

                let filtro2 = filtro.filter((k) =>{
                    let r1 = -1;
                    let r2 = -1;
                    if(k[iCPF] != null) {
                        if (k[iCPF].v != null){
                            r1 = preencherZerosCPF(k[iCPF].v.toString().trim()).search(CPF);
                        }
                        if(k[iCPF].f != null) {
                            r2 = preencherZerosCPF(k[iCPF].f.toString().trim()).search(CPF);
                        }

                    }
                    return ((r1 > -1) ||( r2 > -1) );
                });

                let nome1 = "";
                let nome2 = "";
                if(filtro2.length > 0) {
                    for (const valor of filtro2) {
                        if (valor[iNome1] != null){
                            if (valor[iNome1].v !=null) {
                                nome1 = valor[iNome1].v.toString().trim();
                            }
                        }
                        if (valor[iNome2] != null){
                            if (valor[iNome2].v !=null) {
                                nome2 = valor[iNome2].v.toString().trim();
                            }
                        }
                    }
                }

                dadosCPF = {
                    n1: nome1, 
                    n2: nome2
                }
             
                pesquisar(dadosCPF);

            }else{
                resultadoIncorreto("Nenhum registro foi encontrado");
            }

           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            //console.log(value);
            resultadoIncorreto("Erro Interno");
            carregando.style = "display: none;";
        }
    )
}


function pesquisar(dadosNomes){
    let carregando = document.getElementById("carregando");
    carregando.style = "display: block;";

    obterDados(urldados).then(
        value => {

            if (validarNome(dadosNomes)) {

                let tabela = value.table.rows;
                let colunas1 = value.table.cols;

                let filtro = tabela.map((k) =>{
                    return k['c'];
                });

                let listaC = colunas1.map((coluna) => {
                    return coluna.label;
                });

                objColunas = criarObjetoDeLista(listaC);
                let iProprietario = parseInt(encontrarChavePorValor(objColunas, "PROPRIETÁRIO"));
                console.log(iProprietario );
               
                let filtro2 = filtro.filter((k) =>{
                    let r1 = -1;
                    let r2 = -1;
                    let r3 = -1;
                    let r4 = -1;
  
                    if (k[iProprietario ] != null) {
                        if (k[iProprietario].v != null) {
                            if (dadosNomes["n1"].length > 0){
                                r1 = k[iProprietario].v.toString().trim().toUpperCase().search(dadosNomes["n1"].toUpperCase());
                            }
                            if (dadosNomes["n2"].length > 0){
                                r2 = k[iProprietario].v.toString().trim().toUpperCase().search(dadosNomes["n2"].toUpperCase());
                            }
                        }
                        if (k[iProprietario].f != null) {
                            if (dadosNomes["n1"].length > 0){
                                r3 = k[iProprietario].f.toString().trim().toUpperCase().search(dadosNomes["n1"].toUpperCase());
                            }
                            if (dadosNomes["n2"].length > 0){
                                r4 = k[iProprietario].f.toString().trim().toUpperCase().search(dadosNomes["n2"].toUpperCase());
                            }
                        }

                    }
                    return ((r1 > -1) ||( r2 > -1) || ( r3 > -1) || ( r4 > -1));
                });

                console.log(filtro2);
                dadosNPS = filtro2;
                criarTabelaHTML();
                
            }else{
                resultadoIncorreto("Nenhum registro foi encontrado");
            }

           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            console.log(value);
            resultadoIncorreto("Erro Interno");
            carregando.style = "display: none;";
        }
    )
}


function obterData(data) {
    let d = data.toString().trim().split(/[\s/,:]+/);
    let mes = "";
    let ano = "";
    if (d[1].length > 2){
        mes = d[1].substring(d[1].length - 2);
    }else{
        mes = (d[1] ?? "").padStart(2, "0");
    }

    if (d[2].length > 2){
        ano = d[2].substring(d[2].length - 2);
    }else{
        ano = (d[2] ?? "").padStart(2, "0");
    }

    return `${mes}/${ano}`;
}

function criarTabelaHTML() {

    let iData = parseInt(encontrarChavePorValor(objColunas, "CRIAÇÃO"));
    let iCPF = parseInt(encontrarChavePorValor(objColunas, "CPF"));
    let iNota = parseInt(encontrarChavePorValor(objColunas, "Nota"));

    let divResultados = document.getElementById("resultados");
    divResultados.textContent = '';

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var trCabecalho = document.createElement("tr");


    for (const chave in objColunas) {
        let th = document.createElement("th");
        th.textContent = objColunas[chave];
        trCabecalho.appendChild(th);
    }

    thead.appendChild(trCabecalho);

    if (dadosNPS.length > 0){
       
        let tabela = document.createElement("table");
        tabela.setAttribute("id","tabela");

        tabela.appendChild(thead);
        
        for (let y = 0; y < dadosNPS.length;y++) {

                let linhaTabela = tbody.insertRow();
                for (let x = 0; x < dadosNPS[y].length;x++) {
                   
                    var celulaTabela = linhaTabela.insertCell();
                    let valor;
                    if (x == iData){

                        if(dadosNPS[y][x] == null ) {
                            valor = "";
                        }else{
                            valor = dadosNPS[y][x].f != null ? dadosNPS[y][x].f : "";
                        }

                    }else{
                        if(dadosNPS[y][x] == null ) {
                            valor = "";
                        }else{
                            valor = dadosNPS[y][x].v != null ? dadosNPS[y][x].v : "";
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


        tabela.appendChild(tbody);
        divResultados.appendChild(tabela);
        divResultados.style = "display: flex;";

    }else{
        resultadoIncorreto("Nenhum registro foi encontrado");
    }
    
}

function resultadoIncorreto(mensagem){
    let divResultados = document.getElementById("resultados");
    let frase = document.createElement("p");

    frase.innerHTML = mensagem.toString();
    frase.classList.add("mensagem_erro");
    divResultados.textContent = '';
    divResultados.appendChild(frase);
    divResultados.style = "display: flex;";


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



function inserirPesquisa() {

    let pesquisaBotao = document.getElementById("pesquisa");
    let pesquisaCPF = document.getElementById("input_cpf");
    pesquisaBotao.addEventListener("click", function () {
        pesquisarNome(pesquisaCPF.value);
       
    })
}

function insirirConteudo(){
    inserirPesquisa();
    inserirAtualizacao();
    inserirBotoesMenu();
}

startSite(ATIVADO);

