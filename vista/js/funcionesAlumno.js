$(function () {
    var espacioNombre= {};

    (function (app) {

        app.init = function () {
            app.buscarRegistro();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregarAlumno").on('click', function (event) {  //Evento para el Click del boton agregarAlumno
             app.limpiarModal();
              // bander cero para alta
                $("#id").val(0);
                // el tìtulo que inyecto al modal
                $("#tituloModal").html("Nuevo Alumno");
                // muestro el modal
                $("#modalAlumno").modal({show: true});
            });

            $("#buscarAlumno").on('click', function (event) {  //Evento para el Click del boton buscarAlumno
                $("#tituloModalBuscar").html("Buscar Alumno");
                $("#modalBuscar").modal({show: true});
            });

            $("#imprimir").on('click', function (event) {  //Evento para el Click del boton imprimir
                app.imprimir();
            });


// OYENTE en el caso de hacer click en editar
            $("#cuerpoTablaAlumno").on('click', '.editar', function (event) {   //Evento para el Click en editar Alumno
              // tomar el valor del metadato de la fila 
                app.limpiarModal();
                $("#id").val($(this).attr("data-id_persona"));
                // tomar en forma idependiente cada valor de la celda navegando en el Dom
                // inyectar en cada atributo del modal , todavìa no se ven
                $("#nombre").val($(this).parent().parent().children().first().html());//ver la consola para guiarnos
                $("#apellido").val($(this).parent().parent().children().first().next().html());
                $("#legajo").val($(this).parent().parent().children().first().next().next().html());
                $("#calle").val($(this).parent().parent().children().first().next().next().next().html());
                $("#numero").val($(this).parent().parent().children().first().next().next().next().next().html());
                // Inyectar el tìtulo
                $("#tituloModal").html("Editar Alumno");
                // ahora muestro el modal con todo los campos cargados para editar
                $("#modalAlumno").modal({show: true});
            });

 // oyente de eliminar
 //para buscar una clase es hace con punto '.eliminar'
            $("#cuerpoTablaAlumno").on('click', '.eliminar', function () { //Evento para el Click en eliminar Alumno
             // capturo el id de la fila y lo paso como paràmetro 
                app.eliminarRegistro($(this).attr("data-id_persona"));
            });
// oyente del botòn guardar
            $("#guardar").on("click", function (event) {
                event.preventDefault();
               // si la bandera es cero vino de Alta
                if ($("#id").val() == 0) {//Si el id es cero entonces se guarda una nueva persona
                    app.guardarRegistro();
                } else {//Si el id es distinto de cero entonces se modifica una persona
                    app.modificarRegistro();
                }
            });
// oyente buscar
            $("#btnBuscar").on("click", function (event) { //Evento para el Click en buscar Alumno
                event.preventDefault();
                app.buscar();
            });

// establecer el validador
            $("#formAlumno").bootstrapValidator({
                excluded: [],
            });
        };



        app.buscar = function () { //funcion para buscar un alumno por criterio
            //alert("entre en buscar");
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=Alumno";
            var datosEnviar = {criterio: $("#criterio").val(), buscar: $("#txtBusqueda").val()};
            //alert("criterio: " + datosEnviar.criterio + " valor buscado:" + datosEnviar.buscar);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
              //      alert("busque con exito");
               //     alert(datosRecibidos);
                    $("#modalBuscar").modal('hide');
                    app.rellenarTabla(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar");
                 //   alert(datosRecibidos);
                    $("#modalBuscar").modal('hide');
                }
            });
        };

        app.imprimir = function () {    //funcion para imprimir
            var aux = $("#tablaAlumno").html();//recupero el html del la tablaAlumno
            aux = aux.replace("<th>acciones</th>", "");//reemplazo el <th>acciones</th> por cadena vacia
            var inicio = aux.indexOf("<td><a class", 0);//busco la primera aparicion de esa cadena y guardo su posicion
            while (inicio > 0) {
                var fin = aux.indexOf("</td>", inicio) + 5;//busco el final del <td> y guardo su posicion
                var strBorrar = aux.substring(inicio, fin);//extraigo el string que debo borrar de la tabla
                aux = aux.replace(strBorrar, "");//reemplazo el string a borrar por cadena vacia
                inicio = aux.indexOf("<td><a class", 0);
            }
            $("#html").val(aux);
            $("#imprimirAlumno").submit();//imprimo
        };


