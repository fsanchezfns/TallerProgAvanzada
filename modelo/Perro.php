<?php

/**
 * Description of Perro
 *
 * @author Franco
 */
class Perro {
    
    protected $nombre;
    protected $raza;
    protected $edad;
    
    public function __construct($nombre,$raza,$edad) {
        $this->nombre = $nombre;
        $this->edad = $edad;
        $this->raza = $raza;
        
    }
    
    
    public function setNombre($nombre) {
        $this->nombre=$nombre;
        
    }
    
    public function getNombre(){
        return $this->nombre;
    }
    
    
    public function setRaza($raza){
        $this->raza=$raza;
    }
    
    public function getRaza(){
        return $this->raza;
    }
    
    
    public function setEdad($edad){
       $this->edad=$edad;
     }
    
    public function getEdad(){
        return $this->edad;
        
      }

}
