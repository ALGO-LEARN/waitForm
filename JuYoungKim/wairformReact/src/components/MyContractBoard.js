import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Board from "../components/Board";
import getAccessToken from "../control/getAccessToken";
import getTime from '../control/getTime'
import '../css/post.css'


const MyContractBoard = (props)=>{

    const [posts, setPosts] = useState([]);
    
    useEffect(()=>{
        const token =getAccessToken();
        console.log(props);
        axios
        .get("http://localhost:8080/like/me/list",
           {
             headers: {
               Authorization: 'Bearer ' + token
             }
           })
        .then( (response) =>{
            console.log(response);
            console.log(response.data.data);
            setPosts(response.data.data);     
        })
        .catch((error)=>{
            console.log(error);
            alert(error);
        })

    },[ ]);

    return(
        <>
            <div className="posts">
            <div className="posts-header">
                <ul>
                    <li>수락한 글</li>
                    <li>제목</li>
                    <li>작성일</li>
                </ul>
            </div>

            <div className="posts-contents">
                {posts && posts.map((post)=><Board key={post} title={post.boardTitle} createdDate = {getTime()} boardId = {post.boardId} whosBoard={props.isMyContractBoard}/>)}
            </div>
        </div>
    </>
    );
}

export default MyContractBoard;