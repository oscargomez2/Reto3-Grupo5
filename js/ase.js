/**
 * Cuando inicia la pagina
 */
$(document).ready(function () {
    var datosUser = localStorage.getItem('datos');
    datosUser = JSON.parse(datosUser);
    var idUser = datosUser.id;
    var nombre = datosUser.name;
    if(nombre != null){
        $("#name").addClass("border border-info rounded-3 text-white p-2");
        $("#name").text(nombre);
    }
    getPerfil(idUser);
    getClones();
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
    }).fail( function() {
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
                    row.append($("<td>").append("<img src='"+element.photography+"' width='100%' height='50px' alt='PC'>"));
                    $("#infoClone").append(row);
                });
            }
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='8' class='fw-bolder text-uppercase'>").text("no se pudo consultar los productos"));
            $("#infoClone").append(row);
        }
    }).fail( function() {
        alert("Hubo un error en la aplicación, intentelo más tarde.");
    });
}