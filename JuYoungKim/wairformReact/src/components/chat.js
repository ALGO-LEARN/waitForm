import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import getTime from '../control/getTime';
import getAccessToken from '../control/getAccessToken';
import LikePerson from './LikePerson';
import SockJS from 'sockjs-client';
import '../css/chat.css';
import Stomp from 'stompjs';

const Chat = (props) =>{
    const myNickName = props.myNickName;
    const chatBox = document.getElementsByClassName("chat-body")[0];
    const sockJS = new SockJS("http://localhost:8080/ws/chat");
    const client = Stomp.over(sockJS);
    const [message, setMessage] = useState({
        text : '',
        time : ''
    });

    const chatBoxRef = useRef();
    const inputBoxRef = useRef();

    const [text, setText] = useState("");
    const [chatList, setChatList] = useState([]);
    const [likePeople, setLikePeople] = useState([]);

    const addMessageOnChat = () =>{
        const element = document.createElement('p');
        element.innerHTML = text;

        // 내거면 me 아니면 other 
        element.className = 'chat-content-other'
        chatBox.appendChild(element);
    }

    const connect = () => {
        const token = getAccessToken();
        client.connect({
            headers : {
                Authorization: 'Bearer ' + token
            }
        },(res)=>{
            console.log(res);
        },(error)=>{
            console.log(error);
        })

    }

    const createRoom = () =>{
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
            console.log("채팅방 생성");
            console.log(response);
        })
        .catch((error)=>{
            console.log("채팅방생성 오류");
            console.log(error);
        })
        
    }

    const onTextHandler = (event) =>{
        setText(event.currentTarget.value);
        console.log("text = "+ text);
    };

    const onSubmit = (event) =>{
        event.preventDefault();

        const time = getTime();
        
        setMessage({text,time});  
        setChatList([...chatList, message]);

        addMessageOnChat();
        setInputTextNull();
        inputBoxRef.current.focus();
        console.log("chatList = "+chatList);

    };

    const setInputTextNull = () =>{
        const element = document.getElementsByClassName('chat-input')[0];
        element.value = null;
        setText("");
    }

    const scrollToBottom = () =>{
        if(chatBoxRef.current){
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }

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
            console.log("who like on this board");
            console.log(response);
            setLikePeople(response.data.data);
        })
        .catch((error)=>{
            console.log("연결실패");
            console.log(error);
        })
    },[ ]);

    useEffect(()=>{
        scrollToBottom();
    },[chatList]);

    useEffect(()=>{
        // console.log("create Room");
        // createRoom();
        console.log("connect try");
        connect();
    },[likePeople]);

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