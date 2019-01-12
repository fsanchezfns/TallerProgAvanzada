<?php
require_once 'Domicilio.php';
abstract class Persona {
    protected $nombre;
    protected $apellido;
    protected $refDomicilio;
            
    
    function __construct($nombre, $apellido, $calle, $numero) {
        $this->nombre = $nombre;
        $this->apellido = $apellido;
        $this->refDomicilio = new Domicilio($calle, $numero);
    }

    function getNombre() {
        return $this->nombre;
    }

    function getApellido() {
        return $this->apellido;
    }

    function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    function setApellido($apellido) {
        $this->apellido = $apellido;
    }
    
    function getRefDomicilio() {
        return $this->refDomicilio;
    }

    function setRefDomicilio($refDomicilio) {
        $this->refDomicilio = $refDomicilio;
    }

}
