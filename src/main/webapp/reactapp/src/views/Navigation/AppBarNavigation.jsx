import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";
import cookie from "react-cookies";

export default function ButtonAppBar() {
    return (
        <AppBar sx={{height: 55, backgroundColor:'rgba(153, 153, 153, 0.1)'}}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{ mr: 2, color: "white" }}
                >
                    <Link to="/">
                        <MenuIcon />
                    </Link>
                </IconButton>
                <Typography position="relative" variant="h6" component="div" sx={{ flexGrow: 1, color: "white" }}>

                </Typography>

                <Link to="/signIn">
                    <Button sx={{color: "white"}}>로그인</Button>
                </Link>
                <Link to="/signUp">
                    <Button sx={{color: "white"}}>회원가입</Button>
                </Link>

                <Button sx={{color: "white"}} onClick={() => cookie.remove('refreshToken')}>로그아웃</Button>

                <Link to="/board" state={{ mainReset: null }}>
                    <Button sx={{color: "white"}}>게시판</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}