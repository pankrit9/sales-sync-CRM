import React from 'react'
import {Link} from 'react-router-dom'
import Navbar  from "../../components/navbars/Navbar";
import Chatbot from "../../components/chatbot/Chatbot";
 
const Rankings = () => {
  return (
    <>
        <div>
            <Navbar/>
            <Chatbot />
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