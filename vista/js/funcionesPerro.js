$(function (){
    var tallerProg = {};
    
    (function (app){
        
        
        app.init = function (){
           app.buscarPerros();
           app.bindings();
            
        };
        
        app.bindings = function (){
            
            
            $('#agregarPerro').on('click', function (event) {
            app.limpiarModal();
            $('#id').val(0);
            $('#tituloModal').html("Nuevo Perro");
            $('#modalPerro').modal({show: true});
               
            });
         
                
            $('#guardar').on('click',function(event){
                event.preventDefault(); //cancela el evento preterminado
                    
                    if($('#id').val()==0){
                        //guardar perro
                        app.guardarPerro();
                        
                    }else{
                        app.modificarPerro();
                    }
                }); 
                
                
            
            $('#cuerpoTablaPerro').on('click', '.eliminar',function (event){
             app.eliminarPerro($(this).attr("data-id_perro"));                              
            });
            
            //cargo en el modal los datos
         $('#cuerpoTablaPerro').on('click', '.editar', function(event){
             $('#id').val($(this).attr("data-id_perro"));
             $('#nombre').val($(this).parent().parent().children().html());
             $('#raza').val($(this).parent().parent().children().next().html());
             $('#edad').val($(this).parent().parent().children().next().next().html());
             $('#tituloModal').html('Modificar Perro');
             $('#modalPerro').modal({show:true})
                             
         });
         
         //validador del formulario 
         $('#formPerro').bootstrapValidator({
            excluded: [],   
         });
         
         
         $('#btnBuscar').on('click',function(event){
             event.preventDefault();
             app.buscar();
         });
         
         $('#imprimir').on('click',function(event){
             event.preventDefault();
             app.imprimir();
         });
         
        };
        
        
        app.buscarPerros = function(){
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Perro";
            $.ajax({
                    url: url,
                    method: 'GET',
                    dataType: 'json',
                    success:function (data) {
                    app.rellenarTabla(data);
                    },
                    
                    error:function (){
                        alert('error en buscar perro');
                    }
                   });
            
        };
        
        
        
        app.rellenarTabla=function (datos){
          var html=""
          $.each(datos, function (clave, perro){
              html += '<tr>'+
                      '<td>' + perro.nombre_perro + '</td>'+
                      '<td>' + perro.raza_perro + '</td>'+
                      '<td>' + perro.edad_perro + '</td>'+
                      
                      '<td>' +
                      
                      '<a class="pull-left editar" data-id_perro="' + perro.id_perro +'"><span class="gliphicon glyphicon-pencil"></span>Editar</a>'+
                      '<a class="pull-right eliminar" data-id_perro="' + perro.id_perro +'"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>'+
                      '</td>'+
                      '</tr>';
               
          });
          
          $('#cuerpoTablaPerro').html(html);
            
        };
            
         app.eliminarPerro = function (id){
             
           var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Perro";
           var datosEnviar ={id:id};    
                $.ajax({
                    url:url,
                    method: "POST",
                    data: datosEnviar,
                    success: function (datosRecibidos){
                         alert('se a eliminado el perro' + id);
                        app.eliminarFila(id);
                    },
                    error: function (){
                        alert('error al eliminar');
                    }
 
                });  
     
         };   
        
        app.eliminarFila = function(id){
            $('#cuerpoTablaPerro').find("a[data-id_perro='" + id + "']").parent().parent().remove();
            //estoy en eliminar el padre es el td luego el padre es el tr y ahi borro
           
        };
        
        app.guardarPerro= function(){
          var url= "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Perro";
          var datosEnviar= $('#formPerro').serialize();
          //console.log(datosEnviar);
            //hacer ajax
          
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    
                    $('#modalPerro').modal('hide');//oculto el modal
                   // console.log(datosRecibidos);
                    app.actualizarTabla(datosRecibidos,$('#id').val());
                    app.limpiarModal();
                },
                error: function () {
                    alert("Error en guardar perro");
                }
            });
        };
        
        app.actualizarTabla=function(dato,id){
            var html=""; 
            
            if(id==0){//agregar
               
                html+='<tr>' +
                        '<td>'+ dato.nombre_perro + '</td>'+
                        '<td>'+ dato.raza_perro + '</td>'+
                        '<td>'+ dato.edad_perro + '</td>'+
                        '<td>'+
                        '<a class="pull-left editar" data-id_perro="'+ dato.id_perro + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                                      
                        '<a class="pull-right eliminar" data-id_perro="' + dato.id_perro +'"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>'+
                        '</td>'+
                       '</tr>'
                
                $('#cuerpoTablaPerro').append(html);
                   
            }else{ //modificar
                var fila = $('#cuerpoTablaPerro').find("a[data-id_perro='"+ id + "']").parent().parent();
                var otro = 
                             '<td>' + $('#nombre').val()  +'</td>'+
                             '<td>' + $('#raza').val()  +'</td>'+
                             '<td>' + $('#edad').val()  +'</td>'+
                             '<td>' +
                              '<a class="pull-left editar" data-id_perro="'+ id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                             '<a class="pull-right eliminar" data-id_perro="' + id +'"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>'+
                              '</td>' ;
                                                                                            
                        fila.html(otro);
         
          
            }
            
                       
        };
        
        app.limpiarModal = function (){
            $('#id').val('');
            $('#nombre').val('');
            $('#raza').val('');
            $('#edad').val('');
            
        };
        
        app.modificarPerro = function (){
            var url = '../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Perro';
            var datosEnviar = $('#formPerro').serialize();

            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $('#modalPerro').modal('hide');
                    app.actualizarTabla(datosRecibidos,$('#id').val());
                    app.limpiarModal();
                },
                error: function () {
                    alert('error en actulizar el perro');
                }
            });    
        };
        
        app.buscar = function (){
            var url= '../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=Perro';
            var datosEnviar= {criterio: $('#criterio').val(), buscar:$('#txtBusqueda').val()};
            
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos)
                    
                },
                error: function () {
                    alert('Error en la busqueda')
                    
                }
            });
            
            
            
        }


         app.imprimir = function(){
          var aux = $("#tablaPerro").html();
         // console.log(aux);
          aux= aux.replace('<th>Acciones</th>','');
          var inicio= aux.indexOf("<td><a class",0);
          while(inicio>0){
            var fin= aux.indexOf('</td>',inicio) + 5;
            var strBorrar= aux.substring(inicio,fin);
            aux= aux.replace(strBorrar,"");
            inicio=aux.indexOf("<td><a class",0);

          }

          console.log(aux);
          $('#html').val(aux);
          $('#imprimirPerro').submit();


         };
        
        
        
        
        
        app.init();
        
    })(tallerProg);

});


