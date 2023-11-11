import React, {useEffect, useState} from "react";
import AppBarNavigation from "../Navigation/HeaderNavigation";
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

const MemberInfo = () => {

    const [memberInfo, setMemberInfo] = useState([{
        memberId: '',
        memberEmail: '',
        memberBirth: '',
        memberNickname: '',
        createdDate: '',
        modifiedDate: '',
        recentLogDate: '',
        picture: '',
        role: ''
    }]);

    const [memberProfileImg, setMemberProfileImg] = useState("");
    const [memberProfileDate, setMemberProfileDate] = useState("");

    const [memberInfoUpdateChk, setMemberInfoUpdateChk] = useState(false);
    const [currentTab, clickTab] = useState(0);


    const select_tab = () => {
        let result = [
            {
                id: 0,
                name: '회원 정보',
                view: <MemberInfoProfile info={memberInfo} setData={clickTab} img={memberProfileImg} date={memberProfileDate}/>
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
                view: <MemberInfoPwUpdate info={memberInfo} />
            },
            {
                id: 7,
                name: '회원 탈퇴',
                view: <MemberInfoPwUpdate info={memberInfo} />
            }
        ];
        return result;
    }

    const pagination = () => {
        let result = [];
        for (let i=0; i<select_tab().length-3; i++) {
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
        // const userAgent = window.navigator.userAgent; // 기기 정보
        const getMemberInfo = async () => {

            await axios({
                method: "GET",
                url: '/auth/axiosHeaderReissue'
            })

            const findMemberInfo = await axios({
                method: "POST",
                url: '/member/memberInfo'
            })

            const responseData = findMemberInfo.data;
            const responsePicture = responseData.data.picture
            setMemberInfo(responseData.data);
            setMemberProfileDate(responseData.data.createdDate.substring(0, 10));
            if(responsePicture) {
                // const presentUrl = window.location.href.substring(7, 12);
                //
                // if(presentUrl === "local") {
                //     const pictureUrl = responseData.data.picture.substring(0, 4);
                //     if(pictureUrl === "http") {
                //         setMemberProfileImg(responseData.data.picture);
                //     } else {
                //         setMemberProfileImg("/upload/" + responseData.data.picture);
                //     }
                // } else {
                //     await axios({
                //         method: "GET",
                //         url: 'member/imageLoad',
                //         params: {imageFileName: responsePicture}
                //     }).then((res) => {
                //         setMemberProfileImg(res.data);
                //     })
                // }
                setMemberProfileImg(responsePicture);
            } else {
                setMemberProfileImg("");
            }
        };

        getMemberInfo();
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