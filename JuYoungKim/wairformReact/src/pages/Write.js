import React, { useEffect, useState } from "react";
import "../css/write.css"
import AlarmModal from "./AlarmModal";
import Footer from "../components/Footer";
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
    const[CharsOverCheck, setCharsOverCheck] = useState(false);
    const[CharsUnderCheck, setCharsUnderCheck] = useState(true);

    const[canSubmit, setCanSubmit] =useState(false);

    useEffect(()=>{
        setNumOfChars(content.length);
    },[content])

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

    useState(()=>{

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
        const token =getAccessToken();
        axios
            .post("http://localhost:8080/board/upload",{
                "content" : content,
                "title" : title
               },
               {
                 headers: {
                   Authorization: 'Bearer ' + token
                 }
               })
            .then( (response) =>{
                console.log(response);
                alert(response.data.message);
                
            })
            .catch((error)=>{
                console.log(error);
                alert(error);
            })
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