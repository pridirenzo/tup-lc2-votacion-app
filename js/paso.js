const tipoEleccion = 1;
const tipoRecuento = 1;

const comboAnioID = document.getElementById("filtro-año");
const comboCargoID = document.getElementById("filtro-cargo");
const comboDistritoID = document.getElementById("filtro-distrito");
const comboSeccionID = document.getElementById("filtro-seccion");
const hdSeccionProvincial = document.getElementById("hdSeccionProvincial");

// COMBO AÑO
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
    .then(DatosFiltros => DatosFiltros.json())
    .then(DatosFiltros => {

        let option = document.createElement("option");
        option.text = "Sección";
        option.value = "";
        option.disabled = true;
        option.selected = true;
        comboSeccionID.add(option);


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
                                option.text = distrito.Distrito;
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
        validacion = false;
        console.log(comboAnioID.value);
        console.log(comboCargoID.value);
        console.log(comboDistritoID.value);
        console.log(comboSeccionID.value);

        if (!comboAnioID.value || !comboCargoID.value || !comboDistritoID.value || !comboSeccionID.value) {

            document.getElementById("men3").style.display = "block";

            if (comboAnioID.value == "Año") {
                document.getElementById("men3").textContent = "ERROR! DEBE COMPLETAR EL CAMPO AÑO";
            }
            else if (comboCargoID.value != "Cargo"){
                document.getElementById("men3").textContent = "ERROR! DEBE COMPLETAR EL CAMPO CARGO";
            }
            if(comboDistritoID.value != "Distrito"){
                document.getElementById("men3").textContent = "ERROR! DEBE COMPLETAR EL CAMPO DISTRITO";
            }
    
        
            return;
        }

        // Recuperar los valores del filtro
        const anioEleccion = comboAnioID.value;
        const categoriaId = comboCargoID.value;
        const distritoId = comboDistritoID.value;
        const seccionProvincialId = hdSeccionProvincial.value;
        const seccionId = comboSeccionID.value;
        const circuitoId = ""; 
        const mesaId = "";
        const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

        try {
            const response = await fetch(url);
            const data = await response.json();


            console.log(data);
        } catch (error) {

            document.getElementById("men2").style.display = "block";
            console.error(error);
        }
    });
});
