const tipoEleccion = 2;
const tipoRecuento = 1;

const comboAnioID = document.getElementById("filtro-año");
const comboCargoID = document.getElementById("filtro-cargo");
const comboDistritoID = document.getElementById("filtro-distrito");
const comboSeccionID = document.getElementById("filtro-seccion");
const hdSeccionProvincial = document.getElementById("hdSeccionProvincial");
const botonAgregarInforme = document.getElementById("agregar-informe");
let distritoElegido;

// COMBO AÑO

let option = document.createElement("option");
option.text = "Año";
option.value = "";
option.disabled = true;
option.selected = true;
comboAnioID.add(option);

fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
    .then(DatosFiltros => DatosFiltros.json())
    .then(DatosFiltros => {

        DatosFiltros.forEach(item => {
            let option = document.createElement("option");
            option.text = item;
            option.value = item;
            comboAnioID.add(option);
        });
    });

//COMBO CARGO
comboAnioID.addEventListener('change', function () {
    comboCargoID.innerHTML = "";

    let option = document.createElement("option");
    option.text = "Cargo";
    option.value = "";
    option.disabled = true;
    option.selected = true;
    comboCargoID.add(option);

    fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + comboAnioID.value)
        .then(DatosFiltros => DatosFiltros.json())
        .then(DatosFiltros => {
            DatosFiltros.forEach(eleccion => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach(cargo => {
                        let option = document.createElement("option");
                        option.text = cargo.Cargo;
                        option.value = cargo.IdCargo;
                        comboCargoID.add(option);
                    });
                }
            });
        });
});

// COMBO DISTRITO
comboCargoID.addEventListener('change', function () {

    comboDistritoID.innerHTML = "";

    let option = document.createElement("option");
    option.text = "Distrito";
    option.value = "";
    option.disabled = true;
    option.selected = true;
    comboDistritoID.add(option);

    fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + comboAnioID.value)
        .then(DatosFiltros => DatosFiltros.json())
        .then(DatosFiltros => {
            DatosFiltros.forEach(eleccion => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach(cargo => {
                        if (cargo.IdCargo == comboCargoID.value) {
                            cargo.Distritos.forEach(distrito => {
                                let option = document.createElement("option");
                                option.text = distrito.Distrito.toUpperCase();
                                option.value = distrito.IdDistrito;
                                comboDistritoID.add(option);
                            });
                        }
                    });
                }
            });
        });
});

// COMBO SECCION

