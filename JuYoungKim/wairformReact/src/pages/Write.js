import React from "react";
import "../css/write.css"
import AlarmModal from "./AlarmModal";
import Footer from "../components/Footer";
import NavBlack from "../components/NavBlack";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import isLogin from '../control/isLogin';

const Wirte = (props) =>{
    const isloged = isLogin();
    return (
        <>
            <NavBlack isloged={isloged} />

            <section className="write-section">
    
                <div className="ckeditor-div">
                    <h1>양식 작성</h1>
                    <form action="">
                            <CKEditor
                                editor={ ClassicEditor }
                                data="<p>Hello from CKEditor 5!</p>"
                                onReady={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    console.log( { event, editor, data } );
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
                            <button>제출</button>
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