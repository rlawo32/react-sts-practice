import React, {useState} from "react";

const RecordForm = ({numList, setNumList}) => {
    const [num, setNum] = useState(1);
    return (
        <div>
            <div>현재 숫자 : {num}</div>
            <button onClick={() => {setNum(num + 1)}}>숫자 증가</button>
            <button onClick={() => {setNum(num - 1)}}>숫자 감소</button>
            <button onClick={() => {setNum(0)}}>숫자 초기화</button>
            <hr/>
            <button onClick={() => setNumList([...numList, num])}>숫자 기록</button>
            <button onClick={() => setNumList([])}>기록 초기화</button>
        </div>
    )
}

const RecordList = ({numList}) => {
    return (
        <div>
            <h2>기록된 숫자</h2>
            {numList.length > 0 ? <div>
                <ul className="a">
                    {numList.map((num) => (
                        <li>{num}</li>
                    ))}
                </ul>
            </div> : <div>기록 없음</div>}
        </div>
    )
}

const About = () => {
    const [numList, setNumList] = useState([]);
    const [text, setText] = useState("");
    const [edit, setEdit] = useState(false);
    const [url, setUrl] = useState("");

    let content = <div>
        {text} <button onClick={() => setEdit(true)}>수정</button>
    </div>

    if(edit) {
        content = <div>
            <input type="text" value={text}
                   onChange={(e) => {
                       setText(e.target.value);
                   }}/>
            <button onClick={() => setEdit(false)}>수정</button>
        </div>
    }

    return (
        <div>
            <h1>자기 소개 페이지</h1>

            <div style={ {margin: "40px auto", width: "800px", textAlign: "center"} }>
                <RecordForm numList={numList} setNumList={setNumList}/>
                <RecordList numList={numList}/>
            </div>
            {content}
        </div>
    )
}

export default About;