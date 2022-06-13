import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import getAccessToken from '../control/getAccessToken';
import LikePerson from './LikePerson';
import '../css/chat.css';

const Chat = (props) =>{

    const token = getAccessToken();
    const headers = { Authorization :'Bearer ' + token };
    const chatBox = document.getElementsByClassName("chat-body")[0];


    const options = {debug: false};
    const sockJS = new SockJS("http://localhost:8080/ws-chat/");
    const client = Stomp.over(sockJS, options);


    const myNickName = props.writerNickName;
    const senderId = props.writerMemberId;
    const boardId =props.boardId;
 
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
    const [boardLikes,setBoardLikes] = useState([]);
    const [isWebsocketConnect,setIsWebsocketConnect] = useState(false);
    const [roomIdForNinkanme, setRoomIdForNinkanme] = useState([]); 
    const [sroomId, setRoomId] = useState();
    const [receiver, setRiceiver] = useState();

    useEffect(()=>{
        const url = "http://localhost:8080/like/"+boardId;
        const getLikeMyBoard = async () => {
            await axios.get(url,{
                headers : {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((res)=>{
                console.log("이 글의 좋아요 가져오기 성공");
                console.log(res.data.data);
                setBoardLikes(res.data.data);
            })
            .catch((error)=>{
                console.log("이 글의 좋아요 가져오기 실패");
                console.log(error);
            });
        };
        getLikeMyBoard();
    },[boardId]);

    useEffect(()=>{

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

        getChatRooms();
    },[ ])

    useEffect(()=>{
        for(let i=0; i<boardLikes.length; i++){
            let likeNickname = boardLikes[i].nickname;
            for(let j=0; j<createdRoom.length; j++){
                if(likeNickname === createdRoom[j].inviter.nickname){
                    setRoomIdForNinkanme( (prev) => {
                        return {...prev ,[likeNickname]: createdRoom[j].roomId};
                    });
                }
            }
        }

        roomIdForNinkanme && console.log("넥네임 별 채팅방 번호");
        roomIdForNinkanme && console.log(roomIdForNinkanme);

    },[boardLikes, createdRoom])

    useEffect(()=>{
        if(Object.keys(roomIdForNinkanme).length !== 0){
            console.log("채팅방 있을 경우 첫 상대방");
            setRiceiver(Object.entries(roomIdForNinkanme)[0][0]);
            setRoomId(Object.entries(roomIdForNinkanme)[0][1]);
        }
    },[roomIdForNinkanme])

    useEffect(()=>{
        const url = "http://localhost:8080/chat/rooms/"+sroomId+"/messages";
        const getMessages = async () => {
            await axios.get(url,{
                headers : {
                    Authorization: 'Bearer ' + token
                }
             })
            .then((res)=>{
                console.log("이전 채팅 불러오기");
                console.log(res.data.data);
                console.log(sroomId);
                myNickName && addRecentMessages(res.data.data);
            })
            .catch((error)=>{
                console.log("이전 채팅 불러오기 실패");
                console.log(error);
            })
        }

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

        sroomId && removeBeforeMessages();
        sroomId && getMessages();
    },[sroomId, myNickName])
    

    useEffect(()=>{
        const token = getAccessToken();
        const headers = { Authorization :'Bearer ' + token };

        const connect = () => {
            client.connect(headers, (res) =>{
                console.log("웹소켓 연결 성공");
                console.log(res);
                setIsWebsocketConnect(true);
                client.subscribe('/sub/'+myNickName,(res)=>{
                        console.log("구독 메시지");
                        console.log(JSON.parse(res.body));
                        // console.log("roomId = "+ sroomId);
                        // if(JSON.parse(res.body).sender.nickname !== myNickName && JSON.parse(res.body).roomId === sroomId  )
                            // addOtherMessageOnChat(JSON.parse(res.body).content);
                            setRecChat(JSON.parse(res.body));
                        })
                },(error)=>{
                    console.log("웹소켓 연결 실패");
                    console.log(error);
            })
        };

        myNickName && console.log("웹소켓 연결 시도");
        myNickName && connect();
    },[myNickName]);

    const [recChat, setRecChat] = useState();

    useEffect(()=>{
        recChat && console.log("roomId = "+ sroomId);
        if( recChat && recChat.sender.nickname !== myNickName && recChat.roomId === sroomId)
            addOtherMessageOnChat(recChat.content);
    },[recChat]);

    useEffect(()=>{
        scrollToBottom();
    },[chatList]);

    const addOtherMessageOnChat = (o_message) =>{
        const element = document.createElement('p');
        element.innerHTML = o_message;

        // 내거면 me 아니면 other 
        element.className = 'chat-content-other'
        chatBox.appendChild(element);
    }

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

        const roomId = sroomId;
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

    const hideShowList =()=>{
        const like_div = document.getElementsByClassName('chat-like-div')[0];
        if(like_div.style.display ==='block'){
            like_div.style.display='none';
        }
        else{
            like_div.style.display='block';
        }
    }

    
    return(
        <>
            <div className='chat-like-div'>
                {roomIdForNinkanme && Object.entries(roomIdForNinkanme).map((obj)=><LikePerson key={obj[1]} nickName={obj[0]} roomId={obj[1]} setRoomId ={setRoomId} setRiceiver={setRiceiver}/>)}
            </div>
            <div className="chat">
                <div className="chat-header">
                    <i className="fa-solid fa-bars" onClick={hideShowList}></i>
                    {receiver && <p>{receiver}</p>}
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