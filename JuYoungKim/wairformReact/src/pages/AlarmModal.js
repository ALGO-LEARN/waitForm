import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import Recommend from '../components/Recommend';
import getAccessToken from '../control/getAccessToken';
import '../css/alarmmodal.css'

const AlarmModal = (props)=>{

    const [recommend, setRecommend] = useState();
    const [myNickName, setMyNickName] = useState();

    useEffect(()=>{
        getReccomendList();
        getMyNickName();
    },[ ]);


    const getReccomendList = async () =>{
        const token= getAccessToken();
        await axios.get("http://localhost:8080/recommend/list",
            {
                headers : {
                    Authorization: 'Bearer ' + token
                }
            }
        ).then((res)=>{
            console.log("추천받은 목록");
            console.log(res.data.data);
            setRecommend(res.data.data);
        }).catch((error)=>{
            console.log("추천받은 적 없거나 오류");
            console.log(error);
        });
    };

    const getMyNickName = async () =>{
        const token= getAccessToken();
        await axios.get("http://localhost:8080/member/me",
            {
                headers : {
                    Authorization: 'Bearer ' + token
                }
            }
        ).then((res)=>{
            console.log("내 정보");
            console.log(res.data.data);
            setMyNickName(res.data.data.nickname);
        }).catch((error)=>{
            console.log("내 정보 가져오기 실패");
            console.log(error);
        });

    }

    const close =() => {
        document.querySelector(".modal-background").className = "modal-background";
    }

    return(
        <div>
            <div className="modal-background">
                <div className="modal-window">
                    <div className="modal-contents">
                        <div className="modal-down"><i className="fa-solid fa-xmark" id="alarm-close" onClick={close}></i></div>
                        <div className="modal-contents-body">
                            <table>
                                <thead>
                                    <tr>
                                        <th><div className="modael-contents-body-writer"><p>게시글 번호</p></div></th>
                                        <th><div className="modal-contents-body-title">제목</div></th>
                                        <th><div className="modal-contens-body-date">수락</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recommend && myNickName&& recommend.map((rec)=>
                                    <Recommend 
                                    key = {rec}
                                    myNickName = {myNickName}
                                    myMemberId = {rec.memberId}
                                    boardId = {rec.boardId}
                                    boardTitle = {rec.boardTitle} ></Recommend> )}
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                        <div className="modal-contents-footer">
                            {/* <Link to = "#">1</Link>
                            <Link to = "#">2</Link>
                            <Link to = "#">3</Link>
                            <Link to = "#">4</Link>
                            <Link to = "#">5</Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlarmModal;