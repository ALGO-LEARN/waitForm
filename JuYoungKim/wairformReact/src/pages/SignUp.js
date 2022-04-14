import React, { useEffect, useState } from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import Footer from "../components/Footer";
import AlarmModal from "./AlarmModal";
import isEmail from "../control/isEmail";
import isPassword from "../control/isPassword";
import '../css/signup.css'
import NotLoginHomeNavBlack from "../components/NotLoginHomeNavBlack"
import isPasswordSame from "../control/passwordValCheck";

const SignUp = (props) =>{
    const [nickName, setNickName] = useState("");
    const [password,setPassword] = useState("");
    const [passwordVal, setPasswordVal] = useState("");
    const [email, setEmail] = useState ("");

    const [emailError, setEmailError] = useState("");
    const [passWordError, setpassWordError] = useState("");
    const [passWordValError, setpassWordValError] = useState("");

    const [passwordValBool, setPasswordValBoll] =useState(false);

    const history = useHistory();

    const onNickNameHandler = (event) =>{
        setNickName(event.currentTarget.value);
        console.log(nickName);
    }

    const onPasswordHandler = (event) =>{
        setPassword(event.currentTarget.value);
        const passwordRegex = isPassword(password);
        if(!passwordRegex)
            setpassWordError("비밀번호는 영문 숫자를 포함하여 6~20자를 입력하세요.")
        else
            setpassWordError("");
        
        console.log("*******************************");
        console.log("password : "+password);
        console.log("password len : "+password.length);
    }

    const onEmailHandler = (event) =>{
        const emailRegex = isEmail(email);
        if(!emailRegex && email.length>2)
            setEmailError("이메일형식에 맞게 입력하세요.");
        else
            setEmailError("");
        setEmail(event.currentTarget.value);
        console.log(email);
    }

    const onPasswordValHandler = (event) =>{
        setPasswordVal(event.currentTarget.value, ()=>{});
        const pwdValCheck = isPasswordSame(password, passwordVal);
        setPasswordValBoll(pwdValCheck);
        if(!passwordValBool)
            setpassWordValError("비밀번호와 동일한 값을 적어주세요.")
        else
            setpassWordValError("");
        // console.log("password : "+password);
        // console.log("passwordVal : "+passwordVal);
        console.log("*****************************")
        console.log("pwdValCheck : "+ pwdValCheck);
        console.log("passwordValBool :"+passwordValBool);
    }

    const onSubmit = (event) =>{
       event.preventDefault();
       console.log(nickName+" "+password+" "+email);
        axios
            .post("http://localhost:8080/auth/signup",{
                "email" : email,
                "nickname" : nickName,
                "password" : password
            }).then(function (response) {
                console.log(response);
                alert(response.data.message);
                if(response.status === 200)
                    history.push("/login");
            })
            .catch(function(error){
                console.log(error);
                alert(error);
            });
    }


    return (
        <>
            <NotLoginHomeNavBlack></NotLoginHomeNavBlack>

            <div className="signup-div">
                <form onSubmit={onSubmit}>
                    <div className="signup-contents-div">
                        <label htmlFor="">NickName<input type="text" value={nickName} onChange={onNickNameHandler} placeholder="사용하고 싶은 닉네임"/></label>
                        
                    </div>
                    <div className="signup-contents-div">
                        <label htmlFor="">Email<input type="email" value={email} onChange={onEmailHandler} placeholder="이메일"/></label>
                        {emailError && <div style={{textAlign:"left"}}><p style={{color :"red"}}> {emailError}</p></div>}
                    </div>
                    <div className="signup-contents-div">
                        <label htmlFor="">Password<input type="password" value={password} onChange={onPasswordHandler} placeholder="비밀번호"/></label>
                        {passWordError && <div style={{textAlign:"left"}}><p style={{color :"red"}}> {passWordError}</p></div>}
                    </div>
                    <div className="signup-contents-div">
                        <label htmlFor="">Password Validation<input type="password" value={passwordVal} onChange={onPasswordValHandler} placeholder="비밀번호 검사"/></label>
                        {passwordValBool && <div style={{textAlign:"left"}}><p style={{color :"red"}}> {passWordValError}</p></div>}
                    </div>
                    <button type="submit">회원가입</button>
                </form>
            </div>
            <AlarmModal></AlarmModal>
            <Footer></Footer>
        </>
    );
}

export default SignUp;