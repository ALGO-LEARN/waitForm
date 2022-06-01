import React from "react";
import '../css/chat.css';

const LikePerson =(props) =>{
    return(
        <>
            <button className="like-person">{props.nickName}</button>
        </>
    );
}

export default LikePerson;