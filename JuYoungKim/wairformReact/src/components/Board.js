import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Board =(props) => {

    const [title,setTitle] = useState(props.title);
    const [createdDate,setcreatedDate] =useState(props.createdDate);
    const [boardID,setboardID] =useState(props.boardId);
    const [whosBoard,setWhosBoard] = useState(props.whosBoard);

    const url = "/boards/"+ boardID;

    useEffect(()=>{
        console.log(props);
    },[]);
    return(
        
        <>
            <ul>
                <li></li>
                {/* <li> <Link to ={url} >{title}</Link></li> */}
                <li> <Link to = {{
                    pathname: url,
                    state: {whosBoard :whosBoard}
                    
                }} >{title}</Link></li>
                <li>{createdDate.substring(0,10)}</li>
            </ul>
        </>
    );
}

export default Board;