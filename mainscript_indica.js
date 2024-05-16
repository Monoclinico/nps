let spreadsheetID_indicadores = "1pORUAqUrp-8Kj6k1-C8u2KdOCIZ5LN9NsqyjaC3EZiI";

let urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID_indicadores}/gviz/tq?tqx=out:json&tq&gid=0`;


let urlmeta = `https://docs.google.com/spreadsheets/d/${spreadsheetID_indicadores}/gviz/tq?tqx=out:json&tq&gid=75941007`;


const ATIVADO = true;

let dadosIndicadores = {};
let dadosIndicadoresCabecalho = {};
let dadosParametros = {};

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

            if (validarCPF(CPF)) {
           
                let tabela = value.table.rows;

                dadosIndicadoresCabecalho = value.table.cols;
                
                let filtro = tabela.map((k) =>{
                    return k['c'];
                });
                

                dadosParametros = filtro[0];

                let filtro2 = filtro.filter((k) =>{
                    let r1 = -1;
                    let r2 = -1;
                    let indiceCPF = 0;

                    for(let c = 0;c < dadosIndicadoresCabecalho.length; c++) {
                        if (dadosIndicadoresCabecalho[c]["label"] == "CPF"){
                            indiceCPF = c;
                            break;
                        }
                    }

                    if(k[indiceCPF] != null) {
                        if (k[indiceCPF].v != null){
                            r1 = preencherZerosCPF(k[indiceCPF].v.toString().trim()).search(CPF.toString().trim())
                        }
                        if (k[indiceCPF].f != null) {
                            r2 = preencherZerosCPF(k[indiceCPF].f.toString().trim()).search(CPF.toString().trim())
                        }
                    }
                    return ((r1 > -1) ||( r2 > -1) );
                });

                dadosIndicadores = filtro2;
                criarTabelaHTML();

            }else{
                resultadoIncorreto("Nenhum registro foi encontrado");
            }

           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            resultadoIncorreto("Erro Interno");
            //console.log(value);
            carregando.style = "display: none;";
        }
    )
}

function preencherZerosCPF(cpfp) {
    const cpfPadrao = "00000000000";

    let cpf = limparString(cpfp.toString());

    if (cpf.length < 11) {
        const zerosFaltantes = 11 - cpf.length;
        cpf = cpfPadrao.substring(0, zerosFaltantes) + cpf;
    }

    return cpf;
}


function limparString(string) {
    return string.replace(/[.\-\s]/g, '');
}

function validarNumero(n) {
    let numberPattern = /^[0-9]+(?:[,\.][0-9]+)?$/;
    return numberPattern.test(n);
}

function removerPercentagem(string) {
    return string.replace(/%/g, '');
}

function formatarPorcentagem(v1, v2) {
    let valor1 = v1.toString();
    let valor2 = v2.toString();



    if (valor1.includes('%')) {
        return valor1.replace('%', '');
    } else if (valor2.includes('%')) {
        return valor2.replace('%', '');
    } else {
        return valor1;
    }
}

