/**
 * Cuando inicia la pagina
 */
$(document).ready(function () {
    var datos = JSON.parse(localStorage.getItem('datos'));
    //var idUser = localStorage.getItem('idUser');
    //console.log(idUser);
    //var nombre = localStorage.getItem('nombre');
    //alert("Bienvenido " + nombre);
    if (datos.name != null) {
        $("#name").addClass("border border-info rounded-3 text-white p-2");
        $("#name").text(datos.name);
    }
    getPerfil(datos.id);
    getOrdenes(datos.zone);
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
    localStorage.removeItem('datos');
    window.location.href = "../index.html";
});


/**
 * consultar perfil del coordinador
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
    }).fail( function() {
        alert("Hubo un error en la aplicación, intentelo más tarde.");
    });
}

function getOrdenes(zona) {
    $.ajax({
        url: 'http://localhost:8080/api/order/zona/' + zona,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (order) {
            console.log(order.length)
            $("#infoOrdenes").empty();
            if (order.length == 0) {
                let row = $("<tr>");
                row.append($("<td colspan='7' class='fw-bolder text-uppercase'>").text("no hay ordenes"));
                $("#infoOrdenes").append(row);
            } else {
                order.forEach(element => {

                    console.log(element.salesMan.email);
                    let row = $("<tr>");
                    row.append($("<td>").text(element.salesMan.identification));
                    row.append($("<td>").text(element.salesMan.name));
                    row.append($("<td>").text(element.salesMan.email));
                    row.append($("<td>").text(element.registerDay.split("T")[0]));
                    row.append($("<td>").text(element.salesMan.identification));
                    row.append($("<td>").text(element.status));
                    row.append($("<td class='px-0'><button class='btn btn-primary py-1 px-4 m-0' onclick='verDetalle(" + element.id + ")'>Ver Detalle</button>"));
                    $("#infoOrdenes").append(row);
                });
            }
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='7' class='fw-bolder text-uppercase'>").text("no se pudo consultar las ordenes"));
            $("#infoOrdenes").append(row);
        }
    }).fail( function() {
        alert("Hubo un error en la aplicación, intentelo más tarde.");
    });
}


function verDetalle(idOrder) {
    
    $.ajax({
        url: 'http://localhost:8080/api/order/' + idOrder,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (order) {
            
            $("#listaProductos").empty();
            
            let p = order.products;
            let q = order.quantities;
           
            for(const [key, value] of Object.entries(p)){
                //console.log(p[key].price)
                //console.log(key)
                let row = $("<tr>");
                row.append($("<td>").text(p[key].id));
                row.append($("<td>").text(p[key].brand));
                row.append($("<td>").text("tecnologia"));
                row.append($("<td>").text("prueba"));
                row.append($("<td>").text(p[key].description));
                row.append($("<td>").text(p[key].price));
                row.append($("<td id='cambio'>").text(""));
                row.append($("<td>").text(p[key].quantity));
                row.append($("<td>").append("<img src='" + p[key].photography + "' alt='pc' width='100%' height='50px'>"));
                $("#listaProductos").append(row);
            }
            
            /*let p = Object.values(order.products); // p = ["Scott", "Negro", true, 5];

            for (let i = 0; i < p.length; i++) {
                console.log(p[i]);
                let row = $("<tr>");
                row.append($("<td>").text(p[i].id));
                row.append($("<td>").text(p[i].brand));
                row.append($("<td>").text("tecnologia"));
                row.append($("<td>").text("prueba"));
                row.append($("<td>").text(p[i].description));
                row.append($("<td>").text(p[i].price));
                row.append($("<td>").text(""));
                row.append($("<td>").text(p[i].quantity));
                row.append($("<td>").append("<img src='" + p[i].photography + "' alt='pc' width='50%' height='50px'>"));
                $("#listaProductos").append(row);
                //row.append($("<td>").text(order.products[1].brand));
            }*/
            /*for(let clave in order){
                console.log(order[clave]);
            }*/
            /*let row = $("<tr>");
            row.append($("<td>").text(order.products[1].id));
            row.append($("<td>").text(order.products[1].brand));
            row.append($("<td>").text("tecnologia"));
            row.append($("<td>").text("prueba"));
            row.append($("<td>").text(order.products[1].description));
            row.append($("<td>").text(order.products[2].price));
            row.append($("<td>").text(order.quantities[1]));
            row.append($("<td>").text(order.products[1].quantity));
            $("#listaProductos").append(row);*/
        },
        error: function (result) {
            var row = $("<tr>");
            row.append($("<td colspan='9' class='fw-bolder text-uppercase'>").text("no se encontro el perfil"));
            $("#listaProductos").append(row);
        }
    }).fail( function() {
        alert("Hubo un error en la aplicación, intentelo más tarde.");
    });
    $("#registrarOrden").modal("show");
}
