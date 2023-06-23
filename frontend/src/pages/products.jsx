import React from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";

function Products() {

    return (
        <>
            <div>
                <Navbar/>
            </div>
            
            <div >
                <Link to="#" className='menu-bars'>
                    Hello hello im the inventory. This needs to be finished by Tuesday
                </Link>
            </div>
        </>
    );
}
export default Products ;