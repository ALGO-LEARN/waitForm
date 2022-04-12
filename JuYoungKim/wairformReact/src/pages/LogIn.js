import React, {useState} from 'react';
import "../css/login.css"
import {Link, useHistory} from 'react-router-dom'
import axios from 'axios';
import Footer from '../components/Footer';

const LogIn = (props) =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const history = useHistory();

    const onEmailHandler = (event) =>{
        setEmail(event.currentTarget.value);
        console.log("email = " +  email);
    }

    const onPasswordHandler = (event) =>{
        setPassword(event.currentTarget.value);
        console.log("password = "+password);
    }

    const onSubmit = (event) =>{
        event.preventDefault();
        console.log(email +" "+password);

        axios
            .post("http://localhost:8080/auth/login",{
                "email" : email,
                "password" : password
            })
            .then(function(response){
                console.log(response);
                alert(response.data.message);
                if(response.status === 200){
                    alert("로그인 성공");
                    localStorage.setItem("accessToken",response.data.data.accessToken);
                    localStorage.setItem("refreshToken",response.data.data.refreshToken);
                    history.push('/');
                    window.location.reload();
                }
            })
            .catch(function(error){
                console.log(error);
                alert(error);
            })
    }

    return (
    <div>
        
        <div className="log-in-form">
            <h1>LOGIN</h1>
            <h1>WAITFORM</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <div className="input-form">
                        <label htmlFor="id">EMAIL<input type="email" id="id" onChange={onEmailHandler} placeholder="이메일을 입력해주세요."></input></label>
                    </div>
                    <div className="input-form">
                        <label htmlFor="pwd">PASSWORD<input type="password" id="pwd" onChange={onPasswordHandler} placeholder="비밀번호를 입력해주세요."></input></label>
                    </div>
                </div>
                <div className="find-id-pwd">
                    <Link to="#">아이디 찾기</Link>
                    <Link to="#">비밀번호 찾기</Link>
                </div>
                <div>
                    <div className="btn-div">
                        <button className="in-btn" type='submit'>로그인</button>
                    </div>
                    <div className="btn-div">
                        <button className="in-btn"><Link to='/signup'>회원가입</Link></button>
                    </div>
                </div>
            </form>
    
        </div>

        <Footer></Footer>
    </div>
    );

}

export default LogIn;