import React, { useEffect, useState } from "react";
import "../css/write.css"
import AlarmModal from "./AlarmModal";

import NavBlack from "../components/NavBlack";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import isLogin from '../control/isLogin';
import getCKEditorValue from "../control/getCkEditorValue";
import axios from "axios";
import getAccessToken from "../control/getAccessToken";
import { useHistory } from "react-router-dom";

const Wirte = (props) =>{

    const history = useHistory();

    const isloged = isLogin();

    const [title,settitle] = useState("");
    const [content,setContent] = useState("");

    const[numOfChars,setNumOfChars] = useState(0);
    const[CharsOverCheck, setCharsOverCheck] = useState(true);
    const[CharsUnderCheck, setCharsUnderCheck] = useState(true);

    const[canSubmit, setCanSubmit] =useState(false);

    useEffect(()=>{
        setNumOfChars(content.length);
    },[content])
    useEffect(()=>{
        console.log("********************************");
        console.log(canSubmit);
    },[canSubmit])

    useEffect(()=>{

        if(numOfChars>4000)
            setCharsOverCheck(true);
        else
            setCharsOverCheck(false);

        if(numOfChars<500)
            setCharsUnderCheck(true);
        else
            setCharsUnderCheck(false);

    },[numOfChars])
    useEffect(()=>{
        if(!CharsOverCheck && !CharsUnderCheck)
            setCanSubmit(true);
        else
            setCanSubmit(false);

    },[CharsOverCheck,CharsUnderCheck])

    const onTitleHandler = (event) =>{
        settitle(event.currentTarget.value);
        console.log("Board Title = "+ title);
    }

    const onSubmit = (event) =>{
        event.preventDefault();
        console.log(getAccessToken());
        console.log(getCKEditorValue(content));
        write_CallML();
        // const token =getAccessToken();
        // axios
        //     .post("http://localhost:8080/board/upload",{
        //         "content" : content,
        //         "title" : title
        //        },
        //        {
        //          headers: {
        //            Authorization: 'Bearer ' + token
        //          }
        //        })
        //     .then( (response) =>{
        //         console.log(response);
        //         alert(response.data.message);
                
        //     })
        //     .catch((error)=>{
        //         console.log(error);
        //         alert(error);
        //     })
    }

    const write_CallML = async () =>{
        const token = getAccessToken();
        try{
            const wRes = await axios.post("http://localhost:8080/board/upload",{
                "content" : content,
                "title" : title
               },
               {
                 headers: {
                   Authorization: 'Bearer ' + token
                 }
               })
               console.log("글 등록 성공");
               const board_id = wRes.data.data.boardId;
               const mRes = await axios.get("http://127.0.0.1:8000/ML/"+board_id);
               console.log("클러스터링된 결과");
               console.log(mRes);

               const recc = await axios.post("http://localhost:8080/recommend",{
                "members":[
                    {"memberId":mRes.data.clustered_id[0]+1},
                    {"memberId":mRes.data.clustered_id[1]+1},
                    {"memberId":mRes.data.clustered_id[2]+1},
                    {"memberId":mRes.data.clustered_id[3]+1},
                    {"memberId":mRes.data.clustered_id[4]+1}
                ],
                "boardId":parseInt(mRes.data.board_idx)
               },
               {
                headers: {
                  Authorization: 'Bearer ' + token
                }
              })
               console.log("추천 성공");
               console.log(recc)

        }catch(error){
            console.log("ML서버 실패 혹은 글 쓰기 실패 혹은 추천하기 실패");
            console.log(error);
        }
    }

    return (
        <>
            <NavBlack isloged={isloged} />

            <section className="write-section">
    
                <div className="ckeditor-div">
                    <form onSubmit={onSubmit}>
                            <div className="title">
                                <label><h3>*글 제목</h3><input placeholder="제목을 입력해주세요." onChange={onTitleHandler} value={title}/></label>
                            </div>
                            <h3>*양식</h3>
                            <CKEditor
                                editor={ ClassicEditor }
                                config = {{
                                    placeholder : "양식을 입력하세요."
                                }}
                                data=""
                                onReady={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setContent(data);
                                    
                                    console.log( { event, editor, data } );
                                    console.log("Board Contetns = "+content);
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                                } }
                            />
                        <div className="byte-check">
                                {CharsOverCheck && <p style={{color : "red"}} >! 초과된 글자 수 입니다</p>}
                                {CharsUnderCheck && <p style={{color : "red"}}>! 양식에 필요한 글자 수가 너무 적습니다</p>}
                        </div>
                        <div className="write-form-btn">
                            <button
                            disabled = { canSubmit ? false :true }
                            className= { canSubmit ? "canSubmit" : "cantSubmit" }
                            type="submit">제출</button>

                            <button
                            style={{backgroundColor : "#060607", cursor: "pointer"}} 
                            onClick={ (event)=> { event.preventDefault(); history.goBack();}}>취소</button>

                        </div>
                    </form>
                </div>
            </section>
            <AlarmModal></AlarmModal>
        </>
    );
}

export default Wirte;