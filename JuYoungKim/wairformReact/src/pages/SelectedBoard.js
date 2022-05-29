import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import NavBlack from "../components/NavBlack";
import Chat from "../components/Chat";
import getAccessToken from "../control/getAccessToken";
import isLogin from "../control/isLogin";
import getCKEditorValue from "../control/getCkEditorValue";
import '../css/selectedBoard.css'
import ChatOneToOne from "../components/ChatOneToOne";

const SelectedBoard = (props) =>{
    const isloged = isLogin();
    const {boardId} = useParams();
    const [title,setTitle] =useState("");
    const [content, setContent] = useState("");
    const [date,setDate] = useState("");
    const [myNickName, setMyNickName] = useState("");
    const [myBoardOrOthersBoard, setMyBoardOrOthersBoard] = useState(props.location.state.whosBoard);

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
                console.log("SelectedBoadrd");
                console.log(response);
                setTitle(response.data.data.title);
                setContent(response.data.data.content);
                setDate(response.data.data.createdDate);
                setMyNickName(response.data.data.writerNickname);
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
                {myBoardOrOthersBoard &&<Chat boardId ={boardId} myNickName={myNickName}></Chat>}
                {!myBoardOrOthersBoard && <ChatOneToOne boardId ={boardId} myNickName={myNickName}></ChatOneToOne>}
            </div>
            
        </>
    );
}

export default SelectedBoard;