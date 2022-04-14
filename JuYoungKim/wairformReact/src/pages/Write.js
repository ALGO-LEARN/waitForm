import React, { useState } from "react";
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


const Wirte = (props) =>{

    const isloged = isLogin();

    const [title,settitle] = useState("");
    const [content,setContent] = useState("");

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
                                <label><h3>글 제목</h3><input placeholder="제목을 입력해주세요." onChange={onTitleHandler} value={title}/></label>
                            </div>
                            <h3>내용</h3>
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
                        <div className="write-form-btn">
                            <button>취소</button>
                            <button type="submit">제출</button>
                        </div>
                    </form>
                </div>
            </section>
            
            <AlarmModal></AlarmModal>
            <Footer></Footer>
        </>
    );
}

export default Wirte;