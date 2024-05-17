
const spreadsheetID = '14VokMI9naR-pcZZMVkNyOhLhS4LQW6JyvdhnbaHApEs';

const urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1120078857`;


const urlmeta = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json&tq&gid=1037073560`;

const ATIVADO = true;

let dadosNPS = {};

let objColunas = {};

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



function pesquisar(pesquisaCPF){
    let carregando = document.getElementById("carregando");
    carregando.style = "display: block;";

    obterDados(urldados).then(
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

            
                dadosNPS = filtro2;
                automatizarNPS();

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

    let listaMeses = [];

    let iData = parseInt(encontrarChavePorValor(objColunas, "Data/Hora da Opinião"));
    let iNota = parseInt(encontrarChavePorValor(objColunas, "Nota"));

    for (let i = 0; i < dadosNPS.length; i++) {

        if (dadosNPS[i][iData] != null){
            if (dadosNPS[i][iData].f != null){
                let data = obterData(dadosNPS[i][iData].f);
                listaMeses.push(data);
            }
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

        let detrator = 0;
        let neutro = 0;
        let promotor = 0;

        for (let i = 0; i < dadosNPS.length; i++) {
            let dataObtida = "";

            if (dadosNPS[i][iData] != null){
                if (dadosNPS[i][iData].f != null){
                    dataObtida = obterData(dadosNPS[i][iData].f);
                }
            }

            let dataAtual = this.value.toString().trim();
            
            
            if (dataObtida == dataAtual) {

                let valor = -1;
                if (dadosNPS[i][iNota] != null){
                    if (dadosNPS[i][iNota].v != null){
                        valor = parseInt(dadosNPS[i][iNota].v);
                    }
                }

                if (valor >= 9){
                    promotor++;
                } else if((valor >= 7) && (valor < 9)) {
                    neutro++;
                }else {
                    if (valor != -1){
                        detrator++;
                    }
                }

            }
        }

        calcularNPS(detrator, neutro, promotor);

        
        criarTabelaHTML();
        
    });

    selectElement.addEventListener("change",function (){
        selectElement.click();
    });

    selectElement.click();
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

    let iData = parseInt(encontrarChavePorValor(objColunas, "Data/Hora da Opinião"));
    let iData0 = parseInt(encontrarChavePorValor(objColunas, "Data/Hora do Disparo"));
    let iCPF = parseInt(encontrarChavePorValor(objColunas, "CPF"));
    let iNota = parseInt(encontrarChavePorValor(objColunas, "Nota"));


    let selectElement = document.getElementById("select_meses");
    let dataAtual = selectElement.value.toString().trim();

    let divResultados = document.getElementById("resultados");
    divResultados.textContent = '';

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var trCabecalho = document.createElement("tr");


    for (const chave in objColunas) {
        if (chave != iCPF) {
            let th = document.createElement("th");
            th.textContent = objColunas[chave];
            trCabecalho.appendChild(th);
        }
    }

    thead.appendChild(trCabecalho);

    if (dadosNPS.length > 0){
       
        let tabela = document.createElement("table");
        tabela.setAttribute("id","tabela");

        tabela.appendChild(thead);
        
        for (let y = 0; y < dadosNPS.length;y++) {

            let data = "";

            if (dadosNPS[y][iData] != null){
                if (dadosNPS[y][iData].f != null){
                    data = obterData(dadosNPS[y][iData].f);
                }
            }

            if (data == dataAtual){

                var linhaTabela = tbody.insertRow();
                for (let x = 0; x < dadosNPS[y].length;x++) {
                    if(x == iCPF){
                        continue;
                    }else{
                        var celulaTabela = linhaTabela.insertCell();
                        let valor;
                        if (x == iData || x == iData0){
 
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

                        if (x == iNota){
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
        resultadoIncorreto("Nenhum registro foi encontrado");
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

async function enviarUrlViaPOST(CPF) {
    let cpf = CPF.toString();
    let horario = pegarHorarioAtual();

    let url = `https://docs.google.com/forms/d/e/1FAIpQLScRmjFnuLLUmPn13VR3Aw9MDDR6psqY05AKNkzYkIpU2PB4ig/formResponse?&submit=Submit?usp=pp_url&entry.1358987799=${cpf}&entry.566409605=${horario}`;
    
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

    }finally {
        console.clear();
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

function insirirConteudo(){
    inserirPesquisa();
    inserirAtualizacao();
    inserirBotoesMenu();
}

startSite(ATIVADO);

