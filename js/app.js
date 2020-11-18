const selectPaises = document.querySelector('#paises');
const formulario = document.querySelector('#formulario');
const hoy = new Date().toISOString().slice(0, 10);

document.addEventListener('DOMContentLoaded', () => {
    consultarListaPaises();
    consultarDatosMundiales();
    formulario.addEventListener('submit', consultarDatosPais)
});

async function consultarDatosMundiales() {
    const url = `https://api.covid19tracking.narrativa.com/api/${hoy}`;
    spinner();
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        datosMundiales(resultado.total);
    } catch (error) {
        console.error(error);
    }
}

async function consultarListaPaises() {
    const url = 'https://api.covid19tracking.narrativa.com/api/countries';
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        llenarSelectPaises(resultado.countries)
    } catch (error) {
        console.error(error);
    }
}

async function consultarDatosPais(e) {
    e.preventDefault();
    const pais = document.querySelector('#paises').value;
    if (pais === '') {
        mostrarAlerta('Seleccione País');
        return;
    }

    const url = `https://api.covid19tracking.narrativa.com/api/${hoy}/country/${pais}`;
    spinner();
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const datos = resultado.dates[hoy].countries[pais];
        mostrarDatos(datos);
    } catch (error) {
        console.error(error);
    }
}

function llenarSelectPaises(paises) {
    paises.sort((a, b) => a.name_es.localeCompare(b.name_es));
    paises.forEach(pais => {
        const {
            name_es,
            name
        } = pais
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name_es;
        selectPaises.appendChild(option);
    });
}

function datosMundiales(datos) {
    limpiarHTML();
    const {
        today_confirmed,
        today_deaths,
        today_recovered,
    } = datos;

    const titulo = document.createElement('h1');
    titulo.classList.add('mb-4', 'text-center');
    titulo.innerHTML = `Datos Mundiales <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    const fecha = document.createElement('p');
    fecha.innerHTML = `<strong>${new Date().toLocaleDateString()}</strong>`;

    const casosConfirmados = document.createElement('p');
    casosConfirmados.innerHTML = `<strong>${today_confirmed}</strong> Casos confirmados`;

    const muertos = document.createElement('p');
    muertos.innerHTML = `<strong>${today_deaths}</strong> Muertos`;

    const recuperados = document.createElement('p');
    recuperados.innerHTML = `<strong>${today_recovered}</strong> Recuperados`;

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('mt-5', 'text-center');
    resultadoDiv.appendChild(titulo);
    resultadoDiv.appendChild(fecha);
    resultadoDiv.appendChild(casosConfirmados);
    resultadoDiv.appendChild(muertos);
    resultadoDiv.appendChild(recuperados);

    resultado.appendChild(resultadoDiv)
}

function mostrarDatos(datos) {
    limpiarHTML();
    const {
        name_es,
        today_confirmed,
        today_deaths,
        today_recovered,
        source
    } = datos;

    const tituloPais = document.createElement('h1');
    tituloPais.classList.add('mb-4', 'text-center');
    tituloPais.textContent = name_es;

    const fecha = document.createElement('p');
    fecha.innerHTML = `<strong>${new Date().toLocaleDateString()}</strong>`;

    const casosConfirmados = document.createElement('p');
    casosConfirmados.innerHTML = `<strong>${today_confirmed}</strong> Casos confirmados`;

    const muertos = document.createElement('p');
    muertos.innerHTML = `<strong>${today_deaths}</strong> Muertos`;

    const recuperados = document.createElement('p');
    recuperados.innerHTML = `<strong>${today_recovered}</strong> Recuperados`;

    const fuente = document.createElement('p');
    fuente.innerHTML = `<strong>Fuente:</strong> "${source}"`;

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('mt-5', 'text-center');
    resultadoDiv.appendChild(tituloPais);
    resultadoDiv.appendChild(fecha);
    resultadoDiv.appendChild(casosConfirmados);
    resultadoDiv.appendChild(muertos);
    resultadoDiv.appendChild(recuperados);
    resultadoDiv.appendChild(fuente);

    resultado.appendChild(resultadoDiv)
}

function mostrarAlerta(msj) {
    const existeAlerta = document.querySelector('.alerta');
    if (!existeAlerta) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alerta', 'bg-danger', 'rounded-lg', 'text-white', 'text-center', 'font-weight-bold', 'text-uppercase', 'p-2', 'w-100');
        divMensaje.textContent = msj;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="spinner">
            <div class="dot1"></div>
            <div class="dot2"></div>
        </div>
    `;
    resultado.appendChild(divSpinner);
}