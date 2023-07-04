import React, { useState } from 'react'
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as VscIcons from "react-icons/vsc";
import {Link} from 'react-router-dom'
import { SidebarData } from './SidebarData'
import './Navbar.css'
import { IconContext } from 'react-icons/lib'
import { setMode, setLogout } from '../../state';
import { useDispatch, useSelector } from "react-redux";
import { useTheme, IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";


function Navbar() {
    const [sidebar, setSidebar] = useState(false)
    const dispatch = useDispatch(); // to dispatch actions from the reducer
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const navigate = useNavigate();

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
            <IconContext.Provider value={{color: '#5E17EB'}}>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        < li className='navbar-toggle' >
                            <Link to='#' className='menu-bars'>
                                {sidebar? <AiIcons.AiOutlineClose/>:<FaIcons.FaBars/>}
                            </Link>
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
                                        {sidebar? <span>{item.title}</span> :''}
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