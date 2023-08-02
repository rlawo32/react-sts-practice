import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";

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
                    <MenuIcon />
                </IconButton>
                <Typography position="relative" variant="h6" component="div" sx={{ flexGrow: 1, color: "white" }}>
                    News
                </Typography>

                <Link to="/signIn">
                    <Button sx={{color: "white"}}>로그인</Button>
                </Link>
                <Link to="/signUp">
                    <Button sx={{color: "white"}}>회원가입</Button>
                </Link>
                <Link to="/board">
                    <Button sx={{color: "white"}}>게시판</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}