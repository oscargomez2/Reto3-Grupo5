$("#login").click(function () {
    //alert("hola");
    if($.trim($("#emailLogin").val()) == "" || $.trim($("#password").val()) == ""){
        alert("Por favor ingrese el correo y la contraseña");
    }else{
        var email= $("#emailLogin").val();
        var password= $("#password").val();
        $.ajax({
            url: 'http://localhost:8080/api/user/' + email + "/" + password,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (user) {
                if(user.id==null){
                    alert("Usuario o contraseña incorrectos")
                }else{
                    localStorage.setItem("idUser",user.id);
                    localStorage.setItem("nombre",user.name);
                    if(user.type == "ADM" || user.type == "administrador"){
                        window.location.href = "../pages/admin.html";
                    }else if(user.type == "COORD" || user.type == "coordinador"){
                        window.location.href = "../pages/coord.html";
                    }else{
                        window.location.href = "../pages/ase.html";
                    }
                    
                }
            }
        });
    }
});