<?php

class Domicilio {
    private $calle;
    private $numero;
    
    function __construct($calle, $numero) {
        $this->calle = $calle;
        $this->numero = $numero;
    }
    
    function getCalle() {
        return $this->calle;
    }

    function getNumero() {
        return $this->numero;
    }

    function setCalle($calle) {
        $this->calle = $calle;
    }

    function setNumero($numero) {
        $this->numero = $numero;
    }

}
