import React from 'react'
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";
 
const Staff = () => {
  return (
    <>
        <div>
            <Navbar/>
        </div>
        
        <div >
            <Link to="#" className='menu-bars'>
                SPRINT 1, need to be done by Tuesday
            </Link>
        </div>
    </>
  )
}

export default Staff