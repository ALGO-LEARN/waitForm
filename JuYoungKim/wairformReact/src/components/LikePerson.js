import React from "react";
import '../css/chat.css';

const LikePerson =(props) =>{
    return(
        <>
            <button className="like-person" onClick={ () => {props.setRoomId(props.roomId); props.setRiceiver(props.nickName);}}>{props.nickName}</button>
        </>
    );
}

export default LikePerson;