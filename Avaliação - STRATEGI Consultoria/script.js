/** BLOCO - Integração com a API ViaCep  */

const cep = document.querySelector("#cep")


/** Função que preeenche autmaticamente os campos Logradouro, Number, Bairro, Localidade e UF  */
const mostrarDados = (resultado) => {
    for(const campo in resultado){
        document.querySelector("#" + campo) ?
         document.querySelector("#" + campo).value = resultado[campo] : ""
    }
}

/** Executa a conecção a API e recebe JSON com dados de consulta  */
cep.addEventListener("blur", (e) => {
    let busca = cep.value.replace("-", "")
    const opcoes = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    fetch(`https://viacep.com.br/ws/${busca}/json/`, opcoes)
    .then( response => {response.json()
        .then(dados => mostrarDados(dados))
    })
    .catch(e => console.log("Erro ao buscar" + e))
})

/** ==========================================================================================================*/
/** BLOCO - Validação do CPF  */

const cpf = document.querySelector('#cpf')

/** Padroniza uma máscara para o cpf eee.eee.eee-ee */
cpf.addEventListener('keypress', () => {
    let cpfLength = cpf.value.length
    cpfLength === 3 || cpfLength === 7 ? cpf.value += '.' :
    cpfLength === 11 ? cpf.value += '-' : ''
    
})

/** Validações após o campo CPF ser preeenchido */
cpf.addEventListener('focusout', () => {

    let strCPF = cpf.value.replace(/\.|-/g,'')
    
    function TestaCPF(strCPF) {
        let Soma = 0, Resto
        
        let arrCPF = []
        for(let i = 0 ; i < strCPF.length ; i++){
            arrCPF[i] = strCPF.split('')[i]
        }

        /** Valida se o número digitado forem d dígitos repetidos */
        let repeated = []
        for(let i = 0 ; i < (arrCPF.length - 1) ; i++){
            if(arrCPF[i] == arrCPF[ i + 1 ]){
                repeated.push(arrCPF[i])
            }
        }
        repeated.length == 10 ? alertCPF() : true
        

        /** Valida o primeiro dígito verificador do CPF (eee.eee.eee-Ee)  */
        for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i)
        Resto = (Soma * 10) % 11

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return alertCPF()

        /** Valida o segundo dígito verificador do CPF (eee.eee.eee-eE)  */
        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
        Resto = (Soma * 10) % 11

        if ((Resto == 10) || (Resto == 11))  Resto = 0
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return alertCPF()

        return true
    }
    
    function alertCPF(){
        return alert("O cpf informado é inválido")
    }
    TestaCPF(strCPF)
})

/** ==========================================================================================================*/
/** BLOCO - Inclusão de campo dinâmico de Hobbies  */

const hobby = document.querySelector("#hobby")
const newhobby = document.querySelector("#newHobby")
const btnHobby = document.querySelector("#btnHobby")

let hobbyDB = []

/** Funções que ouvem se a tecla Enter ou o butão 'Adicionar' foram acionados */
hobby.addEventListener( 'keypress', e => {
    if (e.key === 'Enter' && hobby.value !== '') {
        setHobbyDB()
    }
})

btnHobby.addEventListener('click', e => {
    if (hobby.value !== '') {
        setHobbyDB()
    }
})

/** Função responsável por setar o novo valor ao Array hobbydb */
function setHobbyDB(){
    hobbyDB.push ({'hobby': hobby.value })
    updateHobby()
}

/** Função responsável por inputar o array hobbyDB, no formato JSON, ao Local Storage do browser */
function updateHobby(){
    localStorage.setItem('hobbyList', JSON.stringify(hobbyDB))
    loadHobbies()
}

/** Função que consulta as informações armazenadas ao Local Storage do browser. 
 * enviando esses dados para a função que renderiza os dados.
*/
function loadHobbies (){
    newhobby.innerHTML = ""
    hobbyDB = JSON.parse(localStorage.getItem('hobbyList')) ?? []
    hobbyDB.forEach((hobby, i) => {
        insertHobbyTela(hobby.hobby, i)
    });
}

/** Função responsável por renderizar os dados do hobbyDB */
function insertHobbyTela (text, i){
    const li = document.createElement('li')

    li.innerHTML = `
        <div class="hobbylist">
            <span>${text}</span>
            <i class='bx bxs-trash' onclick="removeHobby(${i})"></i>
        </div>
    `
    newhobby.appendChild(li)
    hobby.value = ''
    hobby.focus()
}

/** Função responsável por remover os hobbies do hobbyDB e atualizá-lo no Local Storage */
function removeHobby (i){
    hobbyDB.splice(i, 1)
    updateHobby()
}

loadHobbies()

/** ==========================================================================================================*/
/** BLOCO - Coleta de dados do Formulário  */

const body = document.querySelectorAll('input')
const txtArea = document.querySelector('#txtArea')
const modal = document.querySelector('.modal')
const chkLgpd = document.querySelector('#chkLgpd')
const btn = document.querySelector('#btnSubmit')

/** Confirmação se o usuário confirmou e concordou com a política de LGPD */
btn.addEventListener('click', () =>{
    chkLgpd.checked ? renderModal() : alert('Antes de prosseguir, você precisa concordar com nossa política de proteção de dados.')
})

/** Função que coleta os dados o formulário e converte ao formato JSON */
const renderModal = () => {
    let listaHobbies = []
    hobbyDB.forEach((hobby, i) => {
        listaHobbies[i] = hobby.hobby
    });

    let fieldsValue = JSON.stringify({
        Nome : body[0].value,
        CPF : body[1].value,
        Data_de_Nascimento : body[2].value,
        Idade : body[3].value,
        CEP : body[4].value,
        Logradouro : body[5].value,
        Número : body[6].value,
        Bairro : body[7].value,
        Cidade : body[8].value,
        Estado : body[9].value,
        Hobby: listaHobbies ?? []
    })
    
    txtArea.value = `Os dados captados pelo formulário foram: ${fieldsValue}`
    modal.style.display = 'flex'
}
