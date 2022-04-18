import React from "react";
import AlarmModal from '../pages/AlarmModal';
import '../css/result.css';
import Footer from "../components/Footer";
import NavBlack from "../components/NavBlack";
import isLogin from "../control/isLogin";

const MLResult = (props) =>{

    const isloged = isLogin();
    return(
        <>
                <NavBlack isloged={isloged}/>
                <section class="result">
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button onclick="">제안하기</button>
                    </div>
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button>제안하기</button>
                    </div>
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button>제안하기</button>
                    </div>
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button>제안하기</button>
                    </div>
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button>제안하기</button>
                    </div>
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button>제안하기</button>
                    </div>
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button>제안하기</button>
                    </div>
                    <div class="result-creator">
                        <h1>이 름</h1>
                        <img src="/image/blank-profile-picture.png" alt=""></img>
                        <p>tag</p>
                        <button>제안하기</button>
                    </div>
                    
                </section>
                <AlarmModal></AlarmModal>
                <Footer></Footer>
                
        </>
    );
}

export default MLResult;