// llamada ajax para guardar alumno
        app.guardarRegistro= function () {  //funcion para guardar un alumno
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Alumno";
            // variable que toma todos los datos del formulario
            var datosEnviar = $("#formAlumno").serialize();//apartir del id del formulario
            
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    // esconder el modal 
                    $("#modalAlumno").modal('hide');
                    // refrescar la tabla del html agregando el ultimo registro
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert(datosRecibidos);
                }
            });
        };


        app.modificarRegistro = function () {    //funcion para modificar alumno
            //alert("entre en modificar");
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Alumno";
            var datosEnviar = $("#formAlumno").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalAlumno").modal('hide');
                    // se debe buscar en la tabla el regitro y refrescarla con los datos 
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar persona");
                    alert(datosRecibidos);
                }
            });
        };

        app.buscarRegistro = function () {  //funcion para listos todos los alumnos
            //alert("Entre en buscarPersonas");
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Alumno";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    app.rellenarTabla(data);
                 },
                error: function () {
                    alert('error buscar persona');
                }
            });
        };

        app.eliminarRegistro= function (id) {   //funcion para eliminar un alumno
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Alumno";
            //alert(id);
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: "POST",
                data: datosEnviar,
                success: function (datosRecibidos) {
                        alert('Registro eliminado');
                  // se debe buscar la fila en la tabla y borrar la fila     
                    app.borrarFila(id);
                },
                error: function (datosRecibidos) {
                    alert('error al eliminar');
                }
            });
        };

        app.rellenarTabla = function (data) {   //funcion para rellenar la tabla de alumnos
            //alert("Entre en rellenar tabla");
            var html = "";
            $.each(data, function (clave, alumno) {
                html += '<tr>' +
                        '<td>' + alumno.nombre + '</td>' +
                        '<td>' + alumno.apellido + '</td>' +
                        '<td>' + alumno.legajo + '</td>' +
                        '<td>' + alumno.calle + '</td>' +
                        '<td>' + alumno.numero + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id_persona="' + alumno.id_persona + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id_persona="' + alumno.id_persona + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>' +
                        '</tr>';
            });
            // con # selecionamos el id del body de la tabla 
            $("#cuerpoTablaAlumno").html(html);
        };

        app.actualizarTabla = function (alumno, id) {   //funcion para agrgar un alumno nuevo o modificar uno existente en la tabla alumno
            if (id == 0) { //ES guardar una persona nueva
                // armo la fila dinamica
                var html = '<tr>' +
                        '<td>' + alumno.nombre + '</td>' +
                        '<td>' + alumno.apellido + '</td>' +
                        '<td>' + alumno.legajo + '</td>' +
                        '<td>' + alumno.calle + '</td>' +
                        '<td>' + alumno.numero + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id_persona="' + alumno.id_persona + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id_persona="' + alumno.id_persona + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>' +
                        '</tr>';
         // append agrega al final d ela tabla       
                $("#cuerpoTablaAlumno").append(html);

            } else {    //Es Modificar una persona existente
                //busco la fila si vino por modifica
                var fila = $("#cuerpoTablaAlumno").find("a[data-id_persona='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre").val() + '</td>' +
                        '<td>' + $("#apellido").val() + '</td>' +
                        '<td>' + $("#legajo").val() + '</td>' +
                        '<td>' + $("#calle").val() + '</td>' +
                        '<td>' + $("#numero").val() + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id_persona="' + id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id_persona="' + id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>';
                fila.html(html);
            }
        };


        app.borrarFila = function (id) {    //funcion para borrar un fila
            //parent parent es porque voy a borrar el tr 
            var fila = $("#cuerpoTablaAlumno").find("a[data-id_persona='" + id + "']").parent().parent().remove();
        };


        app.limpiarModal = function () {    //funcion para limpiar los textbox del modal
            $("#id").val(0);
            $("#nombre").val('');
            $("#apellido").val('');
            $("#titulo").val('');
            $("#calle").val('');
            $("#numero").val('');
            $("#legajo").val('');
        };

        app.init();

    })(espacioNombre);


});
