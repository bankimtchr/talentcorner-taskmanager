"use client";

import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link';
import { FiHome } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { RiAddBoxLine } from "react-icons/ri";
import { RiMailUnreadLine } from "react-icons/ri";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const NavLink = ({ item, open, setOpen }) => {
    // console.log(item);
    const pathName = usePathname();

    const handleNavClick = () => {
        if (open) {
            setOpen(!open);
        }
    }

    return (
        <div className={pathName === item.path ? "lg:w-full lg:py-1 lg:bg-lightpurple flex items-center px-4" : "lg:w-full lg:py-1 flex items-center px-4"}>

            {item.name === "Home" && <FiHome size={24} color="white" className="hidden lg:block" />}
            {(item.name === "Add Employee" || item.name === "Franchise") && <LuUser size={26} color="white" className="hidden lg:block" />}
            {item.name === "Dashboard" && <RxDashboard size={24} color="white" className="hidden lg:block" />}
            {item.name === "New" && <RiAddBoxLine size={28} color="white" className="hidden lg:block" />}
            {item.name === "Mails" && <RiMailUnreadLine size={24} color="white" className="hidden lg:block" />}
            {item.name === "Assign" && <MdOutlineTaskAlt size={24} color="white" className="hidden lg:block" />}
            {item.name === "Edit Employee" && <FiEdit size={24} color="white" className="hidden lg:block" />}

            <Link href={item.path} key={item.name} className={pathName === item.path ? " py-1 px-4 hover:underline text-lg font-semibold lg:bg-lightpurple text-lightpurple lg:text-white lg:w-[250px] cursor-pointer " : "py-1 px-4 hover:underline text-lg font-semibold text-purple lg:text-white sm:w-full cursor-pointer "} onClick={handleNavClick} >
                {item.name}
            </Link>
        </div>
    )
}

export default NavLink
