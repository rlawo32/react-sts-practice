import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link, Router} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home";
import Save from "./pages/Save";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Git from "./callback/Git"
import 'bootstrap/dist/css/bootstrap.css';
import { UserContext } from "./context/LoginContext";

const App = () => {
  // const [accessToken, setAccessToken] = useState(null);
  const [loginType, setLoginType] = useState("");

  const accessToken = new URL(window.location.href).searchParams.get("accessToken");
  const refreshToken = new URL(window.location.href).searchParams.get("refreshToken");

  // useEffect(() => {
  //
  //     if(accessToken) {
  //
  //     }
  // }, [accessToken]);

  if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
  }

  return (
    <div className="App">
      <header className="App-header">
          <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/save" element={<Save />} />
              <Route path="/about" element={<About />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/signIn" element={<SignIn />} />
              {/*<Route path="/auth/callback/google" element={<Google />} />*/}
              <Route path="/auth/callback/git" element={<Git />} />
          </Routes>
      </header>
    </div>
  );
}

export default App;
