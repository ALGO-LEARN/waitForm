import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import getAccessToken from '../control/getAccessToken';
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

    const chatBoxRef = useRef();
    const inputBoxRef = useRef();

    const [senderId, setSenderId] = useState();
    const [message, setMessage] = useState({
        roomId:'',
        senderId : '',
        content : ''
    });


    const [content, setContent] = useState("");
    const [chatList, setChatList] = useState([]);
    const [roomId, setRoomId] = useState();
    const [isWebsocketConnect,setIsWebsocketConnect] = useState(false);

    

    useEffect(()=>{
        const token = getAccessToken();
        const url = "http://localhost:8080/chat/rooms";
        const url2 = "http://localhost:8080/member/"+myNickName;
        
        myNickName && writerNickName && axios.all([
            axios.get(url,
                {
                    headers : {
                        Authorization: 'Bearer ' + token
                    }
                })
            ,axios.get(url2,
                {                
                    headers : {
                        Authorization: 'Bearer ' + token
                }
            })])
        .then(
            axios.spread((response, response2)=>{
                console.log("내 Member PK 조회");
                console.log(response2.data.data);
                setSenderId(response2.data.data.id);
                
                console.log("채팅방 목록 조회");
                console.log(response.data.data);

                response.data.data.forEach(element => {
                    if( (element.members[0].nickname === props.writerNickName || element.members[1].nickname === props.writerNickName) && element.inviter.nickname === myNickName ){
                        console.log(element.roomId);
                        setRoomId(element.roomId);
                    }
                });

            })
        )
        .catch((error)=>{
            console.log("채팅방 목록 조회 실패");
            console.log("혹은")
            console.log("내 Member PK 조회 실패");
            console.log(error);
        })
    },[writerNickName, myNickName]);

    useEffect(()=>{
        // senderId && console.log("내 pk");
        // senderId && console.log(senderId);
    },[senderId]);

    useEffect(()=>{

        const removeBeforeMessages = () => {
            const otext = document.querySelectorAll('.chat-content-other');
            const mtext = document.querySelectorAll('.chat-content-me');

            for(const ot of otext)
                ot.remove();
            for(const mt of mtext)
                mt.remove();
        }

        const addRecentMessages = (res) => {
            for(let i=res.length-1; i>=0; i--){
                if(res[i].sender.nickname !== myNickName)
                    addOtherMessageOnChat(res[i].content);
                else
                    addMyMessageOnChat(res[i].content);
            }
        }

        const getMessages = async () =>{
            const url = "http://localhost:8080/chat/rooms/"+roomId+"/messages"
            await axios.get(url,{
                headers : {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((res)=>{
                console.log("이전 채팅 불러오기");
                console.log(res.data.data);
                myNickName && addRecentMessages(res.data.data)
            })
            .catch((error)=>{
                console.log("이전 채팅 불러오기 실패");
                console.log(error);
            })
        }

        roomId && console.log("내 방 번호" +roomId);
        roomId && removeBeforeMessages();
        roomId && getMessages();
    },[roomId])


    useEffect(()=>{
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
                    
                    // if(JSON.parse(res.body).sender.nickname !== myNickName)
                        // addOtherMessageOnChat(JSON.parse(res.body).content);
                        setRecChat(JSON.parse(res.body));
                })
                },(error)=>{
                console.log("웹소켓 연결 실패");
                console.log(error);
            })
        };
        console.log("웹소켓 연결 시도");
        connect();
        return ()=>{
            client.disconnect(()=>{
                client.unsubscribe('sub-0');
            });
        }
    },[ ])

    const [recChat, setRecChat] = useState();

    useEffect(()=>{
        recChat && console.log("roomId = "+ roomId);
        if(recChat && recChat.sender.nickname !== myNickName && recChat.roomId === roomId)
            addOtherMessageOnChat(recChat.content);
    },[recChat]);

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
        const chatBox = document.getElementsByClassName("chat-body")[0];
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
        roomId && isWebsocketConnect && client.send("/pub/messages",headers,JSON.stringify(newMessage));
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