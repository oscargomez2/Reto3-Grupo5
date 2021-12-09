/**
 * Cuando inicia la pagina
 */
$(document).ready(function () {

    //$('#btnActualizar').attr('style', 'display: none !important');
    //$('#btnActualizarClone').attr('style', 'display: none !important');
    //$("#user").empty();
    var idUser = localStorage.getItem('idUser');
    console.log(idUser);
    var nombre = localStorage.getItem('nombre');
    //alert("Bienvenido " + nombre);
    //$("#name").text(nombre);
    getPerfil(idUser);
    getClones();
    //consultarUsers();
    //consultarProductos();
    //$("#name").text(idUser);
    //getPerfil(idUser);
});

/**
 * cerrar sesion
 */
$("#close").click(function () {
    localStorage.clear();
    window.location.href = "../index.html";
});



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
    });
}

function getClones() {
    $.ajax({
        url: 'http://localhost:8080/api/clone/all',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (clone) {
            $("#infoClone").empty();
            if (clone.lenght == 0) {
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
                    row.append($("<td>").append("<img src='"+element.photography+"' width='50%' height='50px'>"));
                });
            }
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='8' class='fw-bolder text-uppercase'>").text("no se pudo consultar los productos"));
            $("#infoClone").append(row);
        }
    });
}