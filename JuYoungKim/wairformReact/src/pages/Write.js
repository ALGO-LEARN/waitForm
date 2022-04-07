import React from "react";
import "../css/write.css"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Link} from 'react-router-dom';
const Wirte = () =>{
    return (
        <>
            <div>
                <div className="nav-background">
                    <div className="nav-logo">
                        <Link to="/">WAITFORM</Link>
                    </div>
                    <div className="nav-links">
                        <Link to="/login">LOGIN</Link>
                        <Link to="/signup">SIGN UP</Link>
                    </div>
                </div>
            </div>

            <section className="write-section">
    
                <div clasNames="ckeditor-div">
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

            <section className="footer-section">
                <footer>
                    <div className="nav-logo">
                        <i class="fa-solid fa-address-card"></i>
                        <Link to="/">외폼</Link>
                    </div>
                    <p>Copyright © 2022 tcpschool.co.,Ltd. All rights reserved.</p>
                </footer>
            </section>        
        </>
    );
}

export default Wirte;