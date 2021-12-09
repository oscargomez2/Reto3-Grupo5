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
    $("#name").text(nombre);
    getPerfil(idUser);
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
            if (user.type == "COORD" || user.type == "coordinador") {
                row.append($("<td>").text("Coordinador de Zona"));
            }
            row.append($("<td>").text(user.zone));
            $("#infoPerfil").append(row);
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='5' class='fw-bolder text-uppercase'>").text("no se encontro el perfil"));
            $("#infoPerfil").append(row);
        }
    });
}