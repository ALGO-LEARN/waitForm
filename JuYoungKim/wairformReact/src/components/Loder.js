import React from "react";
import ReactLoading from 'react-loading';

const Loader = ({type,color,message})=> {
    return(
        <div class="contentWrap" style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
            backgroundColor:"#0000001d",
            opacity:"1",
            zIndex:"1000"
        }}>
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <h2>{message}</h2>
          <h2>창을 닫지 말아주세요.</h2>
          <ReactLoading
            type={type}
            color={color}
            height={'80%'}
            width={'80%'} />
        </div>

      </div>

    );
}

export default Loader;