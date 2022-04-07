import React, { useState } from "react"
import {Link} from 'react-router-dom'
import axios from "axios"

import '../css/signup.css'
const SignUp = () =>{
    const [nickName, setNickName] = useState("");
    const [password,setPassword] = useState("");
    const [email, setEmail] = useState ("");

    const onNickNameHandler = (event) =>{
        setNickName(event.currentTarget.value);
    }
    const onPasswordHandler = (event) =>{
        setPassword(event.currentTarget.value);
    }
    const onEmailHandler = (event) =>{
        setEmail(event.currentTarget.value);
    }
    const onSubmit = (event) =>{
        event.preventDefault();
    }
    return (
        <>
            <div>
                <div class="nav-background">
                    <div class="nav-logo">
                        <Link to="/">WAITFORM</Link>
                    </div>
                    <div class="nav-links">
                        <Link to="/login">LOGIN</Link>
                        <Link to="/signup">SIGN UP</Link>
                    </div>
                </div>
            </div>

            <div class="signup-div">
                <form action="">
                    <div class="signup-contents-div">
                        <label for="">NickName<input type="text" value={nickName} onChange={onNickNameHandler}/></label>
                    </div>
                    <div class="signup-contents-div">
                        <label for="">Email<input type="email" value={email} onChange={onEmailHandler}/></label>
                    </div>
                    <div class="signup-contents-div">
                        <label for="">Password<input type="password" value={password} onChange={onPasswordHandler}/></label>
                    </div>
                    <button type="submit" onSubmit={onSubmit}>회원가입</button>
                </form>
            </div>

            <section class="footer-section">
                <footer>
                    <div class="nav-logo">
                        <i class="fa-solid fa-address-card"></i>
                        <Link to="/">외폼</Link>
                    </div>
                    <p>Copyright © 2022 tcpschool.co.,Ltd. All rights reserved.</p>
                </footer>
            </section>
        </>
    );
}

export default SignUp;