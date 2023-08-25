import {Routes, Route} from "react-router-dom";
import './App.css';
import MainHome from "./views/Navigation/MainHome";
import Save from "./views/Navigation/Save";
import About from "./views/Navigation/About";
import SignUp from "./views/SignUp/SignUp";
import SignIn from "./views/SignIn/SignIn";
import MainBoard from "./views/NoticeBoard/MainBoard";
import TableBoard from "./views/NoticeBoard/TableBoard";
import DetailBoard from "./views/NoticeBoard/DetailBoard";
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  // const [accessToken, setAccessToken] = useState(null);
  // const [loginType, setLoginType] = useState("");
  //
  // const accessToken = new URL(window.location.href).searchParams.get("accessToken");
  // const refreshToken = new URL(window.location.href).searchParams.get("refreshToken");

  // useEffect(() => {
  //
  //     if(accessToken) {
  //
  //     }
  // }, [accessToken]);

  // if (accessToken) {
  //     localStorage.setItem("accessToken", accessToken);
  //     localStorage.setItem("refreshToken", refreshToken);
  // }

  return (
    <div className="App">
      <header className="App-header">
          <Routes>
              <Route exact path="/" element={<MainHome />} />
              <Route path="/save" element={<Save />} />
              <Route path="/about" element={<About />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/signIn" element={<SignIn />} />
              <Route path="/board" element={<MainBoard />} />

              <Route path="/game1board" element={<TableBoard />} />

              {/*<Route path="/detailBoard/:boardNo" element={<DetailBoard />} />*/}
              <Route path="/detailBoard" element={<DetailBoard />} />
              <Route path="/board/:boardId" element={<MainBoard />} />
              <Route path="/board/:boardId" element={<DetailBoard />} />
          </Routes>
      </header>
    </div>
  );
}

export default App;
