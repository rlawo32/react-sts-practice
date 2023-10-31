import {useCallback, useEffect, useRef, useState} from "react";
import './ChatView.scss';
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatRoom = (props) => {
    const client = useRef({});
    const focus = useRef();
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

    const stompConnect = () => {
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
            setTimeout(()=>{ focus.current.scrollTop = focus.current.scrollHeight }, 500);

            await client.current.subscribe("/sub/" + props.chatRoomId , (message) => {
                    // console.log(JSON.parse(message.body));
                    setChattingList(prevList => [...prevList, JSON.parse(message.body)]);
                    setTimeout(()=>{ focus.current.scrollTop = focus.current.scrollHeight }, 100);
                }
            );
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

        client.current.send("/sub/" + props.chatRoomId, {Authorization: token}, JSON.stringify(sendData));

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
        axios({
            method: "POST",
            url: '/chat/quitChatRoom/' + props.chatRoomId
        });

        // eslint-disable-next-line eqeqeq
        if(e == 'back') {
            setTimeout(()=>{props.setChatRoomId("");}, 3000);
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
            stompConnect();
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
        e.preventDefault();
        e.returnValue = '';
        quitChatRoomHandler('quit');
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
                <div ref={focus} className="chat-chatting-list">
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
                                        <div className="chat-chatting-content">{chatting.content}</div>
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
                                        <div className="chat-chatting-content">{chatting.content}</div>
                                    </div>
                            }
                        </div>
                    ))}
                    <div ref={focus}></div>
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