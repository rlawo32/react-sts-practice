import React, {useEffect, useState} from "react";
import { Cookies } from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import AppBarNavigation from "../Navigation/AppBarNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import MemberInfoProfile from "./MemberInfoProfile";
import MemberInfoBoardLog from "./MemberInfoBoardLog";
import MemberInfoCommentLog from "./MemberInfoCommentLog";
import MemberInfoLoginLog from "./MemberInfoLoginLog";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import TableBoard from "../NoticeBoard/TableBoard";

const MemberInfo = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const category_name = ['회원 정보', '내 글', '내 댓글', '로그인 기록'];

    const [memberInfo, setMemberInfo] = useState([]);
    const [currentTab, clickTab] = useState(0);

    const select_tab = () => {
        let result = [
            {
                id: 0,
                name: '회원 정보',
                view: <MemberInfoProfile info={memberInfo}/>
            },
            {
                id: 1,
                name: '내 글',
                view: <MemberInfoBoardLog />
            },
            {
                id: 2,
                name: '내 댓글',
                view: <MemberInfoCommentLog />
            },
            {
                id: 3,
                name: '로그인 기록',
                view: <MemberInfoLoginLog />
            }
        ];
        return result;
    }

    const selectTabHandler = (idx) => {
        clickTab(idx);
    }

    useEffect(() => {
        axios({
            method: "POST",
            url: '/member/memberInfo'
        }).then((res) => {
            const responseData = res.data;
            setMemberInfo(responseData.data);
            console.log(memberInfo);
        })

    }, [])

    return (
        <div className="member-info">

            <AppBarNavigation />

            <div className="info-select">
                <ul>
                    {select_tab().map((el) => (
                        <li key={el.id} onClick={() => selectTabHandler(el.id)}>
                            <button className="list-item">{el.name}</button>
                        </li>
                    ))}
                </ul>
            </div>

            {select_tab()[currentTab].view}

            <FooterNavigation />
        </div>
    )
}

export default MemberInfo;