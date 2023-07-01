import React, { useState } from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as BsIcons from "react-icons/bs";
import * as FaIcons6 from "react-icons/fa6";
import * as VscIcons from "react-icons/vsc";
import * as TbIcons from "react-icons/tb"

export const SidebarData = [

    {
        title: 'Sales',
        path: '/sales',
        icon: <FaIcons6.FaMoneyBillTrendUp/>,
        cName: 'nav-text'
    },
    {
        title: 'Tasks',
        path: '/tasks',
        icon: <FaIcons.FaClipboardList/>,
        cName: 'nav-text'
    },
    {
        title: 'Clients',
        path: '/clients',
        icon: <BsIcons.BsPeople/>,
        cName: 'nav-text'
    },
    {
        title: 'Staff',
        path: '/staff',
        icon: <FaIcons6.FaPeopleGroup/>,
        cName: 'nav-text'
    },
    {
        title: 'Products',
        path: '/products',
        icon: <BsIcons.BsBoxSeam/>,
        cName: 'nav-text'
    },
    {
        title: 'Rankings',
        path: '/rankings',
        icon: <FaIcons6.FaRankingStar/>,
        cName: 'nav-text'
    },
    {
        title: 'Records',
        path: '/records',
        icon: <TbIcons.TbReportMoney/>,
        cName: 'nav-text'
    },
    {
        title: 'SIGN OUT',
        path: '/',
        icon: <VscIcons.VscSignOut/>,
        cName: 'nav-text out'
    }
]