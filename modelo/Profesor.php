<?php
require_once 'Persona.php';
class Profesor extends Persona {
    public $titulo;
    function __construct($nombre, $apellido, $titulo,$calle, $numero) {
        parent::__construct($nombre, $apellido,$calle, $numero);
        $this->titulo = $titulo;
    }
    function getTitulo() {
        return $this->titulo;
    }

    function setTitulo($titulo) {
        $this->titulo = $titulo;
    }


}
