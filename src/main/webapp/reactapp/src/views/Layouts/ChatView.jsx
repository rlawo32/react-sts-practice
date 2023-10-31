import React, {useEffect, useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark as chatDelete, faUserGroup as personnel} from "@fortawesome/free-solid-svg-icons";

const ChatView = (props) => {

    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [memberId, setMemberId] = useState("");

    const [chatRoomName, setChatRoomName] = useState("");
    const [chatRoomState, setChatRoomState] = useState(false);
    const [isChatRoomEffect, setIsChatRoomEffect] = useState(false);

    const [chatRoomList, setChatRoomList] = useState([{
        chatRoomNo: '',
        chatRoomId: '',
        chatRoomName: '',
        createMemberId: '',
        createMemberName: '',
        joinMemberId: '',
        joinPersonnel: '',
        createdDate: '',
    }]);

    const pagination = () => {
        let result = [];
        for (let i=0; i<totalPage; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}><button className="list-item">{i+1}</button></li>);
        }
        return result;
    }

    const createChatRoomHandler = async () => {
        if(chatRoomName.length < 1) {
            window.alert("방제목을 입력해주세요.");
            setIsChatRoomEffect(true);
        } else {
            await axios({
                method: "POST",
                url: "/chat/createChatRoom",
                data: JSON.stringify({
                    chatRoomName: `${chatRoomName}`
                }),
                headers: {'Content-type': 'application/json'}
            }).then((res) => {
                window.alert("생성되었습니다.");
                setChatRoomState(!chatRoomState);
                setIsChatRoomEffect(false);
                setChatRoomName("");
            })
        }
    }

    const joinChatRoomHandler = (chatRoomId) => {
        axios({
            method: "POST",
            url: "/chat/checkChatRoom/" + chatRoomId
        }).then((res) => {
            if(res.data.data) {
                props.setChatRoomId(chatRoomId);
            } else {
                alert('해당 방 인원이 정원입니다.');
            }
        })
    }

    const deleteChatRoomHandler = async (chatRoomId) => {
        // eslint-disable-next-line eqeqeq
        if(window.confirm('방을 삭제하면 채팅 내용이 모두 삭제됩니다.\n삭제하시겠습니까?') == true) {
            await axios({
                method: "DELETE",
                url: '/chat/chatRoomDelete/' + chatRoomId
            }).then(() => {
                alert('방이 삭제되었습니다.');
                setChatRoomState(!chatRoomState);
            })
        }
    }

    useEffect(() => {
        const paging = {
            recordPerPage: 8,
            page: pageNo
        }

        axios({
            method: "GET",
            url: '/chat/chatRoomList',
            params: paging
        }).then((res) => {
            const datalist = res.data.chatRoomList;
            setChatRoomList(datalist);
            setTotalPage(res.data.totalPage);

            for(let i=0; i<datalist.length; i++) {
                datalist[i].chatRoomNo = (i  + (pageNo * 8)) + 1;
            }
        });
    }, [chatRoomState, pageNo]);

    useEffect(() => {
        axios({
            method: "POST",
            url: '/member/memberInfo'
        }).then((res) => {
            setMemberId(res.data.data.memberId);
        });
        props.setChatViewClose(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="chat-main">
            <div className="chat-room-view">
                <div className="chat-room-list">
                    <table>
                        <thead>
                            <tr>
                                <td style={{width: "70px"}}>NO</td>
                                <td style={{width: "250px"}}>ROOM</td>
                                <td style={{width: "70px"}}><FontAwesomeIcon icon={personnel} /></td>
                                <td style={{width: "100px"}}>CREATOR</td>
                                <td style={{width: "1px"}}></td>
                            </tr>
                        </thead>
                        <tbody>
                            {chatRoomList.map((chatRooms, idx) => {
                                return (
                                    <tr key={chatRooms.chatRoomId}>
                                        <td>{chatRooms.chatRoomNo}</td>
                                        <td onClick={() => joinChatRoomHandler(chatRooms.chatRoomId)}
                                            style={{cursor:'pointer'}}>{chatRooms.chatRoomName}</td>
                                        <td>{chatRooms.joinPersonnel}/2</td>
                                        <td>{chatRooms.createMemberName}</td>
                                        <td>
                                            {
                                                chatRooms.createMemberId === memberId ?
                                                    <FontAwesomeIcon icon={chatDelete} onClick={() => deleteChatRoomHandler(chatRooms.chatRoomId)}
                                                                     style={{ marginTop: '7px', marginRight: '7px', cursor: 'pointer'}}/>
                                                    :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="paging-design">
                    <ul>
                        {pagination()}
                    </ul>
                </div>
                <div className="chat-room-input">
                    <input type="text" value={chatRoomName} style={isChatRoomEffect?{border: '2px solid red'}:{}}
                           onChange={(e) => setChatRoomName(e.target.value)} />
                    <button onClick={() => createChatRoomHandler()}>방만들기</button>
                </div>
            </div>
        </div>
    )

}

export default ChatView;