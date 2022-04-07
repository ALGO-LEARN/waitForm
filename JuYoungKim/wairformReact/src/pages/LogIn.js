import React from 'react';
import "../css/login.css"
import {Link} from 'react-router-dom'

const LogIn = () =>{
    return (
    <div>
        <div className="log-in-form">
            <h1>LOGIN</h1>
            <h1>WAITFORM</h1>
            <form action="">
                <div>
                    <div className="input-form">
                        <label for="id">아이디<input type="text" id="id"></input></label>
                    </div>
                    <div className="input-form">
                        <label for="pwd">비밀번호<input type="password" id="pwd"></input></label>
                    </div>
                </div>
                <div className="find-id-pwd">
                    <Link to="">아이디 찾기</Link>
                    <Link to="">비밀번호 찾기</Link>
                </div>
                <div>
                    <div className="btn-div">
                        <button className="in-btn">로그인</button>
                    </div>
                    <div className="btn-div">
                        <button className="in-btn">회원가입</button>
                    </div>
                </div>
            </form>
    
        </div>
        <footer className="footer-section">
            <div className="nav-logo">
                <i className="fa-solid fa-address-card"></i>
                <Link to ="/">외폼</Link>
            </div>
            <p>Copyright © 2022 tcpschool.co.,Ltd. All rights reserved.</p>
        </footer>
    </div>
    );

}

export default LogIn;