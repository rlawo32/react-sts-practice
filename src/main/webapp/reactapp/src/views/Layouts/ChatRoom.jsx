import {useEffect, useRef, useState} from "react";
import './ChatView.scss';
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import memberDefaultImg from "../../images/ProfileDefault.png";

const ChatRoom = (props) => {
    const client = useRef({});
    const token = axios.defaults.headers.common["Authorization"]?.toString();

    const [chattingContent, setChattingContent] = useState("");
    const [chattingState, setChattingState] = useState(false);

    const [chattingList, setChattingList] = useState([{
        chattingId : '',
        senderName : '',
        senderId : '',
        chatRoomId : '',
        content : '',
        sendDate : ''
    }]);

    const [memberProfileImg, setMemberProfileImg] = useState("");
    const [memberInfo, setMemberInfo] = useState([{
        memberId: '',
        memberEmail: '',
        memberBirth: '',
        memberNickname: '',
        createdDate: '',
        modifiedDate: '',
        recentLogDate: '',
        picture: ''
    }]);

    const quitChatRoomHandler = () => {
        props.setChatRoomId("");
    }

    const stompConnect = () => {
        client.current = Stomp.over(() => {
            const sock = new SockJS("http://localhost:8080/ws-stomp");
            return sock;
        })

        client.current.connect({Authorization: token}, () => {
            console.log("Connect ...");
            axios({
                method: "GET",
                url: '/chat/chattingList/' + props.chatRoomId
            }).then((res) => {
                setChattingList(res.data);
            });
            client.current.subscribe("/sub/" + props.chatRoomId , (message) => {
                    // console.log(JSON.parse(message.body));
                    axios({
                        method: "GET",
                        url: '/chat/chattingList/' + props.chatRoomId
                    }).then((res) => {
                        setChattingList(res.data);
                    });
                }
            );
        })

        // const stomp = Stomp.over(sockJs);
        // const stomp = Stomp.over(() => {
        //     const sockJs = new SockJS("/ws-stomp");
        //     return sockJs;
        // });

        // stomp.connect({Authorization: "${grantType} ${accessToken}`}, () => {
        //     console.log("STOMP Connection");
        //
        //     // stomp.subscribe("/sub/chat/room/" + props.chatRoomId, function (chat) {
        //     //     loadChatMessages();
        //     // });
        //
        //     // stomp.send('/pub/chat/enter', {}, JSON.stringify({roomId: roomId, loginId: loginId}));
        // });
    }

    const sendChattingHandler = () => {
        const now = new Date();
        const sendDate = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes();

        const sendData = {
            senderName: memberInfo.memberNickname,
            senderId: memberInfo.memberId,
            chatRoomId: props.chatRoomId,
            content: chattingContent,
            sendDate: sendDate
        };

        client.current.send("/sub/" + props.chatRoomId, {Authorization: token}, JSON.stringify(sendData));

        axios({
            method: "POST",
            url: '/chat/saveChatting',
            data: JSON.stringify(sendData),
            headers: {'Content-type': 'application/json'}
        }).then((res) => {
            setChattingState(!chattingState);
        });
    };

    useEffect(() => {

    }, [chattingState]);

    useEffect(() => {
        axios({
            method: "POST",
            url: '/member/memberInfo'
        }).then((res) => {
            setMemberInfo(res.data.data);
            if(res.data.data.picture) {
                setMemberProfileImg(res.data.data.picture);
                const presentUrl = window.location.href.substring(7, 12);

                if(presentUrl === "local") {
                    const pictureUrl = res.data.data.picture.substring(0, 4);
                    if(pictureUrl === "http") {
                        setMemberProfileImg(res.data.data.picture);
                    } else {
                        setMemberProfileImg("/upload/" + res.data.data.picture);
                    }
                } else {
                    axios({
                        method: "GET",
                        url: 'member/imageLoad',
                        params: {imageFileName: res.data.data.picture}
                    }).then((res) => {
                        console.log(res.data);
                        // setMemberProfileImg(res.data);
                    })
                }
            } else {
                setMemberProfileImg("");
            }
        });
    }, []);

    return (
        <div className="chat-main">
            <div className="chat-chatting">
                <div className="chat-chatting-list">
                    {chattingList.map((chatting, idx) => (
                        <div key={chatting.chattingId} className={memberInfo.memberId === chatting.senderId
                                 ? "chat-chatting-myself" : "chat-chatting-opponent"}>
                            {
                                `${memberInfo.memberId}`=== `${chatting.senderId}` ?
                                    <div>
                                        <div className="chat-chatting-header">
                                            <span className="chat-chatting-date">
                                                {chatting.sendDate}
                                            </span>
                                            <span className="chat-member-name">
                                                 {chatting.senderName}
                                            </span>
                                            <span className="chat-member-image">
                                                <img src={memberProfileImg ? memberProfileImg : memberDefaultImg} alt="프로필 이미지" />
                                             </span>
                                        </div>
                                        <div className="chat-chatting-content">{chatting.content}</div>
                                    </div>
                                :
                                    <div>
                                        <div className="chat-chatting-header">
                                            <span className="chat-member-image">
                                                <img src={memberProfileImg ? memberProfileImg : memberDefaultImg} alt="프로필 이미지" />
                                             </span>
                                            <span className="chat-member-name">
                                                 {chatting.senderName}
                                            </span>
                                            <span className="chat-chatting-date">
                                                {chatting.sendDate}
                                            </span>
                                        </div>
                                        <div className="chat-chatting-content">{chatting.content}</div>
                                    </div>
                            }
                        </div>
                    ))}
                </div>
                <div className="chat-chatting-action">
                    <div className="chat-chatting-input">
                        <input type="text" value={chattingContent} onChange={(e) => setChattingContent(e.target.value)} />
                        <button onClick={() => sendChattingHandler()}>보내기</button>
                    </div>
                    <div className="chat-chatting-button">
                        <button onClick={() => quitChatRoomHandler()}>나가기</button>
                    </div>
                    <button onClick={() => stompConnect()}>연결</button>
                </div>
            </div>
        </div>
    )

}

export default ChatRoom;