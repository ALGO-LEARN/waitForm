import React from 'react';
import {Link} from 'react-router-dom'
import '../css/alarmmodal.css'

const AlarmModal = (props)=>{
    
    function close() {
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
                                        <th><div className="modael-contents-body-writer"><p>보낸 사람</p></div></th>
                                        <th><div className="modal-contents-body-title">제목</div></th>
                                        <th><div className="modal-contens-body-date">수신 날짜</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><div className="modael-contents-body-writer"><p>보낸 사람</p></div></td>
                                        <td><div className="modal-contents-body-title">제목</div></td>
                                        <td><div className="modal-contens-body-date">수신 날짜</div></td>
                                    </tr>
                                    <tr>
                                        <td><div className="modael-contents-body-writer"><p>보낸 사람</p></div></td>
                                        <td><div className="modal-contents-body-title">제목</div></td>
                                        <td><div className="modal-contens-body-date">수신 날짜</div></td>
                                    </tr>
                                    <tr>
                                        <td><div className="modael-contents-body-writer"><p>보낸 사람</p></div></td>
                                        <td><div className="modal-contents-body-title">제목</div></td>
                                        <td><div className="modal-contens-body-date">수신 날짜</div></td>
                                    </tr>
                                    <tr>
                                        <td><div className="modael-contents-body-writer"><p>보낸 사람</p></div></td>
                                        <td><div className="modal-contents-body-title">제목</div></td>
                                        <td><div className="modal-contens-body-date">수신 날짜</div></td>
                                    </tr>
                                    <tr>
                                        <td><div className="modael-contents-body-writer"><p>보낸 사람</p></div></td>
                                        <td><div className="modal-contents-body-title">제목</div></td>
                                        <td><div className="modal-contens-body-date">수신 날짜</div></td>
                                    </tr>
                                    <tr>
                                        <td><div className="modael-contents-body-writer"><p>보낸 사람</p></div></td>
                                        <td><div className="modal-contents-body-title">제목</div></td>
                                        <td><div className="modal-contens-body-date">수신 날짜</div></td>
                                    </tr>

                                    <tr>
                                        <td><div className="modael-contents-body-writer"><p>보낸 사람</p></div></td>
                                        <td><div className="modal-contents-body-title">제목</div></td>
                                        <td><div className="modal-contens-body-date">수신 날짜</div></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                        <div className="modal-contents-footer">
                            <Link to = "#">1</Link>
                            <Link to = "#">2</Link>
                            <Link to = "#">3</Link>
                            <Link to = "#">4</Link>
                            <Link to = "#">5</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlarmModal;