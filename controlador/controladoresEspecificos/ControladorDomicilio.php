<?php
require_once 'ControladorGeneral.php';
class ControladorDomicilio extends ControladorGeneral {
    private $refDomicilio;
    
    function __construct($datos) {
        parent::__construct();
    }

    public function agregar($datos) {      //funcion para agregar un domicilio
        $parametros = array("calle" => $datos['calle'],"numero" => $datos['numero']); //esta linea esta de mas ya viene asi 
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_DOMICILIO,$parametros);
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {  //funcion para eliminar un domicilio
        $parametros = array("id" => $datos['id']);
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_DOMICILIO,$parametros);
    }

    public function listar($datos) {
        
    }

    public function modificar($datos) { //funcion para modificar un domicilio
        $parametros = array("calle" => $datos['calle'],"numero" => $datos['numero'],"id" => $datos['id']);
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_DOMICILIO,$parametros);
    }

}
