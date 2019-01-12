<?php

  
     // averiguo que formulario me pide una acciòn atrapo los datos de la URL   
        $formulario = $_GET['Formulario']; //atrapo lo que viene en formulario
      
        $accion = $_GET['accion']; //atrapo lo que viene en accion 
   
        // armo una variable local con un contenido para hacerlo dinàmico
        $controlador = 'Controlador' . $formulario; //controlador es un prefijo
      // importo el controlador especìfico armamdo la cadena dinàmica de texto  
        require_once '../controladoresEspecificos/' . $controlador . '.php'; //cargo el controlador espeficifico, es un import
      // recupero los datos enviados en el formulario si los hubiera
        $datosFormulario = $_POST; //repupero los datos enviados desde js
        // creo una instancia del cotrolador y le paso los datos del formulario
        $refControlador = new $controlador($datosFormulario);
        // llamo al mètodo solicitado en la vista
        $resultado = $refControlador->$accion($datosFormulario);
        // devuelvo la acciòn a la vista
        echo json_encode($resultado); //devuelvo datos al js
        
   