import {useRef, useState} from "react";
import ChatRoom from "./ChatRoom";
import ChatView from "./ChatView";
import './ChatView.scss';
import './Loading.scss';
import {useDrag} from 'react-use-gesture';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRectangleXmark as chatClose} from "@fortawesome/free-solid-svg-icons";

const ChatModal = (props) => {
    const modalRef = useRef();

    const [logoPos, setLogoPos] = useState({})
    const bindLogoPos = useDrag((params)=>{
        setLogoPos({
            x: params.offset[0],
            y: params.offset[1]
        })
    });

    const [chatRoomId, setChatRoomId] = useState("");
    const [chatViewClose, setChatViewClose] = useState(false);

    const chatViewCloseHandler = () => {
        // eslint-disable-next-line eqeqeq
        if(chatRoomId == "") {
            props.setChatModal(false);
        } else {
            setChatViewClose(true);
        }
    }

    return (
        <div ref={modalRef} className="chat-main" style={{
            position:"relative",
            top: logoPos.y,
            left: logoPos.x
        }}>
            <div>
                <div {...bindLogoPos()} className="chat-drag-design">
                    <FontAwesomeIcon icon={chatClose} onClick={() => chatViewCloseHandler()}
                                     style={{float: 'right', marginTop: '7px', marginRight: '15px', cursor: 'pointer'}}/>
                </div>
                {
                    // eslint-disable-next-line eqeqeq
                    chatRoomId == "" ?
                        <ChatView setChatRoomId={setChatRoomId} setChatViewClose={setChatViewClose}/>
                        :
                        <http auto-config='true' use-expressions="true">
                            <header>
                                <frame-options policy="SAMEORIGIN"/>
                                <ChatRoom chatRoomId={chatRoomId} setChatRoomId={setChatRoomId} chatViewClose={chatViewClose}/>
                            </header>
                        </http>
                }
            </div>
        </div>
    )

}

export default ChatModal;