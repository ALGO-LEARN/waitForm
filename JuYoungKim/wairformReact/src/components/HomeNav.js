import { Fragment, useEffect, useState } from "react";
import LoginHomeNav from "./LoginHomeNav";
import NotLoginHomeNav from "./NotLoginHomeNav"


const HomeNav = (props) => {

    const [isloged, setIsloged] = useState(props.isloged);

    useEffect( ()=>{
        setIsloged(props.isloged);
        console.log("********************************");
        console.log("isloged in HomeNav = "+ isloged);
    },[isloged,props.isloged])
    return (
        <Fragment>
           { isloged ?  <LoginHomeNav/> : <NotLoginHomeNav/>};
        </Fragment>
    );

}
HomeNav.defaultProps ={
    isloged : false
}

export default HomeNav;