import React from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import NavBlack from "../components/NavBlack";
import MyWritedBoard from "../components/MyWritedBoard";
import AlarmModal from "./AlarmModal";
import isLogin from "../control/isLogin";
import '../css/post.css'
import { Link } from "react-router-dom";
import MyContractBoard from "../components/MyContractBoard";

const Boards = (props) =>{
    const isloged = isLogin();
    const history = useHistory();

    const [isMyWritedBoard,setIsMyWritedBoard] = useState(true);
    const [isMyContractBoard,setIsMyContractBoard] = useState(false);

    const clickMyWritedBoard = () =>{
        setIsMyWritedBoard(true);
        setIsMyContractBoard(false);
    }

    const clickMyContractBoard = () =>{
        setIsMyContractBoard(true);
        setIsMyWritedBoard(false);
    }

    return(
        <>
            <NavBlack isloged = {isloged}/>
            <div className="post-nav-div">
                <div className="post-ul-div">
                    <ul>
                        <li><Link to='#' onClick={clickMyWritedBoard}>내 글</Link></li>
                        <li><Link to='#' onClick={clickMyContractBoard}>내가 수락한 제안</Link></li>
                    </ul>
                </div>
                <div className="posts-btn-div">
                    <button onClick={(event)=>{event.preventDefault(); history.goBack();}}>이전으로</button>
                    <button onClick={(event)=>{event.preventDefault(); history.push("/write");}}>글 작성</button>
                </div>
            </div>
            {isMyWritedBoard &&<MyWritedBoard  isMyWritedBoard ={isMyWritedBoard}/>}
            {isMyContractBoard && <MyContractBoard isMyContractBoard={isMyWritedBoard}/>}
            <AlarmModal></AlarmModal>
        </>
    );
}

export default Boards;