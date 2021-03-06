/**
 * Cuando inicia la pagina
 */
$(document).ready(function () {
    var datosUser = localStorage.getItem('datos');
    datosUser = JSON.parse(datosUser);
    var idUser = datosUser.id;
    var nombre = datosUser.name;
    if (nombre != null) {
        $("#name").addClass("border border-info rounded-3 text-white p-2");
        $("#name").text(nombre);
    }
    getPerfil(idUser);
    getClones();
    listaProductos();
});

/**
 * cerrar sesion
 */
$("#close").click(function () {
    localStorage.clear();
    localStorage.removeItem('datos');
    window.location.href = "../index.html";
});


/**
 * cargar perfil asesor comercial
 * @param {*} idUser 
 */
function getPerfil(idUser) {
    $.ajax({
        url: 'http://localhost:8080/api/user/' + idUser,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (user) {
            let row = $("<tr>");
            row.append($("<td>").text(user.identification));
            row.append($("<td>").text(user.name));
            row.append($("<td>").text(user.email));
            if (user.type == "ASE" || user.type == "asesor") {
                row.append($("<td>").text("Asesor Comercial"));
            }
            row.append($("<td>").text(user.zone));
            $("#infoPerfil").append(row);
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='5' class='fw-bolder text-uppercase'>").text("no se pudo consultar el perfil"));
            $("#infoPerfil").append(row);
        }
    }).fail(function () {
        alert("Hubo un error en la aplicación, intentelo más tarde.");
    });
}

/**
 * cargar lista de clones
 */
function getClones() {
    $.ajax({
        url: 'http://localhost:8080/api/clone/all',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (clone) {
            $("#infoClone").empty();
            if (clone.length == 0) {
                let row = $("<tr>");
                row.append($("<td colspan='8' class='fw-bolder text-uppercase'>").text("no hay registros"));
                $("#infoClone").append(row);
            } else {
                clone.forEach(element => {
                    let row = $("<tr>");
                    row.append($("<td>").text(element.id));
                    row.append($("<td>").text(element.os));
                    row.append($("<td>").text(element.procesor));
                    row.append($("<td>").text(element.memory));
                    row.append($("<td>").text(element.hardDrive));
                    row.append($("<td>").text(element.description));
                    row.append($("<td>").text(element.price));
                    row.append($("<td>").append("<img src='" + element.photography + "' width='100%' height='50px' alt='PC'>"));
                    $("#infoClone").append(row);
                });
            }
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='8' class='fw-bolder text-uppercase'>").text("no se pudo consultar los productos"));
            $("#infoClone").append(row);
        }
    }).fail(function () {
        alert("Hubo un error en la aplicación, intentelo más tarde.");
    });
}
/****************************************************************************************************************** */

//Metodos para registrar la orden
/**
 * Registrar una nueva orden
 */
function registrarOrden() {
    var datosUser = localStorage.getItem('datos');
    datosUser = JSON.parse(datosUser);
    var idUser = datosUser.id;
    var id = $.trim($("#idOrden").val());
    var date = $.trim($("#fecha").val());
    var productos = {};
    var cantidades = {};
    if (id == null || id == "") {
        alert("El campo de id debe ser llenado");
    } else {
        $.ajax({
            url: 'http://localhost:8080/api/clone/all',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (clone) {
                for (let i = 1; i <= clone.length; i++) {
                    let check = ($("#" + i).is(':checked'));

                    if (clone[i - 1].id == i && check == true) {

                        let cant = $.trim($("#" + i + "Cant").val());
                        if (cant != "" && cant != null && cant != 0 && cant != "0") {
                            cantidades[i.toString()] = parseInt(cant);
                        }
                        productos[i.toString()] = clone[i - 1];

                    }

                }
                if (Object.keys(productos).length === 0 || Object.keys(cantidades).length === 0) {
                    alert("La lista de productos está vacía, debe seleccionar al menos un producto y su cantidad");

                } else {
                    if (Object.keys(productos).length == Object.keys(cantidades).length) {
                        $.ajax({
                            url: 'http://localhost:8080/api/user/' + idUser,
                            type: 'GET',
                            contentType: 'application/json',
                            dataType: 'json',
                            success: function (user) {
                                var usuario = user;
                                $.ajax({
                                    url: 'http://localhost:8080/api/order/' + id,
                                    type: 'GET',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    success: function (order) {
                                        if (order.id == null) {
                                            $.ajax({
                                                url: 'http://localhost:8080/api/order/new',
                                                type: 'POST',
                                                data: JSON.stringify({
                                                    "id": id,
                                                    "registerDay": date,
                                                    "status": "Pendiente",
                                                    "salesMan": usuario,
                                                    "products": productos,
                                                    "quantities": cantidades
                                                }),
                                                contentType: 'application/json',
                                                dataType: 'json',
                                                success: function (order) {
                                                    alert("La orden fue registrada con éxito");
                                                    $(":input").val("");
                                                    $( ":input:checkbox" ).prop( "checked", false );
                                                    $("#idOrden").focus();
                                                    console.log(order);
                                                }
                                            }).fail(function () {
                                                alert("Hubo un error en la aplicación, intentelo más tarde.");
                                            });
                                        } else {
                                            alert("El id ingresado ya está registrado, ingrese uno diferente e intente de nuevo");
                                        }
                                    }
                                }).fail(function () {
                                    alert("Hubo un error en la aplicación, intentelo más tarde.");
                                });

                            }
                        }).fail(function () {
                            alert("Hubo un error en la aplicación, intentelo más tarde.");
                        });
                    } else {
                        alert("No ha seleccionado la cantidad o no ha ckeckeado uno de los productos, rectifique la información y vuelva a intentarlo");
                    }
                }

            }
        }).fail(function () {
            alert("Hubo un error en la aplicación, intentelo más tarde.");
        });
    }

}

/**
 * Listar los productos
 */
function listaProductos() {
    $.ajax({
        url: 'http://localhost:8080/api/clone/all',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (clone) {
            $("#infoCloneOrden").empty();
            if (clone.length == 0) {
                let row = $("<tr>");
                row.append($("<td colspan='6' class='fw-bolder text-uppercase'>").text("no hay registros"));
                $("#infoCloneOrden").append(row);
            } else {
                clone.forEach(element => {
                    let row = $("<tr>");
                    row.append($("<td>").text(element.id));
                    row.append($("<td>").text(element.description));
                    row.append($("<td>").text(element.price));
                    row.append($("<td>").append("<img src='" + element.photography + "' width='100%' height='50px' alt='PC'>"));
                    row.append($("<td> <input class='form-check-input' type='checkbox' id='" + element.id + "'>"));
                    row.append($("<td> <input class='form-control fondo-input' type='number' id='" + element.id + "Cant' placeholder='Cantidad' class='form-control'>"));
                    $("#infoCloneOrden").append(row);
                });
            }
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='6' class='fw-bolder text-uppercase'>").text("no se pudo consultar los productos"));
            $("#infoCloneOrden").append(row);
        }
    }).fail(function () {
        alert("Hubo un error en la aplicación, intentelo más tarde.");
    });
}
/**********************************************************************************************************************/