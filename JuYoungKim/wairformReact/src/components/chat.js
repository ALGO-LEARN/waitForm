import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import getAccessToken from '../control/getAccessToken';
import LikePerson from './LikePerson';
import SockJS from 'sockjs-client';
import '../css/chat.css';
import Stomp from 'stompjs';

const Chat = (props) =>{

    const token = getAccessToken();
    const headers = { Authorization :'Bearer ' + token };
    const chatBox = document.getElementsByClassName("chat-body")[0];


    var options = {debug: false};
    var sockJS = new SockJS("http://localhost:8080/ws-chat/");
    var client = Stomp.over(sockJS, options);


    const myNickName = props.writerNickName;
    const senderId = props.writerMemberId;

    const [message, setMessage] = useState({
        roomId:'',
        senderId : '',
        content : ''
    });
    
    const chatBoxRef = useRef();
    const inputBoxRef = useRef();
    
    const [content, setContent] = useState("");
    const [chatList, setChatList] = useState([]);
    const [createdRoom, setCreatedRoom] = useState();
    const [likePeople, setLikePeople] = useState();
    const [isWebsocketConnect,setIsWebsocketConnect] = useState(false);
    
    
    useEffect(()=>{
        const token = getAccessToken();
        const url = "http://localhost:8080/like/"+props.boardId;
        axios
        .get(url,
            {
                headers : {
                    Authorization: 'Bearer ' + token
                }
            })
        .then((response)=>{
            console.log("좋아요 한 사람");
            console.log(response);
            setLikePeople(response.data.data);
        })
        .catch((error)=>{
            console.log("좋아요 한 사람 불러오기 실패");
            console.log(error);
        })
    },[ ]);

    
    useEffect(()=>{   
        const createRoom =  () =>{
            const token = getAccessToken();
            const url = "http://localhost:8080/chat/rooms"
            axios
            .post(url,{
                "host":myNickName,
                "invited" :likePeople[0].nickname
            },
            {
                headers : {
                    Authorization: 'Bearer ' + token 
                }
            })
            .then((response)=>{
                console.log("**************************");
                console.log("채팅방 생성 완료");
                setCreatedRoom(response.data.data);
                console.log("**************************");
                console.log("생성된 채팅방");
                console.log(response);
            })
            .catch((error)=>{
                console.log("채팅방생성 오류");
                console.log(error);
            })
            
        }

        likePeople && console.log(likePeople);
        likePeople && console.log("방 생성 시도");
        likePeople && createRoom();

    },[likePeople])

    useEffect(()=>{

        const connect = () => {
            const token = getAccessToken();
            const chatBox = document.getElementsByClassName("chat-body")[0];
            const addOtherMessageOnChat = (o_message) =>{
                const element = document.createElement('p');
                element.innerHTML = o_message;
        
                // 내거면 me 아니면 other 
                element.className = 'chat-content-other'
                chatBox.appendChild(element);
            }

            const headers = { Authorization :'Bearer ' + token };
            client.connect(headers, (res) =>{
                console.log("웹소켓 연결 성공");
                console.log(res);
                setIsWebsocketConnect(true);
                client.subscribe('/sub/'+myNickName,(res)=>{
                console.log("구독 메시지");
                console.log(JSON.parse(res.body));
                if(JSON.parse(res.body).sender.nickname !== myNickName)
                addOtherMessageOnChat(JSON.parse(res.body).content);
                })
                },(error)=>{
                console.log("웹소켓 연결 실패");
                console.log(error);
            })
        };
        createdRoom && console.log("웹소켓 연결 시도");
        createdRoom && connect();

    },[createdRoom]);

    useEffect(()=>{
        scrollToBottom();
    },[chatList]);


    const addMyMessageOnChat = (my_message) =>{
        const element = document.createElement('p');
        element.innerHTML = my_message;
        // 내거면 me 아니면 other 
        element.className = 'chat-content-me'
        chatBox.appendChild(element);
    }
    
    const onTextHandler = (event) =>{
        setContent(event.currentTarget.value);
    };
    

    const onSubmit = (event) =>{
        event.preventDefault();

        const roomId = createdRoom.chatRoomId;
        setMessage((prev)=> ({...prev, roomId,senderId,content}));
        setChatList([...chatList, message]);

        const newMessage = {roomId, senderId, content};

        isWebsocketConnect && client.send("/pub/messages",headers,JSON.stringify(newMessage));
        isWebsocketConnect && addMyMessageOnChat(newMessage.content);

        setInputTextNull();
        inputBoxRef.current.focus();
    };

    
    const setInputTextNull = () =>{
        const element = document.getElementsByClassName('chat-input')[0];
        element.value = null;
        setContent("");
    }
    
    const scrollToBottom = () =>{
        if(chatBoxRef.current){
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }

    
    return(
        <>
            <div className='chat-like-div'>
                {likePeople && likePeople.map((people)=><LikePerson key={people} nickName={people.nickname}/>)}
            </div>
            <div className="chat">
                <div className="chat-header">
                    <i className="fa-solid fa-bars"></i>
                    <p>상대방 이름</p>
                </div>

                <div className="chat-body"
                    ref={chatBoxRef}>

                </div>

                <div className="chat-footer">
                    <input 
                    className='chat-input'
                    onChange={onTextHandler}
                    ref={inputBoxRef}></input>
                    <button className='chat-button' onClick={onSubmit}><i className="fa-solid fa-share"></i></button>
                </div>
            </div>
        </>
    );
}

export default Chat;