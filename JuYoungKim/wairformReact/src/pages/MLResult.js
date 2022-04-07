import React from "react";
import {Link} from 'react-router-dom'
import '../css/result.css';
const MLResult = () =>{
    return(
        <>
                    <div>
                        <div class="nav-background">
                            <div class="nav-logo">
                                <Link to="/">WAITFORM</Link>
                            </div>
                            <div class="nav-links">
                                <Link to="/login">LOGIN</Link>
                                <Link to="/signup">SIGN UP</Link>
                            </div>
                        </div>
                    </div>

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

                <section class="footer-section">
                    <div>
                        <div class="nav-logo">
                            <i class="fa-solid fa-address-card"></i>
                            <Link to="/">외폼</Link>
                        </div>
                        <p>Copyright © 2022 tcpschool.co.,Ltd. All rights reserved.</p>
                    </div>
                </section>
        </>
    );
}

export default MLResult;