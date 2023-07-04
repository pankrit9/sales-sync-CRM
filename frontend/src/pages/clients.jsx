import React from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../components/navbars/Navbar";

function Clients() {
    return (
        <>
            <div>
                <Navbar/>
            </div>
            
            <div >
                <Link to="#" className='menu-bars'>
                    This needs to be finished by Tuesday
                </Link>
            </div>
        </>
    );
}
export default Clients ;