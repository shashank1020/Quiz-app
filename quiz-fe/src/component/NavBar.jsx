import React, {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components';
import {UserAuthContext} from "../lib/user-auth-context";

const NavBar = () => {
    const {user, logoutUser} = useContext(UserAuthContext)
    const navigate = useNavigate()
    return (
        <Box sx={{flexGrow: 1}}>
            <CustomNavBar position="static">
                <Toolbar>
                    <Box className='left-side'>
                        <Typography variant="h6" component="div" className='logo' onClick={() => navigate('/')}>
                            Quizzzz
                        </Typography>
                        {user && (
                            <>
                                <Button onClick={() => navigate('myquiz')}>
                                    My Quiz
                                </Button>
                                <Button onClick={() => navigate("/quiz/create")}>
                                    Create Quiz
                                </Button>
                            </>)}
                    </Box>
                    {!user && <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>}
                    {user && <Button onClick={() => logoutUser()}  className='ml'>Logout</Button>}
                </Toolbar>
            </CustomNavBar>
        </Box>
    );
}

export default NavBar;


const CustomNavBar = styled(AppBar)`
  button {
    color: white;
  }
  .left-side {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .logo {
    margin-right: 10px;
    font-weight: 600;
    cursor: pointer;
  }
  .ml {
    margin-left: 10px;
  }
`