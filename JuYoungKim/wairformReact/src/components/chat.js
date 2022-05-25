import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import getTime from '../control/getTime';
import '../css/chat.css';

const Chat = (props) =>{

    const chatBox = document.getElementsByClassName("chat-body")[0];

    const [message, setMessage] = useState({
        text : '',
        time : ''
    });

    const chatBoxRef = useRef();
    const inputBoxRef = useRef();

    const [text, setText] = useState("");

    const [chatList, setChatList] = useState([]);

    const addMessageOnChat = () =>{
        const element = document.createElement('p');
        element.innerHTML = text;

        // 내거면 me 아니면 other 
        element.className = 'chat-content-other'
        chatBox.appendChild(element);
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
        scrollToBottom();
    },[chatList]);

    return(
        <>
            <div className="chat">
                <div className="chat-header">
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
                    <button className='chat-button' onClick={onSubmit}><i class="fa-solid fa-share"></i></button>
                </div>
            </div>
        </>
    );
}

export default Chat;