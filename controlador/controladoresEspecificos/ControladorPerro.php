<?php
require_once 'ControladorGeneral.php';
require_once '../../modelo/Perro.php';


class ControladorPerro extends ControladorGeneral{
 
    private $refPerro;
    
    public function __construct() {
        parent::__construct();
    }


   
    public function agregar($datos) {
        
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            //'nombre', 'raza', 'edad' es el name del html'
            $parametros=array("nombre"=>$datos['nombre'], "raza" =>$datos['raza'], "edad"=>$datos['edad']);
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_PERRO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            
            return ($this->buscarUltimo());
            
        }
        
        catch(Exception $e){
            $this->refControladorPersistencia->rollBackTransaccion();
            echo 'Fallo'. $e->getMessage();
            
        }
        
    }

    public function buscar($datos) {
        try{
        $parametros=array("criterio" =>$datos['criterio'], "valor" => $datos['buscar']);
        $query= str_replace( '? = ?' ,$parametros['criterio']." = " ."'".$parametros['valor']."'", DbSentencias::BUSCAR_PERRO);
        $resultado=$this->refControladorPersistencia->ejecutarSentencia($query);
        $perro = $resultado->fetchAll(PDO::FETCH_ASSOC);
        return $perro;
        }
        catch(Exception $e){
            echo "fallo". $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametro= array("id"=>$datos['id']);
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_PERRO,$parametro);
            $this->refControladorPersistencia->confirmarTransaccion();
            
        } 
        
        
        catch(Exception $e){
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Fallo:" . $e->getMessage();
           
        }
    
    }

    public function listar($datos) {
        
        try{
        $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_TODOS); 
        $perros=$resultado->fetchAll(PDO::FETCH_ASSOC);
        return $perros;
        }
       catch (Exception $e){
           echo "Failed:" . $e->getMessage();
           
       }
        
    }

    public function modificar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("nombre"=>$datos['nombre'], "raza" => $datos['raza'], "edad" =>$datos['edad'], "id"=>$datos['id']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_PERRO,$parametros);         
            $this->refControladorPersistencia->confirmarTransaccion();   
           
            
        }
        
        
        catch(Exception $e){
            $this->refControladorPersistencia->rollBackTransaccion();
            echo'Fallo en modificar el perro' . $e->getMessage() ;
        } 
        
    }
    
    
    public function buscarUltimo(){
        try{
        $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_PERRO);
        $perro=$resultado->fetch();
         return $perro;
        }
        catch(Exception $e){
            echo 'Fallo en buscar el ultimo perro'. $e->getMessage();
        }
    }

}