comboDistritoID.addEventListener('change', function () {
    comboSeccionID.innerHTML = "";

    let option = document.createElement("option");
    option.text = "Sección";
    option.value = "";
    option.disabled = true;
    option.selected = true;
    comboSeccionID.add(option);

    fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + comboAnioID.value)
        .then(DatosFiltros => DatosFiltros.json())
        .then(DatosFiltros => {
            DatosFiltros.forEach(eleccion => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach(cargo => {
                        if (cargo.IdCargo == comboCargoID.value) {
                            cargo.Distritos.forEach(distrito => {
                                if (distrito.IdDistrito == comboDistritoID.value) {
                                    distritoElegido = comboDistritoID.options[comboDistritoID.selectedIndex].text;
                                    hdSeccionProvincial.value = distrito.IdSeccionProvincial;
                                    distrito.SeccionesProvinciales.forEach(seccionProvincial => {
                                        seccionProvincial.Secciones.forEach(seccion => {
                                            let opcion = document.createElement("option");
                                            opcion.text = seccion.Seccion;
                                            opcion.value = seccion.IdSeccion;
                                            comboSeccionID.add(opcion);
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
});

//BOTON FILTRAR
document.addEventListener('DOMContentLoaded', function () {

    const botonFiltro = document.getElementById("boton-filtro");

    botonFiltro.addEventListener('click', async function () {

        document.getElementById("cartel-carga").style.display = "block";
        document.getElementById("cartel-carga").textContent = "Cargando...";
    
        setTimeout(function() {
            document.getElementById("cartel-carga").style.display = "none";
        }, 1500);

        if (!comboAnioID.value || !comboCargoID.value || !comboDistritoID.value || !comboSeccionID.value) {

            setTimeout(function() {
                document.getElementById("men3").style.display = "block";
            }, 2000);

            if (comboAnioID.value != "Año") {
                document.getElementById("men3").textContent = "ERROR! DEBE COMPLETAR EL CAMPO AÑO";
            }
            if (comboCargoID.value != "Cargo") {
                document.getElementById("men3").textContent = "ERROR! DEBE COMPLETAR EL CAMPO CARGO";
            }
            if (comboDistritoID.value != "Distrito") {
                document.getElementById("men3").textContent = "ERROR! DEBE COMPLETAR EL CAMPO DISTRITO";
            }
            if (comboSeccionID.value != "Sección") {
                document.getElementById("men3").textContent = "ERROR! DEBE COMPLETAR EL CAMPO SECCIÓN";
            }

            setTimeout(function() {
                document.getElementById("men3").style.display = "none";
            }, 4000);

            return;
        }
        else {

            const anioEleccion = comboAnioID.value;
            const categoriaId = comboCargoID.value;
            const distritoId = comboDistritoID.value;
            const seccionProvincialId = hdSeccionProvincial.value;
            const seccionId = comboSeccionID.value;
            const circuitoId = "";
            const mesaId = "";

            const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
            console.log(url)
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);

                const mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
                const electores = data.estadoRecuento.cantidadElectores;
                const participacionEscrutado = data.estadoRecuento.participacionPorcentaje;


                const cuadroMesasEscrutadas = document.getElementById("1textos-recuadros-2");
                const cuadroElectores = document.getElementById("2textos-recuadros-2");
                const cuadroParticipacionEscrutado = document.getElementById("3textos-recuadros-2");

                cuadroMesasEscrutadas.textContent = mesasEscrutadas + "%";
                cuadroElectores.textContent = electores + "%";
                cuadroParticipacionEscrutado.textContent = participacionEscrutado + "%";

            } catch (error) {

                document.getElementById("men2").style.display = "block";
                console.error(error);
            }

            const tituloID = document.getElementById("titulo-elecciones");
            const subtituloID = document.getElementById("subtitulo-elecciones");
            tituloID.innerHTML = "Elecciones" + " " + anioEleccion + " " + " | " + "Generales";
            subtituloID.innerHTML = anioEleccion + ">" + "Generales" + ">" + comboCargoID.options[comboCargoID.selectedIndex].text + ">" + comboDistritoID.options[comboDistritoID.selectedIndex].text + ">" + comboSeccionID.options[comboSeccionID.selectedIndex].text;



            document.getElementById("svgMapa").innerHTML = mapas[distritoElegido];
            document.getElementById("texto-mapa").innerHTML = distritoElegido;
        }


    });
});

let informes = [];


const informesGuardados = localStorage.getItem('INFORMES');
if (informesGuardados) {
    informes = JSON.parse(informesGuardados);
}

botonAgregarInforme.addEventListener('click', function () {

    
    if (!comboAnioID.value || !comboCargoID.value || !comboDistritoID.value || !comboSeccionID.value) {
        document.getElementById("men2").style.display = "block";
        document.getElementById("men2").textContent = "ERROR! PRIMERO DEBE COMPLETAR LOS CAMPOS Y LUEGO FILTRAR.";
        setTimeout(function() {
            document.getElementById("men2").style.display = "none";
        }, 2000);
    }
    else {
        const informe = `${comboAnioID.value}|${tipoRecuento}|${tipoEleccion}|${comboCargoID.value}|${comboDistritoID.value}|${hdSeccionProvincial.value}|${comboSeccionID.value}`;


        if (informes.includes(informe)) {

            document.getElementById("men2").style.display = "block";
            document.getElementById("men2").textContent = "ERROR! ESTE INFORME YA EXISTE";
            setTimeout(function() {
                document.getElementById("men2").style.display = "none";
            }, 2000);
            
            
        } else {

            informes.push(informe);

            localStorage.setItem('INFORMES', JSON.stringify(informes));


            document.getElementById("men1").style.display = "block";
            document.getElementById("men1").textContent = "¡OPERACIÓN EXITOSA! INFORME AGREGADO";
            setTimeout(function() {
                document.getElementById("men1").style.display = "none";
            }, 2000);
        }
    }
});