import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Board from "../components/Board";
import getAccessToken from "../control/getAccessToken";
import '../css/post.css'


const MyWritedBoard = (props)=>{
    const [posts, setPosts] = useState([]);
    
    useEffect(()=>{
        const token =getAccessToken();
        console.log(props);
        axios
        .get("http://localhost:8080/board/me/list",
           {
             headers: {
               Authorization: 'Bearer ' + token
             }
           })
        .then( (response) =>{
            console.log("내 글 목록");
            console.log(response.data.data);
            setPosts(response.data.data);
            // alert(response.data.message);      
        })
        .catch((error)=>{
            console.log("내 글 목록 조회 실패 혹은 없음");
            console.log(error);
        })

    },[ ]);

    return(
        <>
        {/* <div className="posts"> */}
            <div className="posts-header">
                <ul>
                    <li>작성한 글</li>
                    <li>제목</li>
                    <li>작성일</li>
                </ul>
            </div>

            <div className="posts-contents">
                {posts && posts.map((post)=><Board key={post} title={post.title} createdDate = {post.createdDate} boardId = {post.boardId} whosBoard ={props.isMyWritedBoard}/>)}
            </div>
        {/* </div> */}
    </>
    );
}

export default MyWritedBoard;