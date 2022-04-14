import React from "react";
import axios from "axios";
import NavBlack from "../components/NavBlack";
import AlarmModal from "./AlarmModal";
import isLogin from "../control/isLogin";
import Board from "../components/Board";
import getAccessToken from "../control/getAccessToken";
import { useState, useEffect } from "react";
import '../css/post.css'

const Boards = (props) =>{

    const isloged = isLogin();
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        const token =getAccessToken();
        console.log(token);
        axios
        .get("http://localhost:8080/board/me/list",
           {
             headers: {
               Authorization: 'Bearer ' + token
             }
           })
        .then( (response) =>{
            console.log(response);
            console.log(response.data.data);
            setPosts(response.data.data);
            alert(response.data.message);      
        })
        .catch((error)=>{
            console.log(error);
            alert(error);
        })

    },[ ]);

    return(
        <>
            <NavBlack isloged = {isloged}/>
            <div className="posts">
                
                <div className="posts-header">
                    <ul>
                        <li>작성한 글</li>
                        <li>제목</li>
                        <li>작성일</li>
                    </ul>
                </div>

                <div className="posts-contents">
                    {posts && posts.map((post)=><Board title={post.title} createdDate = {post.createdDate} boardId = {post.boardId}/>)}
                </div>
            </div>
            <AlarmModal></AlarmModal>
        </>
    );
}

export default Boards;