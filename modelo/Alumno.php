<?php
require_once 'Persona.php';
class Alumno extends Persona {
    public $legajo;
    function __construct($nombre, $apellido, $legajo,$calle, $numero) {
        parent::__construct($nombre, $apellido,$calle, $numero);
        $this->legajo = $legajo;
    }
    function getLegajo() {
        return $this->legajo;
    }

    function setLegajo($legajo) {
        $this->legajo = $legajo;
    }



}
