import axios from "axios";
import React from "react";
import {useState, useEffect} from 'react';
import getAccessToken from "../control/getAccessToken";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../css/alarmmodal.css'

const Recommend = (props) => {

    const myNickName = props.myNickName;
    const myMemberId = props.myMemberId;
    const boardId = props.boardId;
    const boardTitle = props.boardTitle;
    const [like,setLike] = useState(false);
    const [invited , setInvited] = useState();


    const sendMessage = async (roomId) => {
        const options = {debug: false};
        const sockJS = new SockJS("http://localhost:8080/ws-chat/");
        const client = Stomp.over(sockJS, options);
        const token = getAccessToken();
        const headers = { Authorization :'Bearer ' + token };
        const message = { roomId : roomId, senderId: myMemberId, content : "안녕하세요"};
        // console.log(myMemberId)
        await client.connect(headers, (res)=>{
            console.log("채팅방 연결 성공");
            client.send('/pub/messages',headers, JSON.stringify(message));
            client.disconnect(()=>{
                client.unsubscribe('sub-0');
            });
        },
        (error)=>{
            console.log("좋아요 시 채팅방에 첫 메세지 보내기 실패");
            console.log(error);
        });
        
    }

    const onClickHandler = () =>{
        const url = "http://localhost:8080/board/"+boardId+"/like"
        const token = getAccessToken();
        axios.post(url,
            {

            },
            {
                 headers : {
                    Authorization: 'Bearer ' + token
                }
            }
            ).then((res)=>{
                alert("상대방의 제안에 수락하셨습니다.");
                console.log("좋아요 성공");
                console.log(res);
                setLike(true);
            }).catch((error)=>{
                console.log("좋아요 실패");
                console.log(error);
            });
    };

    const getRecieverNickName = async () =>{
        const url = "http://localhost:8080/board/"+boardId;
        const token = getAccessToken();
        await axios
        .get(url,
            {
                headers : {
                Authorization: 'Bearer ' + token 
            }
            })
            .then((response)=>{
                console.log("상대방 닉네임을 가져오기 위한 게시글 조회");
                console.log("상대방 닉네임 조회");
                console.log(response.data.data.writerNickname);
                setInvited(response.data.data.writerNickname);
            })
            .catch((error)=>{
                console.log("단일 게시글 조회 오류 오류");
                console.log(error);
            })
    };

    const makeChatRoom = async () =>{
        const url = "http://localhost:8080/chat/rooms"
        const token = getAccessToken();
        await axios
        .post(url,{
                "host":myNickName,
                "invited": invited
            },
            {
                headers : {
                Authorization: 'Bearer ' + token 
            }
            })
            .then((response)=>{
                console.log("채팅방 생성 완료");
                console.log("생성된 채팅방");
                console.log(response.data.data);
                sendMessage(response.data.data.chatRoomId);
            })
            .catch((error)=>{
                console.log("채팅방생성 오류");
                console.log(error);
            })
    }

    useEffect(()=>{
        getRecieverNickName();
    },[ ])

    useEffect(()=>{
        invited && like && makeChatRoom();
    },[like])


    return (
        <>
            <tr>
                <td><div className="modael-contents-body-writer"><p>{boardId}</p></div></td>
                <td><div className="modal-contents-body-title">{boardTitle} 게시글로부터 제안받으셨습니다.</div></td>
                <td><div className="modal-contents-body-date"><button onClick={onClickHandler}>좋아요</button></div></td>
            </tr>
        </>
    );
}

export default Recommend;