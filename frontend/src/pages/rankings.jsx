import React from 'react'
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";
 
const Rankings = () => {
  return (
    <>
        <div>
            <Navbar/>
        </div>
        
        <div >
            <Link to="#" className='menu-bars'>
                SPRINT 2
            </Link>
        </div>
    </>
  )
}

export default Rankings