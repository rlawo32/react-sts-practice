import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";

const MemberInfoLoginLog = () => {

    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalLoginLog, setTotalLoginLog] = useState(0);

    const [loginLogList, setLoginLogList] = useState([{
        loginLogNo: '',
        logId: '',
        logMemberId: '',
        logMemberEmail: '',
        logLoginDate: '',
        logLoginSuccess: '',
        logLoginReason: ''
    }]);

    const paging = {
        boardId: 0,
        recordPerPage: 10,
        page: pageNo
    }

    const pagination = () => {
        let result = [];
        for (let i=0; i<totalPage; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}><button className="list-item">{i+1}</button></li>);
        }
        return result;
    }

    useEffect(() => {

        const getLogins = async () => {

            const loginLogs = await axios({
                method: "GET",
                url: '/member/memberLog',
                params: paging
            })

            const datalist = loginLogs.data.loginLogList;

            setLoginLogList(datalist);
            setTotalPage(loginLogs.data.totalPage);
            setTotalLoginLog(loginLogs.data.totalLoginLog);

            for(let i=0; i<datalist.length; i++) {
                datalist[i].loginLogNo = (i  + (pageNo * 10)) + 1;
            }
        };

        getLogins();

    }, [pageNo])

    return (
        <div className="member-info">

            <h3>로그인 기록</h3>

            <div className="loginLog-view">

                <div className="table-view">
                    <table>
                        <thead className="table-header">
                        <tr>
                            <td style={{width: "70px"}}>번호</td>
                            <td style={{width: "80px"}}>분류</td>
                            <td style={{width: "300px"}}>아이피 주소</td>
                            <td style={{width: "300px"}}>내용</td>
                            <td style={{width: "250px"}}>날짜</td>
                        </tr>
                        </thead>
                        <tbody id="tbody">
                        {loginLogList.map((loginLogs, idx) => {
                            return (
                                <tr key={loginLogs.logId}>
                                    <td>{loginLogs.loginLogNo}</td>
                                    { `${loginLogs.logLoginSuccess}` === 'S' && <td>성공</td> }
                                    { `${loginLogs.logLoginSuccess}` === 'F' && <td>실패</td> }
                                    <td>NULL</td>
                                    <td>{loginLogs.logLoginReason}</td>
                                    <td>{loginLogs.logLoginDate}</td>
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

            </div>

        </div>
    )
}

export default MemberInfoLoginLog;