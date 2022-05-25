import { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import isLogin from './isLogin';

const AuthRoute = ({component : Component, ...rest }) =>{
    const isLoged = isLogin();
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