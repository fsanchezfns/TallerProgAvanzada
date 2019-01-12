<?php

require_once 'ControladorGeneral.php';
require_once 'ControladorDomicilio.php';
require_once '../../modelo/Alumno.php';

class ControladorAlumno extends ControladorGeneral {

    private $refAlumno;

    function __construct($datos) {
        parent::__construct();
   
    }

    public function agregar($datos) {
        try {
            //echo "Inicio TRansaccion";
            $this->refControladorPersistencia->iniciarTransaccion();
            //guardo primero domicilio, ("calle";"numero" es el nombre de la comlumna ver el html es el nombre no el id aunque se llaman iguales)
            $parametros = array("calle" => $datos['calle'], "numero" => $datos['numero']);
            $controlador = new ControladorDomicilio($parametros);
            $controlador->agregar($parametros);

            //guardo alumno, 
            $parametros = array("nombre" => $datos['nombre'], "apellido" => $datos['apellido'], "legajo" => $datos['legajo']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_ALUMNO, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            //echo "Confirme TRansaccion";
            return $this->buscarUltimoAlumno();//recupero el alumno guardado para obtener el id
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {//funcion para buscar por criterio
        try {
            $parametros = array( "criterio" => $datos['criterio'],"valor" => $datos['buscar']);
            $query = str_replace("? = ?", $parametros['criterio']." = '".$parametros['valor']."'", DbSentencias::BUSCAR_ALUMNOS);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            $arrayAlumnos = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $arrayAlumnos;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    private function buscarUltimoAlumno() {//funcion para buscar el ultimo alumno ingresado
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMOALUMNO, $parametros);
            $fila = $resultado->fetch();//el fetch me trae todo lo que tiene $resultado
            return $fila;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {//funcion para listar todos los alumnos
        try {
            
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_ALUMNOS);
            $arrayAlumnos = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $arrayAlumnos;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function eliminar($datos) {//funcion para eliminar un alumno y su domicilio
        try {
            //echo "Inicio TRansaccion";
            $this->refControladorPersistencia->iniciarTransaccion();
            $fkDomicilio = $this->buscarFkDomicilio($datos["id"]);
            //elimino alumno
            $parametros = array("id" => $datos['id']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_ALUMNO, $parametros);

            //elimino el domicilio
            $parametros = array("id" => $fkDomicilio);
            $controlador = new ControladorDomicilio($parametros); //creo el controlador domicilio
            $controlador->eliminar($parametros); 
            $this->refControladorPersistencia->confirmarTransaccion();
            //echo "Confirme TRansaccion";
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function modificar($datos) {//funcion para modificar un alumno existente
        try {
            //echo "Inicio TRansaccion";
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("nombre" => $datos['nombre'], "apellido" => $datos['apellido'], "legajo" => $datos['legajo'], "id" => $datos['id']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_ALUMNO, $parametros);

            $id = $this->buscarFkDomicilio($datos['id']); //busco el id porque no lo conosco
            $parametros = array("calle" => $datos['calle'], "numero" => $datos['numero'], "id" => $id);
            $controlador = new ControladorDomicilio($parametros);
            $controlador->modificar($parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            //echo "Confirme TRansaccion";
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    private function buscarFkDomicilio($id) {//funcion para buscar el fk de domicilio del alumno
        try {
            $parametros = array("id" => $id);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ALUMNO, $parametros);
            $fila = $resultado->fetch();
            return $fila['fk_domicilio'];
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

}
