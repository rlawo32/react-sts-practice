import React, {useEffect, useState} from "react";
import { Cookies } from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import AppBarNavigation from "../Navigation/AppBarNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import MemberInfoProfile from "./MemberInfoProfile";
import MemberInfoBoardLog from "./MemberInfoBoardLog";
import MemberInfoCommentLog from "./MemberInfoCommentLog";
import MemberInfoRecommendLog from "./MemberInfoRecommendLog";
import MemberInfoLoginLog from "./MemberInfoLoginLog";
import MemberInfoUpdate from "./MemberInfoUpdate";
import MemberInfoPwUpdate from "./MemberInfoPwUpdate";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import TableBoard from "../NoticeBoard/TableBoard";

const MemberInfo = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const [memberInfo, setMemberInfo] = useState([]);
    const [memberProfileImg, setMemberProfileImg] = useState("");
    const [memberInfoUpdateChk, setMemberInfoUpdateChk] = useState(false);
    const [currentTab, clickTab] = useState(0);


    const select_tab = () => {
        let result = [
            {
                id: 0,
                name: '회원 정보',
                view: <MemberInfoProfile info={memberInfo} setData={clickTab} img={memberProfileImg}/>
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
                name: '내 추천',
                view: <MemberInfoRecommendLog />
            },
            {
                id: 4,
                name: '로그인 기록',
                view: <MemberInfoLoginLog />
            },
            {
                id: 5,
                name: '내 정보 수정',
                view: <MemberInfoUpdate info={memberInfo} setData={setMemberInfoUpdateChk} img={memberProfileImg} setImg={setMemberProfileImg}/>
            },
            {
                id: 6,
                name: '비밀번호 변경',
                view: <MemberInfoPwUpdate />
            }
        ];
        return result;
    }

    const pagination = () => {
        let result = [];
        for (let i=0; i<select_tab().length-2; i++) {
            result.push(<li key={select_tab()[i].id} onClick={() => selectTabHandler(select_tab()[i].id)}>
                <button className="list-item">{select_tab()[i].name}</button>
            </li>);
        }
        return result;
    }

    const selectTabHandler = (idx) => {
        clickTab(idx);
    }

    useEffect( () => {
        axios({
            method: "POST",
            url: '/member/memberInfo'
        }).then((res) => {
            const responseData = res.data;
            setMemberInfo(responseData.data);
            if(responseData.data.picture) {
                setMemberProfileImg("/upload/" + responseData.data.picture);
            } else {
                setMemberProfileImg("");
            }
        })
    }, [memberInfoUpdateChk])

    return (
        <div className="member-info">

            <AppBarNavigation />

            <div className="info-select">
                <div className="paging-design">
                    <ul>
                        {/*{select_tab().map((el) => (*/}
                        {/*    <li key={el.id} onClick={() => selectTabHandler(el.id)}>*/}
                        {/*        <button className="list-item">{el.name}</button>*/}
                        {/*    </li>*/}
                        {/*))}*/}
                        {pagination()}
                    </ul>
                </div>
            </div>

            {select_tab()[currentTab].view}

            <FooterNavigation />
        </div>
    )
}

export default MemberInfo;