import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBlack from "../components/NavBlack";
import Chat from "../components/Chat";
import ChatOneToOne from "../components/ChatOneToOne";
import getAccessToken from "../control/getAccessToken";
import isLogin from "../control/isLogin";
import getCKEditorValue from "../control/getCkEditorValue";
import '../css/selectedBoard.css'

const SelectedBoard = (props) =>{
    const isloged = isLogin();
    const {boardId} = useParams();
    const [title,setTitle] =useState("");
    const [content, setContent] = useState("");
    const [date,setDate] = useState("");
    const [writerNickName, setWriterNickName] = useState("");
    const [writerMemberId, setWriterMemberId] = useState("");
    const [myBoardOrOthersBoard, setMyBoardOrOthersBoard] = useState(props.location.state.whosBoard);
    const [myNickName, setMyNickName] =useState(props.location.state.myNickName);

    useEffect(()=>{
        const token = getAccessToken();
        axios
            .get("http://localhost:8080/board/"+boardId,
            {
                headers : {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((response)=>{
                console.log("현재 게시글 정보");
                console.log(response);
                setTitle(response.data.data.title);
                setContent(response.data.data.content);
                setDate(response.data.data.createdDate);
                setWriterNickName(response.data.data.writerNickname);
                setWriterMemberId(response.data.data.memberId);
            })
            .catch((error)=>{
                console.log(error);
                alert(error);
            })
    },[ ])

    return(
        <>
            <NavBlack isloged = {isloged}/>
            <div className="selectedBoard-with-chat">
                <div className="selectedBoard">
                    <div className="selectedBoard-header">
                        <ul>
                            <li>{title}</li>
                            <li>{date.substring(0,10)}</li>
                        </ul>
                    </div>
                    <div className="selectedBoard-contents">
                        {content &&getCKEditorValue(content) }
                    </div>
                </div>
                {myBoardOrOthersBoard &&<Chat writerMemberId = {writerMemberId} boardId = {boardId} writerNickName = {writerNickName} myNickName ={myNickName}></Chat>}
                {!myBoardOrOthersBoard && <ChatOneToOne writerMemberId = {writerMemberId} boardId = {boardId} writerNickName = {writerNickName} myNickName ={myNickName}></ChatOneToOne>}
            </div>
            
        </>
    );
}

export default SelectedBoard;