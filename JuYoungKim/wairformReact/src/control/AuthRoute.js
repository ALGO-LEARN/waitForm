import { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import isLogin from './isLogin';

const AuthRoute = ({component : Component, ...rest }) =>{
    const isLoged = isLogin();
    useEffect( ()=>{
        // console.log("AuthRoute : " + isLoged);
        // console.log("AuthRoute component : "+ Component);
        // console.log("AuthRout props : " + rest);
    },[]);
    return(
        <Route
            {...rest}
            render = {props => 
                isLoged ?(
                    <Component {...props} />
                ) : ( 
                    <Redirect to={{
                                    pathname: '/login', 
                                    state: {from: props.location}
                                  }}
                    />
                )
            }
        />
    )
}

export default AuthRoute;