import React from 'react';
import {Link} from 'react-router-dom'
import '../css/nav.css'
import logOut from '../control/logOut';

const LoginHomeNav = (props) => {

    function show() {
        document.querySelector(".modal-background").className = "modal-background modal-show";
    }

    return(
        <>
        <div className="nav">
            <div className="nav-logo">
                <Link to = "/">WAITFORM</Link>
            </div>
            <div className="nav-links">
                <Link to = "/">ABOUT</Link>
                <Link to = "#" id="alarm-show" onClick={show}>ALARM</Link>
                <Link to = "/boards">BOARD</Link>
                <Link to ="/" onClick={logOut}>LOGOUT</Link>
            </div>
        </div>
        </>
    );
}

export default LoginHomeNav;