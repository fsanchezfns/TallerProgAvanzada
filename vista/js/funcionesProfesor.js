$(function() {
    var TallerAvanzada = {};

    (function(app) {

        app.init = function() {
            app.buscarPersonas();
            
            app.bindings();
        };

        app.bindings = function() {
            $("#agregarProfesor").on('click', function(event) {  //Evento para el Click del boton agregarProfesor
                 app.limpiarModal();
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Profesor");
                $("#modalProfesor").modal({show: true});
            });
            
            $("#buscarProfesor").on('click', function(event) {  //Evento para el Click del boton buscarProfesor
                $("#tituloModalBuscar").html("Buscar Profesor");
                $("#modalBuscar").modal({show: true});
            });
            
            $("#imprimir").on('click', function(event) {  //Evento para el Click del boton imprimirProfesor
                app.imprimir();
            });

            $("#cuerpoTablaProfesor").on('click', '.editar', function(event) {  //Evento para el Click en editarProfesor
                 app.limpiarModal();
                $("#id").val($(this).attr("data-id_persona"));
                $("#nombre").val($(this).parent().parent().children().first().html());
                $("#apellido").val($(this).parent().parent().children().first().next().html());
                $("#titulo").val($(this).parent().parent().children().first().next().next().html());
                $("#calle").val($(this).parent().parent().children().first().next().next().next().html());
                $("#numero").val($(this).parent().parent().children().first().next().next().next().next().html());
                $("#tituloModal").html("Editar Profesor");
                $("#modalProfesor").modal({show: true});
            });

            $("#cuerpoTablaProfesor").on('click', '.eliminar', function() { ////Evento para el Click en eliminarProfesor
                app.eliminarPersona($(this).attr("data-id_persona"));
            });

            $("#guardar").on("click", function(event) {
                event.preventDefault();
                if ($("#id").val()==0) {//Si el id es cero entonces se guarda una nueva persona
                    app.guardarPersona();
                }else{//Si el id es distinto de cero entonces se modifica una persona
                    app.modificarPersona();
                }
            });
            
            $("#btnBuscar").on("click", function(event) {   //Evento para el Click en buscar Profesor
                event.preventDefault();
                app.buscar();
            });

            $("#formProfesor").bootstrapValidator({
                excluded: [],
            });
            
            
           
            
            
        };
        
        app.buscar = function(){//funcion para buscar un profesor por criterio
            //alert("entre en buscar");
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=Profesor";
            var datosEnviar = {criterio:$("#criterio").val(),buscar:$("#txtBusqueda").val()};
            //alert("criterio: "+datosEnviar.criterio+" valor buscado:"+datosEnviar.buscar);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function(datosRecibidos) {
                  //  alert("busque con exito");
                  //  alert(datosRecibidos);
                    $("#modalBuscar").modal('hide');
                    app.rellenarTabla(datosRecibidos);
                },
                error: function(datosRecibidos) {
                    alert("Error al buscar");
                  //  alert(datosRecibidos);
                    $("#modalBuscar").modal('hide');
                }
            });
        };
        
        app.imprimir = function(){//funcion para imprimir
            var aux = $("#tablaProfesor").html();//recupero el html del la tablaProfesor
            aux = aux.replace("<th>acciones</th>","");//reemplazo el <th>acciones</th> por cadena vacia
            var inicio = aux.indexOf("<td><a class",0);//busco la primera aparicion de esa cadena y guardo su posicion
            while (inicio > 0){
                var fin = aux.indexOf("</td>", inicio) + 5;//busco el final del <td> y guardo su posicion
                var strBorrar = aux.substring(inicio,fin);//extraigo el string que debo borrar de la tabla
                aux = aux.replace(strBorrar,"");//reemplazo el string a borrar por cadena vacia
                inicio = aux.indexOf("<td><a class",0);
            }
            $("#html").val(aux);
            $("#imprimirProfesores").submit();//imprimo
        };
        
        app.guardarPersona = function() {//funcion para guardar un profesor
            //alert("entre en agregar");
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Profesor";
            var datosEnviar = $("#formProfesor").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function(datosRecibidos) { 
                    $("#modalProfesor").modal('hide');
                    
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function(datosRecibidos) {
                    alert("Error en guardar persona");
                    alert(datosRecibidos);
                }
            });
        };
        
        app.modificarPersona = function() {//funcion para modificar un profesor
            //alert("entre en modificar");
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Profesor";
            var datosEnviar = $("#formProfesor").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function(datosRecibidos) {
                    $("#modalProfesor").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function(datosRecibidos) {
                    alert("Error en guardar persona");
                    alert(datosRecibidos);
                }
            });
        };
        
        app.buscarPersonas = function() {//funcion para listar todos los profesores
            //alert("Entre en buscarPersonas");
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Profesor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                success: function(datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function() {
                    alert('error buscar persona');
                }
            });
        };
        
        app.eliminarPersona = function(id) {//funcion para eliminar un profesor
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Profesor";
            //alert(id);
            var datosEnviar = {id:id};
            $.ajax({
                url: url,
                method: "POST",
                data: datosEnviar,
                success: function(datosRecibidos) {
                    app.borrarFila(id);
                },
                error: function(datosRecibidos) {
                    alert('error al eliminar');
                }
            });
        };

        app.rellenarTabla = function(data) {//funcion para rellenar la tabla profesores
            //alert("Entre en rellenar tabla");
            var html = "";
            $.each(data, function(clave, profesor) {
                html += '<tr>' +
                        '<td>' + profesor.nombre + '</td>' +
                        '<td>' + profesor.apellido + '</td>' +
                        '<td>' + profesor.titulo + '</td>' +
                        '<td>' + profesor.calle + '</td>' +
                        '<td>' + profesor.numero + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id_persona="' + profesor.id_persona + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id_persona="' + profesor.id_persona + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>' +
                        '</tr>';
            });
            $("#cuerpoTablaProfesor").html(html);
        };
        
        app.actualizarTabla = function(profesor, id) {//funcion para actualizar o modificar la tabla profesor
            if (id == 0) { //ES guardar una persona nueva
                var html = '<tr>' +
                        '<td>' + profesor.nombre + '</td>' +
                        '<td>' + profesor.apellido + '</td>' +
                        '<td>' + profesor.titulo + '</td>' +
                        '<td>' + profesor.calle + '</td>' +
                        '<td>' + profesor.numero + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id_persona="' + profesor.id_persona + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id_persona="' + profesor.id_persona + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>' +
                        '</tr>';
                $("#cuerpoTablaProfesor").append(html);
                
            } else {    //Es Modificar una persona existente
                //busco la fila
                var fila = $("#cuerpoTablaProfesor").find("a[data-id_persona='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre").val() + '</td>' +
                        '<td>' + $("#apellido").val() + '</td>' +
                        '<td>' + $("#titulo").val() + '</td>' +
                        '<td>' + $("#calle").val() + '</td>' +
                        '<td>' + $("#numero").val() + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id_persona="' + id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id_persona="' + id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>';
                fila.html(html);
            }
        };
        
        app.borrarFila = function(id) {//funcion para borrar una fila de la tabla profesor
            var fila = $("#cuerpoTablaProfesor").find("a[data-id_persona='" + id + "']").parent().parent().remove();
        };
        
        app.limpiarModal = function(){//funcion para limpiar el modal de profesores
            $("#id").val(0);
            $("#nombre").val('');
            $("#apellido").val('');
            $("#titulo").val('');
            $("#calle").val('');
            $("#numero").val('');
        };
        
        app.init();

    })(TallerAvanzada);


});
