import {useEffect, useState} from "react";
import ChatRoom from "./ChatRoom";
import ChatView from "./ChatView";

const ChatMain = () => {

    const [chatRoomId, setChatRoomId] = useState("");

    useEffect(() => {


    }, []);

    return (
        <div className="chat-main">
            <div>
                {
                    chatRoomId == "" ?
                        <ChatView setChatRoomId={setChatRoomId}/>
                        :
                        <ChatRoom chatRoomId={chatRoomId} setChatRoomId={setChatRoomId}/>
                }
            </div>
        </div>
    )

}

export default ChatMain;