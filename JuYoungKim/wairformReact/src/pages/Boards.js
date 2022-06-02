import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import AlarmModal from "./AlarmModal";
import NavBlack from "../components/NavBlack";
import MyWritedBoard from "../components/MyWritedBoard";
import MyContractBoard from "../components/MyContractBoard";
import isLogin from "../control/isLogin";
import '../css/post.css'

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

    const target =( whosBoard )=>{
        const lis = document.getElementsByClassName('my-post');
        if(whosBoard){
            lis[0].style.backgroundColor = 'black';
            lis[0].children[0].style.color = 'white';
            lis[1].style.backgroundColor = 'white'
            lis[1].children[0].style.color = 'black';
        }
        else{
            lis[0].style.backgroundColor = 'white';
            lis[0].children[0].style.color = 'black';
            lis[1].style.backgroundColor = 'black';
            lis[1].children[0].style.color = 'white';
        }
    };

    useEffect(()=>{
        target(isMyWritedBoard);
    },[isMyWritedBoard])

    return(
        <>
            <NavBlack isloged = {isloged}/>
            <div className="posts">
                <div className="post-nav-div">
                    <div className="post-null">

                    </div>
                    <div className="post-ul-div">
                        <ul>
                            <li className="my-post"><Link to='#' onClick={clickMyWritedBoard}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;내 글&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Link></li>
                            <li className="my-post"><Link to='#' onClick={clickMyContractBoard}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;내가 수락한 제안&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Link></li>
                        </ul>
                    </div>
                    <div className="posts-btn-div">
                        <button onClick={(event)=>{event.preventDefault(); history.goBack();}}>이전으로</button>
                        <button onClick={(event)=>{event.preventDefault(); history.push("/write");}}>글 작성</button>
                    </div>
                </div>
                {isMyWritedBoard &&<MyWritedBoard  isMyWritedBoard ={isMyWritedBoard}/>}
                {isMyContractBoard && <MyContractBoard isMyContractBoard={isMyWritedBoard}/>}
            </div>
            <AlarmModal></AlarmModal>
        </>
    );
}

export default Boards;