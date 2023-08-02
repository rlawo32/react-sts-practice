import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";

export default function BoardTagBarNavigation() {
    return (
            <span sx={{height: 55, width: 800, backgroundColor:'rgba(153, 153, 153, 0.1)', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '-120%', left: '-2.7%'}}>
                <Link to="/game1board">
                    <Button sx={{ color: "white", pr: 4 }}>리그오브레전드</Button>
                </Link>
                <Link to="/game2board">
                    <Button sx={{ color: "white", pr: 4 }}>오버워치</Button>
                </Link>
                <Link to="/game3board">
                    <Button sx={{ color: "white", pr: 4 }}>배틀그라운드</Button>
                </Link>
                <Link to="/game4board">
                    <Button sx={{ color: "white", pr: 4 }}>메이플스토리</Button>
                </Link>
                <Link to="/game5board">
                    <Button sx={{ color: "white", pr: 4 }}>마인크래프트</Button>
                </Link>
                <Link to="/game6board">
                    <Button sx={{ color: "white" }}>스팀</Button>
                </Link>
            </span>
    );
}