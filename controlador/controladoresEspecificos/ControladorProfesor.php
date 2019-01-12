<?php
require_once 'ControladorGeneral.php';
require_once 'ControladorDomicilio.php';
require_once '../../modelo/Profesor.php';

class ControladorProfesor extends ControladorGeneral{
    private $refProfesor;
    
    function __construct($datos) {
        parent::__construct();
    }

    
    public function agregar($datos) {//funcion para agregar un profesor nuevo
        try {
            //echo "Inicio TRansaccion";
            $this->refControladorPersistencia->iniciarTransaccion();
            
            //cargo el domicilio del profesor, debo insertar primero en domicilio
            
            $parametros = array("calle" => $datos['calle'], "numero" => $datos['numero']);
            $controlador = new ControladorDomicilio($parametros);
            $controlador->agregar($parametros);

            //cargo el profesor
            $parametros = array("nombre" => $datos['nombre'], "apellido" => $datos['apellido'], "titulo" => $datos['titulo']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_PROFESOR, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            //echo "Confirme TRansaccion";
            return $this->buscarUltimoProfesor();//busco el profesor ingresado
            
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {//busco un profesor por algun criterio
        try {
            $parametros = array( "criterio" => $datos['criterio'],"valor" => $datos['buscar']);
            $query = str_replace("? = ?", $parametros['criterio']." = '".$parametros['valor']."'", DbSentencias::BUSCAR_PROFESORES);
           
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            
            $arrayProfesores = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $arrayProfesores;
            
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }
    
    private function buscarUltimoProfesor(){//busco el ultimo profesor ingresado
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMOPROFESOR, $parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }
    
    public function listar($datos) {//listo todos los profesores existentes
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PROFESORES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
            
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function eliminar($datos) {//elimino un profesor
        try {
            //echo "Inicio TRansaccion";
            $this->refControladorPersistencia->iniciarTransaccion();
            //elimino el profesor
            $fkDomicilio = $this->buscarFkDomicilio($datos["id"]);
            $parametros = array("id" => $datos['id']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_PROFESOR, $parametros);

            //elimino el domicilio del profesor
            $parametros = array("id" => $fkDomicilio);
            $controlador = new ControladorDomicilio($parametros);
            $controlador->eliminar($parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            //echo "Confirme TRansaccion";
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function modificar($datos) {//modifico un profesor existente
        try {
            //echo "Inicio TRansaccion";
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("nombre" => $datos['nombre'], "apellido" => $datos['apellido'], "titulo" => $datos['titulo'], "id" => $datos['id']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_PROFESOR, $parametros);

            $id = $this->buscarFkDomicilio($datos['id']);
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
    
    private function buscarFkDomicilio($id){//busco el fk del domicilio del profesor
        try {
            $parametros = array("id" => $id);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_PROFESOR, $parametros);
            $fila = $resultado->fetch();
            return $fila['fk_domicilio'];
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

}
