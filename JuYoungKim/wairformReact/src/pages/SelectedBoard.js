import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import getAccessToken from "../control/getAccessToken";
import NavBlack from "../components/NavBlack";
import isLogin from "../control/isLogin";
import getCKEditorValue from "../control/getCkEditorValue";
import '../css/selectedBoard.css'

const SelectedBoard = (props) =>{
    const isloged = isLogin();
    const {boardId} = useParams();
    const [title,setTitle] =useState("");
    const [content, setContent] = useState("");
    const [date,setDate] = useState(""); 

    useEffect(()=>{
        const token = getAccessToken();
        console.log(boardId);
        axios
            .get("http://localhost:8080/board/"+boardId,
            {
                headers : {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((response)=>{
                console.log(response);
                setTitle(response.data.data.title);
                setContent(response.data.data.content);
                setDate(response.data.data.createdDate);
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
                <div className="chat">
                    <p>추후 채팅을 위한 공간</p>
                </div>
            </div>
            
        </>
    );
}

export default SelectedBoard;