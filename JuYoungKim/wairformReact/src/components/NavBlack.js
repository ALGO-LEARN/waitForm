import React from "react";
import LoginHomeNavBlack from "./LoginHomeNavBlack";
import NotLoginHomeNavBlack from "./NotLoginHomeNavBlack";
import { useEffect, useState } from "react";

const NavBlack = (props) =>{

    const [isloged, setIsloged] = useState(props.isloged);

    useEffect( ()=>{
        setIsloged(props.isloged);
        console.log("********************************");
        console.log("isloged in HomeNavBlack = "+ isloged);
    },[isloged,props.isloged]);


    return(
        <>
           { isloged ? <LoginHomeNavBlack/> : <NotLoginHomeNavBlack/> }
        </>
    );
}

export default NavBlack;