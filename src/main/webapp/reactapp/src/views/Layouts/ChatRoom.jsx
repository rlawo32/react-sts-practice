import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatRoom = (props) => {
    const client = useRef({});
    const lowerScroll = useRef();
    const token = axios.defaults.headers.common["Authorization"]?.toString();

    const [chattingContent, setChattingContent] = useState("");
    const [chattingState, setChattingState] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const [isEnterLoading, setIsEnterLoading] = useState(false);
    const [isQuitLoading, setIsQuitLoading] = useState(false);

    const [chattingList, setChattingList] = useState([{
        chattingId : '',
        senderName : '',
        senderId : '',
        chatRoomId : '',
        content : '',
        sendDate : ''
    }]);

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

    const stompConnect = (enter) => {
        client.current = Stomp.over(() => {
            const sock = new SockJS("http://ec2-52-78-218-238.ap-northeast-2.compute.amazonaws.com:8080/ws-stomp");
            return sock;
        })

        client.current.connect({Authorization: token}, async () => {
            console.log("Connect ...");

            await axios({
                method: "GET",
                url: '/chat/chattingList/' + props.chatRoomId
            }).then((res) => {
                setChattingList(res.data);
            });

            await axios({
                method: "POST",
                url: '/chat/enterChatRoom/' + props.chatRoomId
            });

            setTimeout(()=>{setIsEnterLoading(true)}, 100);
            setTimeout(()=>{
                client.current.send("/topic/" + props.chatRoomId,
                    {Authorization: token, type: "enter"},
                    JSON.stringify({
                        senderName: enter + " 님이 입장하셨습니다."
                    })); }, 200);
            setTimeout(()=>{ lowerScroll.current.scrollTop = lowerScroll.current.scrollHeight }, 500);

            await client.current.subscribe("/topic/" + props.chatRoomId , (message) => {
                    const body = JSON.parse(message.body);
                    // console.log(JSON.parse(message.body));

                    if(message.headers.type === "enter") {
                        setNotificationMessage(body.senderName);
                    } else if(message.headers.type === "quit") {
                        setNotificationMessage(body.senderName);
                    } else if(message.headers.type === "message") {
                        setChattingList(prevList => [...prevList, body]);
                        setTimeout(()=>{ lowerScroll.current.scrollTop = lowerScroll.current.scrollHeight }, 100);
                    }

                    setTimeout(()=>{ setNotificationMessage("") }, 3000);
                });
        })
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

        client.current.send("/topic/" + props.chatRoomId,
            {Authorization: token, type: "message"},
            JSON.stringify(sendData));

        axios({
            method: "POST",
            url: '/chat/saveChatting',
            data: JSON.stringify(sendData),
            headers: {'Content-type': 'application/json'}
        }).then((res) => {
            setChattingState(!chattingState);
            setChattingContent("");
        });
    };

    const quitChatRoomHandler = (e) => {
        let sendMessage = memberInfo.memberNickname + " 님이 퇴장하셨습니다.";
        if(e === 'quit') {
            sendMessage = "상대방이 퇴장했습니다.";
        }

        client.current.send("/topic/" + props.chatRoomId,
            {Authorization: token, type: "quit"},
            JSON.stringify({
                senderName: sendMessage
            }));

        axios({
            method: "POST",
            url: '/chat/quitChatRoom/' + props.chatRoomId
        });
        setIsQuitLoading(true);

        // eslint-disable-next-line eqeqeq
        if(e == 'back') {
            setTimeout(()=>{props.setChatRoomId("");}, 700);
        }
        console.log("Disconnect ...");
        client.current.disconnect();
    }

    // eslint-disable-next-line no-unused-vars
    const memberImageLoadHandler = useCallback((senderId) => {
        setTimeout(async ()=>{
            const memberImage = await axios({
                method: "GET",
                url: 'chat/imageLoad',
                params: {memberId: senderId}
            }); console.log(memberImage.data);}, 3000);

        // return memberImage.data;
    }, [])

    useEffect(() => {
        if(props.chatViewClose) {
            quitChatRoomHandler('back');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.chatViewClose])

    useEffect(() => {
        axios({
            method: "POST",
            url: '/member/memberInfo'
        }).then((res) => {
            setMemberInfo(res.data.data);
            stompConnect(res.data.data.memberNickname);
        });

        (() => {
            window.addEventListener('beforeunload', preventClose);
        })();

        return () => {
            window.removeEventListener('beforeunload', preventClose);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const preventClose =(e) => {
        quitChatRoomHandler('quit');
        e.preventDefault();
        e.returnValue = '';
    }

    const enterOnKeyHandler = (e) => {
        // eslint-disable-next-line eqeqeq
        if(e.key == 'Enter') {
            if(chattingContent.length < 1) {

            } else {
                sendChattingHandler();
            }
        }
    }

    return (
        <div className="chat-main">
            <div className="chat-chatting-view">
                <div className="enter-loading" style={isEnterLoading?{display: 'none'}:{display: 'block'}}>
                    <div className="chat-enter-loading" />
                </div>
                <div className="chat-quit-loading" style={isQuitLoading?{display: 'block'}:{display: 'none'}}/>
                <div ref={lowerScroll} className="chat-chatting-list">
                    <div className="notification-message">{notificationMessage}</div>
                    {chattingList.map((chatting, idx) => (
                        <div key={idx} className={memberInfo.memberId === chatting.senderId
                            ? "chat-chatting-myself" : "chat-chatting-opponent"}>
                            {
                                `${memberInfo.memberId}`===`${chatting.senderId}` ?
                                    <div>
                                        <div className="chat-chatting-header">
                                            <span className="chat-chatting-date">
                                                {chatting.sendDate}
                                            </span>
                                            <span className="chat-member-name">
                                                {chatting.senderName}
                                            </span>
                                            {/*<span className="chat-member-image">*/}
                                            {/*    <img src={memberProfileImg ? memberProfileImg : memberDefaultImg} alt="프로필 이미지" />*/}
                                            {/* </span>*/}
                                        </div>
                                        <div className="chat-chatting-content">
                                            <div className="chat-chatting-balloon">
                                                {chatting.content}
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className="chat-chatting-header">
                                            {/*<span className="chat-member-image">*/}
                                            {/*    <img src={memberProfileImg ? memberProfileImg : memberDefaultImg} alt="프로필 이미지" />*/}
                                            {/* </span>*/}
                                            <span className="chat-member-name">
                                                {chatting.senderName}
                                            </span>
                                            <span className="chat-chatting-date">
                                                {chatting.sendDate}
                                            </span>
                                        </div>
                                        <div className="chat-chatting-content">
                                            <div className="chat-chatting-balloon">
                                                {chatting.content}
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    ))}
                </div>
                <div className="chat-chatting-action">
                    <div className="chat-chatting-button">
                        <button onClick={() => quitChatRoomHandler('back')}>나가기</button>
                    </div>
                    <div className="chat-chatting-input">
                        <input type="text" value={chattingContent} onKeyDown={enterOnKeyHandler}
                               onChange={(e) => setChattingContent(e.target.value)} />
                        <button onClick={() => sendChattingHandler()}>보내기</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ChatRoom;