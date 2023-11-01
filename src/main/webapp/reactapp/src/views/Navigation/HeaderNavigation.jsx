import * as React from 'react';
import '../Layouts/MainView.scss'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartSimple as locoIcon} from "@fortawesome/free-solid-svg-icons"
import {getCookie} from './Cookie';
import {useEffect, useState} from "react";
import axios from "axios";
import ChatModal from "../Layouts/ChatModal";

export default function ButtonAppBar() {
    const [isLoginCheck, setIsLoginCheck] = useState(0);
    const [chatModal, setChatModal] = useState(false);

    const logout = async () => {
        // navigate("/");
        // window.location.reload();
        await axios({
            method: "POST",
            url: "/logout"
        }).then((res) => {
            window.location.reload();
        })
    }

    useEffect(() => {
        if(getCookie('refreshToken')) {
            setIsLoginCheck(1);
        } else {
            setIsLoginCheck(0);
        }
    }, [isLoginCheck])

    return (
        <AppBar sx={{height: 65, backgroundColor:'rgba(153, 153, 153, 0)'}}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{ mr: 2, color: "white" }}
                >
                    <Link to="/" style={{color: 'white', fontWeight: 'bold', marginLeft: '15px', fontSize: '24px', fontFamily: 'YEONGJUPunggiGinsengTTF', textDecoration: 'none'}} >
                        <FontAwesomeIcon icon={locoIcon} style={{position: 'relative', top: '2px', fontSize: '35px'}}/>&nbsp; ReP
                    </Link>
                </IconButton>
                <Typography position="relative" variant="h6" component="div" sx={{ flexGrow: 1, color: "white" }}>

                </Typography>

                <Link to="/">
                    <Button sx={{color: "white", marginRight: '10px', fontSize: '16px', fontFamily: 'SUITE-Regular'}}>Home</Button>
                </Link>

                {
                    // eslint-disable-next-line eqeqeq
                    `${isLoginCheck}` == 1 ?
                        <span>
                            <Button sx={{color: "white", marginRight: '10px', fontSize: '16px', fontFamily: 'SUITE-Regular'}} onClick={() => setChatModal(!chatModal)}>Chat</Button>
                            <Link to="/memberInfo">
                                <Button sx={{color: "white", marginRight: '10px', fontSize: '16px', fontFamily: 'SUITE-Regular'}} >My Info</Button>
                            </Link>
                            <Link to="/">
                                <Button sx={{color: "white", marginRight: '10px', fontSize: '16px', fontFamily: 'SUITE-Regular'}} onClick={() => logout()}>Logout</Button>
                            </Link>
                        </span>
                        :
                        <span>
                            <Link to="/signIn">
                                <Button sx={{color: "white", marginRight: '10px', fontSize: '16px', fontFamily: 'SUITE-Regular'}}>Sign In</Button>
                            </Link>
                            <Link to="/signUp">
                                <Button sx={{color: "white", marginRight: '10px', fontSize: '16px', fontFamily: 'SUITE-Regular'}}>Sign Up</Button>
                            </Link>
                        </span>
                }

                <Link to="/board" state={{ mainReset: null }}>
                    <Button sx={{color: "white", marginRight: '30px', fontSize: '16px', fontFamily: 'SUITE-Regular'}}>Board</Button>
                </Link>
            </Toolbar>
            <div style={{
                position:"relative",
                top: 30,
                left: 300
            }}>
                {chatModal ? <ChatModal setChatModal={setChatModal}/> : null}
            </div>
        </AppBar>
    );
}