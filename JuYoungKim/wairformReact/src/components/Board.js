import React, { useState } from "react";
import { Link } from "react-router-dom";

const Board =(props) => {

    const [title,setTitle] = useState(props.title);
    const [createdDate,setcreatedDate] =useState(props.createdDate);
    const [boardID,setboardID] =useState(props.boardId);

    const url = "/boards/"+ boardID;

    return(
        
        <>
            <ul>
                <li></li>
                <li> <Link to ={url} >{title}</Link></li>
                <li>{createdDate.substring(0,10)}</li>
            </ul>
        </>
    );
}

export default Board;