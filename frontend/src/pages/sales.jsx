import React from 'react'
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";

const Sales = () => {
  return (
    <>
        <div>
            <Navbar/>
        </div>
        
        <div >
            <Link to="#" className='menu-bars'>
                Sales statistics
            </Link>
        </div>
    </>
  )
}

export default Sales