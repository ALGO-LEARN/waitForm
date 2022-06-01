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
 
    const chatBoxRef = useRef();
    const inputBoxRef = useRef();

    const [message, setMessage] = useState({
        roomId:'',
        senderId : '',
        content : ''
    });   
    const [content, setContent] = useState("");
    const [chatList, setChatList] = useState([]);
    const [createdRoom, setCreatedRoom] = useState([]);
    const [isWebsocketConnect,setIsWebsocketConnect] = useState(false);
    
    

    const getChatRooms = async ()=>{
        const url = "http://localhost:8080/chat/rooms"
        await axios.get(url,
            {
                headers : {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((response)=>{
                console.log("채팅방 가져오기");
                console.log(response.data.data);
                setCreatedRoom(response.data.data);
            })
            .catch((error)=>{
                console.log("채팅방 가져오기 실패");
                console.log(error);
            })
    };

    useEffect(()=>{
        getChatRooms();
    },[ ])


    useEffect(()=>{
        const token = getAccessToken();
        const chatBox = document.getElementsByClassName("chat-body")[0];
        const headers = { Authorization :'Bearer ' + token };

        const addOtherMessageOnChat = (o_message) =>{
            const element = document.createElement('p');
            element.innerHTML = o_message;
    
            // 내거면 me 아니면 other 
            element.className = 'chat-content-other'
            chatBox.appendChild(element);
        }

        const connect = () => {
            
            client.connect(headers, (res) =>{
                console.log("웹소켓 연결 성공");
                console.log(res);
                setIsWebsocketConnect(true);
                client.subscribe('/sub/'+myNickName,(res)=>{
                        console.log("구독 메시지");
                        console.log(JSON.parse(res.body));
                        console.log(JSON.parse(res.body).content);
                        if(JSON.parse(res.body).sender.nickname !== myNickName)
                            addOtherMessageOnChat(JSON.parse(res.body).content);
                        })
                },(error)=>{
                    console.log("웹소켓 연결 실패");
                    console.log(error);
            })
        };

        createdRoom && console.log("채팅방 목록");
        createdRoom && console.log(createdRoom);
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

        const roomId = createdRoom[0].roomId;
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
                {createdRoom && createdRoom.map((people)=><LikePerson key={people.roomId} nickName={people.inviter.nickname}/>)}
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