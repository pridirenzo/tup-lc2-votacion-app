const tipoEleccion = 2;
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