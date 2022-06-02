import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Board from "../components/Board";
import getAccessToken from "../control/getAccessToken";
import getTime from '../control/getTime'
import '../css/post.css'


const MyContractBoard = (props)=>{

    const [posts, setPosts] = useState([]);
    const [myNickName,setMyNickName] = useState("");
    
    useEffect(()=>{
        const token =getAccessToken();
        console.log("MyContarctBoard props")
        console.log(props);
        axios
        .get("http://localhost:8080/like/me/list",
           {
             headers: {
               Authorization: 'Bearer ' + token
             }
           })
        .then( (response) =>{
            console.log("내가 좋아요한 Board");
            console.log(response);
            console.log("내가 좋아요한 Board data");
            console.log(response.data.data);
            setPosts(response.data.data);
            console.log("내 닉네임")
            console.log(response.data.data[0].nickname);
            setMyNickName(response.data.data[0].nickname);
        })
        .catch((error)=>{
            console.log("내가 좋아요한 Board 불러오기 실패");
            alert(error);
        })

    },[ ]);

    return(
        <>
            {/* <div className="posts"> */}
                <div className="posts-header">
                    <ul>
                        <li>수락한 글</li>
                        <li>제목</li>
                        <li>작성일</li>
                    </ul>
                </div>

                <div className="posts-contents">
                    {posts && posts.map((post)=><Board key={post} title={post.boardTitle} createdDate = {""} boardId = {post.boardId} whosBoard={props.isMyContractBoard} myNickName={post.nickname}/>)}
                </div>
            {/* </div> */}
        </>
    );
}

export default MyContractBoard;