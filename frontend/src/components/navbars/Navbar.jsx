import React, { useState } from 'react'
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import {Link} from 'react-router-dom'
import { SidebarData } from './SidebarData'
import './Navbar.css'
import { IconContext } from 'react-icons/lib'
import { setMode, setLogout } from '../../state';
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";


function Navbar({}) {
    const [sidebar, setSidebar] = useState(false)
    const dispatch = useDispatch();
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const navigate = useNavigate();
    const company = useSelector((state) => state.company);
    const role = useSelector((state) => state.role);
    const name = useSelector((state) => state.name);
    const _id = useSelector((state) => state.user);
    const showSidebar = () => setSidebar(!sidebar)

    //Return function for rendering the Navbar
    return (
        <>
            <IconContext.Provider value={{color: '#5E17EB'}}>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' >
                        < li className='navbar-toggle' onClick={showSidebar} >
                            <Link to='#' className='menu-bars'>
                                {sidebar? <AiIcons.AiOutlineClose/> :<FaIcons.FaBars/>}
                            </Link>
                            {sidebar &&
                            <div >
                                <div className='company-name'
                                    color={'white'} display={'flex'}
                                >
                                    {company ? company : "Logged Out"}
                                </div>
                                <div className='credentials' >
                                    {name ? name +" |" : ""}
                                </div>
                                <div className='role-nav' >
                                    {role} ID {_id}
                                </div>
                            </div>}
                        </li>
                        
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName} onClick={() => {
                                    if(item.cName === 'nav-text out'){
                                        dispatch(setLogout());
                                        navigate('/');
                                    }
                                    if(item.cName === 'nav-text mode'){
                                        dispatch(setMode());
                                        {theme.palette.mode === "dark" ? (
                                        <DarkMode sx={{ fontSize: "25px" }} />
                                        ) : (
                                        <LightMode sx={{ color: dark, fontSize: "25px" }} />
                                        )}
                                    }
                                }}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        {sidebar? <div className='span2'>{item.title}</div> :''}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}
export default Navbar ;