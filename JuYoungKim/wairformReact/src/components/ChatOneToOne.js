import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import getAccessToken from '../control/getAccessToken';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../css/chat.css';

const ChatOneToOne = (props) =>{

    const token = getAccessToken();
    const headers = { Authorization :'Bearer ' + token };
    const chatBox = document.getElementsByClassName("chat-body")[0];


    const options = {debug: false};
    const sockJS = new SockJS("http://localhost:8080/ws-chat/");
    const client = Stomp.over(sockJS, options);
    
    
    const myNickName = props.myNickName;
    const writerNickName =props.writerNickName;
    const [senderId, setSenderId] = useState();
    // const writerId = props.writerMemberId;

    
    const [message, setMessage] = useState({
        roomId:'',
        senderId : '',
        content : ''
    });

    const chatBoxRef = useRef();
    const inputBoxRef = useRef();

    const [content, setContent] = useState("");
    const [chatList, setChatList] = useState([]);
    const [roomId, setRoomId] = useState();
    const [isWebsocketConnect,setIsWebsocketConnect] = useState(false);

    

    useEffect(()=>{
        const token = getAccessToken();
        const url = "http://localhost:8080/chat/rooms";
        const url2 = "http://localhost:8080/member/"+myNickName;
        axios
        .get(url,
            {
                headers : {
                    Authorization: 'Bearer ' + token
                }
            })
        .then((response)=>{
            console.log("채팅방 목록 조회");
            console.log(response);
            for(let i=0; i<response.data.data.length; i++){
                if(writerNickName === response.data.data[i].members[1].nickname)
                    setRoomId(response.data.data[i].roomId);
            }
        })
        .catch((error)=>{
            console.log("채팅방 목록 조회 실패");
            console.log(error);
        });
        
        axios.get(url2,
            {                
                headers : {
                    Authorization: 'Bearer ' + token
            }
        })
        .then((response) =>{
            console.log("내 Member PK 조회");
            console.log(response.data);
            setSenderId(response.data.data.id);
        })
        .catch((error)=>{
            console.log("내 Member PK 조회 실패");
            console.log(error);
        });
    },[ ]);


    useEffect(()=>{
        // const chatBox = document.getElementsByClassName("chat-body")[0];
        const connect = () => {
            const token = getAccessToken();
            const headers = { Authorization :'Bearer ' + token };
            client.connect(headers, (res) =>{
                console.log("웹소켓 연결 성공");
                console.log(res);
                setIsWebsocketConnect(true);
                client.subscribe("/sub/"+myNickName,(res)=>{
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
        console.log("웹소켓 연결 시도");
        connect();
    },[ ])

    const loadChat = async (roomId) =>{
        const url = "http://localhost:8080/chat/rooms/"+roomId+"/messages"
        await axios.get(url,{
            headers : {
                Authorization: 'Bearer ' + token
            }
        })
        .then((res)=>{
            console.log("이전 채팅 불러오기");
            console.log(res.data.data);
        })
        .catch((error)=>{
            console.log("이전 채팅 불러오기 실패");
            console.log(error);
        })
    }

    useEffect(()=>{
        roomId && console.log(roomId);
        roomId && loadChat(roomId);
    },[roomId])


    useEffect(()=>{
        scrollToBottom();
    },[chatList]);

    const addMyMessageOnChat = (o_message) =>{
        const element = document.createElement('p');
        element.innerHTML = o_message;

        // 내거면 me 아니면 other 
        element.className = 'chat-content-me';
        chatBox.appendChild(element);
    }

    const addOtherMessageOnChat = (o_message) =>{
        const element = document.createElement('p');
        element.innerHTML = o_message;

        // 내거면 me 아니면 other 
        element.className = 'chat-content-other'
        chatBox.appendChild(element);
    }

    const onTextHandler = (event) =>{
        setContent(event.currentTarget.value);
    };



    const onSubmit = (event) =>{
        event.preventDefault();
        
        
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
            <div className="chat">
                <div className="chat-header">
                    <i className="fa-solid fa-bars"></i>
                    <p>{writerNickName}</p>
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

export default ChatOneToOne;