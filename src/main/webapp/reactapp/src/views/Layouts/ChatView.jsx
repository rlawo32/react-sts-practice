import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ChatView = (props) => {
    const navigate = useNavigate();

    const [chatRoomName, setChatRoomName] = useState("");
    const [chatRoomState, setChatRoomState] = useState(false);

    const [chatRoomList, setChatRoomList] = useState([{
        chatRoomId: '',
        chatRoomNo: '',
        chatRoomName: '',
        createMemberId: '',
        joinMemberId: '',
        createdDate: '',
    }]);

    const createChatRoomHandler = async () => {
        await axios({
            method: "POST",
            url: "/chat/createChatRoom",
            data: JSON.stringify({
                chatRoomName: `${chatRoomName}`
            }),
            headers: {'Content-type': 'application/json'}
        }).then((result) => {
            window.alert("등록이 완료되었습니다.");
            setChatRoomState(!chatRoomState);
        })
    }

    const joinChatRoomHandler = (chatRoomId) => {
        props.setChatRoomId(chatRoomId);
    }

    useEffect(() => {

        axios({
            method: "GET",
            url: '/chat/chatRoomList'
        }).then((res) => {
            console.log(res.data);
            setChatRoomList(res.data);
        });

    }, [chatRoomState]);

    return (
        <div className="chat-main">
            <div className="chat-room-list">
                <ul>
                    {chatRoomList.map((chatRooms, idx) => (
                      <li key={chatRooms.chatRoomId} onClick={() => joinChatRoomHandler(chatRooms.chatRoomId)}>{chatRooms.chatRoomName}</li>
                    ))}
                </ul>
            </div>
            <div className="chat-room-create">
                <input type="text" value={chatRoomName} onChange={(e) => setChatRoomName(e.target.value)} />
                <button onClick={() => createChatRoomHandler()}>방만들기</button>
            </div>
        </div>
    )

}

export default ChatView;