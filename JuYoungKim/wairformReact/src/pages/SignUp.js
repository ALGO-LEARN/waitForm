import React, { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom';
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

    const [emailError, setEmailError] = useState(true);
    const [passWordError, setpassWordError] = useState(true);
    const [passWordValError, setpassWordValError] = useState(true);

    const [canSignUp, setCanSignUp] = useState(false);

    const history = useHistory();

    useEffect(()=>{
        const emailRegex = isEmail(email);
        if(!email || emailRegex)
            setEmailError(false);
        else
            setEmailError(true);
        console.log("*******************************");    
        console.log(email);
    },[email]);

    useEffect(()=>{
        const passwordRegex = isPassword(password);

        if(!password || passwordRegex)
            setpassWordError(false);
        else    
            setpassWordError(true);

        console.log("*******************************");
        console.log("password : "+password);
        console.log("password len : "+password.length);
    },[password]);

    useEffect(()=>{
        const pwdValCheck = isPasswordSame(password, passwordVal);
        if(!passwordVal || pwdValCheck)
            setpassWordValError(false);
        else
            setpassWordValError(true);

        console.log("*****************************")
        console.log("passWordVal : "+ passwordVal);
        console.log("pwdValCheck : "+ pwdValCheck);
    },[password,passwordVal])

    useEffect(()=>{
        if(email && password && passwordVal && !emailError && !passWordValError && !passWordError)
            setCanSignUp(true);
        else
            setCanSignUp(false);
        
        console.log("*****************************");
        console.log("emailError : " + emailError);
        console.log("passWordError : "+ passWordError);
        console.log("passwordValError : " + passWordValError);
    },[email,password,passwordVal,passWordValError,passWordError,emailError])
    

    const onNickNameHandler = (event) =>{
        setNickName(event.currentTarget.value);
        console.log(nickName);
    }

    const onEmailHandler = (event) =>{   
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) =>{
        setPassword(event.currentTarget.value);
    }


    const onPasswordValHandler = (event) =>{
        setPasswordVal(event.currentTarget.value);
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
                        {emailError && <div style={{textAlign:"left"}}><p style={{color :"red"}}> 이메일 형식에 맞게 입력해주세요</p></div>}
                    </div>
                    <div className="signup-contents-div">
                        <label htmlFor="">Password<input type="password" value={password} onChange={onPasswordHandler} placeholder="비밀번호"/></label>
                        {passWordError && <div style={{textAlign:"left"}}><p style={{color :"red"}}> 비밀번호는 영문 숫자를 포함하여 8 글자 이상을 입력해주세요</p></div>}
                    </div>
                    <div className="signup-contents-div">
                        <label htmlFor="">Password Validation<input type="password" value={passwordVal} onChange={onPasswordValHandler} placeholder="비밀번호 검사"/></label>
                        {passWordValError && <div style={{textAlign:"left"}}><p style={{color :"red"}}> 비밀번호가 일치하지 않습니다</p></div>}
                    </div>
                    <button 
                    disabled = { canSignUp ? false : true }
                    className ={ canSignUp ? "signup-able" : "signup-disable"}
                    type="submit"
                    >회원가입</button>
                </form>
            </div>
            <AlarmModal></AlarmModal>
            <Footer></Footer>
        </>
    );
}

export default SignUp;