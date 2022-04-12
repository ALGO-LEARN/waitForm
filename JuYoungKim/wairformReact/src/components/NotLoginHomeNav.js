import React from 'react';
import { Link } from 'react-router-dom'
import '../css/nav.css'
import { useEffect } from "react";


const NotLoginHomeNav = (props) =>{

    function show() {
        document.querySelector(".modal-background").className = "modal-background modal-show";
    }

    useEffect( ()=>{
        console.log("NotLoginHomeNav");
    },[]);

    return(
        <>
        
        <div className="nav">
            <div className="nav-logo">
                <Link to = "/">WAITFORM</Link>
            </div>
            <div className="nav-links">
                <Link to = "#">ABOUT</Link>
                <Link id="alarm-show" onClick={show}>ALARM</Link>
                <Link to ="/login">LOGIN</Link>
                <Link to = "/signup">SIGN UP</Link>
            </div>
        </div>
        </>
    );
}

export default NotLoginHomeNav;