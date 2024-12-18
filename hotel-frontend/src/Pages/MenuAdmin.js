import '../App.css';
import { Link } from "react-router-dom";
const MenuAdmin = () => {

    return (
        
        <div>
            <div className='fullscreen-bg'></div> 
             
            <h2 className='titulo'>GESTION HABITACIONES</h2>
            <Link to="/admin" style={{color:'white',
                                      'font-size': '2.5rem',
                                      'text-align':'center',
            }}>Crear</Link>
        </div>
        
    )
}


export default MenuAdmin;