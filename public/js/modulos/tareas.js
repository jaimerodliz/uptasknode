import axios from "axios";
import Swal from 'sweetalert2';

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', (e) =>{
        console.log(e.target.classList);
        //evento click en palomita actualizar
        if(e.target.classList.contains('fa-check-circle')){
            console.log("Actualizando...");
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.idtarea;
            console.log(idTarea);

            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    console.log(respuesta);
                    if(respuesta.status==200){
                        //si el elemento tiene la clase completo se lo quita y si no se lo pone
                        icono.classList.toggle('completo');
                        
                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            console.log('Eliminando....');
            const elemento = e.target.parentElement.parentElement;
            const idTarea = elemento.dataset.idtarea;

            console.log(idTarea);

            Swal.fire({
                title: 'Deseas borrar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if(result.isConfirmed){
                    const url = `${location.origin}/tareas/${idTarea}`;
                    
                    axios.delete(url,{
                        params: { idTarea }
                    }).then(function(respuesta){
                        if(respuesta.status==200){
                            //eliminar el nodo html
                            elemento.parentElement.removeChild(elemento);
                            
                            Swal.fire(
                                'Tarea',
                                respuesta.data,
                                'success'
                            );
                            actualizarAvance();
                        }
                    })
                }
            })
        
        }
    });
}

export default tareas;