function criarTabelaHTML() {

    let cabecalhos = [];
    let dados = dadosIndicadores;
    let parametros = dadosParametros;

    let divResultados = document.getElementById("resultados");

    divResultados.textContent = '';

    if ((dados.length > 0) && (dadosIndicadoresCabecalho.length > 0 )){

        for (let x = 0; x < dadosIndicadoresCabecalho.length ;x++){
            cabecalhos.push(dadosIndicadoresCabecalho[x]["label"].toString());
        }

        for (let lin = 0; lin < dados.length; lin++){

            let linha = document.createElement("div");
            linha.classList.add("resultados_linha");

            let linha_quebra_1 = document.createElement("div");
            linha_quebra_1.classList.add("resultados_quebra_linha");

            let linha_quebra_2 = document.createElement("div");
            linha_quebra_2.classList.add("resultados_quebra_linha");

            let linha_atual = 1;

            for (let c = 0;c < cabecalhos.length ;c++) {

                let valor1 = "";
                if (dados[lin] != null){
                    if(dados[lin][c] != null){
                        let v1 = dados[lin][c].v != null ? dados[lin][c].v : "";
                        let v2 = dados[lin][c].f != null ? dados[lin][c].f : "";
                        valor1 = formatarPorcentagem(v1.toString(), v2.toString());
                    }
                }

                let param1 = "";
                if (dadosParametros[c] != null){
                    let v1 = dadosParametros[c].v != null ? dadosParametros[c].v : "";
                    let v2 = dadosParametros[c].f != null ? dadosParametros[c].f : "";
                    param1 = formatarPorcentagem(v1.toString(), v2.toString());
                }
                

                let cabec1 = "";
                cabec1 = cabecalhos[c] != null ? cabecalhos[c] : "";
                cabec1 = cabec1.toString().trim().toUpperCase();

                let indicador = document.createElement("div");
                indicador.classList.add("resultados_filhos");

                let p_label = document.createElement("p");
                p_label.classList.add("label_cabecalho");

                let p_valor = document.createElement("p");
                p_valor.classList.add("label_valor");


                let e_num = 0.0;
                let p_num = 0.0;
                let vali_num = validarNumero(valor1);
                let vali_num_p = validarNumero(param1);

                if (vali_num){
                    e_num = parseFloat(valor1);
                }

                if (vali_num_p){
                    p_num = parseFloat(param1);
                }

                switch (cabec1){

                    case "CPF":

                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num})` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        p_valor.innerHTML = preencherZerosCPF(valor1.toString().trim());
                        break;

                    case "ABS":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num})` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }
    
                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }
    
                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case "ADERÊNCIA":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num}%)` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }
    
                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }
    
                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case "QUALIDADE":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num}%)` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;
                    
                    case "TMA (VOZ)":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num})` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;
                    case "TMA (CHAT)":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num})` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;
                    case "TABULAÇÃO":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num}%)` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case "NCG":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num})` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        if (vali_num && vali_num_p){
                            if (e_num <= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case "FCR":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num}%)` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        if (vali_num && vali_num_p){
                            if (e_num >= p_num){
                                p_valor.classList.add("dentro_meta");
                            }else{
                                p_valor.classList.add("fora_meta");
                            }
                        }else{
                            p_valor.classList.add("sem_meta");
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}%`;
                        }else{
                            p_valor.innerHTML = "" ;
                        }

                        break;

                    case "MÉDIA":
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num})` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        if (valor1.toString().trim() != ""){
                            p_valor.innerHTML = `${e_num}`;
                        }else{
                            p_valor.innerHTML = "" ;
                            p_valor.classList.add("sem_meta");
                        }

                        break;

                    default:
                        if (param1.toString().trim() != ""){
                            p_label.innerHTML = `${cabec1} (${p_num})` ;
                        }else{
                            p_label.innerHTML = cabec1 ;
                        }

                        p_valor.innerHTML = `${valor1}`;
                }

                if (cabec1 == "ABS"){
                    linha_atual = 2;
                }

                indicador.appendChild(p_label);
                indicador.appendChild(p_valor);

                if (linha_atual == 1){
                    linha_quebra_1.appendChild(indicador);
                }else{
                    linha_quebra_2.appendChild(indicador);
                }


            }
            linha.appendChild(linha_quebra_1);
            linha.appendChild(linha_quebra_2);
            divResultados.appendChild(linha);
        }

    }else{
        resultadoIncorreto("Nenhum registro foi encontrado");
    }
    
}

function resultadoIncorreto(mensagem){
    let divResultados = document.getElementById("resultados");
    let frase = document.createElement("p");

    frase.innerHTML = mensagem.toString();
    frase.style = "text-align: center;font-size: 1.3em;color: brown;font-weight: 900;";
    divResultados.textContent = '';
    divResultados.appendChild(frase);

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
        pesquisar(pesquisaCPF.value);
        
    })
}


function insirirConteudo(){
    inserirPesquisa();
    inserirAtualizacao();
    inserirBotoesMenu();
}

startSite(ATIVADO);
