import {Routes, Route} from "react-router-dom";
import './App.css';
import MainHome from "./views/Navigation/MainHome";
import Save from "./views/Navigation/Save";
import About from "./views/Navigation/About";
import SignUp from "./views/SignUp/SignUp";
import SignIn from "./views/SignIn/SignIn";
import MainBoard from "./views/NoticeBoard/MainBoard";
import Game1Board from "./views/NoticeBoard/Game1Board";
import Game2Board from "./views/NoticeBoard/Game2Board";
import Game3Board from "./views/NoticeBoard/Game3Board";
import Game4Board from "./views/NoticeBoard/Game4Board";
import Game5Board from "./views/NoticeBoard/Game5Board";
import Game6Board from "./views/NoticeBoard/Game6Board";
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

              <Route path="/game1board" element={<Game1Board />} />
              <Route path="/game2board" element={<Game2Board />} />
              <Route path="/game3board" element={<Game3Board />} />
              <Route path="/game4board" element={<Game4Board />} />
              <Route path="/game5board" element={<Game5Board />} />
              <Route path="/game6board" element={<Game6Board />} />
          </Routes>
      </header>
    </div>
  );
}

export default App;
