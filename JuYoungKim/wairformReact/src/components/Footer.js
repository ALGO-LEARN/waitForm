import React from 'react'
import {Link} from 'react-router-dom';
import '../css/footer.css'

const Footer = (props)=>{
    return(
        <>
            <footer className="footer-section">
                <div>
                    <i className="fa-solid fa-address-card"></i>
                    <Link to ="/">외폼</Link>
                </div>
                <p>Copyright © 2022 tcpschool.co.,Ltd. All rights reserved.</p>
            </footer>
        </>
    );

}

export default Footer;