import '../css/home.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlarmModal from '../pages/AlarmModal';
import HomeNav from '../components/HomeNav';
import isLogin from '../control/isLogin';

const Home=(props)=>{
    const [isloged,setIsloged] = useState(false);
    useEffect( ()=>{
        setIsloged(isLogin());
        // console.log("isloged in Home = "+isloged);
    },[isloged]);
    return (
        
            <div>
                <div className="header">
                    <HomeNav isloged = {isloged}></HomeNav>
                    <div className="intro">
                        <div className="intro-contents">
                            <h1>당신이 찾고있는</h1>

                            <h1>모든</h1>

                            <h1>크리에이터</h1>

                            <h1>WAITFORM</h1>
                            <br></br>
                            <button><Link to ="/write">양식 작성</Link></button>
                        </div>
                    </div>
                </div>


                <div className="intro-scd">
                    <h1>WAITFORM 은</h1>
                    <div className="intro-scd-body">
                        <div className="intro-scd-contents">
                            
                            <p>아이디어는 있는데 현실화하지 못하고 있거나 능력은 되지만 시간이 부족해서 비슷한 능력을 가진 크리에이터를 추천해 드립니다.</p>
                        </div>
                        <div className="intro-scd-contents">
                            <p>창작자의 창작물에 근거하여 각 분야에 최적화된 기계학습 모델을 이용해 창작자의 성향을 분석한 뒤 크리에이터를 추천합니다.</p>
                        </div>
                        <div className="intro-scd-contents">
                            <p>본인이 작성한 양식에 의거하여 요구사항과 부합한 인재만 추천합니다. 만약 추천된 크리에이터가 마음에 들지 않다면 양식을 변경해보세요.</p>
                        </div>
                        <div className="intro-scd-contents">
                            <p>협상 진행을 도와드립니다. 추천된 크리에이터가 마음에 드신다면 해당 크리에이터에게 제안을 해보세요. 상대가 제안을 수락하면 협상이 진행되도록 두 분을 위한 공간이 따로 형성됩니다.</p>
                        </div>
                    </div>
                </div>
                <AlarmModal></AlarmModal>
        </div>
    );
}

export default Home;